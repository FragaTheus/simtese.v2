package br.com.matheusfragadev.api.shared.infra.repository.account;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import org.springframework.data.jpa.domain.Specification;

public class AccountSpec {

    public static Specification<Account> accountFilter(String search, Role role, Boolean active){
        return Specification.where(search(search)).and(role(role)).and(active(active));
    }

    private static Specification<Account> search(String search){
        return (root, query, criteriaBuilder) -> criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), "%" + search.toLowerCase() + "%")
        );
    }

    private static Specification<Account> role(Role role){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("role"), role);
    }

    private static Specification<Account> active(Boolean active){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("active"), active);
    }

}
