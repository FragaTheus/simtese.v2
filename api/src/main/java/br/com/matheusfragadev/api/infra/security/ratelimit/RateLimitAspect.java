package br.com.matheusfragadev.api.infra.security.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Aplica rate limit por IP (não por conta) nos endpoints anotados com
 * {@link RateLimited}, usando o Redis como contador distribuído.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

    private static final Logger SECURITY_LOG = LoggerFactory.getLogger("SECURITY");
    private static final String KEY_PREFIX = "rate-limit:";

    private final StringRedisTemplate redisTemplate;
    private final HttpServletRequest request;

    @Before("@annotation(rateLimited)")
    public void checkRateLimit(JoinPoint joinPoint, RateLimited rateLimited) {
        String ip = ClientIpResolver.resolveOrUnknown(request);
        String endpoint = joinPoint.getSignature().toShortString();
        String key = KEY_PREFIX + ip + ":" + endpoint;

        Long count = redisTemplate.opsForValue().increment(key);
        if (count == null) {
            return;
        }
        if (count == 1L) {
            redisTemplate.expire(key, Duration.ofSeconds(rateLimited.windowSeconds()));
        }
        if (count > rateLimited.limit()) {
            SECURITY_LOG.warn(
                    "Rate limit excedido | ip={} endpoint={} requisicoes={} limite={} janelaSegundos={}",
                    ip, endpoint, count, rateLimited.limit(), rateLimited.windowSeconds()
            );
            throw new RateLimitExceededException(
                    "Limite de requisições excedido. Tente novamente mais tarde."
            );
        }
    }
}
