// 🛠️ UTILIDADES DE TEMA - CYBERWALLET 2025
// Funciones de ayuda y utilidades para el sistema de temas

import { Theme, alpha } from '@mui/material/styles';
import { DESIGN_TOKENS, colorUtils, glassEffect } from './designTokens';

// ===============================================
// 🎯 CONFIGURACIONES DE CONTRASTE WCAG 3.0
// ===============================================

export const contrastRatios = {
  light: {
    text: {
      high: 7.0,      // Para texto pequeño y crítico
      medium: 4.5,    // Para texto de tamaño medio
      low: 3.0        // Para texto grande y no esencial
    },
    interactive: {
      focus: 3.0,     // Para elementos interactivos en foco
      hover: 2.5,     // Para estados hover
      disabled: 2.0   // Para elementos deshabilitados
    }
  },
  dark: {
    text: {
      high: 7.0,
      medium: 4.5,
      low: 3.0
    },
    interactive: {
      focus: 3.0,
      hover: 2.5,
      disabled: 2.0
    }
  }
};

// ===============================================
// 🎨 HELPERS DE CONTRASTE Y ACCESIBILIDAD
// ===============================================

/**
 * Calcula el ratio de contraste entre dos colores
 * Útil para verificar accesibilidad WCAG
 */
export const getContrastRatio = (foreground: string, background: string): number => {
  // Función simplificada - para implementación completa se necesitaría una librería
  // de cálculo de contraste como 'contrast-ratio' o implementar el algoritmo WCAG
  
  // Extrae valores RGB de colores hex
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calcula luminancia relativa
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  if (!fg || !bg) return 1; // Fallback por si hay error

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Verifica si un contraste cumple con estándares WCAG
 */
export const isAccessible = (ratio: number, level: 'AA' | 'AAA' = 'AA'): boolean => {
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};

/**
 * Obtiene texto de contraste apropiado para un fondo dado
 */
export const getContrastText = (background: string, theme: Theme): string => {
  const relativeLuminance = getRelativeLuminance(background);
  return relativeLuminance > 0.5 ? theme.palette.common.black : theme.palette.common.white;
};

/**
 * Verifica si un color es claro
 */
export const isLightColor = (color: string): boolean => {
  return getRelativeLuminance(color) > 0.5;
};

/**
 * Función auxiliar para calcular la luminancia relativa según WCAG
 */
const getRelativeLuminance = (color: string): number => {
  // Convertir color a RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Aplicar corrección gamma
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calcular luminancia
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
};

/**
 * Función para verificar si un color cumple con WCAG AA
 */
export const meetsWCAGAA = (foreground: string, background: string): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5;
};

/**
 * Función para verificar si un color cumple con WCAG AAA
 */
export const meetsWCAGAAA = (foreground: string, background: string): boolean => {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 7;
};

// ===============================================
// 🎯 GENERADORES DE ESTILOS AVANZADOS
// ===============================================

/**
 * Genera estilos glassmorphism adaptativos
 */
export const createGlassStyle = (
  theme: Theme,
  intensity: 'subtle' | 'medium' | 'strong' = 'medium',
  customProps?: Partial<{
    borderRadius: string;
    padding: string;
    shadow: boolean;
  }>
) => {
  const mode = theme.palette.mode;
  const glass = glassEffect[intensity](mode);
  const shadows = DESIGN_TOKENS.shadows[mode];

  return {
    ...glass,
    borderRadius: customProps?.borderRadius || DESIGN_TOKENS.radius.lg,
    padding: customProps?.padding || DESIGN_TOKENS.spacing[3],
    ...(customProps?.shadow && { boxShadow: shadows.md }),
    transition: `all ${DESIGN_TOKENS.transitions.duration.normal} ${DESIGN_TOKENS.transitions.easing.inOut}`,
  };
};

/**
 * Genera efectos de neomorfismo
 */
