// src/main/java/com/cyberwallet/walletapi/service/impl/CscProvinciaImporter.java
package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.dto.wallet.CscStateDTO;
import com.cyberwallet.walletapi.entity.Pais;
import com.cyberwallet.walletapi.entity.Provincia;
import com.cyberwallet.walletapi.repository.PaisRepository;
import com.cyberwallet.walletapi.repository.ProvinciaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CscProvinciaImporter implements CommandLineRunner {

    private final ProvinciaRepository provinciaRepository;
    private final PaisRepository paisRepository;

    private static final String API_URL = "https://api.countrystatecity.in/v1/countries/AR/states";
    private static final String PAIS_NOMBRE = "Argentina";
    private static final String PAIS_ISO2 = "AR";

    @Value("${api.countrystatecity.key:}")
    private String apiKey;

    @Override
    public void run(String... args) {
        log.info("\uD83D\uDCE6 [CSC IMPORT] Iniciando importación de provincias desde CSC...");

        // Mejor práctica: solo importar si la tabla está vacía
        if (provinciaRepository.count() > 0) {
            log.info("[CSC IMPORT] Ya existen provincias en la base de datos. No se importan más.");
            return;
        }

        if (apiKey == null || apiKey.isBlank()) {
            log.error("❌ [CSC IMPORT] La API Key no está configurada (api.countrystatecity.key)");
            return;
        }

        try {
            Pais paisArgentina = obtenerOCrearPais(PAIS_NOMBRE, PAIS_ISO2);

            if (paisArgentina == null) {
                log.error("❌ [CSC IMPORT] No se pudo obtener o crear el país '{}'. No se importarán provincias.", PAIS_NOMBRE);
                return;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-CSCAPI-KEY", apiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<CscStateDTO[]> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.GET,
                    entity,
                    CscStateDTO[].class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                long total = Arrays.stream(response.getBody())
                        .filter(dto -> {
                            boolean existe = provinciaRepository.existsByNombreIgnoreCase(dto.getName());
                            if (existe) {
                                log.warn("⚠️ [CSC IMPORT] Ya existe: {}", dto.getName());
                                return false;
                            }
                            Provincia nueva = new Provincia();
                            nueva.setNombre(dto.getName());
                            nueva.setCodigo(dto.getIso2());
                            nueva.setPais(paisArgentina);
                            provinciaRepository.save(nueva);
                            log.info("✅ [CSC IMPORT] Provincia guardada: {}", dto.getName());
                            return true;
                        })
                        .count();

                log.info("✅ [CSC IMPORT] Importación finalizada con {} provincias nuevas.", total);
            } else {
                log.error("❌ [CSC IMPORT] Error al consultar API CSC: Status {}", response.getStatusCode());
            }
        } catch (RestClientException ex) {
            log.error("💥 [CSC IMPORT] Excepción al conectar con CSC API: {}", ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("💥 [CSC IMPORT] Error inesperado durante importación: {}", ex.getMessage(), ex);
        }
    }

    private Pais obtenerOCrearPais(String nombrePais, String iso2Pais) {
        Optional<Pais> pais = paisRepository.findByNombre(nombrePais);
        if (pais.isPresent()) {
            return pais.get();
        } else {
            log.info("ℹ️ [CSC IMPORT] Creando país '{}' (ISO2: {}) en la base de datos.", nombrePais, iso2Pais);
            Pais nuevoPais = Pais.builder()
                    .nombre(nombrePais)
                    .iso2(iso2Pais)
                    .build();
            return paisRepository.save(nuevoPais);
        }
    }
}