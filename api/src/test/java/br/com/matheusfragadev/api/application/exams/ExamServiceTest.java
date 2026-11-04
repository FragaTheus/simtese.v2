package br.com.matheusfragadev.api.application.exams;

import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.domain.exams.exception.ExamException;
import br.com.matheusfragadev.api.domain.exams.repository.ExamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExamServiceTest {

    @Mock
    private ExamRepository repository;

    @InjectMocks
    private ExamService service;

    @Test
    void shouldReturnEmptySetWhenNoIdsInformed() {
        assertThat(service.findAllByIds(null)).isEmpty();
        assertThat(service.findAllByIds(Set.of())).isEmpty();
    }

    @Test
    void shouldFailWhenSomeExamIsMissing() {
        var ids = Set.of(UUID.randomUUID(), UUID.randomUUID());
        when(repository.findAllById(ids)).thenReturn(List.of(new Exam("Audiometria")));

        assertThatThrownBy(() -> service.findAllByIds(ids))
                .isInstanceOf(ExamException.class)
                .hasMessageContaining("não foram encontrados");
    }

    @Test
    void shouldFailWhenExamIdIsUnknown() {
        var id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findExamById(id))
                .isInstanceOf(ExamException.class)
                .hasMessageContaining("não encontrado");
    }

    @Test
    void shouldNotCreateDuplicatedExam() {
        when(repository.existsByName("Audiometria")).thenReturn(true);

        assertThatThrownBy(() -> service.createExam("Audiometria"))
                .isInstanceOf(ExamException.class)
                .hasMessageContaining("já existe");

        verify(repository, never()).save(any());
    }

    @Test
    void shouldCreateExam() {
        when(repository.existsByName("Audiometria")).thenReturn(false);
        when(repository.save(any(Exam.class))).thenAnswer(i -> i.getArgument(0));

        var exam = service.createExam("Audiometria");

        assertThat(exam.getName()).isEqualTo("Audiometria");
        assertThat(exam.isActive()).isTrue();
    }

    @Test
    void shouldNotDeleteActiveExam() {
        var id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.of(new Exam("Audiometria")));

        assertThatThrownBy(() -> service.deleteExam(id))
                .isInstanceOf(ExamException.class)
                .hasMessageContaining("inativo");
    }
}
