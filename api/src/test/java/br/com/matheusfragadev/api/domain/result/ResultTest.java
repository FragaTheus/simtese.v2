package br.com.matheusfragadev.api.domain.result;

import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class ResultTest {

    @Test
    void shouldCreateResultFromAppointment() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of("11222333000181"));
        var employee = Employee.of("Maria da Silva", "52998224725");
        var appointment = new Appointment(
                employee, enterprise, Shift.MORNING, ExamType.PERIODIC, Set.of(new Exam("Exame clínico")), null
        );

        var result = Result.of(appointment, true, "resultado.pdf");

        assertThat(result.getEnterprise()).isSameAs(enterprise);
        assertThat(result.getEmployee()).isSameAs(employee);
        assertThat(result.isApt()).isTrue();
        assertThat(result.getFileName()).isEqualTo("resultado.pdf");
    }

    @Test
    void shouldKeepConstructorValuesIncludingUnfitResult() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of("11222333000181"));
        var employee = Employee.of("Maria da Silva", "52998224725");

        var result = new Result(enterprise, employee, false, "inapto.pdf");

        assertThat(result.getEnterprise()).isSameAs(enterprise);
        assertThat(result.getEmployee()).isSameAs(employee);
        assertThat(result.isApt()).isFalse();
        assertThat(result.getFileName()).isEqualTo("inapto.pdf");
    }
}
