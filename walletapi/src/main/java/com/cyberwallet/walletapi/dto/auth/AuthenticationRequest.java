package com.cyberwallet.walletapi.dto.auth;

import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * DTO para la petición de autenticación (login).
 * Permite autenticación con email o username.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationRequest {

    @NotBlank(message = "El email o nombre de usuario no puede estar vacío")
    @Size(min = 4, max = 100, message = "Debe tener entre 4 y 100 caracteres.")
    // CAMBIO: Nueva regex para validar email O username
    @Pattern(
            regexp = "^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}|[a-zA-Z0-9_\\-\\.]+)$",
            message = "El email o nombre de usuario tiene un formato inválido."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String emailOrUsername;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String password;
}