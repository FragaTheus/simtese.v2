package br.com.matheusfragadev.api.infra.auditory;

public record AuditInfo(
        String createdBy,
        String updatedBy
) {
}
