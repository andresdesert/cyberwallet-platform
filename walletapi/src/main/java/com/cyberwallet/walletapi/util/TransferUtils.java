package com.cyberwallet.walletapi.util;

import com.cyberwallet.walletapi.dto.wallet.WalletDetailsResponse;
import com.cyberwallet.walletapi.entity.Transaction;
import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.entity.Wallet;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.TransactionRepository;
import com.cyberwallet.walletapi.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransferUtils {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public WalletDetailsResponse executeTransfer(User sender, User receiver, BigDecimal amount, String traceId) {
        Wallet senderWallet = sender.getWallet();
        Wallet receiverWallet = receiver.getWallet();

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS, "Saldo insuficiente.");
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        transactionRepository.save(Transaction.builder()
                .type("TRANSFER_OUT")
                .amount(amount)
                .counterpart(receiverWallet.getAlias())
                .date(LocalDateTime.now())
                .user(sender)
                .build());

        transactionRepository.save(Transaction.builder()
                .type("TRANSFER_IN")
                .amount(amount)
                .counterpart(senderWallet.getAlias())
                .date(LocalDateTime.now())
                .user(receiver)
                .build());

        log.info("[TRANSFER] Transferencia realizada correctamente. TraceId: {}", traceId);

        return new WalletDetailsResponse(senderWallet.getAlias(), senderWallet.getBalance(), senderWallet.getCvu());
    }

    public static void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El monto no puede ser nulo.");
        }
        if (amount.compareTo(BigDecimal.valueOf(0.01)) < 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El monto debe ser mayor o igual a 0.01.");
        }
        if (amount.compareTo(new BigDecimal("3000000.00")) > 0) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "El monto no puede superar los 3 millones.");
        }
        String plain = amount.stripTrailingZeros().toPlainString();
        if (plain.contains("E") || plain.contains("e")) {
            throw new BusinessException(ErrorCode.INVALID_AMOUNT, "Formato de monto inválido: no se permiten exponentes.");
        }
    }
}