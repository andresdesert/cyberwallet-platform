package com.cyberwallet.walletapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa una transacción en la billetera: puede ser depósito, retiro,
 * transferencia de entrada (TRANSFER_IN), transferencia de salida (TRANSFER_OUT) o cambio de alias.
 */
@Entity
@Table(name = "transacciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String type; // "DEPOSIT", "WITHDRAW", "TRANSFER_IN", "TRANSFER_OUT", "ALIAS_CHANGE"

    @Column(nullable = false)
    private BigDecimal amount;

    /**
     * Para transferencias, email del otro usuario (receptor o emisor).
     * En depósito/retiro o cambio de alias, puede quedar en null.
     */
    private String counterpart;

    @Column(nullable = false)
    private LocalDateTime date;

    /**
     * Relación N a 1 con User: cada transacción está asociada a un usuario.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
