package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByExpiresAtBefore(LocalDateTime now);

    // 🔥 Nuevo método: Buscar tokens por ID de usuario
    List<PasswordResetToken> findByUser_Id(UUID userId);
}
