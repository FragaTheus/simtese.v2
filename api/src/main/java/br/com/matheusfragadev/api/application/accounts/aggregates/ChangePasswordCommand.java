package br.com.matheusfragadev.api.application.accounts.aggregates;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ChangePasswordCommand(
        UUID targetId,
        String password,
        String confirmPassword
) {
}
