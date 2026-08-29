package br.com.matheusfragadev.api.infra.controller.auth.aggregate;

import lombok.Builder;

@Builder
public record AuthResponse(
       String name
) {
}
