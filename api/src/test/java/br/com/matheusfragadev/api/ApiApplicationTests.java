package br.com.matheusfragadev.api;

import br.com.matheusfragadev.api.integration.PostgresTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
@Import(PostgresTestConfig.class)
class ApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
