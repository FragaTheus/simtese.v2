package br.com.matheusfragadev.api.infra.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(
        auditorAwareRef = "securityAuditorAware",
        modifyOnCreate = false
)
public class JpaAuditingConfig {
}
