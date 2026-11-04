package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.CAEPFException;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CAEPFTest {

    private static final String VALID = "12345678901242";

    @Test
    void shouldAcceptValidCaepfAndNormalizeFormatting() {
        assertThat(CAEPF.of(VALID).getValue()).isEqualTo(VALID);
        assertThat(CAEPF.of("12.345.678/9012-42").getValue()).isEqualTo(VALID);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectNullOrBlank(String raw) {
        assertThatThrownBy(() -> CAEPF.of(raw))
                .isInstanceOf(CAEPFException.class)
                .hasMessageContaining("obrigatorio");
    }

    @ParameterizedTest
    @ValueSource(strings = {"1234567890124", "12.345.678/9012--42"})
    void shouldRejectInvalidLength(String raw) {
        assertThatThrownBy(() -> CAEPF.of(raw))
                .isInstanceOf(CAEPFException.class)
                .hasMessageContaining("entre 14 e 18");
    }

    @Test
    void shouldRejectLetters() {
        assertThatThrownBy(() -> CAEPF.of("1234567890124A"))
                .isInstanceOf(CAEPFException.class)
                .hasMessageContaining("letras");
    }

    @Test
    void shouldRejectRepeatedDigits() {
        assertThatThrownBy(() -> CAEPF.of("11111111111111"))
                .isInstanceOf(CAEPFException.class)
                .hasMessageContaining("iguais");
    }

    @Test
    void shouldRejectInvalidCheckDigits() {
        assertThatThrownBy(() -> CAEPF.of("12345678901243"))
                .isInstanceOf(CAEPFException.class)
                .hasMessage("CAEPF invalido");
    }
}
