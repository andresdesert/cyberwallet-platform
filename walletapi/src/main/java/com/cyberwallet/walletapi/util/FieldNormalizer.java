package com.cyberwallet.walletapi.util;

public class FieldNormalizer {

    public static String normalizeName(String name) {
        if (name == null || name.trim().isEmpty()) return null;
        String[] words = name.trim().replaceAll("\\s+", " ").split(" ");
        StringBuilder normalized = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                normalized.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        return normalized.toString().trim();
    }

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    public static String normalizeUsername(String username) {
        return username == null ? null : username.trim().toLowerCase().replaceAll("\\s+", "");
    }

    public static String normalizeGenero(String genero) {
        if (genero == null) return null;
        String cleaned = genero.trim().toLowerCase();
        switch (cleaned) {
            case "masculino":
                return "Masculino";
            case "femenino":
                return "Femenino";
            case "otro":
                return "Otro";
            case "prefiero no decirlo":
                return "Prefiero no decirlo";
            default:
                return cleaned;
        }
    }

    public static String normalizeDireccion(String direccion) {
        if (direccion == null) return null;
        return direccion.trim().replaceAll("\\s+", " ");
    }

    public static String normalizePais(String pais) {
        return pais == null ? null : pais.trim();
    }

}
