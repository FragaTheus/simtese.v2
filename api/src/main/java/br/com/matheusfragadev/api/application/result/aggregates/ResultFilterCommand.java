package br.com.matheusfragadev.api.application.result.aggregates;

import org.springframework.data.domain.Pageable;

public record ResultFilterCommand(
        String search,
        Boolean apt,
        Pageable pageable
) {
}
