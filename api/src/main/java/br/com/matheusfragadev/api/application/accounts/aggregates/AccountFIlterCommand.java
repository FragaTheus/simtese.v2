package br.com.matheusfragadev.api.application.accounts.aggregates;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import org.springframework.data.domain.Pageable;

public record AccountFIlterCommand(
        String search,
        Role role,
        Boolean active,
        Pageable pageable
) {
}
