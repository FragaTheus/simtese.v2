package br.com.matheusfragadev.api.infra.security.details;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private final Account account;

    public UUID getId(){
        return this.account.getId();
    }

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(()-> this.account.getRole().name());
    }

    @Override
    public @Nullable String getPassword() {
        return this.account.getPassword().getValue();
    }

    @Override
    public @NonNull String getUsername() {
        return this.account.getEmail();
    }

    @Override
    public boolean isEnabled() {
        return this.account.isActive();
    }
}
