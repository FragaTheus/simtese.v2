package br.com.matheusfragadev.api.infra.auth.aggregates;

import lombok.Builder;

@Builder
public record AuthResponse(
       String name
) {
}
