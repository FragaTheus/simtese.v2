package br.com.matheusfragadev.api.infra.repository.appointment;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.infra.repository.appointment.aggregate.AppointmentSpecCommand;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AppointmentSpec {

    public static Specification<Appointment> appointmentFilter(AppointmentSpecCommand command) {
        return search(command.search())
                .and(status(command.examStatus()))
                .and(shift(command.shift()));
    }

    private static Specification<Appointment> search(String search) {
        if (search == null || search.isBlank()) {
            return Specification.unrestricted();
        }

        String value = "%" + search.toLowerCase() + "%";

        return (root, query, cb) ->
                cb.or(
                        cb.like(cb.lower(root.get("employee").get("name")), value),
                        cb.like(cb.lower(root.get("employee").get("cpf")), value),
                        cb.like(cb.lower(root.get("enterprise").get("name")), value),
                        cb.like(cb.lower(root.get("enterprise").get("cnpj")), value)
                );
    }

    private static Specification<Appointment> status(ExamStatus status) {
        if (status == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("examStatus"), status);
    }

    private static Specification<Appointment> shift(Shift shift) {
        if (shift == null) {
            return Specification.unrestricted();
        }

        return (root, query, cb) ->
                cb.equal(root.get("shift"), shift);
    }
}
