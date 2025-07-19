package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.wallet.LoadCardRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.LoadCardResponseDTO; // <--- CAMBIO: Importar LoadCardResponseDTO
import com.cyberwallet.walletapi.entity.Transaction;
import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.entity.Wallet;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.TransactionRepository;
import com.cyberwallet.walletapi.repository.UserRepository;
import com.cyberwallet.walletapi.repository.WalletRepository;
import com.cyberwallet.walletapi.service.CardLoadService;
import com.cyberwallet.walletapi.validator.CardValidator; // Asegúrate de que CardValidator tenga el método getTypeFromBIN
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CardLoadServiceImpl implements CardLoadService {

    private static final Logger logger = LoggerFactory.getLogger(CardLoadServiceImpl.class);

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    private static final BigDecimal MAX_LOAD_AMOUNT = new BigDecimal("3000000");

    @Override
    @Transactional
    public ApiResponse<LoadCardResponseDTO> loadCardFunds(LoadCardRequestDTO request, Authentication authentication) { // <--- CAMBIO: Tipo de retorno
        String userEmail = authentication.getName();
        logger.debug("🚀 Iniciando proceso de carga de fondos para usuario: {}", userEmail);

        // 1️⃣ Validar BIN y formato de tarjeta
        String cardNumber = request.getCardNumber();
        logger.debug("🔍 Validando BIN y formato de tarjeta: {}", cardNumber);
        CardValidator.validateCardBIN(cardNumber); // Esto ya valida y lanza excepción si el BIN no es reconocido
        logger.debug("✅ Validación BIN PASÓ");

        // 2️⃣ Validar fecha de expiración
        logger.debug("🔍 Validando fecha de expiración: {}", request.getExpirationDate());
        CardValidator.validateExpirationDate(request.getExpirationDate());
        logger.debug("✅ Validación de fecha PASÓ");

        // 3️⃣ Validar CVV
        logger.debug("🔍 Validando CVV: {}", request.getCvv());
        if (!request.getCvv().matches("\\d{3}")) { // Mantener la validación a 3 dígitos.
            throw new BusinessException(ErrorCode.INVALID_CARD_FORMAT, "El CVV debe tener 3 dígitos.");
        }
        logger.debug("✅ Validación CVV PASÓ");

        // 4️⃣ Validar monto
        BigDecimal amount = request.getAmount();
        logger.debug("🔍 Validando monto: {}", amount);
        if (amount.compareTo(BigDecimal.valueOf(0.01)) < 0) {
            throw new BusinessException(ErrorCode.TRANSACTION_FAILED, "El monto debe ser mayor o igual a 0.01.");
        }
        if (amount.compareTo(MAX_LOAD_AMOUNT) > 0) {
            logger.debug("💥 Monto excede el límite permitido: {}", amount);
            throw new BusinessException(ErrorCode.AMOUNT_EXCEEDS_LIMIT, "El monto supera el límite permitido (3.000.000 ARS).");
        }
        logger.debug("✅ Validación monto PASÓ");

        // 5️⃣ Validar nombre del titular
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado: " + userEmail));
        String expectedName = (user.getNombre() + " " + user.getApellido()).trim();
        logger.debug("🔍 Validando nombre del titular: {}", request.getCardHolderName());
        CardValidator.validateCardHolderMatchesUserName(request.getCardHolderName(), expectedName);
        logger.debug("✅ Validación nombre PASÓ");

        // 6️⃣ Ajustar saldo y persistir
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(ErrorCode.WALLET_NOT_FOUND, "Billetera no encontrada: " + userEmail));

        BigDecimal newBalance = wallet.getBalance().add(amount);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);
        logger.debug("💰 Nuevo balance: {}", newBalance);

        // 7️⃣ Registrar transacción
        Transaction tx = Transaction.builder()
                .type("LOAD_FUNDS")
                .amount(amount)
                .counterpart("TARJETA VIRTUAL")
                .date(LocalDate.now().atStartOfDay())
                .user(user)
                .build();
        transactionRepository.save(tx);
        logger.debug("📝 Transacción registrada");

        // --- CAMBIOS PARA DEVOLVER EL TIPO DE TARJETA ---
        String cardType = CardValidator.getCardTypeFromBIN(cardNumber); // <--- NUEVO: Obtener el tipo de tarjeta del BIN

        // Construir LoadCardResponseDTO con alias, newBalance, CVU y el tipo de tarjeta
        LoadCardResponseDTO loadCardResponse = new LoadCardResponseDTO(
                wallet.getAlias(),
                newBalance,
                wallet.getCvu(), // Asegúrate de que wallet.getCvu() esté disponible
                cardType // Incluir el tipo de tarjeta
        );
        return ApiResponse.success("Fondos cargados exitosamente.", loadCardResponse); // <--- CAMBIO: Devolver LoadCardResponseDTO
    }
}
