package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import jakarta.validation.constraints.*;

public record CreateAccountRequest(
        @NotBlank(message = "Nome e obrigatorio!")
        @Size(min = 3, max = 100, message = "Nome deve conter entre 3 e 100 caracteres")
        @Pattern(
                regexp = "^[\\p{L} ]+$",
                message = "Nome deve conter somente letras e espacos."
        )
        String name,

        @Email(message = "Formato de email invalido")
        @NotBlank(message = "Email e obrigatorio")
        @Size(min = 5, max = 200, message = "Email deve conter entre 5 e 100 caracteres")
        String email,

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
        String confirmPassword,

        Role role
) {
}
