// src/main/java/com/cyberwallet/walletapi/repository/DollarRateRepository.java
package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.model.DollarRateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DollarRateRepository extends JpaRepository<DollarRateEntity, String> {
}
