package br.com.matheusfragadev.api.domain.accounts.entity;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.shared.auditory.Auditory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends Auditory {

    @Setter
    @Column(length = 100, nullable = false)
    private String name;

    @Column(nullable = false, unique = true, updatable = false)
    private String email;

    @Setter
    @Embedded
    private Password password;

    @Setter
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Setter
    @Column(nullable = false)
    private boolean active;

    private Account(String name, String email, Password password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.active = true;
    }

    public static Account ofAdmin(String name, String email, Password password){
        return new Account(name, email, password, Role.ADMIN);
    }

    public static Account ofNurse(String name, String email, Password password){
        return new Account(name, email, password, Role.NURSE);
    }

    public static Account ofReceptionist(String name, String email, Password password){
        return new Account(name, email, password, Role.RECEPTIONIST);
    }

    public static Account ofEnterprise(String name, String email, Password password){
        return new Account(name, email, password, Role.ENTERPRISE);
    }
}
