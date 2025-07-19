package com.cyberwallet.walletapi.util.fallback;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Loader centralizado de provincias/estados/departamentos de fallback por país.
 * FUENTE ÚNICA DE VERDAD para evitar duplicación de mapeos hardcodeados.
 * Mejores prácticas 2025: explícito, seguro, sin hardcodeos innecesarios.
 */
public class ProvinciaFallbackLoader {
    
    // ✅ FUENTE ÚNICA DE VERDAD - Todas las provincias centralizadas aquí
    private static final Map<String, List<String>> FALLBACK_PROVINCIAS = Map.of(
            "argentina", List.of(
                    "Buenos Aires", "CABA", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa",
                    "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan",
                    "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
            ),
            "brasil", List.of(
                    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", "Goiás",
                    "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco",
                    "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina",
                    "São Paulo", "Sergipe", "Tocantins"
            ),
            "uruguay", List.of(
                    "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores", "Florida", "Lavalleja", "Maldonado",
                    "Montevideo", "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó", "Treinta y Tres"
            )
    );

    // ✅ Mapeo de alias para diferentes formas de referirse al mismo país
    private static final Map<String, String> COUNTRY_ALIASES = Map.of(
            "ar", "argentina",
            "argentina", "argentina",
            "br", "brasil", 
            "brazil", "brasil",
            "brasil", "brasil",
            "uy", "uruguay",
            "uruguay", "uruguay"
    );

    /**
     * Devuelve el mapa país→provincias de fallback.
     * @return Mapa inmutable país→provincias.
     */
    public static Map<String, List<String>> getFallbackProvincias() {
        return Collections.unmodifiableMap(FALLBACK_PROVINCIAS);
    }

    /**
     * Obtiene las provincias para un país específico con normalización de alias.
     * @param countryKey Clave del país (puede ser ISO2 o nombre)
     * @return Lista de provincias o lista vacía si no se encuentra
     */
    public static List<String> getProvincesForCountry(String countryKey) {
        if (countryKey == null || countryKey.trim().isEmpty()) {
            return Collections.emptyList();
        }
        
        String normalizedKey = normalizeCountryKey(countryKey);
        String canonicalKey = COUNTRY_ALIASES.get(normalizedKey);
        
        if (canonicalKey != null) {
            return FALLBACK_PROVINCIAS.getOrDefault(canonicalKey, Collections.emptyList());
        }
        
        return Collections.emptyList();
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
        return List.of("argentina", "brasil", "uruguay");
    }
} 