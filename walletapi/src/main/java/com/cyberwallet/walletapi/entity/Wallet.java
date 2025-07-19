package com.cyberwallet.walletapi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallets") // ✨ ¡Agrega esta línea!
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(unique = true, nullable = false, length = 22)
    private String cvu;

    @Column(unique = true, nullable = false, length = 20)
    private String alias;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public void setUser(User user) {
        this.user = user;
        if (user != null && user.getWallet() != this) {
            user.setWallet(this);
        }
    }
}