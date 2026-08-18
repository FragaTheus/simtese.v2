package br.com.matheusfragadev.api.infra.controller.appointment.aggregate;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AppointmentSummary(
        UUID id,
        String employeeName,
        String enterpriseName
) {
}
