package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import lombok.Builder;

import java.util.UUID;

@Builder
public record EnterpriseSummary(
        UUID id,
        String name,
        String registrationNumber,
        EnterpriseDocumentType registrationType
) {
}
