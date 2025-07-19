package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.dto.wallet.LoadCardRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.TransactionResponseDTO;
import com.cyberwallet.walletapi.dto.wallet.TransferAliasRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.WalletDetailsResponse;
import com.cyberwallet.walletapi.entity.Transaction;
import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.entity.Wallet;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.TransactionRepository;
import com.cyberwallet.walletapi.repository.UserRepository;
import com.cyberwallet.walletapi.repository.WalletRepository;
import com.cyberwallet.walletapi.service.AliasGeneratorService;
import com.cyberwallet.walletapi.service.WalletService;
import com.cyberwallet.walletapi.util.TransferUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WalletServiceImpl implements WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletServiceImpl.class);
    private static final BigDecimal MAX_DEPOSIT_LIMIT = new BigDecimal("3000000.00");
    private static final BigDecimal MAX_TRANSFER_LIMIT = new BigDecimal("1000000.00");
    private static final BigDecimal MAX_DAILY_LIMIT = new BigDecimal("3000000.00");
    private static final Random RANDOM = new Random();

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final AliasGeneratorService aliasGeneratorService;
    private final TransferUtils transferUtils;


    @Override
    public WalletDetailsResponse getWalletDetails(String userEmail) {
        Wallet wallet = getWalletByUserEmail(userEmail);
        log.info("[WALLET] Consulta de detalles realizada para: {}", userEmail);
        return new WalletDetailsResponse(wallet.getAlias(), wallet.getBalance(), wallet.getCvu());
    }

    @Override
    @Transactional
    public WalletDetailsResponse depositFunds(String userEmail, BigDecimal amount) {
        validateAmount(amount);
        if (amount.compareTo(MAX_DEPOSIT_LIMIT) > 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El depósito no puede superar los 3 millones.");
        }

        Wallet wallet = getWalletByUserEmail(userEmail);
        BigDecimal newBalance = wallet.getBalance().add(amount);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        registerTransaction("DEPOSIT", amount, null, wallet.getUser());
        log.info("[WALLET] Depósito realizado: {} para usuario: {}", amount, userEmail);
        return new WalletDetailsResponse(wallet.getAlias(), newBalance, wallet.getCvu());
    }

    @Override
    @Transactional
    public WalletDetailsResponse withdrawFunds(String userEmail, BigDecimal amount) {
        validateAmount(amount);
        Wallet wallet = getWalletByUserEmail(userEmail);

        validateSufficientFunds(wallet, amount);

        BigDecimal newBalance = wallet.getBalance().subtract(amount);
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        registerTransaction("WITHDRAW", amount, null, wallet.getUser());
        log.info("[WALLET] Extracción realizada: {} para usuario: {}", amount, userEmail);
        return new WalletDetailsResponse(wallet.getAlias(), newBalance, wallet.getCvu());
    }

    @Override
    @Transactional
    public WalletDetailsResponse transferFundsByCvu(String senderEmail, String targetCvu, BigDecimal amount) {
        validateAmount(amount);
        if (amount.compareTo(MAX_TRANSFER_LIMIT) > 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "La transferencia no puede superar 1 millón por operación.");
        }
        Wallet senderWallet = getWalletByUserEmail(senderEmail);
        Wallet recipientWallet = walletRepository.findByCvu(targetCvu)
                .orElseThrow(() -> new BusinessException(ErrorCode.WALLET_NOT_FOUND, "Billetera destino no encontrada para el CVU: " + targetCvu));
        if (senderWallet.getCvu().equalsIgnoreCase(targetCvu)) {
            throw new BusinessException(ErrorCode.SELF_TRANSFER, "No se puede transferir a uno mismo.");
        }
        validateSufficientFunds(senderWallet, amount);
        // Validar límite diario del emisor
        BigDecimal sentToday = transactionRepository.sumTransfersByUserAndDate(senderWallet.getUser().getId(), LocalDate.now());
        if (sentToday == null) sentToday = BigDecimal.ZERO;
        if (sentToday.add(amount).compareTo(MAX_DAILY_LIMIT) > 0) {
            throw new BusinessException(ErrorCode.AMOUNT_EXCEEDS_LIMIT, "Supera el límite diario de 3 millones en transferencias.");
        }
        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        recipientWallet.setBalance(recipientWallet.getBalance().add(amount));
        walletRepository.save(senderWallet);
        walletRepository.save(recipientWallet);
        registerTransaction("TRANSFER_OUT", amount, targetCvu, senderWallet.getUser());
        registerTransaction("TRANSFER_IN", amount, senderWallet.getCvu(), recipientWallet.getUser());
        log.info("[WALLET] Transferencia por CVU realizada: {} -> {}", senderEmail, targetCvu);
        return new WalletDetailsResponse(senderWallet.getAlias(), senderWallet.getBalance(), senderWallet.getCvu());
    }

    @Override
    @Transactional
    public WalletDetailsResponse transferByAlias(String senderEmail, TransferAliasRequestDTO requestDTO, String traceId) {
        log.debug("[TRANSFERENCIA-ALIAS] Validando monto: {}", requestDTO.getAmount());
        validateAmount(requestDTO.getAmount());
        if (requestDTO.getAmount().compareTo(MAX_TRANSFER_LIMIT) > 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "La transferencia no puede superar 1 millón por operación.");
        }
        String aliasDestino = requestDTO.getTargetAlias().trim().toLowerCase();
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Emisor no encontrado."));
        User receiver = userRepository.findByWallet_Alias(aliasDestino)
                .orElseThrow(() -> new BusinessException(ErrorCode.RECEIVER_NOT_FOUND, "No se encontró un usuario con el alias especificado."));
        if (sender.getEmail().equalsIgnoreCase(receiver.getEmail())) {
            throw new BusinessException(ErrorCode.SELF_TRANSFER, "No puedes transferirte fondos a ti mismo.");
        }
        // Validar límite diario del emisor
        BigDecimal sentToday = transactionRepository.sumTransfersByUserAndDate(sender.getId(), LocalDate.now());
        if (sentToday == null) sentToday = BigDecimal.ZERO;
        if (sentToday.add(requestDTO.getAmount()).compareTo(MAX_DAILY_LIMIT) > 0) {
            throw new BusinessException(ErrorCode.AMOUNT_EXCEEDS_LIMIT, "Supera el límite diario de 3 millones en transferencias.");
        }
        return transferUtils.executeTransfer(sender, receiver, requestDTO.getAmount(), traceId);
    }

    @Override
    public String generateCvu() {
        String cvu;
        do {
            StringBuilder cvuBuilder = new StringBuilder();
            cvuBuilder.append(RANDOM.nextInt(9) + 1);
            for (int i = 1; i < 22; i++) {
                cvuBuilder.append(RANDOM.nextInt(10));
            }
            cvu = cvuBuilder.toString();
        } while (walletRepository.existsByCvu(cvu));
        return cvu;
    }

    @Override
    @Transactional
    public WalletDetailsResponse updateAlias(String userEmail, String newAlias) {
        Wallet wallet = getWalletByUserEmail(userEmail);
        String previousAlias = wallet.getAlias();
        String previousCvu = wallet.getCvu(); // Protección
        String generatedAlias = aliasGeneratorService.generateAlias();
        validateAliasNotNullOrEmpty(generatedAlias);
        // Validar formato reforzado
        boolean formatoValido = generatedAlias.matches("^[a-z]{2,}\\.[a-z]{2,}\\.[a-z]{2,}$")
            && generatedAlias.length() >= 6 && generatedAlias.length() <= 30
            && generatedAlias.chars().filter(ch -> ch == '.').count() == 2;
        if (!formatoValido) {
            log.error("[ALIAS VALIDATION] Alias generado inválido en updateAlias: {}", generatedAlias);
            throw new BusinessException(ErrorCode.INVALID_ALIAS_FORMAT, "El alias generado no cumple el formato requerido.");
        }
        if (walletRepository.existsByAlias(generatedAlias)) {
            log.error("[ALIAS VALIDATION] Alias generado ya en uso en updateAlias: {}", generatedAlias);
            throw new BusinessException(ErrorCode.ALIAS_ALREADY_EXISTS, "El alias generado ya está en uso: " + generatedAlias);
        }
        wallet.setAlias(generatedAlias);
        // Protección: el CVU solo se asigna al crear la wallet y nunca debe ser modificado en ningún otro método.
        // No modificar wallet.setCvu() en ningún método salvo en la creación inicial.
        walletRepository.save(wallet);
        registerTransaction("ALIAS_CHANGE", BigDecimal.ZERO, null, wallet.getUser());
        log.info("[ALIAS] Alias cambiado: {} → {} para usuario: {}", previousAlias, generatedAlias, userEmail);
        return new WalletDetailsResponse(wallet.getAlias(), wallet.getBalance(), wallet.getCvu());
    }

    @Override
    @Transactional
    public WalletDetailsResponse loadCardFunds(String userEmail, LoadCardRequestDTO requestDTO) {
        Wallet wallet = getWalletByUserEmail(userEmail);

        if (!isValidCardNumber(requestDTO.getCardNumber())) {
            throw new BusinessException(ErrorCode.INVALID_CARD_NUMBER, "El número de tarjeta es inválido.");
        }

        if (isCardExpired(requestDTO.getExpirationDate())) {
            throw new BusinessException(ErrorCode.INVALID_CARD_EXPIRATION, "La tarjeta está vencida.");
        }

        BigDecimal newBalance = wallet.getBalance().add(requestDTO.getAmount());
        wallet.setBalance(newBalance);
        walletRepository.save(wallet);

        registerTransaction("LOAD_CARD", requestDTO.getAmount(), "SimulatedCard", wallet.getUser());
        log.info("[WALLET] Carga de tarjeta simulada realizada: {} para usuario: {}", requestDTO.getAmount(), userEmail);
        return new WalletDetailsResponse(wallet.getAlias(), newBalance, wallet.getCvu());
    }

    // === Métodos auxiliares ===

    private Wallet getWalletByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado: " + email));
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new BusinessException(ErrorCode.WALLET_NOT_FOUND, "Billetera no encontrada para: " + email));
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new BusinessException(ErrorCode.TRANSACTION_FAILED, "El monto no puede ser nulo.");
        }
        if (amount.compareTo(BigDecimal.valueOf(0.01)) < 0) {
            throw new BusinessException(ErrorCode.TRANSACTION_FAILED, "El monto debe ser mayor o igual a 0.01.");
        }
        String plain = amount.stripTrailingZeros().toPlainString();
        if (plain.contains("E") || plain.contains("e")) {
            throw new BusinessException(ErrorCode.TRANSACTION_FAILED, "Formato de monto inválido: no se permiten exponentes.");
        }
    }

    private void validateSufficientFunds(Wallet wallet, BigDecimal amount) {
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS,
                    "Saldo insuficiente: balance actual " + wallet.getBalance() + ", se pidió " + amount);
        }
    }

    private void registerTransaction(String type, BigDecimal amount, String counterpart, User user) {
        Transaction tx = Transaction.builder()
                .type(type)
                .amount(amount)
                .counterpart(counterpart)
                .date(LocalDateTime.now())
                .user(user)
                .build();
        transactionRepository.save(tx);
        log.debug("[WALLET] Transacción registrada: {}", tx);
    }

    private boolean isValidCardNumber(String cardNumber) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cardNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        return (sum % 10 == 0);
    }

    private boolean isCardExpired(String expirationDate) {
        String[] parts = expirationDate.split("/");
        if (parts.length != 2) {
            throw new BusinessException(ErrorCode.INVALID_CARD_EXPIRATION, "Formato de fecha de expiración inválido.");
        }

        int month = Integer.parseInt(parts[0]);
        int year = 2000 + Integer.parseInt(parts[1]);

        LocalDate expiry = LocalDate.of(year, month, 1).withDayOfMonth(1).plusMonths(1).minusDays(1);
        return expiry.isBefore(LocalDate.now());
    }

    private void validateAliasNotNullOrEmpty(String alias) {
        if (alias == null || alias.isBlank()) {
            log.error("[ALIAS VALIDATION] Alias nulo o vacío detectado.");
            throw new BusinessException(ErrorCode.INVALID_ALIAS_FORMAT, "El alias no puede ser nulo ni vacío.");
        }
    }
}
