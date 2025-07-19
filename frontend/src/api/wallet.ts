// src/api/wallet.ts
import api from './axiosInstance';
import log from 'loglevel';

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

interface WalletDetails {
  alias: string;
  balance: number;
  cvu: string;
}

interface TransferByAliasRequest {
  targetAlias: string;
  amount: number;
}

interface TransferByCvuRequest {
  targetCvu: string;
  amount: number;
}

interface DepositRequest {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface WithdrawRequest {
  amount: number;
  cbu: string;
  bankName: string;
}

interface UpdateAliasRequest {
  newAlias: string;
}

interface LoadCardRequest {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getWalletDetails = async (): Promise<WalletDetails> => {
  try {
    const response = await api.get<ApiResponse<WalletDetails>>('/wallet/details');
    return response.data.data;
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al obtener detalles de la billetera';
    log.error('[WALLET] Get details failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const transferByAlias = async (request: TransferByAliasRequest): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/wallet/transfer/alias', request);
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al transferir por alias';
    log.error('[WALLET] Transfer by alias failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const transferByCvu = async (request: TransferByCvuRequest): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/wallet/transfer/cvu', request);
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al transferir por CVU';
    log.error('[WALLET] Transfer by CVU failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const deposit = async (request: DepositRequest): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/wallet/deposit', request);
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al realizar el depósito';
    log.error('[WALLET] Deposit failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const withdraw = async (request: WithdrawRequest): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/wallet/withdraw', request);
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al realizar el retiro';
    log.error('[WALLET] Withdraw failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const updateAlias = async (request: UpdateAliasRequest): Promise<void> => {
  try {
    await api.put<ApiResponse<void>>('/wallet/alias', request);
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al actualizar el alias';
    log.error('[WALLET] Update alias failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getTransactionHistory = async (): Promise<unknown[]> => {
  try {
    const response = await api.get<ApiResponse<unknown[]>>('/transactions/history');
    return response.data.data;
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al obtener el historial de transacciones';
    log.error('[WALLET] Get transaction history failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const getBalance = async (): Promise<number> => {
  try {
    const response = await api.get<ApiResponse<{ balance: number }>>('/wallet/balance');
    return response.data.data.balance;
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al obtener el saldo';
    log.error('[WALLET] Get balance failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Funciones adicionales que faltaban
export const depositFunds = async (request: DepositRequest): Promise<void> => {
  return deposit(request);
};

export const withdrawFunds = async (request: WithdrawRequest): Promise<void> => {
  return withdraw(request);
};

export const updateWalletAlias = async (request: UpdateAliasRequest): Promise<void> => {
  return updateAlias(request);
};

export const loadCardFunds = async (request: LoadCardRequest): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/wallet/load-card', request);
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al cargar fondos con tarjeta';
    log.error('[WALLET] Load card funds failed:', errorMessage);
    throw new Error(errorMessage);
  }
}; 