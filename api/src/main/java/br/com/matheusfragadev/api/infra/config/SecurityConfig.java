package br.com.matheusfragadev.api.infra.config;

import br.com.matheusfragadev.api.infra.security.accessdenied.AccessDeniedHandlerImpl;
import br.com.matheusfragadev.api.infra.security.entrypoint.AuthenticationEntryPointImpl;
import br.com.matheusfragadev.api.infra.security.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import jakarta.servlet.DispatcherType;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final AuthenticationEntryPointImpl authenticationEntryPoint;
    private final AccessDeniedHandlerImpl accessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain
            (HttpSecurity http, @Value("${api.v1.prefix}") String apiPrefix) throws Exception {
        return http.
                headers(h->
                        h.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)) //Somente em dev para H2
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement
                        (s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(
                        auth ->
                                auth
                                        .dispatcherTypeMatchers(
                                                DispatcherType.ERROR
                                        ).permitAll()
                                        .requestMatchers("/h2-console/**").permitAll() //Somente em dev
                                        .requestMatchers(HttpMethod.POST, apiPrefix+"/auth/**").permitAll()
                                        .requestMatchers(HttpMethod.GET, apiPrefix+"/exams/**").permitAll()
                                        .requestMatchers(HttpMethod.POST, apiPrefix+"/appointments/**").permitAll()
                                        .requestMatchers(HttpMethod.PATCH, apiPrefix+"/enterprises/**").hasAuthority("ADMIN")
                                        .requestMatchers(HttpMethod.POST, apiPrefix+"/enterprises/**").hasAuthority("ADMIN")
                                        .requestMatchers(HttpMethod.DELETE, apiPrefix+"/enterprises/**").hasAuthority("ADMIN")
                                        .requestMatchers(apiPrefix+"/accounts/**").hasAuthority("ADMIN")
                                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}