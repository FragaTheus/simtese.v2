package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record AccountInfo(
        UUID id,
        String name,
        String email,
        Role role,
        boolean active,
        Instant createdAt,
        Instant updatedAt,
        String createdBy,
        String updatedBy
) {
}
