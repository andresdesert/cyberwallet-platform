package com.cyberwallet.walletapi.dto.wallet;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * Respuesta que contiene información detallada de la billetera del usuario:
 * alias, balance y CVU.
 *
 * Se utiliza para devolver información al cliente tras operaciones de wallet.
 */
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class WalletDetailsResponse {

    private String alias;
    private BigDecimal balance;
    private String cvu;

    // Constructor manual con orden correcto (alias, balance, cvu)
    public WalletDetailsResponse(String alias, BigDecimal balance, String cvu) {
        this.alias = alias;
        this.balance = balance;
        this.cvu = cvu;
    }
}
