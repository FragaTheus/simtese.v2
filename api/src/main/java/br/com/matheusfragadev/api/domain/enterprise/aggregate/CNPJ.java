package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.CNPJException;
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
public class CNPJ {

    private static final int MIN_LENGTH = 14;
    private static final int MAX_LENGTH = 18;
    private static final String REGEX = "^[0-9./-]+$";
    private static final Pattern PATTERN = Pattern.compile(REGEX);


    @Column(name = "cnpj", updatable = false, unique = true, length = MIN_LENGTH)
    private String value;

    public static CNPJ of(String value) {
        verifyIfInputIsValid(value);
        var cnpj = formatedCnpj(value);
        calculateCnpj(cnpj);
        return new CNPJ(cnpj);
    }

    //Metodos auxiliares
    //Formata o cnpj somente para numeros;
    private static String formatedCnpj(String rawCnpj){
        return rawCnpj.replaceAll("[^\\d]", "");
    }

    //Verifica se o valor do input inputado pelo usuario e valido
    private static void verifyIfInputIsValid(String inputCnpj){
        if (inputCnpj == null || inputCnpj.isBlank())
            throw new CNPJException("CNPJ e obrigatorio");

        if (inputCnpj.length() < MIN_LENGTH || inputCnpj.length() > MAX_LENGTH)
            throw new CNPJException("CNPJ deve ter entre 14 e 18 caracteres");

        if (!PATTERN.matcher(inputCnpj).matches())
            throw new CNPJException("CNPJ nao pode conter letras");

        var formatedCnpj = formatedCnpj(inputCnpj);

        if (formatedCnpj.length() != MIN_LENGTH)
            throw new CNPJException("CNPJ deve ter 14 digitos");

        if (formatedCnpj.chars().distinct().count() == 1)
            throw new CNPJException("CNPJ nao pode ter todos os digitos iguais");
    }

    //Calcula o cnpj para ver se tem o algoritmo valido
    private static void calculateCnpj(String rawCnpj){
        int[] firstWeights = {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int[] secondWeights = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

        int sum = 0;

        for (int i = 0; i < 12; i++) {
            sum += Character.getNumericValue(rawCnpj.charAt(i)) * firstWeights[i];
        }

        int remainder = sum % 11;
        int firstDigit = remainder < 2 ? 0 : 11 - remainder;

        if (firstDigit != Character.getNumericValue(rawCnpj.charAt(12))) {
            throw new CNPJException("CNPJ invalido");
        }

        sum = 0;

        for (int i = 0; i < 13; i++) {
            sum += Character.getNumericValue(rawCnpj.charAt(i)) * secondWeights[i];
        }

        remainder = sum % 11;

        int secondDigit = remainder < 2 ? 0 : 11 - remainder;

        if (secondDigit != Character.getNumericValue(rawCnpj.charAt(13))) {
            throw new CNPJException("CNPJ invalido");
        }
    }

}
