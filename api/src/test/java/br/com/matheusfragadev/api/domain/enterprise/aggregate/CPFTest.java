package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.CPFException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CPFTest {

    private static final String VALID = "52998224725";

    @ParameterizedTest
    @ValueSource(strings = {"52998224725", "529.982.247-25"})
    void shouldAcceptValidCpfAndStoreOnlyDigits(String raw) {
        assertThat(CPF.of(raw).getValue()).isEqualTo(VALID);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectNullOrBlank(String raw) {
        assertThatThrownBy(() -> CPF.of(raw))
                .isInstanceOf(CPFException.class)
                .hasMessageContaining("obrigatorio");
    }

    @ParameterizedTest
    @ValueSource(strings = {"5299822472", "529.982.247-250"})
    void shouldRejectInvalidLength(String raw) {
        assertThatThrownBy(() -> CPF.of(raw))
                .isInstanceOf(CPFException.class)
                .hasMessageContaining("entre 11 e 14");
    }

    @Test
    void shouldRejectLetters() {
        assertThatThrownBy(() -> CPF.of("5299822472A"))
                .isInstanceOf(CPFException.class)
                .hasMessageContaining("letras");
    }

    @Test
    void shouldRejectRepeatedDigits() {
        assertThatThrownBy(() -> CPF.of("11111111111"))
                .isInstanceOf(CPFException.class)
                .hasMessageContaining("iguais");
    }

    @Test
    void shouldRejectInvalidCheckDigits() {
        assertThatThrownBy(() -> CPF.of("52998224726"))
                .isInstanceOf(CPFException.class)
                .hasMessage("CPF invalido");
    }
}
