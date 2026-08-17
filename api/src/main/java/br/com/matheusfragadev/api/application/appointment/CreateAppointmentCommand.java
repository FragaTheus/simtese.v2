package br.com.matheusfragadev.api.application.appointment;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import lombok.Builder;

import java.util.Set;

@Builder
public record CreateAppointmentCommand(
        String employeeName,
        String employeeCpf,
        String enterpriseName,
        String enterpriseCnpj,
        Shift shift,
        ExamType examType,
        Set<Exam> exams,
        String observation
) {
}
