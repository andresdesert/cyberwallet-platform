// src/hooks/useRouteLogger.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import log from 'loglevel'; // Import loglevel

export const useRouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    // Log route changes based on environment
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEBUG][DEV][NAVEGACIÓN] Ruta actual: ${location.pathname}${location.search}${location.hash}`);
    } else if (process.env.NODE_ENV === 'test') {
      log.info(`[INFO][TEST][NAVEGACIÓN] Ruta: ${location.pathname}`);
    } else if (process.env.NODE_ENV === 'production') {
      // In production, you might only log significant route changes or errors,
      // or simply rely on analytics. A general info log can be useful.
      log.info(`[INFO][PROD][NAVEGACIÓN] Ruta visitada.`);
    }
  }, [location]); // Depend on 'location' object for re-logging on change
};
