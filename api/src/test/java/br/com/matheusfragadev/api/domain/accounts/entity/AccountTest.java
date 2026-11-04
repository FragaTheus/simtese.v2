package br.com.matheusfragadev.api.domain.accounts.entity;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.exception.PasswordException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AccountTest {

    private static final String EMAIL = "ana@example.com";
    private static final Password PASSWORD = Password.of("Senha@123", raw -> "hash:" + raw);

    @Test
    void shouldCreateAccountForEachRole() {
        assertThat(Account.ofAdmin("Ana Silva", EMAIL, PASSWORD).getRole()).isEqualTo(Role.ADMIN);
        assertThat(Account.ofNurse("Ana Silva", EMAIL, PASSWORD).getRole()).isEqualTo(Role.NURSE);
        assertThat(Account.ofReceptionist("Ana Silva", EMAIL, PASSWORD).getRole()).isEqualTo(Role.RECEPTIONIST);
        assertThat(Account.ofEnterprise("Ana Silva", EMAIL, PASSWORD).getRole()).isEqualTo(Role.ENTERPRISE);
    }

    @Test
    void shouldCreateActiveAccountWithGivenCredentials() {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        assertThat(account.getName()).isEqualTo("Ana Silva");
        assertThat(account.getEmail()).isEqualTo(EMAIL);
        assertThat(account.getPassword()).isSameAs(PASSWORD);
        assertThat(account.isActive()).isTrue();
    }

    @Test
    void shouldAcceptNameAtMinimumAndMaximumLengths() {
        assertThat(Account.ofAdmin("Ana", EMAIL, PASSWORD).getName()).isEqualTo("Ana");
        var maximumName = "A".repeat(100);
        assertThat(Account.ofAdmin(maximumName, EMAIL, PASSWORD).getName()).isEqualTo(maximumName);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectMissingName(String name) {
        assertThatThrownBy(() -> Account.ofAdmin(name, EMAIL, PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("Nome");
    }

    @ParameterizedTest
    @ValueSource(strings = {"Jo", "Ana1"})
    void shouldRejectInvalidName(String name) {
        assertThatThrownBy(() -> Account.ofAdmin(name, EMAIL, PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("Nome");
    }

    @Test
    void shouldRejectNameOverMaximumLength() {
        assertThatThrownBy(() -> Account.ofAdmin("A".repeat(101), EMAIL, PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("entre 3 e 100");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectMissingEmail(String email) {
        assertThatThrownBy(() -> Account.ofAdmin("Ana Silva", email, PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("Email");
    }

    @ParameterizedTest
    @ValueSource(strings = {"a@b.c", "ana.example.com"})
    void shouldRejectInvalidEmail(String email) {
        assertThatThrownBy(() -> Account.ofAdmin("Ana Silva", email, PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("Email");
    }

    @Test
    void shouldRejectEmailBelowMinimumLength() {
        assertThatThrownBy(() -> Account.ofAdmin("Ana Silva", "a@.c", PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("entre 5 e 200");
    }

    @Test
    void shouldAcceptShortestEmailAllowedByFormat() {
        assertThat(Account.ofAdmin("Ana Silva", "a@b.co", PASSWORD).getEmail()).isEqualTo("a@b.co");
    }

    @Test
    void shouldRejectEmailOverMaximumLength() {
        assertThatThrownBy(() ->
                Account.ofAdmin("Ana Silva", "a".repeat(189) + "@example.com", PASSWORD))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("entre 5 e 200");
    }

    @Test
    void shouldAcceptEmailAtMaximumLength() {
        var email = "a".repeat(188) + "@example.com";

        assertThat(email).hasSize(200);
        assertThat(Account.ofAdmin("Ana Silva", email, PASSWORD).getEmail()).isEqualTo(email);
    }

    @Test
    void shouldRejectNullPassword() {
        assertThatThrownBy(() -> Account.ofAdmin("Ana Silva", EMAIL, null))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("Senha");
    }

    @Test
    void shouldChangeNameOnlyAfterValidation() {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        account.changeName("Maria Souza");
        assertThat(account.getName()).isEqualTo("Maria Souza");

        account.changeName("Maria Souza");
        assertThatThrownBy(() -> account.changeName("Jo"))
                .isInstanceOf(AccountException.class);
        assertThat(account.getName()).isEqualTo("Maria Souza");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRequireBothPasswordsWhenChangingPassword(String value) {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        assertThatThrownBy(() -> account.changePassword(value, "Nova@123", raw -> "new:" + raw))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("obrigatórios");
        assertThatThrownBy(() -> account.changePassword("Nova@123", value, raw -> "new:" + raw))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("obrigatórios");
    }

    @Test
    void shouldRejectMismatchedPasswords() {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        assertThatThrownBy(() -> account.changePassword("Nova@123", "Outra@123", raw -> "new:" + raw))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("não coincidem");
        assertThat(account.getPassword()).isSameAs(PASSWORD);
    }

    @Test
    void shouldHashNewPasswordAfterConfirmation() {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        account.changePassword("Nova@123", "Nova@123", raw -> "hash:" + raw);

        assertThat(account.getPassword().getValue()).isEqualTo("hash:Nova@123");
    }

    @Test
    void shouldRejectInvalidNewPasswordWithoutChangingCurrentPassword() {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        assertThatThrownBy(() -> account.changePassword("invalid", "invalid", raw -> "hash:" + raw))
                .isInstanceOf(PasswordException.class);
        assertThat(account.getPassword()).isSameAs(PASSWORD);
    }

    @Test
    void shouldActivateAndDeactivateIdempotently() {
        var account = Account.ofAdmin("Ana Silva", EMAIL, PASSWORD);

        account.deactivate();
        account.deactivate();
        assertThat(account.isActive()).isFalse();

        account.activate();
        account.activate();
        assertThat(account.isActive()).isTrue();
    }
}
