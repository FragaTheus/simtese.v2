package br.com.matheusfragadev.api.application.accounts;

import br.com.matheusfragadev.api.application.accounts.aggregates.AccountFIlterCommand;
import br.com.matheusfragadev.api.application.accounts.aggregates.ChangePasswordCommand;
import br.com.matheusfragadev.api.application.accounts.aggregates.CreateAccountCommand;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Password;
import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.repository.AccountRepository;
import br.com.matheusfragadev.api.infra.repository.account.AccountSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    //Constante Auxiliar
    private static final Map<Role, AccountFactory> ACCOUNTS_FACTORY =
            Map.of(
                    Role.ADMIN, Account::ofAdmin,
                    Role.NURSE, Account::ofNurse,
                    Role.ENTERPRISE, Account::ofEnterprise,
                    Role.RECEPTIONIST, Account::ofReceptionist
            );

    //Atirbutos da classe
    private final AccountRepository repository;
    private final PasswordEncoder passwordEncoder;

    //Metodos CRUD
    @Override
    public Account findById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new AccountException("Conta não encontrada"));
    }

    @Override
    public Account save(Account account) {
        return repository.save(account);
    }

    public Page<Account> findAll(AccountFIlterCommand command){
        return repository.findAll(AccountSpec.accountFilter
                (command.search(), command.role(), command.active()), command.pageable());
    }

    public void delete(UUID targetId){
        Account account = findById(targetId);
        if (account.isActive()) throw new AccountException("Conta ativa não pode ser deletada.");
        repository.delete(account);
    }

    //Metodos da classe
    public Account createAccount(CreateAccountCommand command) {
        if (repository.existsByEmail(command.email())) {
            throw new AccountException("Email já cadastrado no sistema.");
        }
        if (!command.password().equals(command.confirmPassword())) {
            throw new AccountException("As senhas não conferem.");
        }
        Password password = Password.of(
                command.password(),
                passwordEncoder::encode
        );
        AccountFactory factory = ACCOUNTS_FACTORY.get(command.role());
        Account account = factory.create(
                command.name(),
                command.email(),
                password
        );
        return save(account);
    }

    public Account updateName(UUID targetId, String newNickname){
        Account account = findById(targetId);
        if (!account.isActive()) throw new AccountException("Conta inativa não pode alterar o nome.");
        account.changeName(newNickname);
        return save(account);
    }

    public Account updatePassword(ChangePasswordCommand command){
        Account account = findById(command.targetId());
        if (!account.isActive()) throw new AccountException("Conta inativa não pode alterar a senha.");
        account.changePassword(command.password(), command.confirmPassword(), passwordEncoder::encode);
        return save(account);
    }

    public Account deactivate(UUID targetId){
        Account account = findById(targetId);
        account.deactivate();
        return save(account);
    }

    public Account activate(UUID targetId){
        Account account = findById(targetId);
        account.activate();
        return save(account);
    }

}
