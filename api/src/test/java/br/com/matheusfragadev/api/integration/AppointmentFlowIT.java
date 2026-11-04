package br.com.matheusfragadev.api.integration;

import br.com.matheusfragadev.api.domain.exams.repository.ExamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Import(PostgresTestConfig.class)
class AppointmentFlowIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ExamRepository examRepository;

    @Value("${api.v1.prefix}")
    private String prefix;

    private String body(String roleJson, String cpf) {
        var examId = examRepository.findAll().getFirst().getId();
        return """
                {
                  "employeeName": "Maria da Silva",
                  "employeeCpf": "%s",
                  %s
                  "enterpriseName": "Empresa Fluxo",
                  "enterpriseDocument": {"type": "CNPJ", "value": "11222333000181"},
                  "shift": "MORNING",
                  "examType": "PERIODIC",
                  "examIds": ["%s"],
                  "observation": "teste"
                }
                """.formatted(cpf, roleJson, examId);
    }

    private String schedule(String json) throws Exception {
        var response = mockMvc.perform(post(prefix + "/appointments/schedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return response.replace("\"", "");
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void shouldScheduleAppointmentWithEmployeeRoleAndExposeItOnInfo() throws Exception {
        var id = schedule(body("\"employeeRole\": \"Soldadora\",", "529.982.247-25"));

        mockMvc.perform(get(prefix + "/appointments/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeName", is("Maria da Silva")))
                .andExpect(jsonPath("$.employeeCpf", is("52998224725")))
                .andExpect(jsonPath("$.employeeRole", is("Soldadora")))
                .andExpect(jsonPath("$.examStatus", is("SCHEDULED")));
    }

    @Test
    @WithMockUser(authorities = "ADMIN")
    void shouldScheduleWithoutRoleAndFallbackToNotApplicable() throws Exception {
        var id = schedule(body("", "529.982.247-25"));

        mockMvc.perform(get(prefix + "/appointments/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeRole", is("N/A")));
    }

    @Test
    void shouldRejectInvalidCpfWithClientError() throws Exception {
        mockMvc.perform(post(prefix + "/appointments/schedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("\"employeeRole\": \"Soldadora\",", "111.111.111-11")))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void shouldRequireAuthenticationToReadAppointments() throws Exception {
        mockMvc.perform(get(prefix + "/appointments"))
                .andExpect(status().is4xxClientError());
    }
}
