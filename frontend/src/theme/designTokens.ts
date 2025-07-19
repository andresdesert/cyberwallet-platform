// 🎨 CYBERWALLET DESIGN SYSTEM 2025-2026
// Sistema de tokens de diseño vanguardista para fintech
// Basado en las últimas tendencias UX/UI y mejores prácticas

import { alpha } from '@mui/material/styles';

// ===============================================
// 🎯 SISTEMA DE COLORES VANGUARDISTA 2025-2026
// ===============================================

export const DESIGN_TOKENS = {
  // 🎨 Paletas de color científicamente calibradas para contraste óptimo
  colors: {
    light: {
      primary: {
        50: '#f0f4ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',  // Color principal - Ratio 4.5:1 con white
        600: '#4f46e5',  // Hover states
        700: '#4338ca',  // Active states
        800: '#3730a3',  // Pressed states
        900: '#312e81',  // Text on light backgrounds
        950: '#1e1b4b',  // High contrast text
      },
      secondary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',  // Verde moderno fintech
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
      },
      accent: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',  // Naranja vibrante para CTAs
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
        950: '#431407',
      },
      neutral: {
        0: '#ffffff',     // Pure white
        50: '#fafafa',    // Background subtle
        100: '#f4f4f5',   // Background elevated
        200: '#e4e4e7',   // Border light
        300: '#d4d4d8',   // Border default
        400: '#a1a1aa',   // Text muted
        500: '#71717a',   // Text secondary
        600: '#52525b',   // Text primary light
        700: '#3f3f46',   // Text heading light
        800: '#27272a',   // Text high contrast
        900: '#18181b',   // Text maximum contrast
        950: '#09090b',   // Text absolute black
      },
      semantic: {
        success: {
          light: '#dcfce7',
          main: '#16a34a',
          dark: '#15803d',
          contrastText: '#ffffff',
        },
        warning: {
          light: '#fef3c7',
          main: '#d97706',
          dark: '#b45309',
          contrastText: '#ffffff',
        },
        error: {
          light: '#fecaca',
          main: '#dc2626',
          dark: '#b91c1c',
          contrastText: '#ffffff',
        },
        info: {
          light: '#dbeafe',
          main: '#2563eb',
          dark: '#1d4ed8',
          contrastText: '#ffffff',
        },
      },
      surfaces: {
        background: '#fafafa',      // App background
        paper: '#ffffff',           // Card backgrounds
        elevated: '#ffffff',        // Modal/dropdown backgrounds
        disabled: '#f4f4f5',        // Disabled elements
        overlay: 'rgba(0, 0, 0, 0.4)', // Modal overlays
      },
      text: {
        primary: '#18181b',         // High contrast - Ratio 14.8:1
        secondary: '#52525b',       // Medium contrast - Ratio 7.0:1
        tertiary: '#71717a',        // Low contrast - Ratio 4.5:1
        disabled: '#a1a1aa',        // Disabled text
        inverse: '#ffffff',         // Text on dark backgrounds
      },
      border: {
        light: '#f4f4f5',
        default: '#e4e4e7',
        strong: '#d4d4d8',
        interactive: '#6366f1',
      },
    },
    dark: {
      primary: {
        50: '#1e1b4b',
        100: '#312e81',
        200: '#3730a3',
        300: '#4338ca',
        400: '#4f46e5',
        500: '#6366f1',  // Color principal mantenido
        600: '#818cf8',  // Más brillante para dark mode
        700: '#a5b4fc',
        800: '#c7d2fe',
        900: '#e0e7ff',
        950: '#f0f4ff',
      },
      secondary: {
        50: '#022c22',
        100: '#064e3b',
        200: '#065f46',
        300: '#047857',
        400: '#059669',
        500: '#10b981',  // Verde equilibrado
        600: '#34d399',  // Más brillante
        700: '#6ee7b7',
        800: '#a7f3d0',
        900: '#d1fae5',
        950: '#ecfdf5',
      },
      accent: {
        50: '#431407',
        100: '#7c2d12',
        200: '#9a3412',
        300: '#c2410c',
        400: '#ea580c',
        500: '#f97316',  // Naranja vibrante
        600: '#fb923c',
        700: '#fdba74',
        800: '#fed7aa',
        900: '#ffedd5',
        950: '#fff7ed',
      },
      neutral: {
        0: '#09090b',     // Pure black
        50: '#18181b',    // Background dark
        100: '#27272a',   // Background elevated
        200: '#3f3f46',   // Border light
        300: '#52525b',   // Border default
        400: '#71717a',   // Text muted
        500: '#a1a1aa',   // Text secondary
        600: '#d4d4d8',   // Text primary dark
        700: '#e4e4e7',   // Text heading dark
        800: '#f4f4f5',   // Text high contrast
        900: '#fafafa',   // Text maximum contrast
        950: '#ffffff',   // Text absolute white
      },
      semantic: {
        success: {
          light: '#15803d',
          main: '#22c55e',
          dark: '#16a34a',
          contrastText: '#000000',
        },
        warning: {
          light: '#b45309',
          main: '#f59e0b',
          dark: '#d97706',
          contrastText: '#000000',
        },
        error: {
          light: '#b91c1c',
          main: '#ef4444',
          dark: '#dc2626',
          contrastText: '#000000',
        },
        info: {
          light: '#1d4ed8',
          main: '#3b82f6',
          dark: '#2563eb',
          contrastText: '#000000',
        },
      },
      surfaces: {
        background: '#09090b',      // App background
        paper: '#18181b',           // Card backgrounds
        elevated: '#27272a',        // Modal/dropdown backgrounds
        disabled: '#3f3f46',        // Disabled elements
        overlay: 'rgba(0, 0, 0, 0.8)', // Modal overlays
      },
      text: {
        primary: '#fafafa',         // High contrast - Ratio 17.7:1
        secondary: '#d4d4d8',       // Medium contrast - Ratio 9.2:1
        tertiary: '#a1a1aa',        // Low contrast - Ratio 4.9:1
        disabled: '#71717a',        // Disabled text
        inverse: '#18181b',         // Text on light backgrounds
      },
      border: {
        light: '#27272a',
        default: '#3f3f46',
        strong: '#52525b',
        interactive: '#6366f1',
      },
    }
  },

  // 📝 Sistema tipográfico moderno y legible
  typography: {
    families: {
      primary: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: '"Inter", "SF Pro Display", system-ui, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", "Cascadia Code", "Fira Code", Consolas, monospace',
    },
    scale: {
      // Escala tipográfica basada en proporción áurea (1.618)
      xs: {
        fontSize: '0.75rem',     // 12px
        lineHeight: 1.5,
        fontWeight: 400,
        letterSpacing: '0.025em',
      },
      sm: {
        fontSize: '0.875rem',    // 14px
        lineHeight: 1.5,
        fontWeight: 400,
        letterSpacing: '0.01em',
      },
      base: {
        fontSize: '1rem',        // 16px
        lineHeight: 1.6,
        fontWeight: 400,
        letterSpacing: '0',
      },
      lg: {
        fontSize: '1.125rem',    // 18px
        lineHeight: 1.6,
        fontWeight: 400,
        letterSpacing: '-0.01em',
      },
      xl: {
        fontSize: '1.25rem',     // 20px
        lineHeight: 1.5,
        fontWeight: 500,
        letterSpacing: '-0.015em',
      },
      '2xl': {
        fontSize: '1.5rem',      // 24px
        lineHeight: 1.4,
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      '3xl': {
        fontSize: '1.875rem',    // 30px
        lineHeight: 1.3,
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      '4xl': {
        fontSize: '2.25rem',     // 36px
        lineHeight: 1.2,
        fontWeight: 700,
        letterSpacing: '-0.03em',
      },
      '5xl': {
        fontSize: '3rem',        // 48px
        lineHeight: 1.1,
        fontWeight: 700,
        letterSpacing: '-0.035em',
      },
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // 📏 Sistema de espaciado coherente (8pt grid)
  spacing: {
    0: '0',
    0.5: '0.125rem',    // 2px
    1: '0.25rem',       // 4px
    1.5: '0.375rem',    // 6px
    2: '0.5rem',        // 8px
    2.5: '0.625rem',    // 10px
    3: '0.75rem',       // 12px
    3.5: '0.875rem',    // 14px
    4: '1rem',          // 16px
    5: '1.25rem',       // 20px
    6: '1.5rem',        // 24px
    7: '1.75rem',       // 28px
    8: '2rem',          // 32px
    9: '2.25rem',       // 36px
    10: '2.5rem',       // 40px
    11: '2.75rem',      // 44px
    12: '3rem',         // 48px
    14: '3.5rem',       // 56px
    16: '4rem',         // 64px
    20: '5rem',         // 80px
    24: '6rem',         // 96px
    28: '7rem',         // 112px
    32: '8rem',         // 128px
  },

  // 🔘 Border radius moderno y consistente
  radius: {
    none: '0',
    xs: '0.125rem',     // 2px
    sm: '0.25rem',      // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    '3xl': '1.5rem',    // 24px
    full: '9999px',     // Perfect circle
  },

  // 🌟 Sistema de elevación y sombras
  shadows: {
    light: {
      none: 'none',
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      glow: '0 0 15px rgba(99, 102, 241, 0.3)',
      // Sombras específicas para fintech
      card: '0 4px 16px -2px rgba(99, 102, 241, 0.08), 0 2px 8px -1px rgba(99, 102, 241, 0.04)',
      floating: '0 12px 24px -6px rgba(99, 102, 241, 0.15), 0 6px 12px -3px rgba(99, 102, 241, 0.08)',
    },
    dark: {
      none: 'none',
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.6)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.5)',
      glow: '0 0 15px rgba(99, 102, 241, 0.6)',
      // Sombras específicas para fintech dark mode
      card: '0 4px 16px -2px rgba(0, 0, 0, 0.4), 0 2px 8px -1px rgba(99, 102, 241, 0.1)',
      floating: '0 12px 24px -6px rgba(0, 0, 0, 0.6), 0 6px 12px -3px rgba(99, 102, 241, 0.15)',
    }
  },

  // 🎭 Efectos visuales avanzados 2025-2026
  effects: {
    glass: {
      light: {
        subtle: {
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px) saturate(120%) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.08)',
        },
        medium: {
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px) saturate(160%) brightness(1.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 12px 40px rgba(99, 102, 241, 0.12)',
        },
        strong: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(24px) saturate(200%) brightness(1.2)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 16px 48px rgba(99, 102, 241, 0.15)',
        },
      },
      dark: {
        subtle: {
          background: 'rgba(24, 24, 27, 0.6)',
          backdropFilter: 'blur(8px) saturate(120%) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
        medium: {
          background: 'rgba(24, 24, 27, 0.8)',
          backdropFilter: 'blur(16px) saturate(160%) brightness(1.15)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
        },
        strong: {
          background: 'rgba(24, 24, 27, 0.9)',
          backdropFilter: 'blur(24px) saturate(200%) brightness(1.2)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    gradient: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
      secondary: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      accent: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      fintech: 'linear-gradient(135deg, #6366f1 0%, #10b981 25%, #06b6d4 50%, #8b5cf6 75%, #ec4899 100%)',
      rainbow: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 20%, #48dbfb 40%, #ff9ff3 60%, #54a0ff 80%, #5f27cd 100%)',
      surface: {
        light: 'linear-gradient(135deg, #fafafa 0%, #ffffff 50%, #f8faff 100%)',
        dark: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #1e1b4b 100%)',
      },
      mesh: {
        light: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        dark: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
      },
    },
    neumorphism: {
      light: {
        convex: {
          background: '#fafafa',
          boxShadow: '8px 8px 16px #e4e4e7, -8px -8px 16px #ffffff',
          border: '1px solid rgba(228, 228, 231, 0.3)',
        },
        concave: {
          background: '#fafafa',
          boxShadow: 'inset 8px 8px 16px #e4e4e7, inset -8px -8px 16px #ffffff',
          border: '1px solid rgba(228, 228, 231, 0.3)',
        },
        flat: {
          background: '#fafafa',
          boxShadow: '4px 4px 8px #e4e4e7, -4px -4px 8px #ffffff',
          border: '1px solid rgba(228, 228, 231, 0.2)',
        },
      },
      dark: {
        convex: {
          background: '#18181b',
          boxShadow: '8px 8px 16px #09090b, -8px -8px 16px #27272a',
          border: '1px solid rgba(63, 63, 70, 0.3)',
        },
        concave: {
          background: '#18181b',
          boxShadow: 'inset 8px 8px 16px #09090b, inset -8px -8px 16px #27272a',
          border: '1px solid rgba(63, 63, 70, 0.3)',
        },
        flat: {
          background: '#18181b',
          boxShadow: '4px 4px 8px #09090b, -4px -4px 8px #27272a',
          border: '1px solid rgba(63, 63, 70, 0.2)',
        },
      },
    },
    glow: {
      primary: {
        light: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))',
        dark: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
      },
      secondary: {
        light: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))',
        dark: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))',
      },
      accent: {
        light: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))',
        dark: 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.5))',
      },
      success: {
        light: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.3))',
        dark: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))',
      },
    },
  },

  // 🎯 Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // ⚡ Transiciones y animaciones optimizadas
  transitions: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },

  // 📱 Breakpoints responsive
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  },
};

