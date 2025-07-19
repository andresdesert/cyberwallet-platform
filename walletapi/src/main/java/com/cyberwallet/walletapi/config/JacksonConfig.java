package com.cyberwallet.walletapi.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

/**
 * Configuración de Jackson para la serialización/deserialización de JSON.
 * Incluye soporte para tipos java.time y ajustes de formato de fecha.
 */
@Configuration
public class JacksonConfig {

    /**
     * Configura un ObjectMapper con soporte para java.time y formato ISO-8601.
     *
     * @param builder El builder preconfigurado de Spring Boot.
     * @return ObjectMapper personalizado.
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper objectMapper = builder.build();

        // Registra el módulo para tipos java.time (LocalDate, LocalDateTime, etc.)
        objectMapper.registerModule(new JavaTimeModule());

        // Configura fechas en formato ISO-8601 (no timestamps)
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        // (Opcional) Configurar para ignorar propiedades desconocidas en deserialización
        // objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        return objectMapper;
    }
}
