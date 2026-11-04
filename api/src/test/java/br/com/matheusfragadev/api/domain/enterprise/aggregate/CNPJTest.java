package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.CNPJException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CNPJTest {

    @ParameterizedTest
    @ValueSource(strings = {"11222333000181", "11.222.333/0001-81"})
    void shouldAcceptValidAndStoreOnlyDigits(String raw) {
        assertThat(CNPJ.of(raw).getValue()).isEqualTo("11222333000181");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectNullOrBlank(String raw) {
        assertThatThrownBy(() -> CNPJ.of(raw))
                .isInstanceOf(CNPJException.class)
                .hasMessageContaining("obrigatorio");
    }

    @Test
    void shouldRejectInvalidLength() {
        assertThatThrownBy(() -> CNPJ.of("1122233300018"))
                .isInstanceOf(CNPJException.class)
                .hasMessageContaining("entre 14 e 18");
    }

    @Test
    void shouldAcceptMaximumFormattedLength() {
        assertThat(CNPJ.of("11.222.333/0001-81").getValue()).isEqualTo("11222333000181");
    }

    @Test
    void shouldRejectInputLongerThanMaximumLength() {
        assertThatThrownBy(() -> CNPJ.of("11.222.333/0001--81"))
                .isInstanceOf(CNPJException.class)
                .hasMessageContaining("entre 14 e 18");
    }

    @Test
    void shouldRejectLetters() {
        assertThatThrownBy(() -> CNPJ.of("1122233300018a"))
                .isInstanceOf(CNPJException.class)
                .hasMessageContaining("letras");
    }

    @Test
    void shouldRejectRepeatedDigits() {
        assertThatThrownBy(() -> CNPJ.of("11111111111111"))
                .isInstanceOf(CNPJException.class)
                .hasMessageContaining("iguais");
    }

    @Test
    void shouldRejectWrongCheckDigits() {
        assertThatThrownBy(() -> CNPJ.of("11222333000182"))
                .isInstanceOf(CNPJException.class)
                .hasMessageContaining("invalido");
    }
}
