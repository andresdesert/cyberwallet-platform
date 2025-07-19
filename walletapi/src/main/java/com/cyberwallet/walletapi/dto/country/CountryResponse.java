package com.cyberwallet.walletapi.dto.country;

import lombok.Data;

/**
 * DTO para la respuesta de país.
 * Representa la estructura de respuesta del nombre del país.
 */
@Data
public class CountryResponse {

    /** Nombre del país (estructura anidada). */
    private Name name;

    @Data
    public static class Name {
        /** Nombre común del país (e.g. "Argentina"). */
        private String common;
    }
}
