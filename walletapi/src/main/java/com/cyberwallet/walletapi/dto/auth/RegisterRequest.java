package com.cyberwallet.walletapi.dto.auth;

import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "La calle no puede estar vacía.")
    @Size(min = 3, max = 100, message = "La calle debe tener entre 3 y 100 caracteres.")
    @Pattern(
            regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9'\\-\\.\\s#°ªº,]+$",
            message = "La calle debe contener solo letras, números, espacios y caracteres válidos (-, ., #, °, ª, º, ,)."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String calle; // antes: direccion

    @NotNull(message = "El número de calle es obligatorio.")
    @Min(value = 1, message = "El número debe ser mayor o igual a 1.")
    @Max(value = 9999, message = "El número no puede ser mayor a 9999.")
    private Integer numero;

    @NotNull(message = "El ID de la provincia es obligatorio.")
    @Schema(description = "ID de la provincia válida", example = "1")
    private Long provinciaId;

    @NotNull(message = "El ID del país es obligatorio.")
    @Schema(description = "ID del país válido", example = "1")
    private Long paisId;

    // Los otros campos personales siguen igual:

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(min = 2, max = 30, message = "El nombre debe tener entre 2 y 30 caracteres.")
    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ'\\-\\s]{2,30}$", message = "El nombre contiene caracteres no permitidos.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio.")
    @Size(min = 2, max = 40, message = "El apellido debe tener entre 2 y 40 caracteres.")
    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ'\\-\\s]{2,40}$", message = "El apellido contiene caracteres no permitidos.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String apellido;

    @NotBlank(message = "El DNI es obligatorio.")
    @Pattern(
            regexp = "^(?!0)[0-9]{7,8}$",
            message = "El DNI debe tener exactamente 7 u 8 dígitos, no puede comenzar con cero si tiene 8 dígitos."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String dni;

    @NotBlank(message = "La fecha de nacimiento es obligatoria.")
    @Pattern(
            regexp = "^\\d{4}-\\d{2}-\\d{2}$",
            message = "La fecha de nacimiento debe tener el formato AAAA-MM-DD."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String fechaNacimiento;

    @NotBlank(message = "El género es obligatorio.")
    @Pattern(
            regexp = "^(?i)(Masculino|Femenino|Otro|Prefiero no decirlo)$",
            message = "El género debe ser válido."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String genero;

    @NotBlank(message = "El email es obligatorio.")
    @Email(message = "El email debe tener un formato válido.")
    @Size(min = 5, max = 100, message = "El email debe tener entre 5 y 100 caracteres.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String email;

    @NotBlank(message = "El nombre de usuario es obligatorio.")
    @Size(min = 4, max = 20, message = "El nombre de usuario debe tener entre 4 y 20 caracteres.")
    @Pattern(
            regexp = "^[a-zA-Z0-9_\\-\\.]+$",
            message = "El nombre de usuario contiene caracteres no permitidos."
    )
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String username;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres.")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).+$",
            message = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
    )
    private String password;

    @NotBlank(message = "La confirmación de la contraseña es obligatoria.")
    private String confirmPassword;

    @NotBlank(message = "El teléfono es obligatorio.")
    @Pattern(
        regexp = "^(?!0)(?!15)\\d{10}$",
        message = "El teléfono debe tener exactamente 10 dígitos, no comenzar con 0 ni 15, ni contener letras, espacios o símbolos."
    )
    private String telefono;

}
