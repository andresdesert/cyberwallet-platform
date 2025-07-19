package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.entity.PasswordResetToken;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.PasswordResetTokenRepository;
import com.cyberwallet.walletapi.service.PasswordResetTokenService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementación del servicio para manejar tokens de recuperación de contraseña.
 */
@Service
@RequiredArgsConstructor
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetTokenServiceImpl.class);

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    @Transactional
    public void deleteExpiredTokens(LocalDateTime now) {
        passwordResetTokenRepository.deleteByExpiresAtBefore(now);
        log.info("[RESET TOKEN] Tokens expirados eliminados hasta: {}", now);
    }

    @Override
    @Transactional
    public void markTokenAsUsed(PasswordResetToken token) {
        if (token == null) {
            log.warn("[RESET TOKEN] Intento de marcar token nulo como usado.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token proporcionado es nulo.");
        }

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
        log.info("[RESET TOKEN] Token marcado como usado: {}", token.getToken());
    }

    @Override
    @Transactional
    public PasswordResetToken save(PasswordResetToken token) {
        if (token == null || token.getToken() == null) {
            log.warn("[RESET TOKEN] Token inválido: nulo o vacío.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token no puede estar vacío.");
        }

        if (token.getToken().length() > 512) {
            log.warn("[RESET TOKEN] Token excede la longitud máxima: {} caracteres.", token.getToken().length());
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token excede la longitud máxima permitida (512 caracteres).");
        }

        // 🔎 Log estratégico para verificar el token antes de guardar
        log.debug("[RESET TOKEN] Preparando para guardar token: {}", token.getToken());

        PasswordResetToken savedToken = passwordResetTokenRepository.save(token);

        // 🔎 Log estratégico para confirmar que el token se guardó
        log.info("[RESET TOKEN] Token guardado exitosamente en la base de datos: {}", savedToken.getToken());

        return savedToken;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PasswordResetToken> findByToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            log.warn("[RESET TOKEN] Intento de buscar token nulo o vacío.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token proporcionado es nulo o vacío.");
        }

        Optional<PasswordResetToken> foundToken = passwordResetTokenRepository.findByToken(token);
        log.debug("[RESET TOKEN] Token encontrado: {}", foundToken.isPresent());
        return foundToken;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PasswordResetToken> findByUser(UUID userId) {
        if (userId == null) {
            log.warn("[RESET TOKEN] Intento de buscar tokens con ID de usuario nulo.");
            throw new BusinessException(ErrorCode.INVALID_ARGUMENT, "El ID de usuario no puede ser nulo.");
        }

        List<PasswordResetToken> tokens = passwordResetTokenRepository.findByUser_Id(userId);
        log.debug("[RESET TOKEN] Tokens encontrados para usuario {}: {}", userId, tokens.size());
        return tokens;
    }

    @Override
    @Transactional(readOnly = true)
    public PasswordResetToken validateResetToken(String token) {
        log.debug("[RESET TOKEN] Validando token: {}", token);

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> {
                    log.warn("[RESET TOKEN] Token no encontrado: {}", token);
                    return new BusinessException(ErrorCode.INVALID_TOKEN, "Token inválido o inexistente.");
                });

        if (resetToken.isUsed()) {
            log.warn("[RESET TOKEN] Token ya ha sido utilizado: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ya ha sido utilizado.");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("[RESET TOKEN] Token expirado: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ha expirado.");
        }

        log.info("[RESET TOKEN] Token válido: {}", token);
        return resetToken;
    }

    /**
     * Valida el formato del token antes de persistirlo.
     * Debe tener una longitud máxima de 512 caracteres y el formato básico JWT (3 partes).
     */
    private void validateTokenFormat(String token, boolean isJwt) {
        if (token == null || token.trim().isEmpty()) {
            log.warn("[RESET TOKEN] Token inválido: nulo o vacío.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token no puede estar vacío.");
        }

        if (token.length() > 512) {
            log.warn("[RESET TOKEN] Token excede la longitud máxima: {} caracteres.", token.length());
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token excede la longitud máxima permitida (512 caracteres).");
        }

        if (isJwt) {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                log.warn("[RESET TOKEN] Token con formato inválido: se esperaban 3 partes JWT.");
                throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token no tiene el formato JWT esperado.");
            }
        }
    }
}
