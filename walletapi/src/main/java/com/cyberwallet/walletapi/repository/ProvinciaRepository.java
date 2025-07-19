package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinciaRepository extends JpaRepository<Provincia, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCaseAndPais_NombreIgnoreCase(String provincia, String pais);
    boolean existsByIdAndPais_Id(Long provinciaId, Long paisId);
}
