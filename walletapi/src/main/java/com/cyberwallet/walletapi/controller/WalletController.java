package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.wallet.*;
import com.cyberwallet.walletapi.service.CardLoadService;
import com.cyberwallet.walletapi.service.WalletService;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.exception.ProblemDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import com.cyberwallet.walletapi.dto.wallet.WalletDetailsResponse;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/wallet")
@Tag(name = "Wallet", description = "Operaciones sobre la billetera digital")
public class WalletController {

    private final WalletService walletService;
    private final CardLoadService cardLoadService;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(WalletController.class);

    @Operation(summary = "Obtener detalles de la billetera", description = "Permite obtener el saldo y alias de la billetera.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Detalles de la billetera obtenidos exitosamente."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Billetera no encontrada.")
    })
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<WalletDetailsResponse>> getWalletDetails(Authentication authentication) {
        String userEmail = extractUserEmail(authentication);
        log.debug("[WALLET] Consultando detalles de billetera para: {}", userEmail);
        WalletDetailsResponse walletDetails = walletService.getWalletDetails(userEmail);
        return ResponseEntity.ok(ApiResponse.success("Detalles de la billetera obtenidos correctamente.", walletDetails));
    }

    @Operation(summary = "Depositar fondos", description = "Permite depositar un monto en la billetera del usuario.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Depósito realizado correctamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Monto inválido.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<WalletDetailsResponse>> deposit(
            Authentication authentication,
            @Valid @RequestBody DepositRequestDTO requestDTO) {
        String userEmail = extractUserEmail(authentication);
        log.info("[WALLET] Intentando depósito de ${} para: {}", requestDTO.getAmount(), userEmail);
        WalletDetailsResponse updated = walletService.depositFunds(userEmail, requestDTO.getAmount());
        return ResponseEntity.ok(ApiResponse.success("Depósito realizado correctamente.", updated));
    }

    @Operation(summary = "Retirar fondos", description = "Permite retirar un monto de la billetera del usuario.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Retiro realizado correctamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Saldo insuficiente o monto inválido.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<WalletDetailsResponse>> withdraw(
            Authentication authentication,
            @Valid @RequestBody WithdrawRequestDTO requestDTO) {
        String userEmail = extractUserEmail(authentication);
        log.info("[WALLET] Intentando retiro de ${} para: {}", requestDTO.getAmount(), userEmail);
        WalletDetailsResponse updated = walletService.withdrawFunds(userEmail, requestDTO.getAmount());
        return ResponseEntity.ok(ApiResponse.success("Retiro realizado correctamente.", updated));
    }

    @Operation(summary = "Simular carga de dinero con tarjeta", description = "Permite simular la carga de dinero a través de una tarjeta virtual.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Carga realizada correctamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de la tarjeta inválidos o expirados.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PostMapping("/load-card")
    public ResponseEntity<ApiResponse<LoadCardResponseDTO>> loadCard(
            @Valid @RequestBody LoadCardRequestDTO requestDTO,
            Authentication authentication) {
        return ResponseEntity.ok(cardLoadService.loadCardFunds(requestDTO, authentication));
    }

    @Operation(summary = "Actualizar alias de billetera", description = "Permite cambiar el alias (CVU) de la billetera del usuario.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Alias actualizado correctamente.", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Alias inválido o duplicado.", content = @Content(schema = @Schema(implementation = ProblemDetails.class)))
    })
    @PutMapping("/alias")
    public ResponseEntity<ApiResponse<Map<String, String>>> updateAlias(
            Authentication authentication,
            @Valid @RequestBody UpdateAliasRequestDTO requestDTO) {
        String userEmail = extractUserEmail(authentication);
        WalletDetailsResponse walletDetails = walletService.getWalletDetails(userEmail);
        String previousAlias = walletDetails.getAlias();
        WalletDetailsResponse updated = walletService.updateAlias(userEmail, requestDTO.getNewAlias());
        String newAlias = updated.getAlias();
        Map<String, String> aliasChange = Map.of(
            "previousAlias", previousAlias,
            "newAlias", newAlias
        );
        log.info("[ALIAS] Respuesta cambio de alias: {} → {} para usuario: {}", previousAlias, newAlias, userEmail);
        return ResponseEntity.ok(ApiResponse.success("Alias actualizado correctamente.", aliasChange));
    }

    private String extractUserEmail(Authentication authentication) {
        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser") ||
                authentication.getName() == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED_ACCESS, "No tienes permiso para acceder a este recurso.");
        }
        log.warn("[WALLET] Acceso denegado: autenticación inválida.");
        return authentication.getName();
    }
}
