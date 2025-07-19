package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.ActivationToken;
import com.cyberwallet.walletapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivationTokenRepository extends JpaRepository<ActivationToken, UUID> {
    Optional<ActivationToken> findByToken(String token);
    Optional<ActivationToken> findByUserAndUsedFalse(User user);
}
