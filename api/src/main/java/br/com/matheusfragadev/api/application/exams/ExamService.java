package br.com.matheusfragadev.api.application.exams;

import br.com.matheusfragadev.api.application.exams.aggregate.ExamFilterCommand;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.domain.exams.exception.ExamException;
import br.com.matheusfragadev.api.domain.exams.repository.ExamRepository;
import br.com.matheusfragadev.api.infra.repository.exam.ExamSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository repository;

    //Metodos CRUD
    public Exam findExamById(UUID id){
        return repository.findById(id).orElseThrow(() -> new ExamException("Exame não encontrado"));
    }

    public Page<Exam> findAllExams(ExamFilterCommand command){
        return repository.findAll(ExamSpec.examFilter(command.search(), command.active()), command.pageable());
    }

    public Set<Exam> findAllByIds(Set<UUID> ids){
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        Set<Exam> exams = new HashSet<>(repository.findAllById(ids));
        if (exams.size() != ids.size()) {
            throw new ExamException("Um ou mais exames não foram encontrados");
        }

        return exams;
    }

    //Metodos da classe
    public Exam createExam(String name){
        if (repository.existsByName(name)) {
            throw new ExamException("Exame já existe");
        }
        Exam exam = new Exam(name);
        return repository.save(exam);
    }

    public Exam changeExam(UUID targetId, String newName){
        if (repository.existsByName(newName)) {
            throw new ExamException("Exame já existe");
        }
        Exam exam = findExamById(targetId);
        verifyIfExamIsActive(exam);
        exam.changeName(newName);
        return repository.save(exam);
    }

    public void deactivate(UUID targetId){
        Exam exam = findExamById(targetId);
        exam.deactivate();
        repository.save(exam);
    }

    public void activate(UUID targetId){
        Exam exam = findExamById(targetId);
        exam.activate();
        repository.save(exam);
    }

    public void deleteExam(UUID targetId){
        Exam exam = findExamById(targetId);
        if (exam.isActive()) throw new ExamException("Para deletar um exame, ele precisa estar inativo");
        repository.delete(exam);
    }

    //Metodos auxiliares
    private void verifyIfExamIsActive(Exam exam){
        if (!exam.isActive()) {
            throw new ExamException("Para executar essa ação, o exame precisa estar ativo");
        }
    }



}
