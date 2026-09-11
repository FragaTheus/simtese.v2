package br.com.matheusfragadev.api.domain.result;

import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.infra.auditory.Auditory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Result extends Auditory {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enterprise_id", nullable = false, updatable = false)
    private Enterprise enterprise;

    @Embedded
    private Employee employee;

    @Column(nullable = false, updatable = false)
    private boolean apt;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    public Result(Enterprise enterprise, Employee employee, boolean apt, String fileName) {
        this.enterprise = enterprise;
        this.employee = employee;
        this.apt = apt;
        this.fileName = fileName;
    }

    public static Result of(Appointment appointment, boolean apt, String fileName){
        return new Result(
                appointment.getEnterprise(),
                appointment.getEmployee(),
                apt,
                fileName
        );
    }

}
