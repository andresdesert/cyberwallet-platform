import axiosInstance from '@/api/axiosInstance';
import log from 'loglevel';

type CampoVerificable = 'email' | 'username' | 'provincia';

export const checkAvailability = async (
    field: CampoVerificable,
    value: string,
    iso2?: string
): Promise<boolean> => {
  try {
    let url = '';
    switch (field) {
      case 'email':
        url = `/validations/email/available?email=${encodeURIComponent(value)}`;
        break;
      case 'username':
        url = `/validations/username/available?username=${encodeURIComponent(value)}`;
        break;
      case 'provincia':
        if (!iso2) {
          log.warn('[AVAILABILITY] No se proporcionó ISO2 para validación de provincia');
          return false;
        }
        url = `/validations/provinces/validate?name=${encodeURIComponent(value)}&country=${iso2}`;
        break;
      default:
        log.warn(`[AVAILABILITY] Campo no soportado: ${field}`);
        return false;
    }

    const response = await axiosInstance.get(url);
    // La API devuelve { success: true, data: true/false, message: "..." }
    const result = response.data?.data ?? false;
    
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[AVAILABILITY] ${field} "${value}" disponible: ${result}`);
    }
    
    return result;
  } catch (error: unknown) {
    const apiError = error as { response?: { data?: { detail?: string } } };
    const detail = apiError?.response?.data?.detail || `Error al verificar disponibilidad de ${field}`;
    log.error(`[AVAILABILITY] Error verificando ${field}:`, detail);
    return false;
  }
};
