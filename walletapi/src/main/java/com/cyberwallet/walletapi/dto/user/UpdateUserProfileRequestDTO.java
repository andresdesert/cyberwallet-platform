package com.cyberwallet.walletapi.dto.user;

import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar información editable del perfil de usuario.
 * Solo incluye campos que el usuario puede modificar desde el frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequestDTO {

    @NotBlank(message = "El email no puede estar vacío.")
    @Email(message = "El email debe tener un formato válido.")
    @Size(min = 5, max = 100, message = "El email debe tener entre 5 y 100 caracteres.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String email;

    @NotBlank(message = "El username no puede estar vacío.")
    @Size(min = 4, max = 20, message = "El username debe tener entre 4 y 20 caracteres.")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.]+$", message = "El username solo puede contener letras, números, guiones bajos, guiones y puntos.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String username;

    @NotBlank(message = "La calle no puede estar vacía.")
    @Size(min = 3, max = 100, message = "La calle debe tener entre 3 y 100 caracteres.")
    @Pattern(
            regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'\\-\\.\\s]+$",
            message = "La calle contiene caracteres inválidos."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String calle;

    @NotNull(message = "El número de calle es obligatorio.")
    @Min(value = 1, message = "El número debe ser mayor o igual a 1.")
    @Max(value = 9999, message = "El número no puede ser mayor a 9999.")
    private Integer numero;

    @Schema(description = "ID del país al que se quiere actualizar el perfil", example = "1")
    private Long paisId;

    @Schema(description = "ID de la provincia al que se quiere actualizar el perfil", example = "2")
    private Long provinciaId;

    // Opcional: cambio de contraseña
    @Size(min = 8, max = 64, message = "La nueva contraseña debe tener entre 8 y 64 caracteres.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
            message = "La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
    )
    private String newPassword;

    @Size(min = 8, max = 64, message = "La contraseña actual debe tener entre 8 y 64 caracteres.")
    private String currentPassword;

    @NotBlank(message = "El teléfono es obligatorio.")
    @Pattern(
        regexp = "^(?!0)(?!15)\\d{10}$",
        message = "El teléfono debe tener exactamente 10 dígitos, no comenzar con 0 ni 15, ni contener letras, espacios o símbolos."
    )
    private String telefono;
}
