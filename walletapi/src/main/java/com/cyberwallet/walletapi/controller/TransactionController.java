package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.wallet.TransactionResponseDTO;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Operaciones sobre el historial de transacciones.")
public class TransactionController {

    private final TransactionService transactionService;
    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

    @Operation(summary = "Obtener historial de transacciones", description = "Permite obtener el historial de transacciones del usuario autenticado.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Historial obtenido correctamente."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuario no encontrado.")
    })
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<TransactionResponseDTO>>> getTransactionHistory(Authentication authentication) {
        String userEmail = authentication.getName();
        log.debug("[TRANSACTION] Iniciando obtención de historial para usuario: {}", userEmail);

        if (userEmail == null || userEmail.isBlank()) {
            log.warn("[TRANSACTION] Usuario autenticado no tiene email válido.");
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS, "No se pudo identificar al usuario autenticado.");
        }

        List<TransactionResponseDTO> history = transactionService.getTransactionHistory(userEmail);
        log.info("[TRANSACTION] Historial obtenido. Total de transacciones: {}", history.size());

        ApiResponse<List<TransactionResponseDTO>> response = ApiResponse.<List<TransactionResponseDTO>>builder()
                .message("Historial obtenido correctamente.")
                .data(history)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
