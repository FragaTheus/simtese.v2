package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.CPFException;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.regex.Pattern;

@Getter
@Embeddable
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CPF {

    private static final int MIN_LENGTH = 11;
    private static final int MAX_LENGTH = 14;
    private static final String REGEX = "^[0-9.-]+$";
    private static final Pattern PATTERN = Pattern.compile(REGEX);

    @Column(
            name = "cpf",
            updatable = false,
            unique = true,
            length = MIN_LENGTH
    )
    private String value;

    public static CPF of(String value) {
        verifyIfInputIsValid(value);
        var cpf = formattedCpf(value);
        validateDocument(cpf);
        return new CPF(cpf);
    }

    private static String formattedCpf(String rawCpf) {
        return rawCpf.replaceAll("[^\\d]", "");
    }

    private static void verifyIfInputIsValid(String inputCpf) {
        if (inputCpf == null || inputCpf.isBlank()) {
            throw new CPFException("CPF e obrigatorio");
        }

        if (inputCpf.length() < MIN_LENGTH || inputCpf.length() > MAX_LENGTH) {
            throw new CPFException("CPF deve ter entre 11 e 14 caracteres");
        }

        if (!PATTERN.matcher(inputCpf).matches()) {
            throw new CPFException("CPF nao pode conter letras");
        }

        var formattedCpf = formattedCpf(inputCpf);

        if (formattedCpf.length() != MIN_LENGTH) {
            throw new CPFException("CPF deve ter 11 digitos");
        }

        if (formattedCpf.chars().distinct().count() == 1) {
            throw new CPFException("CPF nao pode ter todos os digitos iguais");
        }
    }

    private static void validateDocument(String rawCpf) {
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(rawCpf.charAt(i)) * (10 - i);
        }

        int remainder = sum % 11;
        int firstDigit = remainder < 2 ? 0 : 11 - remainder;
        if (firstDigit != Character.getNumericValue(rawCpf.charAt(9))) {
            throw new CPFException("CPF invalido");
        }

        sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(rawCpf.charAt(i)) * (11 - i);
        }

        remainder = sum % 11;
        int secondDigit = remainder < 2 ? 0 : 11 - remainder;
        if (secondDigit != Character.getNumericValue(rawCpf.charAt(10))) {
            throw new CPFException("CPF invalido");
        }
    }
}
