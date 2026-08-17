package br.com.matheusfragadev.api.infra.controller.handler;

import lombok.Builder;
import org.springframework.http.HttpStatus;

@Builder
public record ApiErrorResponse(
        HttpStatus status,
        String message
) {
}
