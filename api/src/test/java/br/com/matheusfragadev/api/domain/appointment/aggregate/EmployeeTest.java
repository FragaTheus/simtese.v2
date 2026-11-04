package br.com.matheusfragadev.api.domain.appointment.aggregate;

import br.com.matheusfragadev.api.domain.appointment.exception.EmployeeException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EmployeeTest {

    private static final String NAME = "Maria da Silva";
    private static final String VALID_CPF = "529.982.247-25";

    @Nested
    @DisplayName("Nome")
    class Name {

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"   "})
        void shouldRejectNullOrBlank(String name) {
            assertThatThrownBy(() -> Employee.of(name, VALID_CPF))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("Nome");
        }

        @Test
        void shouldRejectTooShort() {
            assertThatThrownBy(() -> Employee.of("Jo", VALID_CPF))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("entre 3 e 100");
        }

        @Test
        void shouldRejectTooLong() {
            assertThatThrownBy(() -> Employee.of("a".repeat(101), VALID_CPF))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("entre 3 e 100");
        }

        @Test
        void shouldRejectInvalidCharacters() {
            assertThatThrownBy(() -> Employee.of("Maria123", VALID_CPF))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("caracteres inválidos");
        }

        @Test
        void shouldAcceptMinimumAndMaximumNameLengths() {
            assertThat(Employee.of("Ana", VALID_CPF).getEmployeeName()).isEqualTo("Ana");
            var maximumName = "A".repeat(100);
            assertThat(Employee.of(maximumName, VALID_CPF).getEmployeeName()).isEqualTo(maximumName);
        }
    }

    @Nested
    @DisplayName("CPF")
    class Cpf {

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"   "})
        void shouldRejectNullOrBlank(String cpf) {
            assertThatThrownBy(() -> Employee.of(NAME, cpf))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("CPF");
        }

        @ParameterizedTest
        @ValueSource(strings = {"5299822472", "529.982.247-250"})
        void shouldRejectInvalidLength(String cpf) {
            assertThatThrownBy(() -> Employee.of(NAME, cpf))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("entre 11 e 14");
        }

        @Test
        void shouldRejectLetters() {
            assertThatThrownBy(() -> Employee.of(NAME, "5299822472a"))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("caracteres inválidos");
        }

        @Test
        void shouldRejectRepeatedDigits() {
            assertThatThrownBy(() -> Employee.of(NAME, "111.111.111-11"))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("CPF inválido");
        }

        @Test
        void shouldRejectWrongCheckDigits() {
            assertThatThrownBy(() -> Employee.of(NAME, "529.982.247-26"))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("CPF inválido");
        }

        @Test
        void shouldStoreOnlyDigits() {
            var employee = Employee.of(NAME, VALID_CPF);

            assertThat(employee.getEmployeeCpf()).isEqualTo("52998224725");
        }
    }

    @Nested
    @DisplayName("Função")
    class Role {

        @Test
        void shouldDefaultToNotApplicableWhenUsingLegacyFactory() {
            var employee = Employee.of(NAME, VALID_CPF);

            assertThat(employee.getEmployeeRole()).isEqualTo("N/A");
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"   "})
        void shouldDefaultToNotApplicableWhenMissing(String role) {
            var employee = Employee.of(NAME, VALID_CPF, role);

            assertThat(employee.getEmployeeRole()).isEqualTo("N/A");
        }

        @Test
        void shouldKeepTrimmedRole() {
            var employee = Employee.of(NAME, VALID_CPF, "  Auxiliar de Produção  ");

            assertThat(employee.getEmployeeRole()).isEqualTo("Auxiliar de Produção");
        }

        @Test
        void shouldAcceptRoleAtMaximumLength() {
            var role = "A".repeat(100);

            assertThat(Employee.of(NAME, VALID_CPF, role).getEmployeeRole()).isEqualTo(role);
        }

        @Test
        void shouldRejectTooLongRole() {
            var role = "a".repeat(101);

            assertThatThrownBy(() -> Employee.of(NAME, VALID_CPF, role))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("no máximo 100");
        }

        @Test
        void shouldRejectInvalidCharacters() {
            assertThatThrownBy(() -> Employee.of(NAME, VALID_CPF, "Operador <script>"))
                    .isInstanceOf(EmployeeException.class)
                    .hasMessageContaining("caracteres inválidos");
        }
    }
}
