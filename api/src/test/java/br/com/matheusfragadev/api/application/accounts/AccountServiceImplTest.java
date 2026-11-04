package br.com.matheusfragadev.api.application.accounts;

import br.com.matheusfragadev.api.application.accounts.aggregates.AccountFIlterCommand;
import br.com.matheusfragadev.api.application.accounts.aggregates.AvailableEnterpriseAccountsCommand;
import br.com.matheusfragadev.api.application.accounts.aggregates.ChangePasswordCommand;
import br.com.matheusfragadev.api.application.accounts.aggregates.CreateAccountCommand;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.exception.PasswordException;
import br.com.matheusfragadev.api.domain.accounts.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    private static final String EMAIL = "ana@example.com";

    @Mock
    private AccountRepository repository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AccountServiceImpl service;

    private Account account;
    private UUID id;

    @BeforeEach
    void setUp() {
        account = Account.ofAdmin("Ana Silva", EMAIL, Password.of("Senha@123", raw -> "hash:" + raw));
        id = UUID.randomUUID();
    }

    private void stubFound() {
        when(repository.findById(id)).thenReturn(Optional.of(account));
    }

    private void stubSaveEcho() {
        when(repository.save(any(Account.class))).thenAnswer(i -> i.getArgument(0));
    }

    private CreateAccountCommand createCommand(String password, String confirm, Role role) {
        return CreateAccountCommand.builder()
                .name("Ana Silva").email(EMAIL).password(password).confirmPassword(confirm).role(role).build();
    }

    @Test
    void shouldFindById() {
        stubFound();

        assertThat(service.findById(id)).isSameAs(account);
    }

    @Test
    void shouldFailWhenAccountIsNotFound() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(id))
                .isInstanceOf(AccountException.class)
                .hasMessage("Conta não encontrada");
    }

    @Test
    void shouldDelegateSaveToRepository() {
        stubSaveEcho();

        assertThat(service.save(account)).isSameAs(account);
        verify(repository).save(account);
    }

    @Test
    void shouldDelegateFindAllWithPageable() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Account> page = new PageImpl<>(List.of(account));
        when(repository.findAll(ArgumentMatchers.<Specification<Account>>any(), eq(pageable))).thenReturn(page);

        var result = service.findAll(new AccountFIlterCommand("ana", Role.ADMIN, true, pageable));

        assertThat(result).isSameAs(page);
    }

    @Test
    void shouldAcceptNullFiltersWhenListingAccounts() {
        Pageable pageable = PageRequest.of(0, 10);
        when(repository.findAll(ArgumentMatchers.<Specification<Account>>any(), eq(pageable)))
                .thenReturn(Page.empty());

        assertThat(service.findAll(new AccountFIlterCommand(null, null, null, pageable))).isEmpty();
    }

    @Test
    void shouldDelegateAvailableEnterpriseAccounts() {
        Pageable pageable = PageRequest.of(1, 5);
        Page<Account> page = new PageImpl<>(List.of(account));
        when(repository.findAll(ArgumentMatchers.<Specification<Account>>any(), eq(pageable))).thenReturn(page);

        assertThat(service.findAvailableEnterpriseAccounts(new AvailableEnterpriseAccountsCommand("x", pageable)))
                .isSameAs(page);
    }

    @Test
    void shouldNotDeleteActiveAccount() {
        stubFound();

        assertThatThrownBy(() -> service.delete(id))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("ativa não pode ser deletada");
        verify(repository, never()).delete(any(Account.class));
    }

    @Test
    void shouldDeleteInactiveAccount() {
        account.deactivate();
        stubFound();

        service.delete(id);

        verify(repository).delete(account);
    }

    @Test
    void shouldFailToDeleteUnknownAccount() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.delete(id)).isInstanceOf(AccountException.class);
        verify(repository, never()).delete(any(Account.class));
    }

    @ParameterizedTest
    @EnumSource(Role.class)
    void shouldCreateAccountWithRequestedRoleAndEncodedPassword(Role role) {
        when(repository.existsByEmail(EMAIL)).thenReturn(false);
        when(passwordEncoder.encode("Senha@123")).thenReturn("encoded");
        stubSaveEcho();

        var created = service.createAccount(createCommand("Senha@123", "Senha@123", role));

        assertThat(created.getRole()).isEqualTo(role);
        assertThat(created.getPassword().getValue()).isEqualTo("encoded");
        assertThat(created.isActive()).isTrue();
    }

    @Test
    void shouldRejectDuplicatedEmailBeforeAnyOtherWork() {
        when(repository.existsByEmail(EMAIL)).thenReturn(true);

        assertThatThrownBy(() -> service.createAccount(createCommand("Senha@123", "outra", Role.ADMIN)))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("Email já cadastrado");
        verify(repository, never()).save(any());
    }

    @Test
    void shouldRejectMismatchedPasswordsOnCreation() {
        when(repository.existsByEmail(EMAIL)).thenReturn(false);

        assertThatThrownBy(() -> service.createAccount(createCommand("Senha@123", "Outra@123", Role.ADMIN)))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("não conferem");
        verify(repository, never()).save(any());
    }

    @Test
    void shouldRejectWeakPasswordOnCreation() {
        when(repository.existsByEmail(EMAIL)).thenReturn(false);

        assertThatThrownBy(() -> service.createAccount(createCommand("fraca", "fraca", Role.ADMIN)))
                .isInstanceOf(PasswordException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void shouldNotPersistWhenAccountDataIsInvalid() {
        when(repository.existsByEmail("invalido")).thenReturn(false);
        when(passwordEncoder.encode("Senha@123")).thenReturn("encoded");
        var command = CreateAccountCommand.builder()
                .name("Ana Silva").email("invalido").password("Senha@123").confirmPassword("Senha@123")
                .role(Role.NURSE).build();

        assertThatThrownBy(() -> service.createAccount(command)).isInstanceOf(AccountException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void shouldUpdateNameOfActiveAccount() {
        stubFound();
        stubSaveEcho();

        assertThat(service.updateName(id, "Maria Souza").getName()).isEqualTo("Maria Souza");
    }

    @Test
    void shouldNotUpdateNameOfInactiveAccount() {
        account.deactivate();
        stubFound();

        assertThatThrownBy(() -> service.updateName(id, "Maria Souza"))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("inativa");
        verify(repository, never()).save(any());
    }

    @Test
    void shouldNotSaveWhenNewNameIsInvalid() {
        stubFound();

        assertThatThrownBy(() -> service.updateName(id, "A1")).isInstanceOf(AccountException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void shouldUpdatePasswordUsingEncoder() {
        stubFound();
        stubSaveEcho();
        when(passwordEncoder.encode("Nova@1234")).thenReturn("new-hash");

        var updated = service.updatePassword(new ChangePasswordCommand(id, "Nova@1234", "Nova@1234"));

        assertThat(updated.getPassword().getValue()).isEqualTo("new-hash");
    }

    @Test
    void shouldNotUpdatePasswordOfInactiveAccount() {
        account.deactivate();
        stubFound();

        assertThatThrownBy(() -> service.updatePassword(new ChangePasswordCommand(id, "Nova@1234", "Nova@1234")))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("inativa");
        verify(repository, never()).save(any());
    }

    @Test
    void shouldRejectMismatchedPasswordOnUpdate() {
        stubFound();

        assertThatThrownBy(() -> service.updatePassword(new ChangePasswordCommand(id, "Nova@1234", "Outra@1234")))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("não coincidem");
        assertThat(account.getPassword().getValue()).isEqualTo("hash:Senha@123");
        verify(repository, never()).save(any());
    }

    @Test
    void shouldDeactivateAndActivateAndPersist() {
        stubFound();
        stubSaveEcho();

        assertThat(service.deactivate(id).isActive()).isFalse();
        assertThat(service.deactivate(id).isActive()).isFalse();
        assertThat(service.activate(id).isActive()).isTrue();
    }

    @Test
    void shouldFailToActivateUnknownAccount() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.activate(id)).isInstanceOf(AccountException.class);
        assertThatThrownBy(() -> service.deactivate(id)).isInstanceOf(AccountException.class);
    }

    @Test
    void shouldChangeAccountNameThroughDefaultInterfaceMethod() {
        stubFound();
        stubSaveEcho();

        assertThat(service.changeAccountName(id, "Maria Souza").getName()).isEqualTo("Maria Souza");
    }
}
