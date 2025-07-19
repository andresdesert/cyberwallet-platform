package com.cyberwallet.walletapi.config;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class DotenvPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .filename(".env")
                    .ignoreIfMissing()
                    .load();

            Map<String, Object> props = new HashMap<>();
            dotenv.entries().forEach(entry -> props.put(entry.getKey(), entry.getValue()));

            environment.getPropertySources().addFirst(new MapPropertySource("dotenv", props));

            // 🔍 Log detallado para debug
            log.info("🟢 [DOTENV] Variables de entorno cargadas correctamente desde .env");
            dotenv.entries().forEach(entry ->
                    log.debug("🔑 [DOTENV] {} = {}", entry.getKey(), entry.getValue())
            );

            // 🔒 Log clave para trazabilidad directa
            String apiKey = dotenv.get("API_COUNTRYSTATECITY_KEY");
            if (apiKey == null || apiKey.isBlank()) {
                log.warn("⚠️ [DOTENV] La variable API_COUNTRYSTATECITY_KEY no se encontró o está vacía");
            } else {
                log.info("✅ [DOTENV] API_COUNTRYSTATECITY_KEY cargada correctamente");
            }
        } catch (Exception e) {
            log.warn("⚠️ [DOTENV] No se pudo cargar el archivo .env: {}. Usando variables de entorno del sistema.", e.getMessage());
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
