package br.com.matheusfragadev.api.infra.controller.account.aggregate;

import br.com.matheusfragadev.api.application.accounts.aggregates.CreateAccountCommand;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.infra.auditory.AuditInfo;

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

    public static AccountInfo toAccountInfo(Account account, AuditInfo auditInfo){
        return AccountInfo.builder()
                .id(account.getId())
                .name(account.getName())
                .email(account.getEmail())
                .role(account.getRole())
                .active(account.isActive())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .createdBy(auditInfo.createdBy())
                .updatedBy(auditInfo.updatedBy())
                .build();
    }

    public static AccountSummary toAccountSummary(Account account){
        return AccountSummary.builder()
                .id(account.getId())
                .name(account.getName())
                .email(account.getEmail())
                .build();
    }

}
