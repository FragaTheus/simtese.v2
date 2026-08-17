package br.com.matheusfragadev.api.infra.auth.aggregates;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record LoginRequest(

        @Email(message = "Credenciais invalidas")
        @NotNull(message = "Credenciais invalidas")
        @Size(min = 5, max = 200, message = "Credenciais invalidas")
        String email,

        @NotNull(message = "Credenciais invalidas")
        @Pattern(
                regexp = "\"^(?=.*[A-Za-z])(?=.*\\\\d)(?=.*[^A-Za-z0-9]).+$\"",
                message = "Credenciais invalidas"
        )
        String password
) {
}
