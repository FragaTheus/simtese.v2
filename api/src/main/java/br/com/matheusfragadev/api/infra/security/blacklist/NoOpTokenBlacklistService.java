package br.com.matheusfragadev.api.infra.security.blacklist;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@ConditionalOnProperty(
        name = "app.redis.enabled",
        havingValue = "false"
)
public class NoOpTokenBlacklistService implements TokenBlacklistService {

    @Override
    public void blacklist(String token, Duration ttl) {
    }

    @Override
    public boolean isBlacklisted(String token) {
        return false;
    }
}