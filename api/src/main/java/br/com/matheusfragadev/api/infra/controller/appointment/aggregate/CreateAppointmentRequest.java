package br.com.matheusfragadev.api.infra.controller.appointment.aggregate;

import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamType;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.EnterpriseDocument;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;
import java.util.UUID;

public record CreateAppointmentRequest(
        @NotBlank(message = "Nome do funcionário é obrigatório")
        String employeeName,
        @NotBlank(message = "CPF do funcionário é obrigatório")
        String employeeCpf,
        @NotBlank(message = "Nome da empresa é obrigatório")
        String enterpriseName,
        @Valid
        EnterpriseDocument enterpriseDocument,
        Shift shift,
        ExamType examType,
        Set<UUID> examIds,
        @Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
        String observation
) {
}
