package br.com.matheusfragadev.api.domain.enterprise.aggregate;

import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseDocumentException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EnterpriseDocumentTest {

    @Test
    void shouldCreateDocumentWithTypeAndValue() {
        var document = new EnterpriseDocument(EnterpriseDocumentType.CNPJ, "11.222.333/0001-81");

        assertThat(document.type()).isEqualTo(EnterpriseDocumentType.CNPJ);
        assertThat(document.value()).isEqualTo("11.222.333/0001-81");
    }

    @Test
    void shouldRejectNullType() {
        assertThatThrownBy(() -> new EnterpriseDocument(null, "11222333000181"))
                .isInstanceOf(EnterpriseDocumentException.class)
                .hasMessageContaining("Tipo");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectNullOrBlankValue(String value) {
        assertThatThrownBy(() -> new EnterpriseDocument(EnterpriseDocumentType.CNPJ, value))
                .isInstanceOf(EnterpriseDocumentException.class)
                .hasMessageContaining("Documento");
    }
}
