package br.com.matheusfragadev.api.infra.auth;

import br.com.matheusfragadev.api.application.accounts.AccountServiceImpl;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.infra.security.blacklist.TokenBlacklistService;
import br.com.matheusfragadev.api.infra.security.blacklist.TokenBlacklistServiceImpl;
import br.com.matheusfragadev.api.infra.security.details.UserDetailsImpl;
import br.com.matheusfragadev.api.infra.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AccountServiceImpl accountService;
    private final TokenBlacklistService tokenBlacklistService;

    public Account me(UUID accountId){
        return accountService.findById(accountId);
    }

    public String login(String email, String password){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );

        UUID accountId = ((UserDetailsImpl)
                Objects.requireNonNull(authentication.getPrincipal())).getId();

        return jwtService.generateToken(accountId);
    }

    public void logout(String token){
        Instant expiration = jwtService.getExpiration(token);
        Duration ttl = Duration.between(Instant.now(), expiration);
        tokenBlacklistService.blacklist(token, ttl);
    }

}

