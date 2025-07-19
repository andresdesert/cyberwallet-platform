package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.model.DollarRateEntity;
import com.cyberwallet.walletapi.repository.DollarRateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DollarService {
    private final RestTemplate restTemplate;
    private final DollarRateRepository dollarRateRepository;
    private static final Logger log = LoggerFactory.getLogger(DollarService.class);

    public List<Map<String, Object>> getDollarRates() {
        String apiUrl = "https://dolarapi.com/v1/dolares";
        log.debug("[DOLLAR] Solicitando cotizaciones desde: {}", apiUrl);

        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            log.error("[DOLLAR] ❌ Error al obtener cotización. Status: {}", response.getStatusCode());
            throw new RuntimeException("No se pudo obtener la cotización del dólar.");
        }

        List<Map<String, Object>> result = response.getBody();

        for (Map<String, Object> rate : result) {
            String nombre = (String) rate.get("nombre");
            double nuevaVenta = toDouble(rate.get("venta"));

            Optional<DollarRateEntity> existente = dollarRateRepository.findById(nombre);
            double anterior = existente.map(DollarRateEntity::getUltimaVenta).orElse(nuevaVenta);

            String cambio;
            if (nuevaVenta > anterior) cambio = "up";
            else if (nuevaVenta < anterior) cambio = "down";
            else cambio = "neutral";

            // Actualizar base de datos
            dollarRateRepository.save(new DollarRateEntity(nombre, nuevaVenta));

            rate.put("change", cambio);
        }

        log.info("[DOLLAR] Cotizaciones con cambio persistente generadas correctamente.");
        return result;
    }

    private double toDouble(Object value) {
        try {
            return Double.parseDouble(value.toString());
        } catch (Exception e) {
            return 0.0;
        }
    }
}
