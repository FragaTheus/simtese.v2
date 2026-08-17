package br.com.matheusfragadev.api.infra.controller.account;

import br.com.matheusfragadev.api.application.accounts.AccountServiceImpl;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.AccountMapper;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.CreateAccountRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/accounts")
public class AccountController {

    private final AccountServiceImpl accountService;

    @PostMapping
    public ResponseEntity<UUID> create(@Valid @RequestBody CreateAccountRequest request){
        var command = AccountMapper.toCreateAccountCommand(request);
        var account = accountService.createAccount(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(account.getId());
    }

}
