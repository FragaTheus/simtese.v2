package br.com.matheusfragadev.api.domain.accounts.aggregate;

import br.com.matheusfragadev.api.domain.accounts.exception.PasswordException;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.regex.Pattern;

@Getter
@Embeddable
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Password {

    //Constantes de RN
    private static final int MIN_LENGTH = 8;
    private static final int MAX_LENGTH = 16;
    private static final String REGEX =
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$";
    private static final Pattern PATTERN = Pattern.compile(REGEX);

    //Atributo
    @Column(name = "password", nullable = false)
    private String value;

    //Metodo factory
    public static Password of(String rawPassword, Function<String, String> hasher) {
        verifyIfInputIsValid(rawPassword);
        return new Password(hash(rawPassword, hasher));
    }

    //Metodo para validacao de senha
    public void matches(String rawPassword, BiFunction<String, String, Boolean> matcher) {
        if (!matcher.apply(rawPassword, this.value)) {
            throw new PasswordException("Senha inválida");
        }
    }

    //Metodos auxiliares
    private static String hash(String rawPassword, Function<String, String> hasher){
        return hasher.apply(rawPassword);
    }

    //Verifica se valor inputado e valido
    private static void verifyIfInputIsValid(String password){
        if (password == null || password.isBlank()) {
            throw new PasswordException("Senha não pode ser nula ou vazia");
        }

        if (password.length() < MIN_LENGTH || password.length() > MAX_LENGTH) {
            throw new PasswordException("Senha deve ter entre " + MIN_LENGTH + " e " + MAX_LENGTH + " caracteres");
        }

        if (!PATTERN.matcher(password).matches()) {
            throw new PasswordException("Senha deve conter pelo menos uma letra, um número e um caractere especial");
        }
    }
}
