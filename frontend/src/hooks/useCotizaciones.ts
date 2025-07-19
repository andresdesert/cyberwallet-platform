// src/hooks/useCotizaciones.ts
import { useEffect } from 'react';
import useSWR from 'swr';
import api from '@/api/axiosInstance';
import log from 'loglevel';

// 💰 Tipo de cotización esperado del backend
export interface DollarRate {
  nombre: string;
  compra: number;
  venta: number;
  change?: 'up' | 'down' | 'neutral';
}

// 🔁 Función que compara tasas nuevas con anteriores
const fetchCotizaciones = async (previous?: DollarRate[]): Promise<DollarRate[]> => {
  const env = process.env.NODE_ENV?.toUpperCase() || 'UNKNOWN';

  try {
    if (env !== 'PRODUCTION') log.debug(`[${env}] Fetch de cotizaciones iniciado...`);

    const res = await api.get('/cotizaciones');
    
    // El backend devuelve {success, message, data}
    const responseData = res.data;
    const newRates: DollarRate[] = responseData.data || [];

    if (env === 'DEVELOPMENT') log.debug(`[${env}] Cotizaciones crudas recibidas:`, responseData);

    // Verificar que newRates sea un array
    if (!Array.isArray(newRates)) {
      log.error(`[${env}] Error: newRates no es un array:`, newRates);
      return [];
    }

    // 📊 Comparar con tasas anteriores (si existen)
    const ratesWithChange = newRates.map((newRate, i) => {
      const oldRate = previous?.[i];
      let change: DollarRate['change'] = 'neutral';

      if (oldRate) {
        if (newRate.venta > oldRate.venta) change = 'up';
        else if (newRate.venta < oldRate.venta) change = 'down';
      }

      return { ...newRate, change };
    });

    if (env !== 'PRODUCTION') log.info(`[${env}] Cotizaciones procesadas con cambio de tendencia.`);

    return ratesWithChange;
  } catch (err: unknown) {
    const apiError = err as { response?: { status?: number; data?: { detail?: string } }; message?: string };
    const status = apiError?.response?.status;
    const detail = apiError?.response?.data?.detail || apiError?.message || 'Error desconocido al obtener cotizaciones';
    log.error(`[${env}] Error al obtener cotizaciones (${status}): ${detail}`);
    throw err;
  }
};

// 🪝 Hook personalizado para usar cotizaciones con SWR
export const useCotizaciones = () => {
  // 💾 Almacena temporalmente las tasas anteriores para comparar en el próximo fetch
  let previousRates: DollarRate[] | undefined = undefined;

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<DollarRate[]>(
      'cotizaciones',
      () => fetchCotizaciones(previousRates),
      {
        refreshInterval: 30000, // cada 30 segundos
        revalidateOnFocus: true,
        onSuccess: (data) => {
          previousRates = data;
          if (process.env.NODE_ENV === 'development') {
            log.debug('[useCotizaciones] Cotizaciones SWR actualizadas:', data);
          }
        },
        onError: (err) => {
          log.error('[useCotizaciones] Falló SWR:', err);
        },
      }
  );

  // Logging adicional
  useEffect(() => {
    if (isLoading && process.env.NODE_ENV === 'development') {
      log.debug('[useCotizaciones] Cargando cotizaciones...');
    }
  }, [isLoading]);

  return {
    cotizaciones: data ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
};
