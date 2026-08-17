package br.com.matheusfragadev.api.infra.auth.aggregates;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import lombok.Builder;

import java.util.UUID;

@Builder
public record AuthResponse(
        UUID meId,
        String meName,
        String meEmail,
        Role meRole
) {
}
