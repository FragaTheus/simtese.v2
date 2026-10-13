package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record EnterpriseInfo(
        UUID id,
        String name,
        String registrationNumber,
        EnterpriseDocumentType registrationType,
        String linkedAccountName,
        boolean active,
        String createdBy,
        String updatedBy,
        Instant createdAt,
        Instant updatedAt
) {
}
