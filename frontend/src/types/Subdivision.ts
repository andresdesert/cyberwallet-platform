// src/types/Subdivision.ts

/**
 * Representa una subdivisión administrativa (provincia o estado).
 */
export interface Subdivision {
  id: number;
  name: string;
  iso2: string; // Código ISO 3166-2
}
