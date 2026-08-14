package br.com.matheusfragadev.api.domain.exams.entity;

import br.com.matheusfragadev.api.shared.auditory.Auditory;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Exam extends Auditory {

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private boolean active = true;

    public Exam(String name) {
        this.name = name;
    }
}
