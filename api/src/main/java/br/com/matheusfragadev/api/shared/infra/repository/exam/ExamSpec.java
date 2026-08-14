package br.com.matheusfragadev.api.shared.infra.repository.exam;

import br.com.matheusfragadev.api.exams.domain.entity.Exam;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExamSpec {

    public Specification<Exam> examFilter(String search, Boolean active){
        return Specification.where(search(search)).and(isActive(active));
    }

    private static Specification<Exam> search(String search){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }

    private static Specification<Exam> isActive(Boolean active){
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.equal(root.get("active"), active);
    }

}
