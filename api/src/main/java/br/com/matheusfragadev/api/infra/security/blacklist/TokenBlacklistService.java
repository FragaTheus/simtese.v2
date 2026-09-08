package br.com.matheusfragadev.api.infra.security.blacklist;

import java.time.Duration;

public interface TokenBlacklistService {
    void blacklist(String token, Duration ttl);
    boolean isBlacklisted(String token);
}
