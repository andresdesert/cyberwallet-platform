// src/hooks/useLogin.ts
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axiosInstance';
import log from 'loglevel'; // Import loglevel

// The interfaces are not used directly in this hook, but good for reference.
// interface LoginRequest {
//   usernameOrEmail: string;
//   password: string;
// }

// interface LoginResponse {
//   token: string;
//   alias: string;
//   email: string;
// }

export const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doLogin = async ({ usernameOrEmail, password }: { usernameOrEmail: string; password: string }) => {
    setLoading(true);
    setError(null);

    if (process.env.NODE_ENV === 'development') {
      log.info(`[INFO][DEV][useLogin] Intentando iniciar sesión para: ${usernameOrEmail}`);
    } else if (process.env.NODE_ENV === 'test') {
      log.debug(`[DEBUG][TEST][useLogin] Proceso de login iniciado para: ${usernameOrEmail}`);
    }

    try {
      const response = await api.post('/auth/login', {
        emailOrUsername: usernameOrEmail,
        password,
      });
      
      // Log detallado de la respuesta para debugging
      if (process.env.NODE_ENV === 'development') {
        log.debug(`[DEBUG][DEV][useLogin] Respuesta completa del backend:`, response.data);
        log.debug(`[DEBUG][DEV][useLogin] Estructura de response.data:`, {
          hasData: !!response.data,
          hasDataData: !!response.data?.data,
          dataKeys: response.data?.data ? Object.keys(response.data.data) : 'no data',
          success: response.data?.success,
          message: response.data?.message
        });
      }
      
      // Verificar que la respuesta tenga la estructura esperada
      if (!response.data?.data) {
        throw new Error('Respuesta del backend no tiene la estructura esperada');
      }
      
      // El backend puede devolver { success, message, data: { token/accessToken, alias, cvu, message, tokenType } }
      const { token, accessToken, alias, cvu } = response.data.data;
      
      // Usar token o accessToken, dependiendo de cuál esté presente
      const authToken = token || accessToken;
      
      if (process.env.NODE_ENV === 'development') {
        log.debug(`[DEBUG][DEV][useLogin] Datos extraídos: token=${authToken ? 'presente' : 'ausente'}, alias=${alias}, cvu=${cvu}`);
      }
      
      // Verificar que el token esté presente
      if (!authToken) {
        throw new Error('Token de acceso no encontrado en la respuesta');
      }
      
      login({ token: authToken, alias, email: usernameOrEmail });

      if (process.env.NODE_ENV === 'development') {
        log.debug(`[DEBUG][DEV][useLogin] Inicio de sesión exitoso para: ${usernameOrEmail}. Token (parcial): ${accessToken.slice(0, 10)}...`);
      } else if (process.env.NODE_ENV === 'test') {
        log.info(`[INFO][TEST][useLogin] Usuario ${usernameOrEmail} autenticado con éxito.`);
      } else if (process.env.NODE_ENV === 'production') {
        log.info('[INFO][PROD][useLogin] Inicio de sesión exitoso.');
      }
      return true;
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { detail?: string; message?: string }; status?: number }; message?: string };
      const msg =
        apiError?.response?.data?.detail ||
        apiError?.response?.data?.message ||
        apiError?.message ||
        'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      setError(msg);

      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        log.error(`[ERROR][${process.env.NODE_ENV.toUpperCase()}][useLogin] Fallo en el inicio de sesión para ${usernameOrEmail}:`, {
          status: apiError?.response?.status,
          detail: apiError?.response?.data?.detail,
          message: apiError?.message,
          fullError: error,
          responseData: apiError?.response?.data,
          errorType: typeof error,
          errorKeys: error ? Object.keys(error) : 'no error object',
          stack: error instanceof Error ? error.stack : 'no stack'
        });
      } else if (process.env.NODE_ENV === 'production') {
        log.error(`[ERROR][PROD][useLogin] Error crítico en el inicio de sesión: ${msg}`);
      }
      return false;
    } finally {
      setLoading(false);
      if (process.env.NODE_ENV === 'development') {
        log.debug(`[DEBUG][DEV][useLogin] Proceso de login finalizado para ${usernameOrEmail}.`);
      }
    }
  };

  return { doLogin, error, loading };
};
