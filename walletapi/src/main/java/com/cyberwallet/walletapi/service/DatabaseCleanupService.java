package com.cyberwallet.walletapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class DatabaseCleanupService {

    private final EntityManager entityManager;

    @Transactional
    public void cleanDatabase() {
        entityManager.createNativeQuery("TRUNCATE TABLE transacciones CASCADE").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE password_reset_tokens CASCADE").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE activation_tokens CASCADE").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE blacklisted_tokens CASCADE").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE wallets CASCADE").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE users CASCADE").executeUpdate();
    }
}
