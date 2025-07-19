package com.cyberwallet.walletapi.dto.wallet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.cyberwallet.walletapi.util.GenericNormalizerDeserializer;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransferAliasRequestDTO {

    @NotBlank(message = "El alias destino no puede estar vacío.")
    @JsonDeserialize(using = GenericNormalizerDeserializer.class)
    private String targetAlias;

    @NotNull(message = "El monto no puede ser nulo.")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0.")
    @DecimalMax(value = "3000000.00", message = "El monto máximo permitido es 3 millones.")
    @Digits(integer = 10, fraction = 2, message = "El monto debe tener como máximo 2 decimales.")
    private BigDecimal amount;
}
