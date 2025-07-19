// src/hooks/useCountriesLocal.ts
import { useState, useEffect } from 'react';
import { countriesFallback } from '@/data/countriesFallback';

export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

export const useCountriesLocal = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga async para consistencia de UX
    const loadCountries = async () => {
      setLoading(true);
      
      // Simular pequeño delay para UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setCountries(countriesFallback);
      setLoading(false);
      
      console.info('🌍 [useCountriesLocal] Países cargados desde datos locales:', countriesFallback.length);
    };

    loadCountries();
  }, []);

  return {
    countries,
    loading,
    error: null
  };
}; 