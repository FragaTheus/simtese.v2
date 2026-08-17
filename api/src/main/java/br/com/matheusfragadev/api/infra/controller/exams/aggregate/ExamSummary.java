package br.com.matheusfragadev.api.infra.controller.exams.aggregate;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ExamSummary(
        UUID id,
        String name,
        boolean active
) {
}
