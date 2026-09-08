package br.com.matheusfragadev.api.infra.controller.enterprise;

import br.com.matheusfragadev.api.application.enterprise.EnterpriseService;
import br.com.matheusfragadev.api.application.enterprise.aggregate.FilterEnterprisesCommand;
import br.com.matheusfragadev.api.infra.auditory.AuditingResolver;
import br.com.matheusfragadev.api.infra.controller.enterprise.aggregates.ChangeEnterpriseNameRequest;
import br.com.matheusfragadev.api.infra.controller.enterprise.aggregates.CreateEnterpriseRequest;
import br.com.matheusfragadev.api.infra.controller.enterprise.aggregates.EnterpriseInfo;
import br.com.matheusfragadev.api.infra.controller.enterprise.aggregates.EnterpriseMapper;
import br.com.matheusfragadev.api.infra.controller.enterprise.aggregates.EnterpriseSummary;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/enterprises")
public class EnterpriseController {

    private final EnterpriseService enterpriseService;
    private final AuditingResolver auditingResolver;

    @GetMapping("/{targetId}")
    public ResponseEntity<EnterpriseInfo> info(@PathVariable("targetId") UUID targetId){
        var enterprise = enterpriseService.findById(targetId);
        var auditInfo = auditingResolver.resolve(enterprise);
        var response = EnterpriseMapper.toEnterpriseInfo(enterprise, auditInfo);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<EnterpriseSummary>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(
                    size = 20,
                    sort = "name",
                    direction = Sort.Direction.ASC
            ) Pageable pageable
    ){
        var enterpriseFilterCommand = new FilterEnterprisesCommand(search, active, pageable);
        var enterprises = enterpriseService.findAll(enterpriseFilterCommand);
        var summaries = enterprises.map(EnterpriseMapper::toEnterpriseSummary);
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<EnterpriseSummary>> findAllByAccountId(@PathVariable UUID accountId){
        var enterprises = enterpriseService.findAllByAccountId(accountId);
        var summaries = enterprises.stream().map(EnterpriseMapper::toEnterpriseSummary).toList();
        return ResponseEntity.ok(summaries);
    }

    @PostMapping
    public ResponseEntity<UUID> create(@Valid @RequestBody CreateEnterpriseRequest request){
        var enterprise = enterpriseService.create(request.name(), request.cnpj());
        return ResponseEntity.status(HttpStatus.CREATED).body(enterprise.getId());
    }

    @PatchMapping("/{targetId}/name")
    public ResponseEntity<Void> changeName
            (@PathVariable UUID targetId, @Valid @RequestBody ChangeEnterpriseNameRequest request){
        enterpriseService.updateName(targetId, request.name());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable UUID targetId){
        enterpriseService.deactivate(targetId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/activate")
    public ResponseEntity<Void> activate(@PathVariable UUID targetId){
        enterpriseService.activate(targetId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/link/{accountId}")
    public ResponseEntity<Void> linkAccount(@PathVariable UUID targetId, @PathVariable UUID accountId){
        enterpriseService.linkAccount(targetId, accountId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/unlink")
    public ResponseEntity<Void> unlinkAccount(@PathVariable UUID targetId){
        enterpriseService.unlinkAccount(targetId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<Void> delete(@PathVariable UUID targetId){
        enterpriseService.delete(targetId);
        return ResponseEntity.noContent().build();
    }


}
