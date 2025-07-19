// src/api/healthCheck.ts
import api from './axiosInstance';
import log from 'loglevel';

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const checkBackendHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await api.get<ApiResponse<HealthResponse>>('/validations/health');
    return response.data.data;
  } catch (err: unknown) {
    const apiError = err as { response?: { data?: { detail?: string } } };
    const errorMessage = apiError?.response?.data?.detail || 'Error al verificar el estado del backend';
    log.error('[HEALTH] Backend health check failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const checkApiConnectivity = async (): Promise<boolean> => {
  try {
    await api.get<ApiResponse<{ status: string }>>('/validations/health');
    return true;
  } catch (err: unknown) {
    const apiError = err as { response?: { data?: { detail?: string } } };
    const errorMessage = apiError?.response?.data?.detail || 'Error de conectividad con la API';
    log.error('[HEALTH] API connectivity check failed:', errorMessage);
    return false;
  }
};

export const getBackendStatus = async (): Promise<{ online: boolean; responseTime?: number }> => {
  const startTime = Date.now();
  
  try {
    await api.get<ApiResponse<{ status: string }>>('/validations/health');
    const responseTime = Date.now() - startTime;
    return { online: true, responseTime };
  } catch (err: unknown) {
    const apiError = err as { response?: { data?: { detail?: string } } };
    const errorMessage = apiError?.response?.data?.detail || 'Backend no disponible';
    log.error('[HEALTH] Backend status check failed:', errorMessage);
    return { online: false };
  }
};

/**
 * Verifica específicamente la conectividad con el endpoint de provincias
 */
export const checkProvincesEndpoint = async (country: string = 'AR'): Promise<{ isHealthy: boolean; message: string; data?: unknown }> => {
  try {
    const response = await api.get(`/validations/provinces/list/${country}`);
    
    if (response.status === 200 && response.data?.data) {
      const provinces = response.data.data;
      log.info(`[PROVINCES] ✅ Provincias cargadas correctamente para ${country}:`, provinces.length);
      return { 
        isHealthy: true, 
        message: `Provincias cargadas correctamente para ${country} (${provinces.length} encontradas)`,
        data: provinces 
      };
    } else {
      log.warn(`[PROVINCES] ⚠️ Respuesta inesperada para ${country}:`, response.data);
      return { isHealthy: false, message: `Respuesta inesperada para ${country}` };
    }
  } catch (error: unknown) {
    const apiError = error as { code?: string; message?: string };
    log.error(`[PROVINCES] ❌ Error al obtener provincias para ${country}:`, error);
    
    if (apiError.code === 'ECONNREFUSED') {
      return { isHealthy: false, message: 'No se puede conectar al backend para obtener provincias' };
    } else if (apiError.code === 'ECONNABORTED') {
      return { isHealthy: false, message: 'Timeout al obtener provincias' };
    } else {
      return { isHealthy: false, message: `Error al obtener provincias: ${apiError.message}` };
    }
  }
}; 