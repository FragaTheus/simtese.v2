package br.com.matheusfragadev.api.application.result.aggregates;

import br.com.matheusfragadev.api.infra.controller.result.aggregates.CreateResultUnlinkedRequest;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Builder
public record CreateResultUnlinkedCommand(
        String employeeName,
        String employeeCpf,
        UUID enterpriseId,
        Boolean apt,
        MultipartFile file

) {

    public static CreateResultUnlinkedCommand fromRequest(UUID enterpriseId, CreateResultUnlinkedRequest request){
        return CreateResultUnlinkedCommand.builder()
                .employeeName(request.employeeName())
                .employeeCpf(request.employeeCpf())
                .enterpriseId(enterpriseId)
                .apt(request.apt())
                .file(request.file())
                .build();
    }

}
