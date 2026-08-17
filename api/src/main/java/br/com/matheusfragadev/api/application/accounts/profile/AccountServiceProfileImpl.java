package br.com.matheusfragadev.api.application.accounts.profile;

import br.com.matheusfragadev.api.application.accounts.AccountService;
import br.com.matheusfragadev.api.application.accounts.profile.aggregates.ProfileChangePasswordCommand;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceProfileImpl implements AccountService {

    private final AccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Account findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new AccountException("Conta não encontrada"));
    }

    @Override
    public Account save(Account account) {
        return repository.save(account);
    }

    public void changePassword(ProfileChangePasswordCommand command){
        Account account = findById(command.targetId());
        if (!passwordEncoder.matches(command.currentPassword(), account.getPassword().getValue()))
            throw new AccountException("Senha atual incorreta");
        account.changePassword(command.newPassword(), command.confirmNewPassword(), passwordEncoder::encode);
    }


}
