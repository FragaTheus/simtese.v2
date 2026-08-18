package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import jakarta.validation.constraints.NotBlank;

public record ChangeEnterpriseNameRequest(
        @NotBlank(message = "Nome e obrigatorio")
        String name
) {
}
