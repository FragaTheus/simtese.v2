package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseDocumentException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EnterpriseDocument(
        @NotNull(message = "Tipo de cadastro da empresa e obrigatorio")
        EnterpriseDocumentType type,
        @NotBlank(message = "Documento da empresa e obrigatorio")
        String value
) {

    public EnterpriseDocument {
        if (type == null) {
            throw new EnterpriseDocumentException("Tipo de cadastro da empresa e obrigatorio");
        }
        if (value == null || value.isBlank()) {
            throw new EnterpriseDocumentException("Documento da empresa e obrigatorio");
        }
    }
}
