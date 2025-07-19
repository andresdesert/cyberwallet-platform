// src/api/mapping.ts
import { countriesFallback } from '@/data/countriesFallback';
import { provincesFallback } from '@/data/provincesFallback';
import log from 'loglevel';

export interface LocationIds {
  paisId: number;
  provinciaId: number;
}

// 🗺️ Cache local para optimizar performance
const countryCache = new Map<string, number>();
const provinceCache = new Map<string, number>();

/**
 * 🌍 Obtiene el ID de un país por su código ISO2 usando datos locales
 * @param iso2 Código ISO2 del país (AR, BR, UY)
 * @returns ID numérico del país o null si no se encuentra
 */
export const getCountryIdByIso2 = async (iso2: string): Promise<number | null> => {
  try {
    // Normalizar entrada
    const normalizedIso2 = iso2?.trim()?.toUpperCase();
    if (!normalizedIso2 || !['AR', 'BR', 'UY'].includes(normalizedIso2)) {
      log.warn(`[MAPPING] ISO2 inválido: ${iso2}`);
      return null;
    }

    // Verificar cache primero
    if (countryCache.has(normalizedIso2)) {
      const cached = countryCache.get(normalizedIso2)!;
      log.debug(`[MAPPING] País encontrado en cache: ${normalizedIso2} -> ID ${cached}`);
      return cached;
    }

    // Buscar en datos locales
    const country = countriesFallback.find(c => c.iso2 === normalizedIso2);
    if (country) {
      log.info(`[MAPPING] ✅ País encontrado en datos locales: ${normalizedIso2} -> ID ${country.id}`);
      countryCache.set(normalizedIso2, country.id);
      return country.id;
    }

    log.error(`[MAPPING] ❌ País no encontrado: ${normalizedIso2}`);
    return null;

  } catch (error) {
    log.error(`[MAPPING] ❌ Error general al obtener ID de país:`, error);
    return null;
  }
};

/**
 * 🗺️ Obtiene el ID de una provincia por su nombre y país usando datos locales
 * @param provinceName Nombre de la provincia
 * @param countryId ID del país
 * @returns ID numérico de la provincia o null si no se encuentra
 */
export const getProvinceIdByName = async (provinceName: string, countryId: number): Promise<number | null> => {
  try {
    // Normalizar entrada
    const normalizedName = provinceName?.trim();
    if (!normalizedName || !countryId) {
      log.warn(`[MAPPING] Datos inválidos para provincia: "${provinceName}", país ID: ${countryId}`);
      return null;
    }

    // Verificar cache primero
    const cacheKey = `${countryId}:${normalizedName.toLowerCase()}`;
    if (provinceCache.has(cacheKey)) {
      const cached = provinceCache.get(cacheKey)!;
      log.debug(`[MAPPING] Provincia encontrada en cache: "${normalizedName}" -> ID ${cached}`);
      return cached;
    }

    // Mapear país ID a código ISO2
    const countryIso2 = countryId === 1 ? 'AR' : countryId === 2 ? 'BR' : countryId === 3 ? 'UY' : null;
    if (!countryIso2) {
      log.error(`[MAPPING] ❌ País ID no válido: ${countryId}`);
      return null;
    }

    // Buscar en datos locales
    const provinces = provincesFallback[countryIso2 as keyof typeof provincesFallback];
    if (!provinces) {
      log.error(`[MAPPING] ❌ No hay provincias configuradas para país: ${countryIso2}`);
      return null;
    }

    // Buscar provincia (búsqueda flexible)
    const province = provinces.find(p => 
      p.name.toLowerCase() === normalizedName.toLowerCase() ||
      p.name.toLowerCase().includes(normalizedName.toLowerCase()) ||
      normalizedName.toLowerCase().includes(p.name.toLowerCase())
    );

    if (province) {
      log.info(`[MAPPING] ✅ Provincia encontrada en datos locales: "${normalizedName}" -> ID ${province.id}`);
      provinceCache.set(cacheKey, province.id);
      return province.id;
    }

    log.error(`[MAPPING] ❌ Provincia no encontrada: "${normalizedName}" en país ID ${countryId}`);
    return null;

  } catch (error) {
    log.error(`[MAPPING] ❌ Error general al obtener ID de provincia:`, error);
    return null;
  }
};

/**
 * 🎯 Función combinada para obtener ambos IDs en una sola llamada usando datos locales
 * @param countryIso2 Código ISO2 del país
 * @param provinceName Nombre de la provincia
 * @returns Objeto con ambos IDs o null si alguno falla
 */
export const getLocationIds = async (countryIso2: string, provinceName: string): Promise<LocationIds | null> => {
  try {
    log.info(`[MAPPING] 🎯 Obteniendo IDs locales para: País "${countryIso2}", Provincia "${provinceName}"`);

    // Obtener ID del país primero
    log.info(`[MAPPING] 🔍 Buscando ID del país: ${countryIso2}`);
    const paisId = await getCountryIdByIso2(countryIso2);
    log.info(`[MAPPING] Resultado ID del país:`, paisId);
    
    if (!paisId) {
      log.error(`[MAPPING] ❌ No se pudo obtener ID del país: ${countryIso2}`);
      return null;
    }

    // Obtener ID de la provincia
    log.info(`[MAPPING] 🔍 Buscando ID de la provincia: ${provinceName} para país ID: ${paisId}`);
    const provinciaId = await getProvinceIdByName(provinceName, paisId);
    log.info(`[MAPPING] Resultado ID de la provincia:`, provinciaId);
    
    if (!provinciaId) {
      log.error(`[MAPPING] ❌ No se pudo obtener ID de la provincia: ${provinceName}`);
      return null;
    }

    log.info(`[MAPPING] ✅ IDs obtenidos exitosamente: País ID ${paisId}, Provincia ID ${provinciaId}`);
    return { paisId, provinciaId };

  } catch (error) {
    log.error(`[MAPPING] ❌ Error general al obtener IDs de ubicación:`, error);
    return null;
  }
};

/**
 * 🧹 Limpia los caches (útil para testing o refrescar datos)
 */
export const clearMappingCache = (): void => {
  countryCache.clear();
  provinceCache.clear();
  log.info(`[MAPPING] 🧹 Cache de mapeo limpiado`);
};

/**
 * 📊 Obtiene estadísticas del cache (útil para debugging)
 */
export const getMappingCacheStats = (): {countries: number, provinces: number} => {
  return {
    countries: countryCache.size,
    provinces: provinceCache.size
  };
}; 