export const createNeumorphicStyle = (
  theme: Theme,
  variant: 'raised' | 'inset' | 'flat' = 'raised',
  intensity: 'subtle' | 'medium' | 'strong' = 'medium'
) => {
  const mode = theme.palette.mode;
  const colors = DESIGN_TOKENS.colors[mode];
  
  const intensityMap = {
    subtle: { light: 0.3, dark: 0.1 },
    medium: { light: 0.5, dark: 0.15 },
    strong: { light: 0.7, dark: 0.2 }
  };

  const alpha = intensityMap[intensity][mode];

  const baseStyle = {
    backgroundColor: colors.surfaces.paper,
    borderRadius: DESIGN_TOKENS.radius.xl,
    transition: `all ${DESIGN_TOKENS.transitions.duration.normal} ${DESIGN_TOKENS.transitions.easing.inOut}`,
  };

  switch (variant) {
    case 'raised':
      return {
        ...baseStyle,
        boxShadow: mode === 'dark'
          ? `8px 8px 16px rgba(0, 0, 0, ${alpha}), -8px -8px 16px rgba(255, 255, 255, 0.05)`
          : `8px 8px 16px rgba(0, 0, 0, ${alpha}), -8px -8px 16px rgba(255, 255, 255, 0.8)`,
      };
    case 'inset':
      return {
        ...baseStyle,
        boxShadow: mode === 'dark'
          ? `inset 8px 8px 16px rgba(0, 0, 0, ${alpha}), inset -8px -8px 16px rgba(255, 255, 255, 0.05)`
          : `inset 8px 8px 16px rgba(0, 0, 0, ${alpha}), inset -8px -8px 16px rgba(255, 255, 255, 0.8)`,
      };
    case 'flat':
      return {
        ...baseStyle,
        boxShadow: 'none',
        border: `1px solid ${colors.neutral[200]}`,
      };
  }
};

/**
 * Genera gradientes dinámicos
 */
export const createGradient = (
  theme: Theme,
  type: 'primary' | 'secondary' | 'surface' | 'custom' = 'primary',
  direction: 'horizontal' | 'vertical' | 'radial' | 'diagonal' = 'diagonal',
  customColors?: [string, string]
) => {
  const mode = theme.palette.mode;

  let colors: [string, string];
  
  if (type === 'custom' && customColors) {
    colors = customColors;
  } else {
    const palette = DESIGN_TOKENS.colors[mode];
    switch (type) {
      case 'primary':
        colors = [palette.primary[500], palette.primary[600]];
        break;
      case 'secondary':
        colors = [palette.secondary[500], palette.secondary[600]];
        break;
      case 'surface':
        colors = [palette.surfaces.paper, palette.surfaces.elevated];
        break;
      default:
        colors = [palette.primary[500], palette.primary[600]];
    }
  }

  const directionMap = {
    horizontal: '90deg',
    vertical: '180deg',
    radial: 'circle',
    diagonal: '135deg'
  };

  if (direction === 'radial') {
    return `radial-gradient(${directionMap[direction]}, ${colors[0]} 0%, ${colors[1]} 100%)`;
  }

  return `linear-gradient(${directionMap[direction]}, ${colors[0]} 0%, ${colors[1]} 100%)`;
};

/**
 * Genera efectos de glow/brillo
 */
export const createGlowEffect = (
  color: string,
  intensity: 'subtle' | 'medium' | 'strong' = 'medium'
) => {
  const intensityMap = {
    subtle: { spread: 10, opacity: 0.2 },
    medium: { spread: 20, opacity: 0.4 },
    strong: { spread: 30, opacity: 0.6 }
  };

  const config = intensityMap[intensity];

  return {
    boxShadow: `0 0 ${config.spread}px ${alpha(color, config.opacity)}`,
          transition: `box-shadow ${DESIGN_TOKENS.transitions.duration.normal} ${DESIGN_TOKENS.transitions.easing.inOut}`,
  };
};

// ===============================================
// 🎭 HELPERS DE ANIMACIÓN
// ===============================================

/**
 * Crea keyframes para animaciones personalizadas
 */
