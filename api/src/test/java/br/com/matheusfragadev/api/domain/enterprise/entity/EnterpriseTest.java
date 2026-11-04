package br.com.matheusfragadev.api.domain.enterprise.entity;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CAEPF;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CPF;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EnterpriseTest {

    private static final String CNPJ_VALUE = "11222333000181";

    @Test
    void shouldCreateActiveEnterpriseWithCnpj() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));

        assertThat(enterprise.isActive()).isTrue();
        assertThat(enterprise.getRegistrationType()).isEqualTo(EnterpriseDocumentType.CNPJ);
        assertThat(enterprise.getRegistrationNumber()).isEqualTo(CNPJ_VALUE);
        assertThat(enterprise.getAccount()).isNull();
    }

    @Test
    void shouldCreateEnterpriseWithCpf() {
        var enterprise = Enterprise.withCpf("Produtor Rural", CPF.of("52998224725"));

        assertThat(enterprise.getRegistrationType()).isEqualTo(EnterpriseDocumentType.CPF);
        assertThat(enterprise.getRegistrationNumber()).isEqualTo("52998224725");
    }

    @Test
    void shouldCreateEnterpriseWithCaepf() {
        var enterprise = Enterprise.withCaepf("Produtor Rural", CAEPF.of("12345678901242"));

        assertThat(enterprise.getRegistrationType()).isEqualTo(EnterpriseDocumentType.CAEPF);
        assertThat(enterprise.getRegistrationNumber()).isEqualTo("12345678901242");
    }

    @Test
    void shouldRejectNullDocument() {
        assertThatThrownBy(() -> Enterprise.withCnpj("Empresa", null))
                .isInstanceOf(EnterpriseException.class)
                .hasMessageContaining("CNPJ");
        assertThatThrownBy(() -> Enterprise.withCaepf("Empresa", null))
                .isInstanceOf(EnterpriseException.class)
                .hasMessageContaining("CAEPF");
        assertThatThrownBy(() -> Enterprise.withCpf("Empresa", null))
                .isInstanceOf(EnterpriseException.class)
                .hasMessageContaining("CPF");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   "})
    void shouldRejectBlankName(String name) {
        assertThatThrownBy(() -> Enterprise.withCnpj(name, CNPJ.of(CNPJ_VALUE)))
                .isInstanceOf(EnterpriseException.class)
                .hasMessageContaining("Nome da empresa");
    }

    @Test
    void shouldRejectTooLongName() {
        var name = "a".repeat(201);

        assertThatThrownBy(() -> Enterprise.withCnpj(name, CNPJ.of(CNPJ_VALUE)))
                .isInstanceOf(EnterpriseException.class)
                .hasMessageContaining("200");
    }

    @Test
    void shouldChangeName() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));

        enterprise.changeName("Novo Nome");

        assertThat(enterprise.getName()).isEqualTo("Novo Nome");
    }

    @Test
    void shouldAcceptMaximumNameLength() {
        var name = "E".repeat(200);

        assertThat(Enterprise.withCnpj(name, CNPJ.of(CNPJ_VALUE)).getName()).isEqualTo(name);
    }

    @Test
    void shouldPreserveNameWhenChangeIsInvalidOrUnchanged() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));

        enterprise.changeName("Empresa Teste");
        assertThatThrownBy(() -> enterprise.changeName("   "))
                .isInstanceOf(EnterpriseException.class);
        assertThat(enterprise.getName()).isEqualTo("Empresa Teste");
    }

    @Test
    void shouldLinkAndUnlinkAccount() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));
        var account = Account.ofEnterprise(
                "Conta Empresa", "empresa@example.com", Password.of("Senha@123", raw -> "hash:" + raw)
        );

        enterprise.linkAccount(account);
        assertThat(enterprise.getAccount()).isSameAs(account);

        enterprise.unlinkAccount();
        assertThat(enterprise.getAccount()).isNull();
    }

    @Test
    void shouldRejectInvalidAccountLinkOperations() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));

        assertThatThrownBy(() -> enterprise.linkAccount(null))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("nula");
        assertThatThrownBy(enterprise::unlinkAccount)
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("não está vinculada");

        var account = Account.ofEnterprise(
                "Conta Empresa", "empresa@example.com", Password.of("Senha@123", raw -> "hash:" + raw)
        );
        enterprise.linkAccount(account);
        assertThatThrownBy(() -> enterprise.linkAccount(account))
                .isInstanceOf(AccountException.class)
                .hasMessageContaining("já está vinculada");
    }

    @Test
    void shouldToggleActivation() {
        var enterprise = Enterprise.withCnpj("Empresa Teste", CNPJ.of(CNPJ_VALUE));

        enterprise.deactivate();
        enterprise.deactivate();
        assertThat(enterprise.isActive()).isFalse();

        enterprise.activate();
        enterprise.activate();
        assertThat(enterprise.isActive()).isTrue();
    }
}
