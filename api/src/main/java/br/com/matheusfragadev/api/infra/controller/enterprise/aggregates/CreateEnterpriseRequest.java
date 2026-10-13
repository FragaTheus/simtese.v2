package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocument;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateEnterpriseRequest(
        @NotBlank(message = "Nome da empresa e obrigatorio")
        @Size(min = 3, max = 200, message = "Nome da empresa deve conter entre 3 e 200 caracteres")
        String name,

        @Valid
        EnterpriseDocument document
) {
}
