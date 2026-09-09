package br.com.matheusfragadev.api.infra.controller.result;

import br.com.matheusfragadev.api.application.result.ResultService;
import br.com.matheusfragadev.api.application.result.aggregates.CreateResultCommand;
import br.com.matheusfragadev.api.application.result.aggregates.ResultFilterCommand;
import br.com.matheusfragadev.api.infra.controller.result.aggregates.CreateResultRequest;
import br.com.matheusfragadev.api.infra.controller.result.aggregates.ResultInfo;
import br.com.matheusfragadev.api.infra.controller.result.aggregates.ResultSummary;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.UUID;

@RestController
@RequestMapping("${api.v1.prefix}/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping(
            value = "/{appointmentId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> createResult(
            @PathVariable UUID appointmentId,
            @Valid @ModelAttribute CreateResultRequest request
    ) {
        var command = new CreateResultCommand(
                appointmentId,
                request.apt(),
                request.file()
        );
        var result = resultService.create(command);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(result.getId().toString());
    }

    @DeleteMapping("/{resultId}")
    public ResponseEntity<Void> deleteResult(@PathVariable UUID resultId) {
        resultService.delete(resultId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{resultId}")
    public ResponseEntity<ResultInfo> getResult(
            @PathVariable UUID resultId
    ) {
        var result = resultService.findById(resultId);
        var resultInfo = ResultInfo.of(result);
        return ResponseEntity.ok(resultInfo);
    }

    @GetMapping(
            value = "/{resultId}/file",
            produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<Resource> getFile(
            @PathVariable UUID resultId
    ) {
        InputStream inputStream = resultService.findFileByResultId(resultId);
        Resource resource = new InputStreamResource(inputStream);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"resultado.pdf\""
                )
                .body(resource);
    }

    @GetMapping
    public ResponseEntity<Page<ResultSummary>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean apt,
            @PageableDefault(
                   size = 20,
                   sort = "createdAt",
                   direction = Sort.Direction.ASC
            ) Pageable pageable
    ){
        var command = new ResultFilterCommand(
                search,
                apt,
                pageable
        );
        Page<ResultSummary> resultSummaries = resultService.list(command).map(ResultSummary::of);
        return ResponseEntity.ok(resultSummaries);
    }
}