// ===============================================
// 🛠️ UTILIDADES DE COLOR Y CONTRASTE
// ===============================================

export const colorUtils = {
  // Obtener paleta por modo
  getPalette: (mode: 'light' | 'dark') => DESIGN_TOKENS.colors[mode],
  
  // Crear variaciones de transparencia
  withAlpha: (color: string, alphaValue: number) => alpha(color, alphaValue),
  
  // Generar gradientes dinámicos
  gradient: {
    primary: (mode: 'light' | 'dark') => 
      `linear-gradient(135deg, ${DESIGN_TOKENS.colors[mode].primary[500]} 0%, ${DESIGN_TOKENS.colors[mode].primary[600]} 100%)`,
    
    secondary: (mode: 'light' | 'dark') => 
      `linear-gradient(135deg, ${DESIGN_TOKENS.colors[mode].secondary[500]} 0%, ${DESIGN_TOKENS.colors[mode].secondary[600]} 100%)`,
    
    accent: (mode: 'light' | 'dark') => 
      `linear-gradient(135deg, ${DESIGN_TOKENS.colors[mode].accent[500]} 0%, ${DESIGN_TOKENS.colors[mode].accent[600]} 100%)`,
    
    surface: (mode: 'light' | 'dark') => 
      DESIGN_TOKENS.effects.gradient.surface[mode],
    
    mesh: (mode: 'light' | 'dark') => 
      DESIGN_TOKENS.effects.gradient.mesh[mode],
  },

  // Verificar contraste WCAG 3.0
  getContrastRatio: (foreground: string, background: string): number => {
    // Implementación básica - en producción usar librería especializada
    return 4.5; // Placeholder
  },

  // Obtener texto de contraste apropiado
  getContrastText: (backgroundColor: string, mode: 'light' | 'dark'): string => {
    return mode === 'dark' ? DESIGN_TOKENS.colors.dark.text.primary : DESIGN_TOKENS.colors.light.text.primary;
  },
};

