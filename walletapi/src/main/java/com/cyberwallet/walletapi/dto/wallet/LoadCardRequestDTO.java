package com.cyberwallet.walletapi.dto.wallet;

import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO que representa la solicitud para simular la carga de fondos mediante tarjeta virtual.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoadCardRequestDTO {

    @NotBlank(message = "El número de tarjeta es obligatorio.")
    @Pattern(regexp = "\\d{16}", message = "El número de tarjeta debe tener 16 dígitos.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String cardNumber;

    @NotBlank(message = "La fecha de expiración es obligatoria.")
    @Pattern(regexp = "(0[1-9]|1[0-2])/([0-9]{2})", message = "La fecha de expiración debe estar en formato MM/YY.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String expirationDate;

    @NotBlank(message = "El CVV es obligatorio.")
    @Pattern(regexp = "\\d{3,4}", message = "El CVV debe tener 3 o 4 dígitos.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String cvv;

    @NotNull(message = "El monto a cargar es obligatorio.")
    @DecimalMin(value = "1.00", inclusive = true, message = "El monto mínimo a cargar es 1.00.")
    @DecimalMax(value = "3000000.00", message = "El monto no puede superar los 3 millones.")
    private BigDecimal amount;

    @NotBlank(message = "El nombre del titular de la tarjeta es obligatorio.")
    @Size(min = 3, max = 50, message = "El nombre del titular debe tener entre 3 y 50 caracteres.")
    @Pattern(regexp = "^[A-Za-zÁÉÍÓÚáéíóúñÑ\\s'-]+$", message = "El nombre del titular contiene caracteres inválidos.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String cardHolderName;
}
