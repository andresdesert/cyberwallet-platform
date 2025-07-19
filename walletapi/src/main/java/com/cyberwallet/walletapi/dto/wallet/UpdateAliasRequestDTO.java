package com.cyberwallet.walletapi.dto.wallet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;

/**
 * DTO para actualizar el alias de la billetera del usuario autenticado.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAliasRequestDTO {

    @NotBlank(message = "El alias no puede estar vacío.")
    @Size(min = 6, max = 30, message = "El alias debe tener entre 6 y 30 caracteres.")
    @Pattern(regexp = "^[a-zA-Z0-9.-]+$", message = "El alias solo puede contener letras, números, puntos y guiones.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String newAlias;
}
