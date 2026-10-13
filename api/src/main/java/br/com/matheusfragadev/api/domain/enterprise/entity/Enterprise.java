package br.com.matheusfragadev.api.domain.enterprise.entity;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CAEPF;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CPF;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import br.com.matheusfragadev.api.infra.auditory.Auditory;
import jakarta.persistence.Access;
import jakarta.persistence.AccessType;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Access(AccessType.FIELD)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Enterprise extends Auditory {

    private final static int NAME_MAX_LENGTH = 200;

    @Column(nullable = false, length = NAME_MAX_LENGTH)
    private String name;

    @Embedded
    private CNPJ cnpj;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "caepf", unique = true, updatable = false, length = 14))
    private CAEPF caepf;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "cpf", unique = true, updatable = false, length = 11))
    private CPF cpf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(nullable = false)
    private boolean active;

    private Enterprise(String name, CNPJ cnpj, CAEPF caepf, CPF cpf) {
        this.name = validName(name);
        this.cnpj = cnpj;
        this.caepf = caepf;
        this.cpf = cpf;
        validateDocumentExclusivity();
        this.account = null;
        this.active = true;
    }

    public static Enterprise withCnpj(String name, CNPJ cnpj) {
        if (cnpj == null) {
            throw new EnterpriseException("CNPJ e obrigatorio");
        }

        return new Enterprise(name, cnpj, null, null);
    }

    public static Enterprise withCaepf(String name, CAEPF caepf) {
        if (caepf == null) {
            throw new EnterpriseException("CAEPF e obrigatorio");
        }

        return new Enterprise(name, null, caepf, null);
    }

    public static Enterprise withCpf(String name, CPF cpf) {
        if (cpf == null) {
            throw new EnterpriseException("CPF e obrigatorio");
        }

        return new Enterprise(name, null, null, cpf);
    }

    public void linkAccount(Account account) {
        if (account == null) throw new AccountException("Conta não pode ser nula");
        if (this.account != null) throw new AccountException("Empresa já está vinculada a uma conta");
        this.account = account;
    }

    public void unlinkAccount(){
        if (this.account == null) throw new AccountException("Empresa não está vinculada a nenhuma conta");
        this.account = null;
    }

    public void changeName(String newName){
        var validName = validName(newName);
        if (this.name.equals(validName)) {
            return;
        }
        this.name = validName;
    }

    public void deactivate(){
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    public void activate(){
        if (this.active) {
            return;
        }
        this.active = true;
    }

    public String getRegistrationNumber() {
        if (cnpj != null) {
            return cnpj.getValue();
        }
        if (caepf != null) {
            return caepf.getValue();
        }
        return cpf.getValue();
    }

    public EnterpriseDocumentType getRegistrationType() {
        if (cnpj != null) {
            return EnterpriseDocumentType.CNPJ;
        }
        if (caepf != null) {
            return EnterpriseDocumentType.CAEPF;
        }
        return EnterpriseDocumentType.CPF;
    }

    private void validateDocumentExclusivity() {
        int totalDocuments = 0;
        if (cnpj != null) totalDocuments++;
        if (caepf != null) totalDocuments++;
        if (cpf != null) totalDocuments++;

        if (totalDocuments == 0) {
            throw new EnterpriseException("Empresa deve possuir ao menos um documento");
        }

        if (totalDocuments > 1) {
            throw new EnterpriseException("Empresa deve possuir somente um documento");
        }
    }

    private static String validName(String name){
        if (name == null || name.isBlank()) {
            throw new EnterpriseException("Nome da empresa não pode ser nulo ou vazio");
        }
        if (name.length() > NAME_MAX_LENGTH) {
            throw new EnterpriseException("Nome da empresa não pode ter mais de " + NAME_MAX_LENGTH + " caracteres");
        }
        return name;
    }
}
