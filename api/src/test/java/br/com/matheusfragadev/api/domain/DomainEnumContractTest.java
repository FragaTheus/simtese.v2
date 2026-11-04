package br.com.matheusfragadev.api.domain;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DomainEnumContractTest {

    @Test
    void shouldExposeSupportedAccountRoles() {
        assertThat(Role.values()).containsExactly(
                Role.ADMIN, Role.NURSE, Role.RECEPTIONIST, Role.ENTERPRISE
        );
    }

    @Test
    void shouldExposeSupportedAppointmentStatuses() {
        assertThat(ExamStatus.values()).containsExactly(
                ExamStatus.SCHEDULED, ExamStatus.ATTENDED, ExamStatus.RELEASED
        );
    }

    @Test
    void shouldExposeSupportedExamTypes() {
        assertThat(ExamType.values()).containsExactly(
                ExamType.PRE_EMPLOYMENT,
                ExamType.TERMINATION,
                ExamType.PERIODIC,
                ExamType.RETURN_TO_WORK,
                ExamType.SPECIFIC_EVALUATION,
                ExamType.CHANGE_OF_RISK
        );
    }

    @Test
    void shouldExposeSupportedShifts() {
        assertThat(Shift.values()).containsExactly(Shift.MORNING, Shift.AFTERNOON);
    }

    @Test
    void shouldExposeSupportedEnterpriseDocumentTypes() {
        assertThat(EnterpriseDocumentType.values()).containsExactly(
                EnterpriseDocumentType.CNPJ, EnterpriseDocumentType.CAEPF, EnterpriseDocumentType.CPF
        );
    }
}
