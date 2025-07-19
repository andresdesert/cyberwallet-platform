package com.cyberwallet.walletapi.dto.wallet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * DTO para la respuesta de carga de fondos, extendiendo WalletDetailsResponse.
 * Incluye el tipo de tarjeta utilizada (Visa, Mastercard, Amex, etc.).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LoadCardResponseDTO extends WalletDetailsResponse {
    private String cardType; // "VISA", "MASTERCARD", "AMEX"

    // Constructor que incluye los campos de la clase padre y los propios
    public LoadCardResponseDTO(String alias, BigDecimal balance, String cvu, String cardType) {
        super(alias, balance, cvu);
        this.cardType = cardType;
    }
}