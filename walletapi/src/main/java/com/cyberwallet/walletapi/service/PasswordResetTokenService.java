package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.entity.PasswordResetToken;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenService {
    void deleteExpiredTokens(LocalDateTime now);

    void markTokenAsUsed(PasswordResetToken token);

    PasswordResetToken save(PasswordResetToken token);

    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findByUser(UUID userId);

    PasswordResetToken validateResetToken(String token);  // 👈 Nuevo método
}
