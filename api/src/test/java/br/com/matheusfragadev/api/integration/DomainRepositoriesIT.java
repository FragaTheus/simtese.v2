package br.com.matheusfragadev.api.integration;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.repository.AccountRepository;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.appointment.repository.AppointmentRepository;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CAEPF;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CPF;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.enterprise.repository.EnterpriseRepository;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.domain.exams.repository.ExamRepository;
import br.com.matheusfragadev.api.domain.result.Result;
import br.com.matheusfragadev.api.domain.result.ResultRepository;
import br.com.matheusfragadev.api.infra.auditory.SecurityAuditorAware;
import br.com.matheusfragadev.api.infra.config.JpaAuditingConfig;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PostgresTestConfig.class, JpaAuditingConfig.class, SecurityAuditorAware.class})
class DomainRepositoriesIT {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private EnterpriseRepository enterpriseRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private ResultRepository resultRepository;
    @Autowired
    private EntityManager entityManager;

    @Test
    void shouldFindAccountByEmailAndCheckItsExistence() {
        var email = "account-" + UUID.randomUUID() + "@example.com";
        var account = accountRepository.saveAndFlush(Account.ofAdmin(
                "Ana Silva", email, Password.of("Senha@123", raw -> "hash:" + raw)
        ));

        assertThat(accountRepository.existsByEmail(email)).isTrue();
        assertThat(accountRepository.existsByEmail("missing@example.com")).isFalse();
        assertThat(accountRepository.findByEmail(email)).contains(account);
    }

    @Test
    void shouldFindEnterpriseByEachDocumentType() {
        var cnpj = CNPJ.of("11222333000181");
        var caepf = CAEPF.of("12345678901242");
        var cpf = CPF.of("52998224725");
        var cnpjEnterprise = enterpriseRepository.saveAndFlush(Enterprise.withCnpj("Empresa CNPJ", cnpj));
        var caepfEnterprise = enterpriseRepository.saveAndFlush(Enterprise.withCaepf("Empresa CAEPF", caepf));
        var cpfEnterprise = enterpriseRepository.saveAndFlush(Enterprise.withCpf("Empresa CPF", cpf));

        assertThat(enterpriseRepository.existsByCnpj(cnpj)).isTrue();
        assertThat(enterpriseRepository.existsByCaepf(caepf)).isTrue();
        assertThat(enterpriseRepository.existsByCpf(cpf)).isTrue();
        assertThat(enterpriseRepository.findByCnpj(cnpj)).contains(cnpjEnterprise);
        assertThat(enterpriseRepository.findByCaepf(caepf)).contains(caepfEnterprise);
        assertThat(enterpriseRepository.findByCpf(cpf)).contains(cpfEnterprise);
        assertThat(enterpriseRepository.existsByCnpj(CNPJ.of("11444777000161"))).isFalse();
    }

    @Test
    void shouldFindEnterprisesLinkedToAccount() {
        var account = accountRepository.saveAndFlush(Account.ofEnterprise(
                "Conta Empresa", "enterprise-" + UUID.randomUUID() + "@example.com",
                Password.of("Senha@123", raw -> "hash:" + raw)
        ));
        var enterprise = Enterprise.withCnpj("Empresa Vinculada", CNPJ.of("11222333000181"));
        enterprise.linkAccount(account);
        var savedEnterprise = enterpriseRepository.saveAndFlush(enterprise);

        assertThat(enterpriseRepository.findAllByAccountId(account.getId()))
                .containsExactly(savedEnterprise);
        assertThat(enterpriseRepository.findAllByAccountId(UUID.randomUUID())).isEmpty();
    }

    @Test
    void shouldFindExamsByNameAppointmentAndActiveState() {
        var activeExam = examRepository.saveAndFlush(new Exam("Exame ativo " + UUID.randomUUID()));
        var inactiveExam = new Exam("Exame inativo " + UUID.randomUUID());
        inactiveExam.deactivate();
        inactiveExam = examRepository.saveAndFlush(inactiveExam);
        var enterprise = enterpriseRepository.saveAndFlush(
                Enterprise.withCnpj("Empresa Exames", CNPJ.of("11222333000181"))
        );
        var appointment = appointmentRepository.saveAndFlush(new Appointment(
                Employee.of("Maria da Silva", "52998224725"),
                enterprise,
                Shift.MORNING,
                ExamType.PERIODIC,
                Set.of(activeExam),
                null
        ));

        assertThat(examRepository.existsByName(activeExam.getName())).isTrue();
        assertThat(examRepository.existsByName("Exame ausente")).isFalse();
        assertThat(examRepository.findAllByAppointmentId(appointment.getId())).containsExactly(activeExam);
        assertThat(examRepository.findAllByActiveTrue())
                .contains(activeExam)
                .doesNotContain(inactiveExam);
    }

    @Test
    void shouldPersistAndReloadResult() {
        var enterprise = enterpriseRepository.saveAndFlush(
                Enterprise.withCnpj("Empresa Resultado", CNPJ.of("11222333000181"))
        );
        var result = resultRepository.saveAndFlush(new Result(
                enterprise, Employee.of("Maria da Silva", "52998224725"), false, "resultado-inapto.pdf"
        ));
        var resultId = result.getId();
        entityManager.clear();

        var reloaded = resultRepository.findById(resultId).orElseThrow();

        assertThat(reloaded.getEnterprise().getId()).isEqualTo(enterprise.getId());
        assertThat(reloaded.getEmployee().getEmployeeName()).isEqualTo("Maria da Silva");
        assertThat(reloaded.isApt()).isFalse();
        assertThat(reloaded.getFileName()).isEqualTo("resultado-inapto.pdf");
    }
}
