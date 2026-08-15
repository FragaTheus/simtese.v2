package br.com.matheusfragadev.api.domain.exams.entity;

import br.com.matheusfragadev.api.domain.exams.exception.ExamException;
import br.com.matheusfragadev.api.shared.auditory.Auditory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.regex.Pattern;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Exam extends Auditory {

    //Constantes RN
    private static final int NAME_MIN_LENGTH = 2;
    private static final int NAME_MAX_LENGTH = 100;
    private static final String NAME_REGEX =
            "^[\\p{L}\\p{N} .()/-]+$";
    private static final Pattern NAME_PATTERN = Pattern.compile(NAME_REGEX);

    //Atributos da classe
    @Column(nullable = false, length = NAME_MAX_LENGTH)
    private String name;

    @Column(nullable = false)
    private boolean active;

    //Construtor
    public Exam(String name) {
        this.name = validName(name);
        this.active = true;
    }

    //Metodos setter
    public void changeName(String newName){
        this.name = validName(newName);
    }

    public void deactivate(){
        if (!this.active) return;
        this.active = false;
    }

    public void activate(){
        if (this.active) return;
        this.active = true;
    }

    //Metodos auxiliares
    private static String validName(String name) {
        if (name == null || name.isBlank()) {
            throw new ExamException("Nome do exame não pode ser nulo ou vazio");
        }

        if (name.length() < NAME_MIN_LENGTH || name.length() > NAME_MAX_LENGTH) {
            throw new ExamException(
                    "Nome do exame deve ter entre "
                            + NAME_MIN_LENGTH
                            + " e "
                            + NAME_MAX_LENGTH
                            + " caracteres"
            );
        }

        if (!NAME_PATTERN.matcher(name).matches()) {
            throw new ExamException("Nome do exame contém caracteres inválidos");
        }

        return name;
    }
}
