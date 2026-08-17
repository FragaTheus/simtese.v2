package br.com.matheusfragadev.api.infra.controller.auth.aggregate;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.infra.auth.aggregates.AuthResponse;

public class AuthMapper {

    public static AuthResponse toAuthResponse(Account account){
        return AuthResponse.builder()
                .meId(account.getId())
                .meName(account.getName())
                .meEmail(account.getEmail())
                .meRole(account.getRole())
                .build();
    }

}
