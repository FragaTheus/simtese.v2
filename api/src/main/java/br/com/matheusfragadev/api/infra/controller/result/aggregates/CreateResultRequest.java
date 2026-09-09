package br.com.matheusfragadev.api.infra.controller.result.aggregates;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record CreateResultRequest(
        @NotNull(message = "O campo apto é obrigatório")
        Boolean apt,

        @NotNull(message = "O arquivo é obrigatório")
        MultipartFile file
) {
}
