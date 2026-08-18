package br.com.matheusfragadev.api.infra.controller.account;

import br.com.matheusfragadev.api.application.accounts.profile.AccountServiceProfileImpl;
import br.com.matheusfragadev.api.application.accounts.profile.aggregates.ProfileChangePasswordCommand;
import br.com.matheusfragadev.api.infra.auditory.AuditingResolver;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.AccountInfo;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.AccountMapper;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.ChangeNameRequest;
import br.com.matheusfragadev.api.infra.controller.account.aggregate.ProfileChangePasswordRequest;
import br.com.matheusfragadev.api.infra.security.details.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/me")
public class ProfileController {

    private final AccountServiceProfileImpl accountServiceProfile;
    private final AuditingResolver auditingResolver;

    @GetMapping
    public ResponseEntity<AccountInfo> me(@AuthenticationPrincipal UserDetailsImpl userDetails){
        var account = accountServiceProfile.findById(userDetails.getId());
        var auditingInfo = auditingResolver.resolve(account);
        var accountInfo = auditingResolver.resolve(account);
        var response = AccountMapper.toAccountInfo(account, auditingInfo);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/name")
    public ResponseEntity<Void> changeName
            (@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody ChangeNameRequest request){
        accountServiceProfile.changeAccountName(userDetails.getId(), request.name());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword
            (@AuthenticationPrincipal UserDetailsImpl userDetails, @Valid @RequestBody ProfileChangePasswordRequest request){
        var command = new ProfileChangePasswordCommand
                (userDetails.getId(), request.currentPassword(), request.password(), request.confirmPassword());
        accountServiceProfile.changePassword(command);
        return ResponseEntity.noContent().build();
    }

}
