package com.cyberwallet.walletapi.dto.auth;

import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank(message = "El token es obligatorio.")
    @Pattern(
            regexp = "^[a-zA-Z0-9\\-]+$",
            message = "El token contiene caracteres no permitidos."
    )
    private String token;

    @NotBlank(message = "La nueva contraseña es obligatoria.")
    @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
            message = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
    )
    private String newPassword;

    @NotBlank(message = "La confirmación de la nueva contraseña es obligatoria.")
    @Size(min = 8, max = 64, message = "La confirmación debe tener entre 8 y 64 caracteres.")
    private String confirmNewPassword;

    @NotBlank(message = "El email es obligatorio.")
    @Email(message = "El email debe tener un formato válido.")
    @Size(min = 5, max = 100, message = "El email debe tener entre 5 y 100 caracteres.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String email;
}
