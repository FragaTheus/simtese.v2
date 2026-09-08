package br.com.matheusfragadev.api.infra.controller.auth;

import br.com.matheusfragadev.api.infra.auth.AuthenticationService;
import br.com.matheusfragadev.api.infra.controller.auth.aggregate.AuthResponse;
import br.com.matheusfragadev.api.infra.auth.aggregates.LoginRequest;
import br.com.matheusfragadev.api.infra.security.details.UserDetailsImpl;
import br.com.matheusfragadev.api.infra.security.ratelimit.RateLimited;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/auth")
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final Logger SECURITY_LOG = LoggerFactory.getLogger("SECURITY");

    private final AuthenticationService authenticationService;

    @GetMapping
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserDetailsImpl userDetails){
        var account = authenticationService.me(userDetails.getId());
        var response = new AuthResponse(account.getName(), account.getRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @RateLimited(limit = 5, windowSeconds = 60)
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest){
        var token = authenticationService.login(loginRequest.email(), loginRequest.password());
        return ResponseEntity.ok().header
                        (HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
    }

    @DeleteMapping
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            HttpServletRequest request
    ){
        var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        var token = authHeader.substring(BEARER_PREFIX.length());
        authenticationService.logout(token);
        SECURITY_LOG.info("Logout realizado | accountId={}", userDetails.getId());
        return ResponseEntity.noContent().build();
    }

}
