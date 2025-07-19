// src/main/java/com/cyberwallet/walletapi/repository/PaisRepository.java
package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.Pais; // Asegúrate de que esta ruta sea correcta
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {
    // Necesario para ProvinciaFallbackLoader
    Optional<Pais> findByNombreIgnoreCase(String nombre);

    // Necesario para CscProvinciaImporter
    Optional<Pais> findByNombre(String nombre);
}