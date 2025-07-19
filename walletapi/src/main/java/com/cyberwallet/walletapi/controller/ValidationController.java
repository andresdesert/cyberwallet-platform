package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.ProvinceRequestDTO;
import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.UserRepository;
import com.cyberwallet.walletapi.service.CountryValidationService;
import com.cyberwallet.walletapi.service.ProvinceValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/validations")
@RequiredArgsConstructor
@Tag(name = "Validations", description = "Endpoints para validar datos específicos (países, provincias, email, username).")
@Slf4j
public class ValidationController {

    private final ProvinceValidationService provinceValidationService;
    private final CountryValidationService countryValidationService;
    private final UserRepository userRepository;
    
    // Caché simple para evitar consultas duplicadas
    private final Map<String, Boolean> validationCache = new ConcurrentHashMap<>();
    private final Map<String, Long> cacheTimestamps = new ConcurrentHashMap<>();
    private static final long CACHE_DURATION_MS = 30_000; // 30 segundos

    //Dolar cotizaciones
    @GetMapping("/dollar")
    public ResponseEntity<?> getDollarRatesProxy() {
        log.debug("[VALIDATION] Reenviando a cotizaciones del dólar...");
        return ResponseEntity.status(302)
                .header("Location", "/api/v1/cotizaciones")
                .build();
    }

