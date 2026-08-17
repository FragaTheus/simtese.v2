package br.com.matheusfragadev.api.infra.auditory;

import br.com.matheusfragadev.api.application.accounts.AccountServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditingResolver {

    private final AccountServiceImpl accountService;

    public AuditInfo resolve(Auditory entity){
        return new AuditInfo(
                resolveName(entity.getCreatedBy()),
                resolveName(entity.getUpdatedBy())
        );
    }

    private String resolveName(UUID accountId){
        if (accountId == null) return null;
        return accountService.findById(accountId).getName();
    }

}
