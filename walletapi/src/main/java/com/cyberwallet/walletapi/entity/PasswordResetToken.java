package com.cyberwallet.walletapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad que representa un token de restablecimiento de contraseña asociado a un usuario.
 * Se utiliza para validar el flujo de recuperación de contraseña.
 *
 * <p>
 * 🔐 NOTA: La validación de longitud y formato del token debe realizarse en la capa de servicio.
 * La longitud máxima del campo token es de 512 caracteres.
 * </p>
 */
@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 512)
    private String token;  // Token JWT seguro. Validación de longitud en capa de servicio.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used;
}
