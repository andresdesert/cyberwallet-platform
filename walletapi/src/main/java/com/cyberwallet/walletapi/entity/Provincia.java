package com.cyberwallet.walletapi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "provincias", uniqueConstraints = @UniqueConstraint(columnNames = {"nombre", "pais_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provincia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String codigo;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "pais_id", nullable = false)
    private Pais pais;
} 