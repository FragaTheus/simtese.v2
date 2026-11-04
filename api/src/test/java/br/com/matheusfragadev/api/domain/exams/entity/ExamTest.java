package br.com.matheusfragadev.api.domain.exams.entity;

import br.com.matheusfragadev.api.domain.exams.exception.ExamException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ExamTest {

    @Test
    void shouldCreateActiveExam() {
        var exam = new Exam("Hemograma (completo)");

        assertThat(exam.getName()).isEqualTo("Hemograma (completo)");
        assertThat(exam.isActive()).isTrue();
    }

    @Test
    void shouldAcceptMinimumAndMaximumNameLengths() {
        assertThat(new Exam("AB").getName()).isEqualTo("AB");
        var maximumName = "A".repeat(100);
        assertThat(new Exam(maximumName).getName()).isEqualTo(maximumName);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   ", "A", "Exame @#$"})
    void shouldRejectInvalidNames(String name) {
        assertThatThrownBy(() -> new Exam(name)).isInstanceOf(ExamException.class);
    }

    @Test
    void shouldRejectTooLongName() {
        var name = "a".repeat(101);

        assertThatThrownBy(() -> new Exam(name)).isInstanceOf(ExamException.class);
    }

    @Test
    void shouldChangeName() {
        var exam = new Exam("Audiometria");

        exam.changeName("Espirometria");

        assertThat(exam.getName()).isEqualTo("Espirometria");
    }

    @Test
    void shouldKeepExistingNameWhenChangeIsInvalid() {
        var exam = new Exam("Audiometria");

        assertThatThrownBy(() -> exam.changeName("A")).isInstanceOf(ExamException.class);
        assertThat(exam.getName()).isEqualTo("Audiometria");
    }

    @Test
    void shouldToggleActivation() {
        var exam = new Exam("Audiometria");

        exam.deactivate();
        exam.deactivate();
        assertThat(exam.isActive()).isFalse();

        exam.activate();
        exam.activate();
        assertThat(exam.isActive()).isTrue();
    }
}
