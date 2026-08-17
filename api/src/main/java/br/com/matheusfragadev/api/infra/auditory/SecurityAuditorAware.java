package br.com.matheusfragadev.api.infra.auditory;

import br.com.matheusfragadev.api.infra.security.details.UserDetailsImpl;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;


@Component("securityAuditorAware")
public class SecurityAuditorAware implements AuditorAware<UUID> {

    @Override
    public @NonNull Optional<UUID> getCurrentAuditor() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        if (!(authentication.getPrincipal() instanceof UserDetailsImpl principal)) {
            return Optional.empty();
        }

        return Optional.of(principal.getId());
    }
}

