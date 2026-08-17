package br.com.matheusfragadev.api.domain.enterprise.entity;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import br.com.matheusfragadev.api.infra.auditory.Auditory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Enterprise extends Auditory {

    //Constantes de RN
    private final static int NAME_MAX_LENGTH = 200;

    //Atributos classe
    @Column(nullable = false, length = NAME_MAX_LENGTH)
    private String name;

    @Embedded
    private CNPJ cnpj;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(nullable = false)
    private boolean active;

    //Construtores
    public Enterprise(String name, CNPJ cnpj) {
        if (cnpj == null) {
            throw new EnterpriseException("CNPJ é obrigatório");
        }

        this.name = validName(name);
        this.cnpj = cnpj;
        this.account = null;
        this.active = true;
    }

    //Metodos setters
    public void linkAccount(Account account) {
        if (account == null) throw new AccountException("Conta não pode ser nula");
        if (this.account != null) throw new AccountException("Empresa já está vinculada a uma conta");
        this.account = account;
    }

    public void unlinkAccount(Account account){
        if (account == null) throw new AccountException("Conta não pode ser nula");
        if (this.account == null) return;
        if (!this.account.equals(account)) throw new AccountException("Empresa não está vinculada a essa conta");
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

    //Metodos auxiliares
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
