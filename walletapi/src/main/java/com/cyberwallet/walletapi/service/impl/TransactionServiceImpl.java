package com.cyberwallet.walletapi.service.impl;

import com.cyberwallet.walletapi.dto.wallet.TransactionResponseDTO;
import com.cyberwallet.walletapi.entity.Transaction;
import com.cyberwallet.walletapi.entity.User;
import com.cyberwallet.walletapi.exception.BusinessException;
import com.cyberwallet.walletapi.exception.ErrorCode;
import com.cyberwallet.walletapi.repository.TransactionRepository;
import com.cyberwallet.walletapi.repository.UserRepository;
import com.cyberwallet.walletapi.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public List<TransactionResponseDTO> getTransactionHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Usuario no encontrado: " + userEmail));

        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);

        return transactions.stream()
                .map(tx -> new TransactionResponseDTO(
                        tx.getType(),
                        tx.getAmount(),
                        tx.getCounterpart(),
                        tx.getDate()
                ))
                .collect(Collectors.toList());
    }
}
