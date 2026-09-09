package br.com.matheusfragadev.api.infra.controller.result.aggregates;

import br.com.matheusfragadev.api.domain.result.Result;

import java.util.UUID;

public record ResultSummary(
        UUID id,
        String employeeName,
        String enterpriseName,
        Boolean apt
) {

    public static ResultSummary of(Result result){
        return new ResultSummary(
                result.getId(),
                result.getEmployee().getEmployeeName(),
                result.getEnterprise().getName(),
                result.isApt()
        );
    }

}
