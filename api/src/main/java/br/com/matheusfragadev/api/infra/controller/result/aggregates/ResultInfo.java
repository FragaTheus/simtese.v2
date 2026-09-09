package br.com.matheusfragadev.api.infra.controller.result.aggregates;

import br.com.matheusfragadev.api.domain.result.Result;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ResultInfo(
        UUID resultId,
        String employeeName,
        String employeeCpf,
        String enterpriseName,
        String enterpriseCnpj,
        boolean apt
) {

    public static ResultInfo of(Result result) {
        return ResultInfo.builder()
                .resultId(result.getId())
                .employeeName(result.getEmployee().getEmployeeName())
                .employeeCpf(result.getEmployee().getEmployeeCpf())
                .enterpriseName(result.getEnterprise().getName())
                .enterpriseCnpj(result.getEnterprise().getCnpj().getValue())
                .apt(result.isApt())
                .build();
    }

}
