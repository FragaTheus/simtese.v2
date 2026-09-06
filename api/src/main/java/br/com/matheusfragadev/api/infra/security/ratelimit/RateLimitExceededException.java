package br.com.matheusfragadev.api.infra.security.ratelimit;

/**
 * Lançada quando um cliente (identificado por IP) excede o limite de
 * requisições configurado para um endpoint público.
 */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException(String message) {
        super(message);
    }
}
