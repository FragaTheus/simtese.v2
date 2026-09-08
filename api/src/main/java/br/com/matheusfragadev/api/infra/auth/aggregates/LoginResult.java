package br.com.matheusfragadev.api.infra.auth.aggregates;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;

public record LoginResult(
        String token,
        Account account
) {
}
