package com.cyberwallet.walletapi.service;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.dto.wallet.LoadCardRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.LoadCardResponseDTO; // <--- CAMBIO: Importar el nuevo DTO
import org.springframework.security.core.Authentication;

public interface CardLoadService {
    // CAMBIO: El tipo de retorno ahora es ApiResponse<LoadCardResponseDTO>
    ApiResponse<LoadCardResponseDTO> loadCardFunds(LoadCardRequestDTO requestDTO, Authentication authentication); //
}