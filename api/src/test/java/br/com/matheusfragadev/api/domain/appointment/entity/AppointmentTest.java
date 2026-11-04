package br.com.matheusfragadev.api.domain.appointment.entity;

import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.exception.AppointmentException;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AppointmentTest {

    private Employee employee;
    private Enterprise enterprise;
    private Set<Exam> exams;

    @BeforeEach
    void setUp() {
        employee = Employee.of("Maria da Silva", "52998224725", "Soldadora");
        enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of("11222333000181"));
        exams = new HashSet<>(Set.of(new Exam("Exame clinico")));
    }

    private Appointment newAppointment() {
        return new Appointment(employee, enterprise, Shift.MORNING, ExamType.PERIODIC, exams, "obs");
    }

    @Test
    void shouldCreateScheduledAppointmentKeepingEmployeeRole() {
        var appointment = newAppointment();

        assertThat(appointment.getExamStatus()).isEqualTo(ExamStatus.SCHEDULED);
        assertThat(appointment.getEmployee().getEmployeeRole()).isEqualTo("Soldadora");
        assertThat(appointment.getExams()).hasSize(1);
    }

    @Test
    void shouldRejectNullEmployee() {
        assertThatThrownBy(() ->
                new Appointment(null, enterprise, Shift.MORNING, ExamType.PERIODIC, exams, null))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("Colaborador");
    }

    @Test
    void shouldRejectNullEnterprise() {
        assertThatThrownBy(() ->
                new Appointment(employee, null, Shift.MORNING, ExamType.PERIODIC, exams, null))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("Empresa");
    }

    @Test
    void shouldRejectNullShift() {
        assertThatThrownBy(() ->
                new Appointment(employee, enterprise, null, ExamType.PERIODIC, exams, null))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("Período");
    }

    @Test
    void shouldRejectNullExamType() {
        assertThatThrownBy(() ->
                new Appointment(employee, enterprise, Shift.MORNING, null, exams, null))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("Tipo de exame");
    }

    @Test
    void shouldRejectEmptyExams() {
        assertThatThrownBy(() ->
                new Appointment(employee, enterprise, Shift.MORNING, ExamType.PERIODIC, Set.of(), null))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("ao menos um exame");
    }

    @Test
    void shouldRejectNullExams() {
        assertThatThrownBy(() ->
                new Appointment(employee, enterprise, Shift.MORNING, ExamType.PERIODIC, null, null))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("ao menos um exame");
    }

    @Test
    void shouldRejectTooLongObservation() {
        var observation = "a".repeat(501);

        assertThatThrownBy(() ->
                new Appointment(employee, enterprise, Shift.MORNING, ExamType.PERIODIC, exams, observation))
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("500");
    }

    @Test
    void shouldAcceptObservationAtMaximumLengthAndAllowNoObservation() {
        var maximumObservation = "a".repeat(500);

        assertThat(new Appointment(
                employee, enterprise, Shift.MORNING, ExamType.PERIODIC, exams, maximumObservation
        ).getObservation()).isEqualTo(maximumObservation);
        assertThat(new Appointment(
                employee, enterprise, Shift.MORNING, ExamType.PERIODIC, exams, null
        ).getObservation()).isNull();
    }

    @Test
    void shouldAttendOnlyOnce() {
        var appointment = newAppointment();

        appointment.attend();

        assertThat(appointment.getExamStatus()).isEqualTo(ExamStatus.ATTENDED);
        assertThatThrownBy(appointment::attend)
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("atendido");
    }

    @Test
    void shouldReleaseOnlyOnce() {
        var appointment = newAppointment();

        appointment.release();

        assertThat(appointment.getExamStatus()).isEqualTo(ExamStatus.RELEASED);
        assertThatThrownBy(appointment::release)
                .isInstanceOf(AppointmentException.class)
                .hasMessageContaining("liberado");
    }
}
