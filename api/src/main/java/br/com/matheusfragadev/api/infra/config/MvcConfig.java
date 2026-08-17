package br.com.matheusfragadev.api.infra.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MvcConfig {

    @Bean
    public String frontUrlBase(@Value("${front.base.url}") String frontBaseUrl){
        return frontBaseUrl;
    }

    @Bean
    public String apiPrefix(@Value("${api.v1.prefix}") String apiPrefix){
        return apiPrefix;
    }

}
