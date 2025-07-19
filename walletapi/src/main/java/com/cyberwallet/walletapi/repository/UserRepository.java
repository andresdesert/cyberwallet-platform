package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByDni(String dni);
    Optional<User> findByUsername(String username);  // 🚀 Agregado

    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
    boolean existsByUsername(String username);  // 🔥 Ya estaba

    boolean existsByWallet_Alias(String alias);

    @Modifying
    @Query("UPDATE User u SET u.deleted = true, u.status = 'ELIMINADO' WHERE u.id = :id")
    void softDeleteById(@Param("id") UUID id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.wallet WHERE u.email = :email")
    Optional<User> findByEmailWithWallet(@Param("email") String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByWallet_Alias(String alias);
}
