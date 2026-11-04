package br.com.matheusfragadev.api.application.appointment;

import br.com.matheusfragadev.api.application.exams.ExamService;
import br.com.matheusfragadev.api.application.enterprise.EnterpriseService;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.appointment.exception.AppointmentException;
import br.com.matheusfragadev.api.domain.appointment.exception.EmployeeException;
import br.com.matheusfragadev.api.domain.appointment.repository.AppointmentRepository;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocument;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    private static final String CNPJ_VALUE = "11222333000181";

    @Mock
    private AppointmentRepository repository;
    @Mock
    private EnterpriseService enterpriseService;
    @Mock
    private ExamService examService;

    @InjectMocks
    private AppointmentService service;

    private Enterprise enterprise;
    private EnterpriseDocument document;
    private Set<UUID> examIds;
    private Set<Exam> exams;

    @BeforeEach
    void setUp() {
        enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));
        document = new EnterpriseDocument(EnterpriseDocumentType.CNPJ, CNPJ_VALUE);
        examIds = Set.of(UUID.randomUUID());
        exams = Set.of(new Exam("Exame clinico"));
    }

    private CreateAppointmentCommand command(String role) {
        return CreateAppointmentCommand.builder()
                .employeeName("Maria da Silva")
                .employeeCpf("529.982.247-25")
                .employeeRole(role)
                .enterpriseName("Empresa Teste")
                .enterpriseDocument(document)
                .shift(Shift.MORNING)
                .examType(ExamType.PERIODIC)
                .examIds(examIds)
                .observation("obs")
                .build();
    }

    private void stubExistingEnterprise() {
        when(enterpriseService.existsByDocument(document)).thenReturn(true);
        when(enterpriseService.findByDocument(document)).thenReturn(enterprise);
        when(examService.findAllByIds(examIds)).thenReturn(exams);
        when(repository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    void shouldCreateAppointmentWithEmployeeRoleAndExistingEnterprise() {
        stubExistingEnterprise();

        var result = service.create(command("Soldadora"));

        assertThat(result.getEmployee().getEmployeeRole()).isEqualTo("Soldadora");
        assertThat(result.getEmployee().getEmployeeCpf()).isEqualTo("52998224725");
        assertThat(result.getEnterprise()).isSameAs(enterprise);
        assertThat(result.getExamStatus()).isEqualTo(ExamStatus.SCHEDULED);
        verify(enterpriseService, never()).create(any(), any(EnterpriseDocument.class));
    }

    @Test
    void shouldDefaultRoleToNotApplicableWhenNotInformed() {
        stubExistingEnterprise();

        var result = service.create(command(null));

        assertThat(result.getEmployee().getEmployeeRole()).isEqualTo("N/A");
    }

    @Test
    void shouldCreateEnterpriseWhenDocumentIsUnknown() {
        when(enterpriseService.existsByDocument(document)).thenReturn(false);
        when(enterpriseService.create("Empresa Teste", document)).thenReturn(enterprise);
        when(examService.findAllByIds(examIds)).thenReturn(exams);
        when(repository.save(any(Appointment.class))).thenAnswer(i -> i.getArgument(0));

        var result = service.create(command("Soldadora"));

        assertThat(result.getEnterprise()).isSameAs(enterprise);
        verify(enterpriseService, never()).findByDocument(any());
    }

    @Test
    void shouldNotPersistWhenEmployeeIsInvalid() {
        var invalid = CreateAppointmentCommand.builder()
                .employeeName("Maria da Silva")
                .employeeCpf("111.111.111-11")
                .enterpriseDocument(document)
                .build();

        assertThatThrownBy(() -> service.create(invalid)).isInstanceOf(EmployeeException.class);

        verify(repository, never()).save(any());
    }

    @Test
    void shouldFailWhenAppointmentIsNotFound() {
        var id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(id))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("não encontrado");
    }

    @Test
    void shouldAttendAndRelease() {
        stubExistingEnterprise();
        var appointment = service.create(command("Soldadora"));
        var id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.of(appointment));

        assertThat(service.attend(id).getExamStatus()).isEqualTo(ExamStatus.ATTENDED);
        assertThat(service.release(id).getExamStatus()).isEqualTo(ExamStatus.RELEASED);
    }
}
