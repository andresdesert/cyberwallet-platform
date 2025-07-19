// src/lib/utils.ts

/**
 * Utilidad para combinar múltiples clases condicionales de forma limpia.
 * Similar a la función clsx o classNames.
 *
 * Ejemplo de uso:
 * cn('btn', isActive && 'btn-active', isDisabled && 'opacity-50')
 */

export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ');
}
