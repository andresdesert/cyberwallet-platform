package com.cyberwallet.walletapi.service;

import java.util.List;

public interface ProvinceValidationService {
    boolean isValidProvince(String countryIso2, String provinceName);
    List<String> listProvinces(String countryIso2); // ← este método es requerido por el error actual
}
