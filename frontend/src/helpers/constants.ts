// src/helpers/constants.ts

import log from "loglevel";

/**
 * Mapeo de países soportados a su código ISO2. Usado para validaciones y llamadas al backend.
 * Todas las claves deben estar en formato Title Case (ej: "Argentina", "Brasil").
 */
export const countryToIso2: Record<string, string> = {
  Argentina: "AR",
  Brasil: "BR",
  Uruguay: "UY",
} as const;

/**
 * Lista de códigos ISO2 válidos/soportados para validación directa
 */
export const validIso2Codes: string[] = Object.values(countryToIso2);

/**
 * Mapeo inverso: ISO2 -> Nombre del país
 */
export const iso2ToCountry: Record<string, string> = Object.fromEntries(
  Object.entries(countryToIso2).map(([name, iso2]) => [iso2, name])
);

/**
 * Lista derivada y ordenada de países soportados (para dropdowns, etc.)
 */
export const availableCountries: string[] = Object.keys(countryToIso2).sort();

/**
 * Valida si un código ISO2 es soportado
 */
export const isValidIso2 = (iso2: string): boolean => {
  return validIso2Codes.includes(iso2?.toUpperCase());
};

/**
 * Devuelve el código ISO2 normalizado desde el nombre de país.
 * Si no se encuentra, devuelve `undefined` y loggea un warning.
 */
export const getIso2FromCountry = (input: string): string | undefined => {
  const normalized = input.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const match = Object.entries(countryToIso2).find(([name]) => {
    const clean = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return clean === normalized;
  });

  if (!match) {
    log.warn(`[WARN][constants] País no soportado: "${input}". No se pudo mapear a ISO2.`);
    return undefined;
  }

  return match[1];
};
