package br.com.matheusfragadev.api.infra.controller.exams.aggregate;

import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.infra.auditory.AuditInfo;
import br.com.matheusfragadev.api.infra.auditory.AuditingResolver;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ExamMapper {

    public static ExamInfo toExamInfo(Exam exam, AuditInfo auditInfo){
        return ExamInfo.builder()
                .id(exam.getId())
                .name(exam.getName())
                .active(exam.isActive())
                .createdAt(exam.getCreatedAt())
                .updatedAt(exam.getUpdatedAt())
                .createdBy(auditInfo.createdBy())
                .updatedBy(auditInfo.updatedBy())
                .build();
    }

    public static ExamSummary toExamSummary(Exam exam){
        return ExamSummary.builder()
                .id(exam.getId())
                .name(exam.getName())
                .active(exam.isActive())
                .build();
    }

}
