// src/api/checkAvailability.ts
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

interface AvailabilityResponse {
  available: boolean;
  message?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(`/validations/email/available?email=${encodeURIComponent(email)}`);
    // La API devuelve { success: true, data: true/false, message: "..." }
    return response.data.data;
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al verificar disponibilidad del email';
    log.error('[AVAILABILITY] Email check failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(`/validations/username/available?username=${encodeURIComponent(username)}`);
    // La API devuelve { success: true, data: true/false, message: "..." }
    return response.data.data;
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al verificar disponibilidad del username';
    log.error('[AVAILABILITY] Username check failed:', errorMessage);
    throw new Error(errorMessage);
  }
}; 