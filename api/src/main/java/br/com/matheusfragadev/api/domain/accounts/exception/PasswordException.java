package br.com.matheusfragadev.api.domain.accounts.exception;

public class PasswordException extends RuntimeException {
    public PasswordException(String message) {
        super(message);
    }
}
