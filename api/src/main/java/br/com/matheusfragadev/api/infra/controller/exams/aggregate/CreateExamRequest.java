package br.com.matheusfragadev.api.infra.controller.exams.aggregate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateExamRequest(
        @NotBlank(message = "Nome do exame e obrigatorio")
        @Size(min = 2, max = 100, message = "Nome do exame deve ter no minimo 2 caracteres e no maximo 100 caracteres")
        @Pattern(
                regexp = "^[\\p{L}\\p{N} .()/-]+$",
                message = "Nome do exame possui um formato invalido"
        )
        String name
) {
}