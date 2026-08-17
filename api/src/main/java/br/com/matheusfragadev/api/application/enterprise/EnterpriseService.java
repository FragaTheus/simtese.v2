package br.com.matheusfragadev.api.application.enterprise;

import br.com.matheusfragadev.api.application.accounts.AccountServiceImpl;
import br.com.matheusfragadev.api.application.enterprise.aggregate.FilterEnterprisesCommand;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import br.com.matheusfragadev.api.domain.enterprise.repository.EnterpriseRepository;
import br.com.matheusfragadev.api.infra.repository.enterprise.EnterpriseSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnterpriseService {

    //Atributos da classe
    private final EnterpriseRepository repository;
    private final AccountServiceImpl accountService;

    //Metodos CRUD
    public Enterprise findById(UUID targetId){
        return repository.findById(targetId).orElseThrow(() -> new EnterpriseException("Empresa não encontrada"));
    }

    public Enterprise save(Enterprise enterprise){
        return repository.save(enterprise);
    }

    public Page<Enterprise> findAll(FilterEnterprisesCommand command){
        return repository.findAll
                (EnterpriseSpec.enterpriseFilter
                        (command.search(), command.active()), command.pageable());
    }

    public void delete(UUID targetId){
        Enterprise enterprise = findById(targetId);
        if (enterprise.isActive()) throw new EnterpriseException("Não é possível deletar uma empresa ativa");
        repository.delete(enterprise);
    }

    public boolean existsByCnpj(String rawCnpj){
        CNPJ cnpj = CNPJ.of(rawCnpj);
        return repository.existsByCnpj(cnpj);
    }

    public Enterprise findByCnpj(String cnpj){
        CNPJ cnpjObj = CNPJ.of(cnpj);
        return repository.findByCnpj(cnpjObj).orElseThrow(() -> new EnterpriseException("Empresa não encontrada"));
    }

    //Metodos da classe
    public Enterprise create(String name, String rawCnpj){
        CNPJ cnpj = CNPJ.of(rawCnpj);
        if (existsByCnpj(rawCnpj)) throw new EnterpriseException("CNPJ já cadastrado");
        Enterprise enterprise = new Enterprise(name, cnpj);
        return repository.save(enterprise);
    }

    public Enterprise updateName(UUID targetId, String newName){
        Enterprise enterprise = findById(targetId);
        if (!enterprise.isActive()) throw new EnterpriseException("Não é possível alterar o nome de uma empresa inativa");
        enterprise.changeName(newName);
        return repository.save(enterprise);
    }

    public Enterprise linkAccount(UUID targetId, UUID accountId){
        Enterprise enterprise = findById(targetId);
        if (!enterprise.isActive()) throw new EnterpriseException("Não é possível vincular uma conta a uma empresa inativa");
        Account account = accountService.findById(accountId);
        enterprise.linkAccount(account);
        return repository.save(enterprise);
    }

    public Enterprise unlinkAccount(UUID targetId, UUID accountId){
        Enterprise enterprise = findById(targetId);
        Account account = accountService.findById(accountId);
        enterprise.unlinkAccount(account);
        return repository.save(enterprise);
    }

    public Enterprise activate(UUID targetId){
        Enterprise enterprise = findById(targetId);
        enterprise.activate();
        return repository.save(enterprise);
    }

    public Enterprise deactivate(UUID targetId){
        Enterprise enterprise = findById(targetId);
        enterprise.deactivate();
        return repository.save(enterprise);
    }


}
