package com.cyberwallet.walletapi;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.cyberwallet.walletapi.repository")
@EntityScan(basePackages = {
        "com.cyberwallet.walletapi.entity",
        "com.cyberwallet.walletapi.model"  // Agregado para que reconozca DollarRateEntity
})
public class WalletapiApplication {

    private static final Logger log = LoggerFactory.getLogger(WalletapiApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(WalletapiApplication.class, args);
    }

    @PostConstruct
    public void init() {
        log.info("[BOOT] CyberWallet iniciado correctamente.");
    }

    @PreDestroy
    public void shutdown() {
        log.warn("[SHUTDOWN] CyberWallet se está apagando.");
    }
}
