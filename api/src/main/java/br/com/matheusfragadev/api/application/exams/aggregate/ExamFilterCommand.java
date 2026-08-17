package br.com.matheusfragadev.api.application.exams.aggregate;

import lombok.Builder;
import org.springframework.data.domain.Pageable;

@Builder
public record ExamFilterCommand(
        String search,
        Boolean active,
        Pageable pageable
) {
}
