package br.com.matheusfragadev.api.application.appointment;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocument;
import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder
public record CreateAppointmentCommand(
        String employeeName,
        String employeeCpf,
        String enterpriseName,
        EnterpriseDocument enterpriseDocument,
        Shift shift,
        ExamType examType,
        Set<UUID> examIds,
        String observation
) {
}
