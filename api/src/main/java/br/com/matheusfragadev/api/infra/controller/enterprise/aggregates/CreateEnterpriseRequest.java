package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateEnterpriseRequest(
        @NotBlank(message = "Nome da empresa e obrigatorio")
        @Size(min = 3, max = 200, message = "Nome da empresa deve conter entre 3 e 200 caracteres")
        String name,

        @NotBlank(message = "CNPJ e obrigatorio")
        @Pattern(
                regexp = "^[0-9./-]+$",
                message = "CNPJ nao pode conter letras"
        )
        String cnpj
) {
}
