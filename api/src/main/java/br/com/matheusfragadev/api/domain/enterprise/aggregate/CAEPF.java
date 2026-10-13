package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.CAEPFException;
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
public class CAEPF {

    private static final int MIN_LENGTH = 14;
    private static final int MAX_LENGTH = 18;
    private static final String REGEX = "^[0-9./-]+$";
    private static final Pattern PATTERN = Pattern.compile(REGEX);

    @Column(
            name = "caepf",
            updatable = false,
            unique = true,
            length = MIN_LENGTH
    )
    private String value;

    public static CAEPF of(String value) {
        verifyIfInputIsValid(value);
        var caepf = formattedCaepf(value);
        validateDocument(caepf);
        return new CAEPF(caepf);
    }

    private static String formattedCaepf(String rawCaepf) {
        return rawCaepf.replaceAll("[^\\d]", "");
    }

    private static void verifyIfInputIsValid(String inputCaepf) {
        if (inputCaepf == null || inputCaepf.isBlank()) {
            throw new CAEPFException("CAEPF e obrigatorio");
        }

        if (inputCaepf.length() < MIN_LENGTH || inputCaepf.length() > MAX_LENGTH) {
            throw new CAEPFException("CAEPF deve ter entre 14 e 18 caracteres");
        }

        if (!PATTERN.matcher(inputCaepf).matches()) {
            throw new CAEPFException("CAEPF nao pode conter letras");
        }

        var formattedCaepf = formattedCaepf(inputCaepf);

        if (formattedCaepf.length() != MIN_LENGTH) {
            throw new CAEPFException("CAEPF deve ter 14 digitos");
        }

        if (formattedCaepf.chars().distinct().count() == 1) {
            throw new CAEPFException("CAEPF nao pode ter todos os digitos iguais");
        }
    }

    private static void validateDocument(String rawCaepf) {

        int[] firstWeights = {
                6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9
        };

        int[] secondWeights = {
                5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9
        };

        int sum = 0;

        for (int i = 0; i < 12; i++) {
            sum += Character.getNumericValue(rawCaepf.charAt(i))
                    * firstWeights[i];
        }

        int firstDigit = (sum % 11) % 10;

        sum = 0;

        for (int i = 0; i < 12; i++) {
            sum += Character.getNumericValue(rawCaepf.charAt(i))
                    * secondWeights[i];
        }

        sum += firstDigit * secondWeights[12];

        int secondDigit = (sum % 11) % 10;

        int verifier = (firstDigit * 10 + secondDigit + 12) % 100;

        int informedVerifier = Integer.parseInt(rawCaepf.substring(12));

        if (verifier != informedVerifier) {
            throw new CAEPFException("CAEPF invalido");
        }
    }
}
