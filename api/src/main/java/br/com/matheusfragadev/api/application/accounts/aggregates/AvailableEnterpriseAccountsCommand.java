package br.com.matheusfragadev.api.application.accounts.aggregates;

import org.springframework.data.domain.Pageable;

public record AvailableEnterpriseAccountsCommand(
        String search,
        Pageable pageable
) {
}
