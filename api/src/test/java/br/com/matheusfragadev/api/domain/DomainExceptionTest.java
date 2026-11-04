package br.com.matheusfragadev.api.domain;

import br.com.matheusfragadev.api.domain.accounts.exception.AccountException;
import br.com.matheusfragadev.api.domain.accounts.exception.PasswordException;
import br.com.matheusfragadev.api.domain.appointment.exception.AppointmentException;
import br.com.matheusfragadev.api.domain.appointment.exception.EmployeeException;
import br.com.matheusfragadev.api.domain.enterprise.exception.CAEPFException;
import br.com.matheusfragadev.api.domain.enterprise.exception.CNPJException;
import br.com.matheusfragadev.api.domain.enterprise.exception.CPFException;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseDocumentException;
import br.com.matheusfragadev.api.domain.enterprise.exception.EnterpriseException;
import br.com.matheusfragadev.api.domain.exams.exception.ExamException;
import br.com.matheusfragadev.api.domain.result.ResultException;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.function.Function;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

class DomainExceptionTest {

    @ParameterizedTest
    @MethodSource("domainExceptions")
    void shouldPreserveMessageAndRemainUnchecked(
            Class<? extends RuntimeException> exceptionType,
            Function<String, ? extends RuntimeException> constructor
    ) {
        var exception = constructor.apply("domain error");

        assertThat(exception).isExactlyInstanceOf(exceptionType);
        assertThat(exception).hasMessage("domain error");
        assertThat(exception.getCause()).isNull();
    }

    static Stream<org.junit.jupiter.params.provider.Arguments> domainExceptions() {
        return Stream.of(
                org.junit.jupiter.params.provider.Arguments.of(AccountException.class, (Function<String, RuntimeException>) AccountException::new),
                org.junit.jupiter.params.provider.Arguments.of(PasswordException.class, (Function<String, RuntimeException>) PasswordException::new),
                org.junit.jupiter.params.provider.Arguments.of(AppointmentException.class, (Function<String, RuntimeException>) AppointmentException::new),
                org.junit.jupiter.params.provider.Arguments.of(EmployeeException.class, (Function<String, RuntimeException>) EmployeeException::new),
                org.junit.jupiter.params.provider.Arguments.of(CAEPFException.class, (Function<String, RuntimeException>) CAEPFException::new),
                org.junit.jupiter.params.provider.Arguments.of(CNPJException.class, (Function<String, RuntimeException>) CNPJException::new),
                org.junit.jupiter.params.provider.Arguments.of(CPFException.class, (Function<String, RuntimeException>) CPFException::new),
                org.junit.jupiter.params.provider.Arguments.of(EnterpriseDocumentException.class, (Function<String, RuntimeException>) EnterpriseDocumentException::new),
                org.junit.jupiter.params.provider.Arguments.of(EnterpriseException.class, (Function<String, RuntimeException>) EnterpriseException::new),
                org.junit.jupiter.params.provider.Arguments.of(ExamException.class, (Function<String, RuntimeException>) ExamException::new),
                org.junit.jupiter.params.provider.Arguments.of(ResultException.class, (Function<String, RuntimeException>) ResultException::new)
        );
    }
}
