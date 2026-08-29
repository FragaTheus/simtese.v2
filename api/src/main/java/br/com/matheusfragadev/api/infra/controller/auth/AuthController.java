package br.com.matheusfragadev.api.infra.controller.auth;

import br.com.matheusfragadev.api.infra.auth.AuthenticationService;
import br.com.matheusfragadev.api.infra.controller.auth.aggregate.AuthResponse;
import br.com.matheusfragadev.api.infra.auth.aggregates.LoginRequest;
import br.com.matheusfragadev.api.infra.security.details.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    @GetMapping
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserDetailsImpl userDetails){
        var account = authenticationService.me(userDetails.getId());
        var response = new AuthResponse(account.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequest loginRequest){
        var token = authenticationService.login(loginRequest.email(), loginRequest.password());
        return ResponseEntity.ok().header
                        (HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .build();
    }

}
