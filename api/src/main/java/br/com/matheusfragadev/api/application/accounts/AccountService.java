package br.com.matheusfragadev.api.application.accounts;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;

import java.util.UUID;

public interface AccountService {

    Account findById(UUID id);

    Account save(Account account);

    default Account changeAccountName(UUID targetId, String newName) {
        Account account = findById(targetId);
        account.changeName(newName);
        return save(account);
    }

}
