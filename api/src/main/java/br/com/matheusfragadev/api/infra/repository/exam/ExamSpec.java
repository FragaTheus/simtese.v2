package br.com.matheusfragadev.api.infra.repository.exam;

import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExamSpec {

    public static Specification<Exam> examFilter(String search, Boolean active) {
        return search(search)
                .and(isActive(active));
    }

    private static Specification<Exam> search(String search) {
        if (search == null || search.isBlank()) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.like(
                        cb.lower(root.get("name")),
                        "%" + search.toLowerCase() + "%"
                );
    }

    private static Specification<Exam> isActive(Boolean active) {
        if (active == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("active"), active);
    }
}