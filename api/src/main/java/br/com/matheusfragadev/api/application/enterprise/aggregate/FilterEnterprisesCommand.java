package br.com.matheusfragadev.api.application.enterprise.aggregate;

import lombok.Builder;
import org.springframework.data.domain.Pageable;

@Builder
public record FilterEnterprisesCommand(
        String search,
        Boolean active,
        Pageable pageable
) {
}
