package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record EnterpriseInfo(
        UUID id,
        String name,
        String cnpj,
        String linkedAccountName,
        boolean active,
        String createdBy,
        String updatedBy,
        Instant createdAt,
        Instant updatedAt
) {
}
