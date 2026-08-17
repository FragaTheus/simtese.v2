package br.com.matheusfragadev.api.shared.infra.repository.appointment.aggregate;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import lombok.Builder;

@Builder
public record AppointmentSpecCommand(
        String search,
        Shift shift,
        ExamStatus examStatus
) {
}
