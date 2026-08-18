package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AccountChangePassword(
        @NotBlank(message = "Senha e obrigatoria")
        @Size(min = 8, max = 16, message = "Senha deve conter entre 08 e 16 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                message = "Senha deve conter ao menos, um numero, um caracteres especial, uma letra maiuscula e minuscula"
        )
        String password,

        @NotBlank(message = "Confirmacao de senha e obrigatoria")
        @Size(min = 8, max = 16, message = "Confirmacao deve conter entre 08 e 16 caracteres")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                message = "Confirmacao deve conter ao menos, um numero, um caracteres especial, uma letra maiuscula e minuscula"
        )
        String confirmPassword
) {
}