    // --- 📛 Validar disponibilidad de username o email (endpoint público) ---
    /**
     * Endpoint público para validar disponibilidad de username o email.
     * Acepta ?username=, ?email= o ?value= y responde con ApiResponse<Boolean> homogéneo.
     */
    @GetMapping("/username/available")
    public ResponseEntity<ApiResponse<Boolean>> isUsernameAvailable(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "value", required = false) String value,
            @RequestParam(value = "email", required = false) String email
    ) {
        // Determinar qué parámetro usar
        String userToCheck = username != null ? username : (value != null ? value : email);
        
        if (userToCheck == null || userToCheck.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Parámetro username/value/email requerido"));
        }

        String cacheKey = "username:" + userToCheck.trim();
        Boolean cachedResult = getCachedResult(cacheKey);
        if (cachedResult != null) {
            log.debug("[VALIDATION] Username '{}' disponible (cache): {}", userToCheck, cachedResult);
            return ResponseEntity.ok(ApiResponse.success("Disponibilidad verificada (cache)", cachedResult));
        }

        boolean isAvailable = !userRepository.existsByUsername(userToCheck.trim());
        cacheResult(cacheKey, isAvailable);
        log.debug("[VALIDATION] Username '{}' disponible: {}", userToCheck, isAvailable);
        
        return ResponseEntity.ok(ApiResponse.success("Disponibilidad verificada", isAvailable));
    }

    @GetMapping("/email/available")
    public ResponseEntity<ApiResponse<Boolean>> isEmailAvailable(
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "value", required = false) String value,
            @RequestParam(value = "username", required = false) String username
    ) {
        // Determinar qué parámetro usar
        String emailToCheck = email != null ? email : (value != null ? value : username);
        
        if (emailToCheck == null || emailToCheck.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Parámetro email/value/username requerido"));
        }

        String cacheKey = "email:" + emailToCheck.trim();
        Boolean cachedResult = getCachedResult(cacheKey);
        if (cachedResult != null) {
            log.debug("[VALIDATION] Email '{}' disponible (cache): {}", emailToCheck, cachedResult);
            return ResponseEntity.ok(ApiResponse.success("Disponibilidad verificada (cache)", cachedResult));
        }

        boolean isAvailable = !userRepository.existsByEmail(emailToCheck.trim());
        cacheResult(cacheKey, isAvailable);
        log.debug("[VALIDATION] Email '{}' disponible: {}", emailToCheck, isAvailable);
        
        return ResponseEntity.ok(ApiResponse.success("Disponibilidad verificada", isAvailable));
    }

    // Métodos auxiliares para caché
    private Boolean getCachedResult(String key) {
        Long timestamp = cacheTimestamps.get(key);
        if (timestamp != null && (System.currentTimeMillis() - timestamp) < CACHE_DURATION_MS) {
            return validationCache.get(key);
        }
        // Limpiar entrada expirada
        validationCache.remove(key);
        cacheTimestamps.remove(key);
        return null;
    }

    private void cacheResult(String key, boolean result) {
        validationCache.put(key, result);
        cacheTimestamps.put(key, System.currentTimeMillis());
    }

    // --- 🌍 Validar si provincia es válida para país ---
    @Operation(summary = "Validar si una provincia es válida para un país", description = "Devuelve true/false si la provincia existe para el país ISO2 indicado.")
    @GetMapping("/provinces/{countryIso2}/{provinceName}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> isValidProvince(
            @PathVariable String countryIso2,
            @PathVariable String provinceName) {

        log.debug("[VALIDATION] Provincia '{}' para país '{}'", provinceName, countryIso2);

        boolean isValid = provinceValidationService.isValidProvince(countryIso2, provinceName);

        return ResponseEntity.ok(ApiResponse.<Map<String, Boolean>>builder()
                .message("Validación completada")
                .data(Map.of("valid", isValid))
                .timestamp(LocalDateTime.now())
                .build());
    }

    // --- 🗺️ Obtener provincias vía PATH ---
    @Operation(summary = "Listar provincias/estados de un país", description = "Devuelve la lista de provincias/estados de un país dado por su código ISO2.")
    @GetMapping("/provinces/list/{pais}")
    public ResponseEntity<ApiResponse<List<String>>> listProvinces(@PathVariable String pais) {
        log.debug("[LIST] 🔍 Solicitud de provincias para país: {}", pais);
        log.debug("[LIST] 📊 Estado del sistema: países soportados = [AR, BR, UY]");
        
        try {
            List<String> provinces = provinceValidationService.listProvinces(pais);
            log.info("[LIST] ✅ Provincias encontradas para '{}': {} provincias", pais, provinces.size());
            log.debug("[LIST] 📋 Detalle de provincias para '{}': {}", pais, provinces);
            
            return ResponseEntity.ok(ApiResponse.success("Provincias obtenidas correctamente.", provinces));
        } catch (Exception e) {
            log.error("[LIST] ❌ Error al obtener provincias para país '{}': {}", pais, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail("Error al obtener provincias: " + e.getMessage()));
        }
    }

    // --- 🗺️ Obtener provincias vía QUERY ---
    @Operation(summary = "Listar provincias/estados de un país vía query", description = "Devuelve la lista de provincias/estados de un país dado por su código ISO2 como query param.")
    @GetMapping("/provinces")
    public ResponseEntity<ApiResponse<List<String>>> listProvincesQuery(@RequestParam String country) {
        log.debug("[LIST] Provincias para país (query): {}", country);
        
        List<String> provinces = provinceValidationService.listProvinces(country);
        
        return ResponseEntity.ok(ApiResponse.success("Provincias obtenidas correctamente.", provinces));
    }

    // --- 🗺️ Obtener provincias vía JSON (body validado) ---
    @PostMapping("/provinces")
    public ResponseEntity<ApiResponse<List<String>>> listProvincesFromBody(@Valid @RequestBody ProvinceRequestDTO request) {
        String pais = request.getPais();
        log.debug("[LIST] Provincias desde JSON body. País: {}", pais);

        List<String> provinces = provinceValidationService.listProvinces(pais);
        
        return ResponseEntity.ok(ApiResponse.success("Provincias obtenidas correctamente.", provinces));
    }

    // --- 🌍 Obtener países válidos ---
    @Operation(summary = "Obtener países válidos", description = "Devuelve la lista de países válidos para el registro.")
    @GetMapping("/countries")
    public ResponseEntity<ApiResponse<List<String>>> getValidCountries() {
        log.debug("[LIST] Obteniendo países válidos");
        
        List<String> countries = countryValidationService.getTopCountries();
        
        return ResponseEntity.ok(ApiResponse.success("Países obtenidos correctamente.", countries));
    }

    // --- 🌍 Obtener países con IDs ---
    @Operation(summary = "Obtener países con IDs", description = "Devuelve la lista de países con sus IDs para el registro.")
    @GetMapping("/countries/with-ids")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCountriesWithIds() {
        log.debug("[LIST] Obteniendo países con IDs");
        
        List<Map<String, Object>> countries = new ArrayList<>();
        
        // Obtener países desde el repositorio
        try {
            var argentinaOpt = countryValidationService.findPaisById(1L);
            if (argentinaOpt.isPresent()) {
                var argentina = argentinaOpt.get();
                countries.add(Map.of(
                    "id", argentina.getId(),
                    "nombre", argentina.getNombre(),
                    "iso2", argentina.getIso2()
                ));
            }
            
            log.info("[COUNTRIES] Países obtenidos correctamente: {}", countries.size());
            return ResponseEntity.ok(ApiResponse.success("Países obtenidos correctamente.", countries));
        } catch (Exception e) {
            log.error("[COUNTRIES] Error obteniendo países: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(
                ApiResponse.<List<Map<String, Object>>>builder()
                    .message("Error interno al obtener países.")
                    .data(new ArrayList<>())
                    .timestamp(LocalDateTime.now())
                    .build()
            );
        }
    }

    // --- 📍 Obtener provincias con IDs por país ---
    @Operation(summary = "Obtener provincias con IDs", description = "Devuelve la lista de provincias con sus IDs para un país específico.")
    @GetMapping("/provinces/with-ids/{paisId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getProvincesWithIds(@PathVariable Long paisId) {
        log.debug("[LIST] Obteniendo provincias con IDs para país ID: {}", paisId);
        
        List<Map<String, Object>> provinces = new ArrayList<>();
        
        try {
            var paisOpt = countryValidationService.findPaisById(paisId);
            if (paisOpt.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.success("País no encontrado.", provinces));
            }
            
            // Para Argentina (ID 1), devolver provincias hardcodeadas
            if (paisId == 1L) {
                String[] provinciaNames = {
                    "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", 
                    "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", 
                    "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", 
                    "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", 
                    "Tierra del Fuego", "Tucumán"
                };
                
                for (int i = 0; i < provinciaNames.length; i++) {
                    provinces.add(Map.of(
                        "id", (long)(i + 1),
                        "nombre", provinciaNames[i],
                        "paisId", paisId
                    ));
                }
            }
        } catch (Exception e) {
            log.warn("[PROVINCES] Error obteniendo provincias: {}", e.getMessage());
        }
        
        return ResponseEntity.ok(ApiResponse.success("Provincias con IDs obtenidas correctamente.", provinces));
    }

    // --- 🌍 Validar país específico ---
    @Operation(summary = "Validar país", description = "Valida si un país es válido para el registro.")
    @GetMapping("/countries/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateCountry(@RequestParam String name) {
        log.debug("[VALIDATION] Validando país: {}", name);
        
        boolean isValid = countryValidationService.validateCountry(name);
        
        return ResponseEntity.ok(ApiResponse.success("Validación completada.", isValid));
    }

    // --- 🏥 Health check ---
    @Operation(summary = "Health check", description = "Verifica que el servicio de validaciones esté funcionando correctamente.")
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> health = Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "ValidationController",
            "version", "1.0.0"
        );
        
        return ResponseEntity.ok(ApiResponse.success("Servicio funcionando correctamente.", health));
    }
}
