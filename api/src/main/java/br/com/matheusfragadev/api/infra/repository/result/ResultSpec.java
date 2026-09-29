package br.com.matheusfragadev.api.infra.repository.result;

import br.com.matheusfragadev.api.domain.result.Result;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ResultSpec {

    public static Specification<Result> filter(String search, Boolean apt) {
        return search(search)
                .and(apt(apt));
    }

    public static Specification<Result> filterByEnterprise(
            UUID enterpriseId,
            String search,
            Boolean apt
    ) {
        return enterpriseId(enterpriseId)
                .and(search(search))
                .and(apt(apt));
    }

    private static Specification<Result> enterpriseId(UUID enterpriseId) {
        return (root, query, cb) ->
                cb.equal(
                        root.get("enterprise").get("id"),
                        enterpriseId
                );
    }

    private static Specification<Result> search(String search) {
        if (search == null || search.isBlank()) {
            return Specification.unrestricted();
        }

        String value = "%" + search.toLowerCase() + "%";

        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("employee").get("employeeName")), value),
                cb.like(cb.lower(root.get("employee").get("employeeCpf")), value),
                cb.like(cb.lower(root.get("enterprise").get("name")), value),
                cb.like(cb.lower(root.get("enterprise").get("cnpj")), value)
        );
    }

    private static Specification<Result> apt(Boolean apt) {
        if (apt == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("apt"), apt);
    }
}
