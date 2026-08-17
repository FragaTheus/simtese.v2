package br.com.matheusfragadev.api.infra.controller.exams.aggregate;

import lombok.Builder;

import java.time.Instant;

@Builder
public record ExamInfo(
        String name,
        boolean active,
        Instant createdAt,
        Instant updatedAt,
        String createdBy,
        String updatedBy
) {
}
