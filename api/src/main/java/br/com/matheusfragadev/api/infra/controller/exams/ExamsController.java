package br.com.matheusfragadev.api.infra.controller.exams;

import br.com.matheusfragadev.api.application.exams.ExamService;
import br.com.matheusfragadev.api.application.exams.aggregate.ExamFilterCommand;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.infra.auditory.AuditingResolver;
import br.com.matheusfragadev.api.infra.controller.exams.aggregate.CreateExamRequest;
import br.com.matheusfragadev.api.infra.controller.exams.aggregate.ExamInfo;
import br.com.matheusfragadev.api.infra.controller.exams.aggregate.ExamMapper;
import br.com.matheusfragadev.api.infra.controller.exams.aggregate.ExamSummary;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/exams")
public class ExamsController {

    private final ExamService examService;
    private final AuditingResolver auditingResolver;

    @GetMapping("/{targetId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExamInfo> info(@PathVariable("targetId")UUID targetId){
        var exam = examService.findExamById(targetId);
        var auditInfo = auditingResolver.resolve(exam);
        var response = ExamMapper.toExamInfo(exam, auditInfo);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<Page<ExamSummary>> all(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active,
            @PageableDefault(
                    size = 20,
                    sort = "name",
                    direction = Sort.Direction.ASC
            ) Pageable pageable
            ){
        Page<Exam> exams = examService.findAllExams(new ExamFilterCommand(search, active, pageable));
        Page<ExamSummary> response = exams.map(ExamMapper::toExamSummary);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UUID> create(@Valid @RequestBody CreateExamRequest request){
        var exam = examService.createExam(request.name());
        return ResponseEntity.status(HttpStatus.CREATED).body(exam.getId());
    }

    @PatchMapping("/{targetId}/name")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> change
            (@PathVariable("targetId") UUID targetId, @Valid @RequestBody CreateExamRequest request){
        examService.changeExam(targetId, request.name());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{targetId}/deactivate")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable("targetId") UUID targetId){
        examService.deactivate(targetId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{targetId}/activate")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> activate(@PathVariable("targetId") UUID targetId){
        examService.activate(targetId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{targetId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable("targetId") UUID targetId){
        examService.deleteExam(targetId);
        return ResponseEntity.noContent().build();
    }


}
