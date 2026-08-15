package br.com.matheusfragadev.api.shared.infra.repository.enterprise;

import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EnterpriseSpec {

    public static Specification<Enterprise> enterpriseFilter(String search, Boolean active){
        return Specification.where(search(search)).and(active(active));
    }

    private static Specification<Enterprise> search(String search){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("cnpj")), "%" + search.toLowerCase() + "%")
                );
    }

    private static Specification<Enterprise> active(Boolean active){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("active"), active);
    }

}
