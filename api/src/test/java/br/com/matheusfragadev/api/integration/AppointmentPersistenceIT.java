package br.com.matheusfragadev.api.integration;

import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.appointment.repository.AppointmentRepository;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.enterprise.repository.EnterpriseRepository;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.domain.exams.repository.ExamRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(PostgresTestConfig.class)
class AppointmentPersistenceIT {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private EnterpriseRepository enterpriseRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private JdbcTemplate jdbc;

    private Enterprise enterprise(String cnpj) {
        return enterpriseRepository.save(Enterprise.withCnpj("Empresa " + cnpj, CNPJ.of(cnpj)));
    }

    @Test
    void shouldPersistAndReloadAppointmentWithEmployeeRole() {
        var exam = examRepository.save(new Exam("Exame IT " + UUID.randomUUID()));
        var appointment = new Appointment(
                Employee.of("Maria da Silva", "52998224725", "Soldadora"),
                enterprise("11222333000181"),
                Shift.MORNING, ExamType.PERIODIC, Set.of(exam), "obs");

        var id = appointmentRepository.saveAndFlush(appointment).getId();
        entityManager.clear();

        var loaded = appointmentRepository.findById(id).orElseThrow();
        assertThat(loaded.getEmployee().getEmployeeRole()).isEqualTo("Soldadora");
        assertThat(loaded.getEmployee().getEmployeeCpf()).isEqualTo("52998224725");
        assertThat(loaded.getExamStatus()).isEqualTo(ExamStatus.SCHEDULED);
    }

    @Test
    void shouldPersistNotApplicableWhenRoleIsNotInformed() {
        var exam = examRepository.save(new Exam("Exame IT " + UUID.randomUUID()));
        var appointment = new Appointment(
                Employee.of("Maria da Silva", "52998224725"),
                enterprise("11222333000181"),
                Shift.AFTERNOON, ExamType.PRE_EMPLOYMENT, Set.of(exam), null);

        var id = appointmentRepository.saveAndFlush(appointment).getId();
        entityManager.clear();

        assertThat(appointmentRepository.findById(id).orElseThrow().getEmployee().getEmployeeRole())
                .isEqualTo("N/A");
    }

    @Test
    void shouldBackfillExistingRowsWithNotApplicableThroughMigrationDefault() {
        var enterprise = enterpriseRepository.saveAndFlush(
                Enterprise.withCnpj("Empresa Legado", CNPJ.of("11222333000181")));
        var legacyId = UUID.randomUUID();

        // Insert no formato anterior à V12, sem a coluna employee_role
        jdbc.update("""
                INSERT INTO appointment (id, employee_name, employee_cpf, enterprise_id,
                                         shift, exam_type, exam_status, created_at)
                VALUES (?, 'Joao Antigo', '52998224725', ?, 'MORNING', 'PERIODIC', 'SCHEDULED', now())
                """, legacyId, enterprise.getId());

        var role = jdbc.queryForObject(
                "SELECT employee_role FROM appointment WHERE id = ?", String.class, legacyId);

        assertThat(role).isEqualTo("N/A");
    }

    @Test
    void shouldHaveEmployeeRoleColumnInResultTable() {
        var count = jdbc.queryForObject("""
                SELECT count(*) FROM information_schema.columns
                WHERE table_name = 'result' AND column_name = 'employee_role'
                """, Integer.class);

        assertThat(count).isEqualTo(1);
    }
}
