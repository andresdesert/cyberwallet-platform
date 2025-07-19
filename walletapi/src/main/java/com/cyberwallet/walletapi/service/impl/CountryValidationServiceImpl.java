// src/main/java/com/cyberwallet/walletapi/service/impl/CountryValidationServiceImpl.java
package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.entity.Pais;
import com.cyberwallet.walletapi.entity.Provincia;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.PaisRepository;
import com.cyberwallet.walletapi.repository.ProvinciaRepository;
import com.cyberwallet.walletapi.service.CountryValidationService;
import com.cyberwallet.walletapi.util.fallback.PaisFallbackLoader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class CountryValidationServiceImpl implements CountryValidationService {

    private final PaisRepository paisRepository;
    private final ProvinciaRepository provinciaRepository;

    private final Map<String, Boolean> countryValidationCache = new ConcurrentHashMap<>();
    private final List<String> cachedTopCountries = new ArrayList<>();

    @Override
    public Optional<Pais> findPaisById(Long id) {
        return paisRepository.findById(id);
    }

    @Override
    public Optional<Provincia> findProvinciaById(Long id) {
        return provinciaRepository.findById(id);
    }

    @Override
    public boolean validateCountry(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Nombre de país inválido.");
        }

        return countryValidationCache.computeIfAbsent(name.toLowerCase(), this::validateAgainstLocalData);
    }

    @Override
    public List<String> getTopCountries() {
        if (!cachedTopCountries.isEmpty()) {
            return cachedTopCountries;
        }

        try {
            log.info("[PAÍS] 📄 Cargando lista de países desde datos locales...");

            // Usar el loader centralizado
            List<String> countries = PaisFallbackLoader.getSupportedCountries().stream()
                    .map(PaisFallbackLoader::getCountryName)
                    .filter(Objects::nonNull)
                    .sorted()
                    .toList();

            cachedTopCountries.addAll(countries);
            log.info("[PAÍS] ✅ Lista de países cargada: {} países", countries.size());
            return countries;

        } catch (Exception e) {
            log.error("[PAÍS] ❌ Error al obtener lista de países: {}", e.getMessage());
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "No se pudo obtener lista de países.");
        }
    }

    private boolean validateAgainstLocalData(String name) {
        try {
            log.debug("[PAÍS] 🔍 Validando país contra datos locales: {}", name);

            boolean isValid = PaisFallbackLoader.validateCountryName(name);

            if (!isValid) {
                log.warn("[PAÍS] ❌ País no encontrado en datos locales: {}", name);
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "País no encontrado.");
            }

            log.info("[PAÍS] ✅ País validado correctamente: {}", name);
            return true;

        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("[PAÍS] ❌ Error inesperado validando país: {}", e.getMessage());
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "No se pudo validar el país.");
        }
    }

    @Override
    public boolean isProvinciaValida(Long paisId, Long provinciaId) {
        if (paisId == null || provinciaId == null) {
            log.warn("[VALIDATION] paisId o provinciaId nulos: paisId={}, provinciaId={}", paisId, provinciaId);
            return false;
        }

        boolean existe = provinciaRepository.existsByIdAndPais_Id(provinciaId, paisId);

        if (!existe) {
            log.warn("[VALIDATION] Provincia ID={} no pertenece a País ID={}", provinciaId, paisId);
        } else {
            log.debug("[VALIDATION] Provincia ID={} pertenece correctamente a País ID={}", provinciaId, paisId);
        }

        return existe;
    }
}