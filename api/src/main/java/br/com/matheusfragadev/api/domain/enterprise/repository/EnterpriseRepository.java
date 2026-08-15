package br.com.matheusfragadev.api.domain.enterprise.repository;

import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EnterpriseRepository extends JpaRepository<Enterprise, UUID>, JpaSpecificationExecutor<Enterprise> {
}
