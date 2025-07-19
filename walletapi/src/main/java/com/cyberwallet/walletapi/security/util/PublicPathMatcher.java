package com.cyberwallet.walletapi.security.util;

import java.util.List;
import java.util.Set;

public class PublicPathMatcher {

    private PublicPathMatcher() {
        // Clase utilitaria: evitar instanciación
    }

    // Rutas públicas exactas
    private static final Set<String> PUBLIC_PATHS = Set.of(
            "/api/v1/cotizaciones",
            "/api/v1/validations/countries",
            "/api/v1/validations/provinces",
            "/api/v1/validations/email/available",
            "/api/v1/validations/username/available",
            "/api/v1/auth/login",
            "/api/v1/auth/register"
    );

    // Prefijos de rutas públicas (uso de swagger, auth, etc.)
    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/api/v1/auth",
            "/swagger-ui",
            "/v3/api-docs",
            "/webjars",
            "/api/v1/test-utils"
    );

    public static boolean isPublicPath(String path) {
        if (PUBLIC_PATHS.contains(path)) return true;
        for (String prefix : PUBLIC_PREFIXES) {
            if (path.startsWith(prefix)) return true;
        }
        return false;
    }
}
