package br.com.matheusfragadev.api.infra.controller.auth.aggregate;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import lombok.Builder;

@Builder
public record AuthResponse(
       String name,
       Role role
) {
}
