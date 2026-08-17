package br.com.matheusfragadev.api.domain.accounts.entity;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.infra.auditory.Auditory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.function.Function;
import java.util.regex.Pattern;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends Auditory {

    //Constantes RN nome
    private static final int NAME_MAX_LENGTH = 100;
    private static final int NAME_MIN_LENGTH = 3;
    private static final String NAME_REGEX = "^[\\p{L} ]+$";
    private static final Pattern NAME_PATTERN = Pattern.compile(NAME_REGEX);

    //Constantes RN email
    private static final int EMAIL_MIN_LENGTH = 5;
    private static final int EMAIL_MAX_LENGTH = 200;
    private static final String EMAIL_REGEX =
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    private static final Pattern PATTERN_EMAIL = Pattern.compile(EMAIL_REGEX);

    //Atributos da classe
    @Column(length = NAME_MAX_LENGTH, nullable = false)
    private String name;

    @Column(nullable = false, unique = true, updatable = false, length = EMAIL_MAX_LENGTH)
    private String email;

    @Embedded
    private Password password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private boolean active;

    //Metodos setters
    public void changeName(String name){
        verifyIfInputNameIsValid(name);
        if (name.equals(this.name)) return;
        this.name = name;
    }

    public void changePassword(String newPassword, String confirmNewPassword, Function<String, String> hasher){
        var validateNewPassword = newPassword == null || newPassword.isBlank();
        var validateConfirmPassword = confirmNewPassword == null || confirmNewPassword.isBlank();

        if (validateNewPassword || validateConfirmPassword) {
            throw new AccountException("Senha e confirmação de senha são obrigatórios");
        }

        if (!newPassword.equals(confirmNewPassword)) {
            throw new AccountException("As senhas não coincidem");
        }

        this.password = Password.of(confirmNewPassword, hasher);
    }

    public void deactivate(){
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    public void activate(){
        if (this.active) {
            return;
        }
        this.active = true;
    }

    //Construtor privado
    private Account(String name, String email, Password password, Role role) {
        verifyIfInputNameIsValid(name);
        verifyIfEmailIsValid(email);

        if (password == null) {
            throw new AccountException("Senha é obrigatória");
        }

        if (role == null) {
            throw new AccountException("Role é obrigatória");
        }

        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = true;
    }

    //Factory para instancia de role
    public static Account ofAdmin(String name, String email, Password password){
        return new Account(name, email, password, Role.ADMIN);
    }

    public static Account ofNurse(String name, String email, Password password){
        return new Account(name, email, password, Role.NURSE);
    }

    public static Account ofReceptionist(String name, String email, Password password){
        return new Account(name, email, password, Role.RECEPTIONIST);
    }

    public static Account ofEnterprise(String name, String email, Password password){
        return new Account(name, email, password, Role.ENTERPRISE);
    }

    //Metodos auxiliares
    //Verifica nome
    private static void verifyIfInputNameIsValid(String name){
        if (name == null || name.isBlank()) {
            throw new AccountException("Nome não pode ser nulo ou vazio");
        }

        if (name.length() < NAME_MIN_LENGTH || name.length() > NAME_MAX_LENGTH) {
            throw new AccountException("Nome deve ter entre " + NAME_MIN_LENGTH + " e " + NAME_MAX_LENGTH + " caracteres");
        }

        if (!NAME_PATTERN.matcher(name).matches()) {
            throw new AccountException("Nome deve conter apenas letras");
        }
    }

    //Verifica email
    private static void verifyIfEmailIsValid(String email){
        if (email == null || email.isBlank()) {
            throw new AccountException("Email não pode ser nulo ou vazio");
        }

        if (email.length() < EMAIL_MIN_LENGTH || email.length() > EMAIL_MAX_LENGTH) {
            throw new AccountException("Email deve ter entre " + EMAIL_MIN_LENGTH + " e " + EMAIL_MAX_LENGTH + " caracteres");
        }

        if (!PATTERN_EMAIL.matcher(email).matches()) {
            throw new AccountException("Email inválido");
        }
    }
}
