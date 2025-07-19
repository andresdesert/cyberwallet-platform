package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.entity.ActivationToken;
import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.ActivationTokenRepository;
import com.cyberwallet.walletapi.service.ActivationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivationTokenServiceImpl implements ActivationTokenService {

    private final ActivationTokenRepository activationTokenRepository;

    private static final String ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int TOKEN_LENGTH = 6;
    private static final int EXPIRATION_MINUTES = 30;

    private String generateToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(TOKEN_LENGTH);
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            sb.append(ALPHANUM.charAt(random.nextInt(ALPHANUM.length())));
        }
        return sb.toString();
    }

    @Override
    @Transactional
    public ActivationToken generateAndSaveTokenForUser(User user) {
        activationTokenRepository.findByUserAndUsedFalse(user).ifPresent(token -> {
            token.setUsed(true);
            activationTokenRepository.save(token);
        });

        String tokenStr = generateToken();
        ActivationToken token = ActivationToken.builder()
                .user(user)
                .token(tokenStr)
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
                .used(false)
                .build();

        ActivationToken savedToken = activationTokenRepository.save(token);
        activationTokenRepository.flush(); // <-- Asegura sincronización inmediata

        return savedToken;
    }

    @Override
    public ActivationToken getValidToken(String token) {
        ActivationToken foundToken = activationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN, "El token no existe"));

        if (foundToken.isUsed()) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ya ha sido utilizado");
        }

        if (foundToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "El token ha expirado");
        }

        return foundToken;
    }

    @Override
    @Transactional
    public void markTokenAsUsed(ActivationToken token) {
        token.setUsed(true);
        activationTokenRepository.save(token);
    }
}
