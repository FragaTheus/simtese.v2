package br.com.matheusfragadev.api.infra.repository.account;

import br.com.matheusfragadev.api.domain.accounts.aggregate.Role;
import br.com.matheusfragadev.api.domain.accounts.entity.Account;
import org.springframework.data.jpa.domain.Specification;

public class AccountSpec {

    public static Specification<Account> accountFilter(
            String search,
            Role role,
            Boolean active
    ) {
        return search(search)
                .and(role(role))
                .and(active(active));
    }

    public static Specification<Account> availableEnterpriseAccounts(String search) {
        return search(search)
                .and(role(Role.ENTERPRISE))
                .and(active(true));
    }

    private static Specification<Account> search(String search) {
        if (search == null || search.isBlank()) {
            return Specification.unrestricted();
        }

        String value = "%" + search.toLowerCase() + "%";

        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), value),
                cb.like(cb.lower(root.get("email")), value)
        );
    }

    private static Specification<Account> role(Role role) {
        if (role == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("role"), role);
    }

    private static Specification<Account> active(Boolean active) {
        if (active == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("active"), active);
    }

}
