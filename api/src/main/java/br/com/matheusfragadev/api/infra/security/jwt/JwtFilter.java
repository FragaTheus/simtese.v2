package br.com.matheusfragadev.api.infra.security.jwt;

import br.com.matheusfragadev.api.infra.security.blacklist.TokenBlacklistService;
import br.com.matheusfragadev.api.infra.security.details.UserDetailsImpl;
import br.com.matheusfragadev.api.infra.security.details.UserDetailsServiceImpl;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private static final String PREFIX = "Bearer ";
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith(PREFIX)){
            filterChain.doFilter(request, response);
            return;
        }
        try {
            String token = authHeader.substring(PREFIX.length());
            if (tokenBlacklistService.isBlacklisted(token)) {
                throw new JwtException("Token invalidado (logout realizado)");
            }
            UserDetailsImpl userDetails = userDetailsService.loadByUserId(
                    jwtService.getSubject(token)
            );
            var auth =
                    UsernamePasswordAuthenticationToken.authenticated(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
            SecurityContextHolder.getContext()
                    .setAuthentication(auth);
            filterChain.doFilter(request, response);
        } catch (JwtException | AuthenticationException ex){
            SecurityContextHolder.clearContext();
            authenticationEntryPoint.commence(
                    request,
                    response,
                    new BadCredentialsException("Token invalido ou expirado", ex)
            );
        }
    }

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        return request.getServletPath().equals("/api/v1/appointments/schedule");
    }
}
