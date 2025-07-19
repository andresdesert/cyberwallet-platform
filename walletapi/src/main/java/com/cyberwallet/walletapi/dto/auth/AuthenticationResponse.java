package com.cyberwallet.walletapi.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de autenticación (login o registro).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {

    /** Token JWT generado. */
    private String accessToken;

    /** Tipo de token, p. ej. "Bearer". */
    private String tokenType;

    /** Mensaje informativo (registro, errores, instrucciones, etc.). */
    private String message;

    /** Alias generado para la cuenta. */
    private String alias; // ✅ Agregado para exponer el alias generado.

    /** CVU generado para la cuenta. */
    private String cvu; // ✅ Nuevo campo para exponer el CVU generado.
}