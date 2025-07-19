package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.dto.wallet.LoadCardRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.TransactionResponseDTO;
import com.cyberwallet.walletapi.dto.wallet.TransferAliasRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.WalletDetailsResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Interfaz que define los servicios de negocio para la funcionalidad de la billetera.
 */
public interface WalletService {

    /**
     * Obtiene los detalles (alias, balance) de la billetera de un usuario dado su email.
     *
     * @param userEmail Email del usuario cuya billetera se consulta.
     * @return DTO con los detalles de la billetera.
     */
    WalletDetailsResponse getWalletDetails(String userEmail);

    /**
     * Deposita un monto en la billetera de un usuario.
     *
     * @param userEmail Email del usuario que realiza el depósito.
     * @param amount    Monto a depositar (debe ser >= 0.01).
     * @return DTO con los detalles de la billetera tras el depósito.
     */
    WalletDetailsResponse depositFunds(String userEmail, BigDecimal amount);

    /**
     * Retira un monto de la billetera de un usuario.
     *
     * @param userEmail Email del usuario que realiza el retiro.
     * @param amount    Monto a retirar (debe ser >= 0.01 y menor o igual al balance).
     * @return DTO con los detalles de la billetera tras el retiro.
     */
    WalletDetailsResponse withdrawFunds(String userEmail, BigDecimal amount);

    /**
     * Transfiere un monto desde la billetera de un usuario emisor a la billetera de otro usuario por CVU.
     *
     * @param senderEmail Email del usuario que envía los fondos.
     * @param targetCvu   CVU del usuario que recibe los fondos.
     * @param amount      Monto a transferir (debe ser >= 0.01).
     * @return DTO con los detalles de la billetera del emisor tras la transferencia.
     */
    WalletDetailsResponse transferFundsByCvu(String senderEmail, String targetCvu, BigDecimal amount);

    /**
     * Transfiere un monto desde la billetera de un usuario emisor a la billetera de otro usuario por alias.
     *
     * @param senderEmail Email del usuario que envía los fondos.
     * @param requestDTO DTO con alias destino y monto.
     * @param traceId Identificador de trazabilidad para logs y auditoría.
     * @return DTO con los detalles de la billetera del emisor tras la transferencia.
     */
    WalletDetailsResponse transferByAlias(String senderEmail, TransferAliasRequestDTO requestDTO, String traceId);

    /**
     * Actualiza el alias (CVU) de la billetera de un usuario.
     *
     * @param userEmail Email del usuario que cambia el alias.
     * @param newAlias  Nuevo alias (no puede estar vacío y debe ser único).
     * @return DTO con los detalles de la billetera tras el cambio de alias.
     */
    WalletDetailsResponse updateAlias(String userEmail, String newAlias);

    String generateCvu();

    /**
     * Simula la carga de fondos mediante tarjeta virtual.
     *
     * @param userEmail  Email del usuario que realiza la carga.
     * @param requestDTO DTO con los datos de la tarjeta y el monto.
     * @return DTO con los detalles de la billetera tras la carga.
     */
    WalletDetailsResponse loadCardFunds(String userEmail, LoadCardRequestDTO requestDTO);
}
