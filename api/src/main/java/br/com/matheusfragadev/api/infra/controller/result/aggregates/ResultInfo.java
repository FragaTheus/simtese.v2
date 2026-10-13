package br.com.matheusfragadev.api.infra.controller.result.aggregates;

import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocumentType;
import br.com.matheusfragadev.api.domain.result.Result;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ResultInfo(
        UUID resultId,
        String employeeName,
        String employeeCpf,
        String enterpriseName,
        String enterpriseDocument,
        EnterpriseDocumentType enterpriseDocumentType,
        boolean apt
) {

    public static ResultInfo of(Result result) {
        return ResultInfo.builder()
                .resultId(result.getId())
                .employeeName(result.getEmployee().getEmployeeName())
                .employeeCpf(result.getEmployee().getEmployeeCpf())
                .enterpriseName(result.getEnterprise().getName())
                .enterpriseDocument(result.getEnterprise().getRegistrationNumber())
                .enterpriseDocumentType(result.getEnterprise().getRegistrationType())
                .apt(result.isApt())
                .build();
    }
}
