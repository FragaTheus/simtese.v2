package br.com.matheusfragadev.api.application.appointment.aggregate;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import lombok.Builder;
import org.springframework.data.domain.Pageable;

@Builder
public record AppointmentFilterCommand(
        String search,
        Shift shift,
        ExamStatus examStatus,
        Pageable pageable
) {
}
