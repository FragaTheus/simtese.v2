package br.com.matheusfragadev.api.infra.repository.enterprise;

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

        String nameValue = "%" + search.toLowerCase() + "%";
        String documentValue = "%" + normalizeDocument(search) + "%";

        return (root, query, cb) ->
                cb.or(
                        cb.like(cb.lower(root.get("name")), nameValue),
                        cb.like(normalizeDocumentExpression(cb, root.get("cnpj").get("value")), documentValue),
                        cb.like(normalizeDocumentExpression(cb, root.get("caepf").get("value")), documentValue),
                        cb.like(normalizeDocumentExpression(cb, root.get("cpf").get("value")), documentValue)
                );
    }

    private static Specification<Enterprise> active(Boolean active) {
        if (active == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("active"), active);
    }

    private static String normalizeDocument(String value) {
        return value.replaceAll("[^\\d]", "");
    }

    private static jakarta.persistence.criteria.Expression<String> normalizeDocumentExpression(
            jakarta.persistence.criteria.CriteriaBuilder cb,
            jakarta.persistence.criteria.Path<String> document
    ) {
        return cb.function(
                "regexp_replace",
                String.class,
                cb.lower(document),
                cb.literal("[^0-9]"),
                cb.literal(""),
                cb.literal("g")
        );
    }
}