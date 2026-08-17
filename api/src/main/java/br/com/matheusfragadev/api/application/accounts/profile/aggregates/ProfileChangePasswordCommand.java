package br.com.matheusfragadev.api.application.accounts.profile.aggregates;

import lombok.Builder;

import java.util.UUID;

@Builder
public record ProfileChangePasswordCommand(
        UUID targetId,
        String currentPassword,
        String newPassword,
        String confirmNewPassword
) {
}
