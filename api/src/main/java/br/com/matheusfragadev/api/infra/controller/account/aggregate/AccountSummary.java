package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AccountSummary(
        UUID id,
        String name,
        String email
) {
}
