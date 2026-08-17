package br.com.matheusfragadev.api.shared.infra.repository.enterprise;

import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EnterpriseSpec {

    public static Specification<Enterprise> enterpriseFilter(
            String search,
            Boolean active
    ) {
        return search(search)
                .and(active(active));
    }

    private static Specification<Enterprise> search(String search) {
        if (search == null || search.isBlank()) {
            return Specification.unrestricted();
        }

        String value = "%" + search.toLowerCase() + "%";

        return (root, query, cb) ->
                cb.or(
                        cb.like(cb.lower(root.get("name")), value),
                        cb.like(cb.lower(root.get("cnpj")), value)
                );
    }

    private static Specification<Enterprise> active(Boolean active) {
        if (active == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("active"), active);
    }
}