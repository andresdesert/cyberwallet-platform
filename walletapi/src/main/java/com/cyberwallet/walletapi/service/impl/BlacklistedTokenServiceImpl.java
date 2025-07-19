package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.entity.BlacklistedToken;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.BlacklistedTokenRepository;
import com.cyberwallet.walletapi.service.BlacklistedTokenService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Servicio para gestionar tokens JWT en lista negra (BlacklistedToken).
 * Permite bloquear tokens y consultar si están bloqueados, con logs de auditoría.
 */
@Service
@RequiredArgsConstructor
public class BlacklistedTokenServiceImpl implements BlacklistedTokenService {

    private static final Logger log = LoggerFactory.getLogger(BlacklistedTokenServiceImpl.class);

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    /**
     * Añade un token a la lista negra.
     *
     * @param token     JWT a bloquear
     * @param expiresAt Fecha de expiración del token
     */
    @Override
    @Transactional
    public void addTokenToBlacklist(String token, LocalDateTime expiresAt) {
        if (token == null || token.trim().isEmpty()) {
            log.warn("[BLACKLIST] Intento de bloquear un token nulo o vacío.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token proporcionado es nulo o vacío.");
        }

        if (token.length() > 512) {
            log.warn("[BLACKLIST] Token excede la longitud máxima: {}", token);
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token excede la longitud máxima permitida.");
        }

        BlacklistedToken blacklistedToken = BlacklistedToken.builder()
                .token(token)
                .blacklistedAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .build();

        blacklistedTokenRepository.save(blacklistedToken);
        blacklistedTokenRepository.flush(); // <-- ¡NUEVA LÍNEA CLAVE!
        log.info("[BLACKLIST] Token agregado a la lista negra: {}", token);
    }

    /**
     * Verifica si un token está en la lista negra.
     *
     * @param token JWT a verificar
     * @return true si está bloqueado, false si no
     */
    @Override
    @Transactional(readOnly = true)
    public boolean isTokenBlacklisted(String token) {
        if (token == null || token.trim().isEmpty()) {
            log.warn("[BLACKLIST] Intento de verificar un token nulo o vacío.");
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token proporcionado es nulo o vacío.");
        }

        Optional<BlacklistedToken> tokenOpt = blacklistedTokenRepository.findByToken(token);
        boolean isBlacklisted = tokenOpt.isPresent();

        if (isBlacklisted) {
            log.info("[BLACKLIST] Token está en la lista negra: {}", token);
        } else {
            log.debug("[BLACKLIST] Token no encontrado en la lista negra: {}", token);
        }

        return isBlacklisted;
    }

    /**
     * Elimina tokens expirados de la lista negra.
     */
    @Override
    @Transactional
    public void clearExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        int deletedCount = blacklistedTokenRepository.deleteByExpiresAtBefore(now);
        log.info("[BLACKLIST] Tokens expirados eliminados: {}", deletedCount);
    }
}