package br.com.matheusfragadev.api.infra.controller.enterprise.aggregates;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.infra.auditory.AuditInfo;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Optional;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EnterpriseMapper {

    public static EnterpriseInfo toEnterpriseInfo(Enterprise enterprise, AuditInfo auditInfo){
        return EnterpriseInfo.builder()
                .id(enterprise.getId())
                .name(enterprise.getName())
                .cnpj(enterprise.getCnpj().getValue())
                .linkedAccountName(
                        Optional.ofNullable(enterprise.getAccount())
                                .map(Account::getName)
                                .orElse(null)
                )
                .active(enterprise.isActive())
                .createdBy(auditInfo.createdBy())
                .createdAt(enterprise.getCreatedAt())
                .updatedBy(auditInfo.updatedBy())
                .updatedAt(enterprise.getUpdatedAt())
                .build();
    }

    public static EnterpriseSummary toEnterpriseSummary(Enterprise enterprise){
        return EnterpriseSummary.builder()
                .id(enterprise.getId())
                .name(enterprise.getName())
                .cnpj(enterprise.getCnpj().getValue())
                .build();
    }

}
