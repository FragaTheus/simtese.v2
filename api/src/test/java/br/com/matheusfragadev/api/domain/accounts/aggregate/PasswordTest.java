package br.com.matheusfragadev.api.domain.accounts.aggregate;

import br.com.matheusfragadev.api.domain.accounts.exception.PasswordException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PasswordTest {

    private static final String VALID = "Senha@123";

    @Test
    void shouldHashWithGivenFunction() {
        var password = Password.of(VALID, raw -> "hash:" + raw);

        assertThat(password.getValue()).isEqualTo("hash:" + VALID);
    }

    @Test
    void shouldAcceptMinimumAndMaximumLengths() {
        assertThat(Password.of("Ab1@cdef", raw -> raw).getValue()).isEqualTo("Ab1@cdef");
        var maximumLength = "Ab1@cdefghijklmn";
        assertThat(maximumLength).hasSize(16);
        assertThat(Password.of(maximumLength, raw -> raw).getValue()).isEqualTo(maximumLength);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectNullOrBlank(String raw) {
        assertThatThrownBy(() -> Password.of(raw, s -> s))
                .isInstanceOf(PasswordException.class)
                .hasMessageContaining("nula ou vazia");
    }

    @ParameterizedTest
    @ValueSource(strings = {"S@1abc", "Senha@123456789012345"})
    void shouldRejectInvalidLength(String raw) {
        assertThatThrownBy(() -> Password.of(raw, s -> s))
                .isInstanceOf(PasswordException.class)
                .hasMessageContaining("entre 8 e 16");
    }

    @ParameterizedTest
    @ValueSource(strings = {"12345678@", "Abcdefgh@", "Abcdefg12"})
    void shouldRequireLetterDigitAndSpecialCharacter(String raw) {
        assertThatThrownBy(() -> Password.of(raw, s -> s))
                .isInstanceOf(PasswordException.class)
                .hasMessageContaining("pelo menos uma letra");
    }

    @Test
    void shouldAcceptMatchingPassword() {
        var password = Password.of(VALID, raw -> "h" + raw);

        assertThatCode(() -> password.matches(VALID, (raw, hash) -> hash.equals("h" + raw)))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldRejectNonMatchingPassword() {
        var password = Password.of(VALID, raw -> "h" + raw);

        assertThatThrownBy(() -> password.matches("outra", (raw, hash) -> hash.equals("h" + raw)))
                .isInstanceOf(PasswordException.class)
                .hasMessage("Senha inválida");
    }
}
