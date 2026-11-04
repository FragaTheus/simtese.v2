package br.com.matheusfragadev.api.application.accounts.profile;

import br.com.matheusfragadev.api.application.accounts.profile.aggregates.ProfileChangePasswordCommand;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceProfileImplTest {

    @Mock
    private AccountRepository repository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AccountServiceProfileImpl service;

    private Account account;
    private UUID id;

    @BeforeEach
    void setUp() {
        account = Account.ofNurse("Ana Silva", "ana@example.com", Password.of("Senha@123", raw -> "hash:" + raw));
        id = UUID.randomUUID();
    }

    @Test
    void shouldChangePasswordWhenCurrentPasswordMatches() {
        when(repository.findById(id)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("Senha@123", "hash:Senha@123")).thenReturn(true);
        when(passwordEncoder.encode("Nova@1234")).thenReturn("new-hash");

        service.changePassword(new ProfileChangePasswordCommand(id, "Senha@123", "Nova@1234", "Nova@1234"));

        assertThat(account.getPassword().getValue()).isEqualTo("new-hash");
    }

    @Test
    void shouldRejectWrongCurrentPassword() {
        when(repository.findById(id)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("errada", "hash:Senha@123")).thenReturn(false);

        assertThatThrownBy(() ->
                service.changePassword(new ProfileChangePasswordCommand(id, "errada", "Nova@1234", "Nova@1234")))
                .isInstanceOf(AccountException.class)
                .hasMessage("Senha atual incorreta");
        assertThat(account.getPassword().getValue()).isEqualTo("hash:Senha@123");
    }

    @Test
    void shouldRejectMismatchedNewPasswordsKeepingCurrentOne() {
        when(repository.findById(id)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("Senha@123", "hash:Senha@123")).thenReturn(true);

        assertThatThrownBy(() ->
                service.changePassword(new ProfileChangePasswordCommand(id, "Senha@123", "Nova@1234", "Outra@1234")))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("não coincidem");
        assertThat(account.getPassword().getValue()).isEqualTo("hash:Senha@123");
    }

    @Test
    void shouldRequireNewPasswordWhenBlank() {
        when(repository.findById(id)).thenReturn(Optional.of(account));
        when(passwordEncoder.matches("Senha@123", "hash:Senha@123")).thenReturn(true);

        assertThatThrownBy(() ->
                service.changePassword(new ProfileChangePasswordCommand(id, "Senha@123", " ", " ")))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("obrigatórios");
    }

    @Test
    void shouldFailWhenAccountDoesNotExist() {
        var unknown = UUID.randomUUID();
        when(repository.findById(unknown)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                service.changePassword(new ProfileChangePasswordCommand(unknown, "a", "b", "b")))
                .isInstanceOf(AccountException.class)
                .hasMessage("Conta não encontrada");
    }

    @Test
    void shouldFindAndSaveAccounts() {
        when(repository.findById(id)).thenReturn(Optional.of(account));
        when(repository.save(account)).thenReturn(account);

        assertThat(service.findById(id)).isSameAs(account);
        assertThat(service.save(account)).isSameAs(account);
        verify(repository).save(account);
    }
}
