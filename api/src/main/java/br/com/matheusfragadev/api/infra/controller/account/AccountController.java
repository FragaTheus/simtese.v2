package br.com.matheusfragadev.api.infra.controller.account;

import br.com.matheusfragadev.api.application.accounts.AccountServiceImpl;
import br.com.matheusfragadev.api.application.accounts.aggregates.AccountFIlterCommand;
import br.com.matheusfragadev.api.application.accounts.aggregates.ChangePasswordCommand;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.infra.auditory.AuditingResolver;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.*;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/accounts")
public class AccountController {

    private final AccountServiceImpl accountService;
    private final AuditingResolver auditingResolver;

    @GetMapping("/{targetId}")
    public ResponseEntity<AccountInfo> info(@PathVariable UUID targetId){
        var account = accountService.findById(targetId);
        var auditInfo = auditingResolver.resolve(account);
        return ResponseEntity.ok(AccountMapper.toAccountInfo(account, auditInfo));
    }

    @GetMapping
    public ResponseEntity<Page<AccountSummary>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(
                    size = 20,
                    sort = "name",
                    direction = Sort.Direction.ASC
            ) Pageable pageable
            ){
        var command = new AccountFIlterCommand(search, role, active, pageable);
        var accounts = accountService.findAll(command);
        var summaries = accounts.map(AccountMapper::toAccountSummary);
        return ResponseEntity.ok(summaries);
    }

    @PostMapping
    public ResponseEntity<UUID> create(@Valid @RequestBody CreateAccountRequest request){
        var command = AccountMapper.toCreateAccountCommand(request);
        var account = accountService.createAccount(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(account.getId());
    }

    @PatchMapping("/{targetId}/name")
    public ResponseEntity<Void> changeName
            (@PathVariable("targetId") UUID targetId, @Valid @RequestBody ChangeNameRequest request){
        accountService.updateName(targetId, request.name());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/password")
    public ResponseEntity<Void> changePassword
            (@PathVariable("targetId") UUID targetId, @Valid @RequestBody AccountChangePassword request){
        var command = new ChangePasswordCommand(targetId, request.password(), request.confirmPassword());
        accountService.updatePassword(command);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable("targetId") UUID targetId){
        accountService.deactivate(targetId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{targetId}/activate")
    public ResponseEntity<Void> activate(@PathVariable("targetId") UUID targetId){
        accountService.activate(targetId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{targetId}")
    public ResponseEntity<Void> delete(@PathVariable("targetId") UUID targetId){
        accountService.delete(targetId);
        return ResponseEntity.noContent().build();
    }

}
