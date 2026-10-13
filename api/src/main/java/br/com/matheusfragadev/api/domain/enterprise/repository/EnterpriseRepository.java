package br.com.matheusfragadev.api.domain.enterprise.repository;

import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CAEPF;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CPF;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, UUID>, JpaSpecificationExecutor<Enterprise> {
    boolean existsByCnpj(CNPJ cnpj);
    boolean existsByCaepf(CAEPF caepf);
    boolean existsByCpf(CPF cpf);

    Optional<Enterprise> findByCnpj(CNPJ cnpj);
    Optional<Enterprise> findByCaepf(CAEPF caepf);
    Optional<Enterprise> findByCpf(CPF cpf);

    List<Enterprise> findAllByAccountId(UUID accountId);
}
