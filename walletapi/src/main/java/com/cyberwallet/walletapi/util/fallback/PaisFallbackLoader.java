package com.cyberwallet.walletapi.util.fallback;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.util.*;

/**
 * Loader centralizado de países de fallback.
 * FUENTE ÚNICA DE VERDAD para evitar duplicación de mapeos hardcodeados.
 * Mejores prácticas 2025: explícito, seguro, sin hardcodeos innecesarios.
 */
@Slf4j
public class PaisFallbackLoader {
    
    // ✅ FUENTE ÚNICA DE VERDAD - Todos los países centralizados aquí
    private static final Map<String, String> FALLBACK_PAISES = Map.of(
            "argentina", "Argentina",
            "brasil", "Brasil", 
            "uruguay", "Uruguay",
            "chile", "Chile",
            "paraguay", "Paraguay",
            "peru", "Perú",
            "colombia", "Colombia",
            "bolivia", "Bolivia",
            "ecuador", "Ecuador",
            "venezuela", "Venezuela"
    );

    // ✅ Mapeo de alias para diferentes formas de referirse al mismo país
    private static final Map<String, String> COUNTRY_ALIASES = Map.ofEntries(
            Map.entry("ar", "argentina"),
            Map.entry("argentina", "argentina"),
            Map.entry("br", "brasil"), 
            Map.entry("brazil", "brasil"),
            Map.entry("uy", "uruguay"),
            Map.entry("uruguay", "uruguay"),
            Map.entry("cl", "chile"),
            Map.entry("chile", "chile"),
            Map.entry("py", "paraguay"),
            Map.entry("paraguay", "paraguay"),
            Map.entry("pe", "peru"),
            Map.entry("peru", "peru"),
            Map.entry("co", "colombia"),
            Map.entry("colombia", "colombia"),
            Map.entry("bo", "bolivia"),
            Map.entry("bolivia", "bolivia"),
            Map.entry("ec", "ecuador"),
            Map.entry("ecuador", "ecuador"),
            Map.entry("ve", "venezuela"),
            Map.entry("venezuela", "venezuela")
    );

    private static List<Map<String, Object>> countriesFromFile = new ArrayList<>();

    /**
     * Devuelve el mapa país→nombre de fallback.
     * @return Mapa inmutable país→nombre.
     */
    public static Map<String, String> getFallbackPaises() {
        return Collections.unmodifiableMap(FALLBACK_PAISES);
    }

    /**
     * Obtiene el nombre del país con normalización de alias.
     * @param countryKey Clave del país (puede ser ISO2 o nombre)
     * @return Nombre del país o null si no se encuentra
     */
    public static String getCountryName(String countryKey) {
        if (countryKey == null || countryKey.trim().isEmpty()) {
            return null;
        }
        
        String normalizedKey = normalizeCountryKey(countryKey);
        String canonicalKey = COUNTRY_ALIASES.get(normalizedKey);
        
        if (canonicalKey != null) {
            return FALLBACK_PAISES.get(canonicalKey);
        }
        
        return null;
    }

    /**
     * Verifica si un país está soportado.
     * @param countryKey Clave del país
     * @return true si está soportado
     */
    public static boolean isCountrySupported(String countryKey) {
        if (countryKey == null || countryKey.trim().isEmpty()) {
            return false;
        }
        
        String normalizedKey = normalizeCountryKey(countryKey);
        return COUNTRY_ALIASES.containsKey(normalizedKey);
    }

    /**
     * Normaliza la clave del país para búsqueda consistente.
     * @param countryKey Clave original
     * @return Clave normalizada
     */
    private static String normalizeCountryKey(String countryKey) {
        return countryKey.trim().toLowerCase()
                .replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
                .replace("ã", "a").replace("õ", "o").replace("ç", "c")
                .replace(" ", "");
    }

    /**
     * Obtiene todos los países soportados.
     * @return Lista de países soportados
     */
    public static List<String> getSupportedCountries() {
        return List.of("argentina", "brasil", "uruguay", "chile", "paraguay", "peru", "colombia", "bolivia", "ecuador", "venezuela");
    }

    /**
     * Obtiene todos los países desde el archivo JSON.
     * @return Lista de países desde archivo
     */
    public static List<Map<String, Object>> getCountriesFromFile() {
        if (countriesFromFile.isEmpty()) {
            loadCountriesFromFile();
        }
        return Collections.unmodifiableList(countriesFromFile);
    }

    /**
     * Carga los países desde el archivo JSON.
     */
    private static void loadCountriesFromFile() {
        try (InputStream inputStream = PaisFallbackLoader.class.getClassLoader().getResourceAsStream("countries-fallback.json")) {
            if (inputStream == null) {
                log.warn("[PAISES] ⚠️ Archivo de países no encontrado: countries-fallback.json");
                return;
            }

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> fileData = objectMapper.readValue(inputStream, new TypeReference<>() {});
            
            if (fileData.containsKey("countries")) {
                countriesFromFile = (List<Map<String, Object>>) fileData.get("countries");
                log.info("[PAISES] 📄 Países cargados desde archivo: {} países", countriesFromFile.size());
            }
            
        } catch (Exception e) {
            log.error("[PAISES] ❌ Error cargando países desde archivo: {}", e.getMessage());
        }
    }

    /**
     * Valida si un nombre de país es válido.
     * @param countryName Nombre del país
     * @return true si es válido
     */
    public static boolean validateCountryName(String countryName) {
        if (countryName == null || countryName.trim().isEmpty()) {
            return false;
        }

        String normalizedName = normalizeCountryKey(countryName);
        
        // Verificar en el mapa de fallback
        if (COUNTRY_ALIASES.containsKey(normalizedName)) {
            return true;
        }

        // Verificar en el archivo JSON
        if (countriesFromFile.isEmpty()) {
            loadCountriesFromFile();
        }

        return countriesFromFile.stream()
                .anyMatch(country -> {
                    String common = (String) country.get("common");
                    String name = (String) country.get("name");
                    return (common != null && common.equalsIgnoreCase(countryName)) ||
                           (name != null && name.equalsIgnoreCase(countryName));
                });
    }
} 