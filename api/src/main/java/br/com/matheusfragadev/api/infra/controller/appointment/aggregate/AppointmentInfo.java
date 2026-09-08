package br.com.matheusfragadev.api.infra.controller.appointment.aggregate;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import lombok.Builder;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Builder
public record AppointmentInfo(
        UUID id,
        String employeeName,
        String employeeCpf,
        String enterpriseName,
        String enterpriseCnpj,
        Shift shift,
        ExamStatus examStatus,
        ExamType examType,
        String obs,
        String createdBy,
        Instant createdAt,
        String updatedBy,
        Instant updatedAt
) {
}
