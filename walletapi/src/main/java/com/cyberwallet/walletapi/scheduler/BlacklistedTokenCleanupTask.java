package com.cyberwallet.walletapi.scheduler;

import com.cyberwallet.walletapi.repository.BlacklistedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class BlacklistedTokenCleanupTask {

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    /**
     * Ejecuta la limpieza cada día a las 2 AM.
     * Ajusta la cron a tu necesidad (actualmente: "0 0 2 * * *").
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        int deleted = blacklistedTokenRepository.deleteByExpiresAtBefore(now);
        log.info("[CLEANUP] Eliminados {} tokens expirados de la blacklist", deleted);
    }
}
