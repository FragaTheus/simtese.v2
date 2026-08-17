package br.com.matheusfragadev.api.infra.security.details;

import br.com.matheusfragadev.api.domain.accounts.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public @NonNull UserDetailsImpl loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        return accountRepository.findByEmail(username).map(UserDetailsImpl::new)
                .orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas: " + username));
    }

    public @NonNull UserDetailsImpl loadByUserId(@NonNull UUID accountId) throws UsernameNotFoundException {
        return accountRepository.findById(accountId).map(UserDetailsImpl::new)
                .orElseThrow(()-> new UsernameNotFoundException("Usuario nao encontrado"));
    }

}
