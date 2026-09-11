package br.com.matheusfragadev.api.infra.controller.result.aggregates;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public record CreateResultUnlinkedRequest(
        @NotBlank(message = "O campo nome do funcionário é obrigatório")
        String employeeName,

        @NotBlank(message = "O campo CPF do funcionário é obrigatório")
        String employeeCpf,

        @NotNull(message = "O campo apto é obrigatório")
        Boolean apt,

        @NotNull(message = "O arquivo é obrigatório")
        MultipartFile file
) {
}
