package br.com.matheusfragadev.api.domain.result;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ResultRepository extends JpaRepository<Result, UUID>, JpaSpecificationExecutor<Result> {

}
