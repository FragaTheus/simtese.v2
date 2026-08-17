package br.com.matheusfragadev.api.infra.auth.aggregates;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import lombok.Builder;

@Builder
public record LoginResult(
        String token,
        Account account
) {
}
