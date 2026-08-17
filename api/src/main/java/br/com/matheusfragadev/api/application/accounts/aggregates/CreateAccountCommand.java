package br.com.matheusfragadev.api.application.accounts.aggregates;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import lombok.Builder;

@Builder
public record CreateAccountCommand(
        String name,
        String email,
        String password,
        String confirmPassword,
        Role role
) {
}
