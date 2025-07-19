// src/components/auth/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import log from 'loglevel';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const ENV = process.env.NODE_ENV ?? 'production';

// Cache del último token validado para evitar validaciones excesivas
let lastValidatedToken: string | null = null;
let lastValidationTime = 0;
const VALIDATION_INTERVAL = 30000; // Solo validar cada 30 segundos

// Valida si el token JWT tiene una expiración válida
const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    if (ENV === 'development' || ENV === 'test') {
      log.info('[INFO][DEV/TEST][auth] No hay token presente en localStorage para validar.');
    }
    return false;
  }

  // Usar cache para evitar validaciones excesivas
  const now = Date.now();
  if (token === lastValidatedToken && (now - lastValidationTime) < VALIDATION_INTERVAL) {
    return true; // Token válido en cache
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const nowInSeconds = Math.floor(now / 1000);

    if (payload.exp) {
      // Agregar margen de 5 minutos para evitar desconexiones por latencia
      const timeUntilExpiry = payload.exp - nowInSeconds;
      const isValid = timeUntilExpiry > 300; // 5 minutos de margen
      
      if (ENV === 'development') {
        const minutesLeft = Math.floor(timeUntilExpiry / 60);
        log.debug(`[DEBUG][DEV][auth] Token expira en ${minutesLeft} minutos | válido: ${isValid}`);
      }
      
      // Actualizar cache solo si es válido
      if (isValid) {
        lastValidatedToken = token;
        lastValidationTime = now;
      }
      
      return isValid;
    }

    // Token sin expiración (en desarrollo), permitir
    if (ENV === 'development' || ENV === 'test') {
      log.warn('[WARN][DEV/TEST][auth] Token no contiene campo "exp", se permite por retrocompatibilidad.');
      lastValidatedToken = token;
      lastValidationTime = now;
      return true;
    }
    
    // En producción, requerir campo exp
    return false;

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    if (ENV === 'development' || ENV === 'test') {
      log.error(`[ERROR][${ENV.toUpperCase()}][auth] Token inválido o corrupto durante la validación:`, e);
    } else if (ENV === 'production') {
      log.error(`[ERROR][PROD][auth] Error crítico al validar token: ${errorMessage}`);
    }
    
    // Limpiar cache en caso de error
    lastValidatedToken = null;
    lastValidationTime = 0;
    return false;
  }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!isTokenValid(token)) {
    if (ENV === 'development' || ENV === 'test') {
      log.warn(`[WARN][${ENV.toUpperCase()}][auth] Token inválido o expirado. Redirigiendo a /login desde: ${location.pathname}`);
    } else if (ENV === 'production') {
      log.info('[INFO][PROD][auth] Sesión expirada o token inválido. Redirigiendo a login.');
    }
    localStorage.removeItem('token');
    localStorage.setItem('sessionExpired', '1');

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (ENV === 'development' || ENV === 'test') {
    log.info(`[INFO][${ENV.toUpperCase()}][auth] Acceso permitido a ruta protegida: ${location.pathname}`);
  } else if (ENV === 'production') {
    log.debug('[DEBUG][PROD][auth] Acceso a ruta protegida.');
  }

  return <>{children}</>;
};

export default PrivateRoute;