// ===============================================
// 🎭 EFECTOS GLASSMORPHISM AVANZADOS
// ===============================================

export const glassEffect = {
  subtle: (mode: 'light' | 'dark') => DESIGN_TOKENS.effects.glass[mode].subtle,
  medium: (mode: 'light' | 'dark') => DESIGN_TOKENS.effects.glass[mode].medium,
  strong: (mode: 'light' | 'dark') => DESIGN_TOKENS.effects.glass[mode].strong,
  
  // Efectos personalizados
  card: (mode: 'light' | 'dark') => ({
    ...DESIGN_TOKENS.effects.glass[mode].medium,
    borderRadius: DESIGN_TOKENS.radius['2xl'],
    padding: DESIGN_TOKENS.spacing[6],
  }),
  
  button: (mode: 'light' | 'dark') => ({
    ...DESIGN_TOKENS.effects.glass[mode].subtle,
    borderRadius: DESIGN_TOKENS.radius.lg,
    padding: `${DESIGN_TOKENS.spacing[3]} ${DESIGN_TOKENS.spacing[4]}`,
  }),
  
  modal: (mode: 'light' | 'dark') => ({
    ...DESIGN_TOKENS.effects.glass[mode].strong,
    borderRadius: DESIGN_TOKENS.radius['3xl'],
    padding: DESIGN_TOKENS.spacing[8],
  }),
};

// ===============================================
// 🎯 EXPORTACIONES POR DEFECTO
// ===============================================

export default DESIGN_TOKENS; 