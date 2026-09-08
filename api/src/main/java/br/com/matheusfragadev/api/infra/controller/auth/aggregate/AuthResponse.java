package br.com.matheusfragadev.api.infra.controller.auth.aggregate;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import lombok.Builder;

import java.util.UUID;

@Builder
public record AuthResponse(
        UUID id,
        String name,
        Role role
) {
}
