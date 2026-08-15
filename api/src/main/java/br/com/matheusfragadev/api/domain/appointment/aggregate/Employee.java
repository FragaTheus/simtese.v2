package br.com.matheusfragadev.api.domain.appointment.aggregate;

import br.com.matheusfragadev.api.domain.appointment.exception.EmployeeException;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.regex.Pattern;

@Getter
@Embeddable
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Employee {

    //Constantes de RN
    //Constantes para nome
    private static final int NAME_MIN_LENGTH = 3;
    private static final int NAME_MAX_LENGTH = 100;
    private static final String NAME_REGEX = "^[\\p{L} ]+$";
    private static final Pattern PATTERN = Pattern.compile(NAME_REGEX);

    //Constantes para CPF
    private static final int CPF_BASE_LENGTH = 11;
    private static final int CPF_MAX_LENGTH = 14;
    private static final String CPF_REGEX = "^[0-9.-]+$";
    private static final Pattern CPF_PATTERN = Pattern.compile(CPF_REGEX);

    //Atributos da classe
    @Column(name = "employee_name", nullable = false, updatable = false)
    private String employeeName;

    @Column(name = "employee_cpf", nullable = false, updatable = false)
    private String  employeeCpf;

    //Factory da classe
    public static Employee of(String employeeName, String employeeCpf){
        validateIfInputNameIsValid(employeeName);
        verifyIfInputCpfIsValid(employeeCpf);
        var formattedCpf = formatedCpf(employeeCpf);
        calculateCpf(formattedCpf);
        return new Employee(employeeName, formattedCpf);
    }

    //Metodos auxiliares
    //Verifica input de nome do colaborador
    private static void validateIfInputNameIsValid(String employeeName){
        if (employeeName == null || employeeName.isBlank()) throw new EmployeeException
                ("Nome do colaborador não pode ser nulo ou vazio.");

        if (employeeName.length() < NAME_MIN_LENGTH || employeeName.length() > NAME_MAX_LENGTH) {
            throw new EmployeeException
                    ("Nome do colaborador deve ter entre " + NAME_MIN_LENGTH + " e " + NAME_MAX_LENGTH + " caracteres.");
        }

        if (!PATTERN.matcher(employeeName).matches()) {
            throw new EmployeeException
                    ("Nome do colaborador contém caracteres inválidos.");
        }
    }

    //Verifica input de CPF do colaborador
    private static void verifyIfInputCpfIsValid(String employeeCpf){
        if (employeeCpf == null || employeeCpf.isBlank()) throw new EmployeeException
                ("CPF do colaborador não pode ser nulo ou vazio.");

        if (employeeCpf.length() < CPF_BASE_LENGTH || employeeCpf.length() > CPF_MAX_LENGTH) {
            throw new EmployeeException
                    ("CPF do colaborador deve ter entre " + CPF_BASE_LENGTH + " e " + CPF_MAX_LENGTH + " caracteres.");
        }

        if (!CPF_PATTERN.matcher(employeeCpf).matches()) {
            throw new EmployeeException
                    ("CPF do colaborador contém caracteres inválidos.");
        }

        var formatted = formatedCpf(employeeCpf);

        if (formatted.length() != CPF_BASE_LENGTH) {
            throw new EmployeeException
                    ("CPF do colaborador deve ter " + CPF_BASE_LENGTH + " caracteres.");
        }

        if (formatted.chars().distinct().count() == 1) {
            throw new EmployeeException("CPF inválido.");
        }
    }

    //Calcula CPF
    private static void calculateCpf(String rawCpf) {
        int sum = 0;
        String EX_MESSAGE = "CPF inválido";

        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(rawCpf.charAt(i)) * (10 - i);
        }

        int remainder = sum % 11;
        int firstDigit = remainder < 2 ? 0 : 11 - remainder;

        if (firstDigit != Character.getNumericValue(rawCpf.charAt(9))) {
            throw new EmployeeException(EX_MESSAGE);
        }

        sum = 0;

        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(rawCpf.charAt(i)) * (11 - i);
        }

        remainder = sum % 11;
        int secondDigit = remainder < 2 ? 0 : 11 - remainder;

        if (secondDigit != Character.getNumericValue(rawCpf.charAt(10))) {
            throw new EmployeeException(EX_MESSAGE);
        }
    }

    //Formata o CPF
    private static String formatedCpf(String rawCpf){
        return rawCpf.replaceAll("[^0-9]", "");
    }

}