export const createAnimation = {
  fadeIn: {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideUp: {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  slideLeft: {
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  scale: {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  rotate: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  }
};

/**
 * Aplica animaciones con configuración estándar
 */
export const applyAnimation = (
  animation: keyof typeof createAnimation,
  duration: keyof typeof DESIGN_TOKENS.transitions.duration = 'normal',
  easing: keyof typeof DESIGN_TOKENS.transitions.easing = 'inOut',
  delay: string = '0s'
) => ({
  animation: `${animation} ${DESIGN_TOKENS.transitions.duration[duration]} ${DESIGN_TOKENS.transitions.easing[easing]} ${delay} both`,
});

// ===============================================
// 📱 HELPERS RESPONSIVOS
// ===============================================

/**
 * Genera media queries tipadas
 */
export const mediaQuery = {
  up: (breakpoint: keyof typeof DESIGN_TOKENS.breakpoints) => 
    `@media (min-width: ${DESIGN_TOKENS.breakpoints[breakpoint]})`,
  
  down: (breakpoint: keyof typeof DESIGN_TOKENS.breakpoints) => 
    `@media (max-width: ${DESIGN_TOKENS.breakpoints[breakpoint]})`,
  
  between: (min: keyof typeof DESIGN_TOKENS.breakpoints, max: keyof typeof DESIGN_TOKENS.breakpoints) => 
    `@media (min-width: ${DESIGN_TOKENS.breakpoints[min]}) and (max-width: ${DESIGN_TOKENS.breakpoints[max]})`,
  
  only: (breakpoint: keyof typeof DESIGN_TOKENS.breakpoints) => {
    const breakpoints = Object.keys(DESIGN_TOKENS.breakpoints) as Array<keyof typeof DESIGN_TOKENS.breakpoints>;
    const currentIndex = breakpoints.indexOf(breakpoint);
    const nextBreakpoint = breakpoints[currentIndex + 1];
    
    if (nextBreakpoint) {
      return `@media (min-width: ${DESIGN_TOKENS.breakpoints[breakpoint]}) and (max-width: calc(${DESIGN_TOKENS.breakpoints[nextBreakpoint]} - 1px))`;
    }
    return `@media (min-width: ${DESIGN_TOKENS.breakpoints[breakpoint]})`;
  }
};

/**
 * Genera valores responsivos para propiedades CSS
 */
export const responsive = {
  fontSize: (base: string, scales: Partial<Record<keyof typeof DESIGN_TOKENS.breakpoints, string>>) => {
    let styles = { fontSize: base };
    
    Object.entries(scales).forEach(([breakpoint, value]) => {
      const key = breakpoint as keyof typeof DESIGN_TOKENS.breakpoints;
      styles = {
        ...styles,
        [mediaQuery.up(key)]: { fontSize: value }
      };
    });
    
    return styles;
  },
  
  spacing: (base: string, scales: Partial<Record<keyof typeof DESIGN_TOKENS.breakpoints, string>>) => {
    let styles = { padding: base };
    
    Object.entries(scales).forEach(([breakpoint, value]) => {
      const key = breakpoint as keyof typeof DESIGN_TOKENS.breakpoints;
      styles = {
        ...styles,
        [mediaQuery.up(key)]: { padding: value }
      };
    });
    
    return styles;
  }
};

// ===============================================
// 🔧 UTILIDADES GENERALES
// ===============================================

/**
 * Combina múltiples estilos condicionales
 */
export const combineStyles = (...styles: (object | undefined | null | false)[]) => {
  return styles.filter(Boolean).reduce((acc, style) => ({ ...acc, ...style }), {});
};

/**
 * Aplica estilos basados en condiciones
 */
export const conditionalStyle = (condition: boolean, trueStyle: object, falseStyle: object = {}) => {
  return condition ? trueStyle : falseStyle;
};

/**
 * Exporta todas las utilidades como objeto por defecto
 */
export const themeUtils = {
  getContrastRatio,
  isAccessible,
  getContrastText,
  isLightColor,
  meetsWCAGAA,
  meetsWCAGAAA,
  createGlassStyle,
  createNeumorphicStyle,
  createGradient,
  createGlowEffect,
  createAnimation,
  applyAnimation,
  mediaQuery,
  responsive,
  combineStyles,
  conditionalStyle,
  colorUtils,
  glassEffect,
  tokens: DESIGN_TOKENS,
  contrastRatios,
};

export default themeUtils; 