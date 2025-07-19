package com.cyberwallet.walletapi.dto.wallet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO que representa una transacción individual:
 * puede ser depósito, retiro o transferencia.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {

    /**
     * Tipo de transacción: "DEPOSIT", "WITHDRAW", "TRANSFER_IN", "TRANSFER_OUT", etc.
     */
    private String type;

    /**
     * Monto asociado a la transacción.
     */
    private BigDecimal amount;

    /**
     * Para transferencias: alias o email del otro usuario (emisor o receptor).
     * Para depósito/retiro puede ser nulo o vacío.
     */
    private String counterpart;

    /**
     * Fecha y hora en que se realizó la transacción.
     */
    private LocalDateTime date;
}
