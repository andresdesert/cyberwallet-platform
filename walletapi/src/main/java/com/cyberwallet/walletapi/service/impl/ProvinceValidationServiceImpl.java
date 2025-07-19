// src/main/java/com/cyberwallet/walletapi/service/impl/ProvinceValidationServiceImpl.java
package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.service.ProvinceValidationService;
import com.cyberwallet.walletapi.util.fallback.ProvinciaFallbackLoader;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProvinceValidationServiceImpl implements ProvinceValidationService {

    private final Map<String, List<String>> provinceCache = new ConcurrentHashMap<>();

    @Override
    public List<String> listProvinces(String countryIso2) {
        if (countryIso2 == null || countryIso2.isBlank()) {
            log.warn("[PROVINCIAS] ❌ Código de país vacío o nulo.");
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "El código de país no puede estar vacío.");
        }

        String normalizedKey = normalizeCountryKey(countryIso2);
        
        // Verificar si el país está soportado usando el loader centralizado
        if (!ProvinciaFallbackLoader.isCountrySupported(normalizedKey)) {
            log.warn("[PROVINCIAS] ❌ País no soportado: {}", countryIso2);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, 
                "País no soportado. Solo se permite Argentina (AR), Brasil (BR) o Uruguay (UY).");
        }

        return provinceCache.computeIfAbsent(normalizedKey, this::fetchProvincesFromLocalData);
    }

    private List<String> fetchProvincesFromLocalData(String countryKey) {
        log.info("[PROVINCIAS] 📄 Cargando provincias desde datos locales para: {}", countryKey);

        // Usar el loader centralizado
        List<String> provinces = ProvinciaFallbackLoader.getProvincesForCountry(countryKey);

        if (provinces.isEmpty()) {
            log.error("[PROVINCIAS] 🚫 No hay provincias configuradas para '{}'", countryKey);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, 
                "País no soportado o sin provincias configuradas. Solo se permite Argentina, Brasil o Uruguay.");
        }

        log.info("[PROVINCIAS] ✅ Provincias cargadas para '{}': {} provincias", countryKey, provinces.size());
        return provinces;
    }

    @Override
    public boolean isValidProvince(String countryIso2, String provinceName) {
        if (countryIso2 == null || countryIso2.isBlank() || provinceName == null || provinceName.isBlank()) {
            return false;
        }

        try {
            List<String> provinces = listProvinces(countryIso2);
            return provinces.stream()
                    .anyMatch(province -> province.equalsIgnoreCase(provinceName.trim()));
        } catch (Exception e) {
            log.warn("[PROVINCIAS] Error validando provincia '{}' para país '{}': {}", 
                    provinceName, countryIso2, e.getMessage());
            return false;
        }
    }

    /**
     * Normaliza la clave del país para búsqueda consistente.
     */
    private String normalizeCountryKey(String countryKey) {
        return countryKey.trim().toLowerCase()
                .replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
                .replace("ã", "a").replace("õ", "o").replace("ç", "c")
                .replace(" ", "");
    }
}