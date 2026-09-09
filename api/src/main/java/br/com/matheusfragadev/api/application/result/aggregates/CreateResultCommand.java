package br.com.matheusfragadev.api.application.result.aggregates;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record CreateResultCommand(
        UUID appointmentId,
        boolean apt,
        MultipartFile file
) {
}
