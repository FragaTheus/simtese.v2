package br.com.matheusfragadev.api.application.accounts;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;

@FunctionalInterface
public interface AccountFactory {

    Account create(String name, String email, Password password);

}
