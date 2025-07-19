package com.cyberwallet.walletapi.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para la petición de cambio de contraseña.
 */
@Data
public class ChangePasswordRequestDTO {

    @NotBlank(message = "La contraseña actual no puede estar vacía")
    @Size(min = 8, max = 64, message = "La contraseña actual debe tener entre 8 y 64 caracteres")
    @Pattern(
            regexp = "^[^\\s]{8,64}$",
            message = "La contraseña actual no debe contener espacios."
    )
    private String currentPassword;

    @NotBlank(message = "La nueva contraseña no puede estar vacía")
    @Size(min = 8, max = 64, message = "La nueva contraseña debe tener entre 8 y 64 caracteres")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
            message = "La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
    )
    private String newPassword;

    @NotBlank(message = "La confirmación de la nueva contraseña no puede estar vacía")
    @Size(min = 8, max = 64, message = "La confirmación de la nueva contraseña debe tener entre 8 y 64 caracteres")
    private String confirmNewPassword;
}
