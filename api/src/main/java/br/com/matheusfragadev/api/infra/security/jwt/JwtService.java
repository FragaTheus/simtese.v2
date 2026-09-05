package br.com.matheusfragadev.api.infra.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.sql.Date;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final SecretKey jwtSecretKey;
    private final Duration jwtExpiration;

    public String generateToken(UUID accountId){
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(accountId.toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(jwtExpiration)))
                .signWith(jwtSecretKey)
                .compact();
    }

    public UUID getSubject(String token){
        String subject = Jwts.parser()
                .verifyWith(jwtSecretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            throw new MalformedJwtException("Subject do token não é um UUID válido", e);
        }
    }
}