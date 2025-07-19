package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.service.DatabaseCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/test-utils")
@RequiredArgsConstructor
@Profile("test") // Solo disponible en el perfil 'test'
public class DatabaseCleanupController {

    private final DatabaseCleanupService databaseCleanupService;

    @PostMapping("/cleanup")
    public ResponseEntity<Void> cleanupDatabase() {
        databaseCleanupService.cleanDatabase();
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> cleanupDatabaseDelete() {
        databaseCleanupService.cleanDatabase();
        return ResponseEntity.noContent().build();
    }
}
