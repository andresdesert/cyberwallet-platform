package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.wallet.TransferAliasRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.TransferCvuRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.WalletDetailsResponse;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.service.WalletService;
import com.cyberwallet.walletapi.util.ResponseFactory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
@Tag(name = "Wallet", description = "Operaciones sobre la billetera digital")
public class TransferController {

    private final WalletService walletService;
    private static final Logger log = LoggerFactory.getLogger(TransferController.class);
    private static final BigDecimal MAX_TRANSFER_AMOUNT = new BigDecimal("3000000");

    @Operation(summary = "Transferir fondos por CVU", description = "Permite transferir fondos desde la wallet del usuario autenticado a la wallet de otro usuario usando CVU.")
    @PostMapping("/transfer/cvu")
    public ResponseEntity<ApiResponse<WalletDetailsResponse>> transferFundsByCvu(
            @Valid @RequestBody TransferCvuRequestDTO requestDTO,
            Authentication authentication) {

        String senderEmail = authentication.getName();
        String traceId = UUID.randomUUID().toString();

        log.info("[TRANSFERENCIA-CVU] Iniciando transferencia. TraceId: {}", traceId);
        log.debug("[TRANSFERENCIA-CVU] Sender: {}, Target CVU: {}, Amount: {}", senderEmail, requestDTO.getTargetCvu(), requestDTO.getAmount());

        validateAmount(requestDTO.getAmount());

        WalletDetailsResponse walletDetails = walletService.transferFundsByCvu(
                senderEmail,
                requestDTO.getTargetCvu(),
                requestDTO.getAmount()
        );

        log.info("[TRANSFERENCIA-CVU] Transferencia completada. TraceId: {}", traceId);

        ApiResponse<WalletDetailsResponse> response = ApiResponse.<WalletDetailsResponse>builder()
                .message("Transferencia por CVU realizada exitosamente.")
                .data(walletDetails)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Transferir fondos por Alias", description = "Permite transferir fondos a otro usuario usando su alias.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Transferencia realizada correctamente."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos o monto excedido."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuario destinatario no encontrado.")
    })
    @PostMapping("/transfer/alias")
    public ResponseEntity<ApiResponse<WalletDetailsResponse>> transferByAlias(
            @Valid @RequestBody TransferAliasRequestDTO requestDTO,
            Authentication authentication) {

        String senderEmail = authentication.getName();
        String traceId = UUID.randomUUID().toString();

        log.info("[TRANSFERENCIA-ALIAS] Iniciando transferencia. TraceID: {}, Emisor: {}, Alias destino: {}",
                traceId, senderEmail, requestDTO.getTargetAlias());

        WalletDetailsResponse updatedWallet = walletService.transferByAlias(senderEmail, requestDTO, traceId);

        log.info("[TRANSFERENCIA-ALIAS] Transferencia exitosa. TraceID: {}, Nuevo saldo: {}", traceId, updatedWallet.getBalance());

        return ResponseFactory.success("Transferencia realizada correctamente.", updatedWallet);
    }

    // 🔧 Validación de monto
    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El monto de la transferencia debe ser positivo.");
        }
        if (amount.compareTo(MAX_TRANSFER_AMOUNT) > 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El monto de la transferencia no puede superar los 3 millones.");
        }
    }
}
