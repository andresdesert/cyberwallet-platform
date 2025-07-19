package com.cyberwallet.walletapi.dto.wallet;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Petición para retirar fondos de la billetera del usuario autenticado.
 *
 * <p>Requiere un monto mínimo de 0.01. Validado con anotaciones de Bean Validation.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawRequestDTO {

    @NotNull(message = "El monto no puede ser nulo")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor que 0")
    @DecimalMax(value = "3000000.00", message = "El monto máximo permitido es 3 millones.")
    @Digits(integer = 10, fraction = 2, message = "El monto debe tener como máximo 2 decimales.")
    private BigDecimal amount;

}
