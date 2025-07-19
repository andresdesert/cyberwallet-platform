// 🎨 TEMA UNIFICADO - CYBERWALLET 2025
// Exportaciones centralizadas del sistema de temas

// 🎯 Contexto principal de tema
export { 
  UnifiedThemeProvider, 
  useUnifiedTheme,
  type ThemeMode,
  type ColorScheme,
} from '@/context/UnifiedThemeContext';

// 🎨 Design tokens y configuración
export { 
  DESIGN_TOKENS,
  colorUtils,
  glassEffect,
} from './designTokens';

// 🛠️ Utilidades y helpers
export { 
  themeUtils,
  contrastRatios,
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
  mediaQuery,
  responsive,
  combineStyles,
  conditionalStyle,
} from './themeUtils';

// 🎭 Componentes de tema
export { ThemeControls } from '@/components/theme/ThemeControls';

// 🎯 Exportación por defecto
export { default as designTokens } from './designTokens';
export { default as themeUtilities } from './themeUtils'; 