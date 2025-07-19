// src/api/auth.ts
import api from './axiosInstance';
import log from 'loglevel';

interface ApiError {
  response?: {
    status?: number;
    statusText?: string;
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  fechaNacimiento: string;
  dni: string;
  genero: string;
  telefono: string;
  calle: string;
  numero: number; // Corregido: debe ser number, no string
  provinciaId: number;
  paisId: number;
}

interface AuthenticationResponse {
  token?: string;
  accessToken?: string | null;
  tokenType?: string;
  message?: string;
  alias?: string;
  cvu?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    nombre: string;
    apellido: string;
  };
}

// 🎯 NUEVO: Interface específica para la respuesta de registro
export interface RegisterResponse {
  accessToken: string | null;
  tokenType: string;
  message: string;
  alias: string;
  cvu: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const login = async (credentials: LoginRequest): Promise<AuthenticationResponse> => {
  try {
    const response = await api.post<ApiResponse<AuthenticationResponse>>('/auth/login', credentials);
    return response.data.data;
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error en el inicio de sesión';
    log.error('[AUTH] Login failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    log.info('[AUTH] 🚀 Enviando solicitud de registro:', userData);
    const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', userData);
    log.info('[AUTH] ✅ Respuesta exitosa del backend:', response.data);
    return response.data.data;
  } catch (err: unknown) {
    log.error('[AUTH] ❌ Error en registro - Error completo:', err);
    
    const apiError = err as ApiError;
    log.error('[AUTH] ❌ Detalles del error:', {
      status: apiError.response?.status,
      statusText: apiError.response?.statusText,
      data: apiError.response?.data,
      detail: apiError.response?.data?.detail,
      message: apiError.message
    });
    
    const errorMessage = apiError.response?.data?.detail || 'Error en el registro';
    log.error('[AUTH] Register failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al solicitar restablecimiento de contraseña';
    log.error('[AUTH] Forgot password failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword });
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al restablecer la contraseña';
    log.error('[AUTH] Reset password failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await api.post<ApiResponse<void>>('/auth/change-password', { currentPassword, newPassword });
  } catch (err: unknown) {
    const apiError = err as ApiError;
    const errorMessage = apiError.response?.data?.detail || 'Error al cambiar la contraseña';
    log.error('[AUTH] Change password failed:', errorMessage);
    throw new Error(errorMessage);
  }
};
