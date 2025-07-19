// src/hooks/useProvinciasLocal.ts
import { useState, useEffect } from 'react';
import { provincesFallback } from '@/data/provincesFallback';

export interface Province {
  id: number;
  name: string;
  iso2: string;
}

type ValidCountries = 'AR' | 'BR' | 'UY';

export const useProvinciasLocal = (paisIso2?: string) => {
  const [provincias, setProvincias] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProvincias = async () => {
      if (!paisIso2?.trim()) {
        setProvincias([]);
        setLoading(false);
        console.info('🗺️ [useProvinciasLocal] País no definido. Provincias reseteadas.');
        return;
      }

      setLoading(true);
      
      // Simular pequeño delay para UX consistente
      await new Promise(resolve => setTimeout(resolve, 100));

      const countryCode = paisIso2.toUpperCase() as ValidCountries;
      
      if (!Object.keys(provincesFallback).includes(countryCode)) {
        console.warn(`🗺️ [useProvinciasLocal] País "${countryCode}" no encontrado en datos locales`);
        setProvincias([]);
        setLoading(false);
        return;
      }

      const provincesForCountry = provincesFallback[countryCode] || [];
      
      // Asegurar que todos los objetos tienen las propiedades correctas
      const validatedProvinces = provincesForCountry.map(province => ({
        id: province.id,
        name: province.name || '',  // Asegurar que name nunca sea undefined
        iso2: province.iso2 || ''
      }));
      
      setProvincias(validatedProvinces);
      setLoading(false);
      
      console.info(`🗺️ [useProvinciasLocal] Provincias cargadas para ${countryCode}:`, validatedProvinces.length);
    };

    loadProvincias();
  }, [paisIso2]);

  return {
    provincias,
    loading,
    error: null
  };
}; 