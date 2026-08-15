package br.com.matheusfragadev.api.domain.appointment.entity;

import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.exception.AppointmentException;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.shared.auditory.Auditory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Cleanup;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.regex.Pattern;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Appointment extends Auditory {

    private static final int OBS_MAX_LENGTH = 500;

    @Embedded
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enterprise_id", updatable = false)
    private Enterprise enterprise;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = false)
    private Shift shift;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, updatable = false)
    private ExamType examType;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_status", nullable = false)
    private ExamStatus examStatus;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            joinColumns = @JoinColumn(name = "appointment_id"),
            inverseJoinColumns = @JoinColumn(name = "exam_id")
    )
    private Set<Exam> exams;

    @Column(length = OBS_MAX_LENGTH)
    private String observation;

    public Appointment(
            Employee employee,
            Enterprise enterprise,
            Shift shift,
            ExamType examType,
            Set<Exam> exams,
            String observation
    ) {
        if (employee == null) {
            throw new AppointmentException("Colaborador não pode ser nulo.");
        }

        if (enterprise == null) {
            throw new AppointmentException("Empresa não pode ser nula.");
        }

        if (shift == null) {
            throw new AppointmentException("Período não pode ser nulo.");
        }

        if (examType == null) {
            throw new AppointmentException("Tipo de exame não pode ser nulo.");
        }

        if (exams == null || exams.isEmpty()) {
            throw new AppointmentException("O agendamento deve possuir ao menos um exame.");
        }

        if (observation != null && observation.length() > OBS_MAX_LENGTH) {
            throw new AppointmentException(
                    "Observação excede o limite máximo de " + OBS_MAX_LENGTH + " caracteres.");
        }

        this.employee = employee;
        this.enterprise = enterprise;
        this.shift = shift;
        this.examType = examType;
        this.examStatus = ExamStatus.SCHEDULED;
        this.exams = exams;
        this.observation = observation;
    }
}
