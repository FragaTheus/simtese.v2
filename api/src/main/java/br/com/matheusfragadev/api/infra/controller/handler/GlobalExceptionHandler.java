package br.com.matheusfragadev.api.infra.controller.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex){
        log.warn("Erro ao fazer login: {}", ex.getMessage());
        var message = "Credenciais invalidas";
        var status = HttpStatus.UNAUTHORIZED;
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgNotValid(MethodArgumentNotValidException ex){
        var message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Dados inválidos");
        var status = HttpStatus.BAD_REQUEST;
        log.warn("Formato invalido na api: {}", message);
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

}
