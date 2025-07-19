package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    Optional<Wallet> findByUser_Email(String email);
    Optional<Wallet> findByAlias(String alias);
    boolean existsByAlias(String alias);
    Optional<Wallet> findByUser(com.cyberwallet.walletapi.entity.User user);
    Optional<Wallet> findByCvu(String cvu); // <--- CAMBIO: Nuevo método para buscar por CVU
    boolean existsByCvu(String cvu); // Opcional, pero bueno tenerlo si lo necesitas para otras validaciones de unicidad
}