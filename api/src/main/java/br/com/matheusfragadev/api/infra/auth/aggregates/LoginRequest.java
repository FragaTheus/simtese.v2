package br.com.matheusfragadev.api.infra.auth.aggregates;

import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
public record LoginRequest(

        @Email(message = "Credenciais invalidas")
        @NotBlank(message = "Credenciais invalidas")
        @Size(min = 5, max = 200, message = "Credenciais invalidas")
        String email,

        @NotNull(message = "Credenciais invalidas")
        @Pattern(
                regexp =  "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                message = "Credenciais invalidas"
        )
        String password
) {
}
