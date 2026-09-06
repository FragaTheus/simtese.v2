package br.com.matheusfragadev.api.infra.controller.handler;

import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.exception.PasswordException;
import br.com.matheusfragadev.api.domain.appointment.exception.AppointmentException;
import br.com.matheusfragadev.api.domain.appointment.exception.EmployeeException;
import br.com.matheusfragadev.api.domain.enterprise.exception.CNPJException;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import br.com.matheusfragadev.api.domain.exams.exception.ExamException;
import br.com.matheusfragadev.api.infra.security.ratelimit.ClientIpResolver;
import br.com.matheusfragadev.api.infra.security.ratelimit.RateLimitExceededException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.core.AuthenticationException;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger SECURITY_LOG = LoggerFactory.getLogger("SECURITY");

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUsernameNotFound(UsernameNotFoundException ex, HttpServletRequest request){
        log.warn("Erro ao fazer login: {}", ex.getMessage());
        SECURITY_LOG.warn("Tentativa de login com credenciais invalidas | ip={}", ClientIpResolver.resolveOrUnknown(request));
        var message = "Credenciais invalidas";
        var status = HttpStatus.UNAUTHORIZED;
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request){
        log.warn("Erro ao fazer login: {}", ex.getMessage());
        SECURITY_LOG.warn(
                "Falha de autenticacao | ip={} motivo={}",
                ClientIpResolver.resolveOrUnknown(request), ex.getMessage()
        );
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

    @ExceptionHandler(ExamException.class)
    public ResponseEntity<ApiErrorResponse> handlerExam(ExamException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(AccountException.class)
    public ResponseEntity<ApiErrorResponse> handlerAccount(AccountException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(PasswordException.class)
    public ResponseEntity<ApiErrorResponse> handlerPassword(PasswordException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(EnterpriseException.class)
    public ResponseEntity<ApiErrorResponse> handlerEnterprise(EnterpriseException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(CNPJException.class)
    public ResponseEntity<ApiErrorResponse> handlerCNPJ(CNPJException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(AppointmentException.class)
    public ResponseEntity<ApiErrorResponse> handlerAppointment(AppointmentException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(EmployeeException.class)
    public ResponseEntity<ApiErrorResponse> handlerEmployee(EmployeeException ex){
        var message = ex.getMessage();
        var status = HttpStatus.CONFLICT;
        log.warn("Erro de RN em: {}", ex.getMessage());
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handlerAuthException(AuthorizationDeniedException ex, HttpServletRequest request){
        var message = "Você não tem permissão para acessar este recurso";
        var status = HttpStatus.FORBIDDEN; // era UNAUTHORIZED
        log.warn("Erro de autorização: {}", ex.getMessage());
        SECURITY_LOG.warn(
                "Acesso negado | ip={} uri={} motivo={}",
                ClientIpResolver.resolveOrUnknown(request), request.getRequestURI(), ex.getMessage()
        );
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handlerAuthenticationException(AuthenticationException ex, HttpServletRequest request){
        var message = "Autenticação necessária para acessar este recurso";
        var status = HttpStatus.UNAUTHORIZED;
        log.warn("Erro de autenticação: {}", ex.getMessage());
        SECURITY_LOG.warn(
                "Requisicao nao autenticada | ip={} uri={} motivo={}",
                ClientIpResolver.resolveOrUnknown(request), request.getRequestURI(), ex.getMessage()
        );
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiErrorResponse> handlerRateLimitExceeded(RateLimitExceededException ex){
        var message = ex.getMessage();
        var status = HttpStatus.TOO_MANY_REQUESTS;
        log.warn("Rate limit excedido: {}", message);
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handlerGenericException(Exception ex){
        var status = HttpStatus.INTERNAL_SERVER_ERROR;
        var message = "Erro interno no servidor";
        log.error("Erro inesperado: {}", ex.getMessage(), ex);
        var response = new ApiErrorResponse(status, message);
        return ResponseEntity.status(status).body(response);
    }

}
