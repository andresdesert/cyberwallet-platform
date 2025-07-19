package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.entity.Pais;
import com.cyberwallet.walletapi.entity.Provincia;

import java.util.List;
import java.util.Optional;

public interface CountryValidationService {

    boolean validateCountry(String name);

    List<String> getTopCountries();

    boolean isProvinciaValida(Long paisId, Long provinciaId);

    Optional<Pais> findPaisById(Long id);

    Optional<Provincia> findProvinciaById(Long id);
}
