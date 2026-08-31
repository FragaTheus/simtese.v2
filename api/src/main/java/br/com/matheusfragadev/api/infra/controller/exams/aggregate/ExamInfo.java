package br.com.matheusfragadev.api.infra.controller.exams.aggregate;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record ExamInfo(
        UUID id,
        String name,
        boolean active,
        Instant createdAt,
        Instant updatedAt,
        String createdBy,
        String updatedBy
) {
}
