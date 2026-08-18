package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import lombok.Builder;

import java.util.UUID;

@Builder
public record EnterpriseSummary(
        UUID id,
        String name,
        String cnpj
) {
}
