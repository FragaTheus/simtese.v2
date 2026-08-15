package br.com.matheusfragadev.api.domain.enterprise.entity;

import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import br.com.matheusfragadev.api.shared.auditory.Auditory;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
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

    @Column(nullable = false)
    private boolean active;

    //Construtores
    public Enterprise(String name, CNPJ cnpj) {
        this.name = validName(name);
        this.cnpj = cnpj;
        this.active = true;
    }

    //Metodos setters
    public void changeName(String newName){
        var validName = validName(newName);
        if (this.name.equals(validName)) {
            return;
        }
        this.name = validName;
    }

    public void deactivateCnpj(){
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    public void activateCnpj(){
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
