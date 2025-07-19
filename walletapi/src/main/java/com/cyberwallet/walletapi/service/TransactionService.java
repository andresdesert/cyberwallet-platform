package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.dto.wallet.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {
    List<TransactionResponseDTO> getTransactionHistory(String userEmail);
}
