package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangeNameRequest(
        @NotBlank(message = "Nome e obrigatorio!")
        @Size(min = 3, max = 100, message = "Nome deve conter entre 3 e 100 caracteres")
        @Pattern(
                regexp = "^[\\p{L} ]+$",
                message = "Nome deve conter somente letras e espacos."
        )
        String name
) {
}
