package br.com.matheusfragadev.api.infra.security.ratelimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Aplica rate limit por IP em endpoints públicos.
 * O bloqueio é feito por IP (e não por conta), pois esses endpoints
 * podem ser acessados sem autenticação.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {

    /**
     * Quantidade máxima de requisições permitidas dentro da janela de tempo.
     */
    int limit() default 10;

    /**
     * Duração da janela de tempo, em segundos.
     */
    long windowSeconds() default 60;
}
