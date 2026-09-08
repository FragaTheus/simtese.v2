package br.com.matheusfragadev.api.infra.security.blacklist;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "app.redis.enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class TokenBlacklistServiceImpl implements TokenBlacklistService {

    private static final String KEY_PREFIX = "auth:blacklist:";

    private final StringRedisTemplate redisTemplate;

    @Override
    public void blacklist(String token, Duration ttl) {
        if (ttl == null || ttl.isNegative() || ttl.isZero()) {
            return;
        }

        redisTemplate.opsForValue()
                .set(KEY_PREFIX + token, "true", ttl);
    }

    @Override
    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(KEY_PREFIX + token)
        );
    }
}