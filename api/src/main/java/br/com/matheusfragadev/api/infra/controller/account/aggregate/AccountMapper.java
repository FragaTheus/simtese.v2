package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import br.com.matheusfragadev.api.application.accounts.aggregates.CreateAccountCommand;

public record AccountMapper() {

    public static CreateAccountCommand toCreateAccountCommand(CreateAccountRequest request){
        return CreateAccountCommand.builder()
                .name(request.name())
                .email(request.email())
                .password(request.password())
                .confirmPassword(request.confirmPassword())
                .role(request.role())
                .build();
    }

}
