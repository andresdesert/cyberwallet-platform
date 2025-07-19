// src/main/java/com/cyberwallet/walletapi/model/DollarRateEntity.java
package com.cyberwallet.walletapi.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "dollar_rate")
public class DollarRateEntity {
    @Id
    @Column(length = 50)
    private String nombre;

    @Column(name = "ultima_venta")
    private double ultimaVenta;
}

