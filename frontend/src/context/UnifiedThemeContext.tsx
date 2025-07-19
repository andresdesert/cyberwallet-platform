// 🎨 CYBERWALLET UNIFIED THEME SYSTEM 2025-2026
// Sistema de temas unificado con design tokens vanguardistas
// Optimizado para demo y experiencia de usuario premium

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import type { Theme, PaletteMode } from '@mui/material/styles';
import { DESIGN_TOKENS, colorUtils, glassEffect } from '@/theme/designTokens';

// 🎯 Extensiones de tipos para MUI con nuevos tokens
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      // Superficies mejoradas
      bodyBackgroundPrimary: string;
      bodyBackgroundSecondary: string;
      glassBorder: string;
      neumoSurface: string;
      neumoLightShadow: string;
      neumoDarkShadow: string;
      
      // Colores base
      primary: string;
      secondary: string;
      accent: string;
      info: string;
      surface: string;
      
      // Textos optimizados
      textPrimary: string;
      textSecondary: string;
      textTertiary: string;
      textInverse: string;
      
      // Estados semánticos
      success: string;
      warning: string;
      error: string;
      
      // Bordes
      borderLight: string;
      borderDefault: string;
      borderStrong: string;
      borderInteractive: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      bodyBackgroundPrimary?: string;
      bodyBackgroundSecondary?: string;
      glassBorder?: string;
      neumoSurface?: string;
      neumoLightShadow?: string;
      neumoDarkShadow?: string;
      primary?: string;
      secondary?: string;
      accent?: string;
      info?: string;
      surface?: string;
      textPrimary?: string;
      textSecondary?: string;
      textTertiary?: string;
      textInverse?: string;
      success?: string;
      warning?: string;
      error?: string;
      borderLight?: string;
      borderDefault?: string;
      borderStrong?: string;
      borderInteractive?: string;
    };
  }

  interface TypographyVariants {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
    display3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display1?: React.CSSProperties;
    display2?: React.CSSProperties;
    display3?: React.CSSProperties;
  }
}

// 🎯 Tipos del contexto
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'light' | 'dark';

interface UnifiedThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  toggleColorScheme: () => void;
  systemPrefersDark: boolean;
  theme: Theme;
}

const UnifiedThemeContext = createContext<UnifiedThemeContextType | undefined>(undefined);

// 🎨 FUNCIÓN PARA CREAR TEMA PROFESIONAL 2025-2026
const createProfessionalTheme = (colorScheme: ColorScheme): Theme => {
  const isLight = colorScheme === 'light';
  const palette = DESIGN_TOKENS.colors[colorScheme];

  const shadows = DESIGN_TOKENS.shadows[colorScheme];
  const glass = glassEffect.medium(colorScheme);

  const baseTheme = createTheme({
    palette: {
      mode: colorScheme,
      
      // 🎨 Colores primarios optimizados
      primary: {
        main: palette.primary[500],
        light: palette.primary[400],
        dark: palette.primary[600],
        contrastText: colorScheme === 'dark' ? palette.text.inverse : palette.text.inverse,
        50: palette.primary[50],
        100: palette.primary[100],
        200: palette.primary[200],
        300: palette.primary[300],
        400: palette.primary[400],
        500: palette.primary[500],
        600: palette.primary[600],
        700: palette.primary[700],
        800: palette.primary[800],
        900: palette.primary[900],
        A100: palette.primary[100],
        A200: palette.primary[200],
        A400: palette.primary[400],
        A700: palette.primary[700],
      },

      // 🌿 Colores secundarios modernos
      secondary: {
        main: palette.secondary[500],
        light: palette.secondary[400],
        dark: palette.secondary[600],
        contrastText: colorScheme === 'dark' ? palette.text.inverse : palette.text.inverse,
        50: palette.secondary[50],
        100: palette.secondary[100],
        200: palette.secondary[200],
        300: palette.secondary[300],
        400: palette.secondary[400],
        500: palette.secondary[500],
        600: palette.secondary[600],
        700: palette.secondary[700],
        800: palette.secondary[800],
        900: palette.secondary[900],
        A100: palette.secondary[100],
        A200: palette.secondary[200],
        A400: palette.secondary[400],
        A700: palette.secondary[700],
      },

      // 🎯 Color de acento para CTAs
      error: {
        main: palette.semantic.error.main,
        light: palette.semantic.error.light,
        dark: palette.semantic.error.dark,
        contrastText: palette.semantic.error.contrastText,
      },
      warning: {
        main: palette.semantic.warning.main,
        light: palette.semantic.warning.light,
        dark: palette.semantic.warning.dark,
        contrastText: palette.semantic.warning.contrastText,
      },
      info: {
        main: palette.semantic.info.main,
        light: palette.semantic.info.light,
        dark: palette.semantic.info.dark,
        contrastText: palette.semantic.info.contrastText,
      },
      success: {
        main: palette.semantic.success.main,
        light: palette.semantic.success.light,
        dark: palette.semantic.success.dark,
        contrastText: palette.semantic.success.contrastText,
      },

      // 🏠 Fondos y superficies con profundidad
      background: {
        default: palette.surfaces.background,
        paper: palette.surfaces.paper,
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.disabled,
      },
      divider: palette.border.default,
      
      // 🎨 Paleta personalizada
      custom: {
        // Superficies
        bodyBackgroundPrimary: palette.surfaces.background,
        bodyBackgroundSecondary: palette.surfaces.paper,
        glassBorder: palette.border.light,
        neumoSurface: palette.surfaces.paper,
        neumoLightShadow: colorScheme === 'dark' ? palette.neutral[100] : palette.neutral[0],
        neumoDarkShadow: colorScheme === 'dark' ? palette.neutral[0] : palette.neutral[900],
        
        // Colores base
        primary: palette.primary[500],
        secondary: palette.secondary[500],
        accent: palette.accent[500],
        info: palette.semantic.info.main,
        surface: palette.surfaces.paper,
        
        // Textos optimizados
        textPrimary: palette.text.primary,
        textSecondary: palette.text.secondary,
        textTertiary: palette.text.tertiary,
        textInverse: palette.text.inverse,
        
        // Estados semánticos
        success: palette.semantic.success.main,
        warning: palette.semantic.warning.main,
        error: palette.semantic.error.main,
        
        // Bordes
        borderLight: palette.border.light,
        borderDefault: palette.border.default,
        borderStrong: palette.border.strong,
        borderInteractive: palette.border.interactive,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: colorScheme === 'dark' 
              ? DESIGN_TOKENS.effects.gradient.surface.dark
              : DESIGN_TOKENS.effects.gradient.surface.light,
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            fontFamily: DESIGN_TOKENS.typography.families.primary,
            fontSize: DESIGN_TOKENS.typography.scale.base.fontSize,
            lineHeight: DESIGN_TOKENS.typography.scale.base.lineHeight,
            color: palette.text.primary,
            transition: `all ${DESIGN_TOKENS.transitions.duration.normal} ${DESIGN_TOKENS.transitions.easing.inOut}`,
          },
          '*': {
            boxSizing: 'border-box',
          },
          'html, body': {
            margin: 0,
            padding: 0,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: colorScheme === 'dark' 
              ? 'rgba(24, 24, 27, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px) saturate(160%) brightness(1.15)',
            border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.2)'}`,
            boxShadow: shadows.card,
            transition: `all ${DESIGN_TOKENS.transitions.duration.normal} ${DESIGN_TOKENS.transitions.easing.inOut}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: DESIGN_TOKENS.radius.lg,
            textTransform: 'none',
            fontWeight: DESIGN_TOKENS.typography.weights.medium,
            transition: `all ${DESIGN_TOKENS.transitions.duration.fast} ${DESIGN_TOKENS.transitions.easing.out}`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: shadows.lg,
            },
          },
          contained: {
            background: DESIGN_TOKENS.effects.gradient.primary,
            '&:hover': {
              background: DESIGN_TOKENS.effects.gradient.primary,
              filter: 'brightness(1.1)',
            },
          },
          outlined: {
            border: `2px solid ${palette.primary[500]}`,
            '&:hover': {
              background: colorUtils.withAlpha(palette.primary[500], 0.1),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: DESIGN_TOKENS.radius['2xl'],
            background: colorScheme === 'dark' 
              ? 'rgba(24, 24, 27, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(16px) saturate(160%) brightness(1.15)',
            border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(99, 102, 241, 0.2)'}`,
            boxShadow: shadows.card,
            transition: `all ${DESIGN_TOKENS.transitions.duration.normal} ${DESIGN_TOKENS.transitions.easing.inOut}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: shadows.floating,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: DESIGN_TOKENS.radius.lg,
              background: colorScheme === 'dark' 
                ? 'rgba(24, 24, 27, 0.6)'
                : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px) saturate(120%) brightness(1.1)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.2)'}`,
              transition: `all ${DESIGN_TOKENS.transitions.duration.fast} ${DESIGN_TOKENS.transitions.easing.out}`,
              '&:hover': {
                borderColor: palette.primary[500],
                boxShadow: `0 0 0 3px ${colorUtils.withAlpha(palette.primary[500], 0.1)}`,
              },
              '&.Mui-focused': {
                borderColor: palette.primary[500],
                boxShadow: `0 0 0 3px ${colorUtils.withAlpha(palette.primary[500], 0.2)}`,
              },
            },
          },
        },
      },
    },

    // 📝 Tipografía moderna y legible
    typography: {
      fontFamily: DESIGN_TOKENS.typography.families.primary,
      fontWeightLight: DESIGN_TOKENS.typography.weights.light,
      fontWeightRegular: DESIGN_TOKENS.typography.weights.normal,
      fontWeightMedium: DESIGN_TOKENS.typography.weights.medium,
      fontWeightBold: DESIGN_TOKENS.typography.weights.bold,
      
      // Escala tipográfica optimizada
      h1: {
        ...DESIGN_TOKENS.typography.scale['4xl'],
        color: palette.text.primary,
        fontFamily: DESIGN_TOKENS.typography.families.display,
        background: DESIGN_TOKENS.effects.gradient.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      h2: {
        ...DESIGN_TOKENS.typography.scale['3xl'],
        color: palette.text.primary,
        fontFamily: DESIGN_TOKENS.typography.families.display,
      },
      h3: {
        ...DESIGN_TOKENS.typography.scale['2xl'],
        color: palette.text.primary,
        fontFamily: DESIGN_TOKENS.typography.families.display,
      },
      h4: {
        ...DESIGN_TOKENS.typography.scale.xl,
        color: palette.text.primary,
      },
      h5: {
        ...DESIGN_TOKENS.typography.scale.lg,
        color: palette.text.primary,
      },
      h6: {
        ...DESIGN_TOKENS.typography.scale.base,
        color: palette.text.primary,
        fontWeight: DESIGN_TOKENS.typography.weights.semibold,
      },
      subtitle1: {
        ...DESIGN_TOKENS.typography.scale.lg,
        color: palette.text.secondary,
      },
      subtitle2: {
        ...DESIGN_TOKENS.typography.scale.base,
        color: palette.text.secondary,
        fontWeight: DESIGN_TOKENS.typography.weights.medium,
      },
      body1: {
        ...DESIGN_TOKENS.typography.scale.base,
        color: palette.text.primary,
      },
      body2: {
        ...DESIGN_TOKENS.typography.scale.sm,
        color: palette.text.secondary,
      },
      caption: {
        ...DESIGN_TOKENS.typography.scale.xs,
        color: palette.text.tertiary,
      },
      button: {
        ...DESIGN_TOKENS.typography.scale.sm,
        fontWeight: DESIGN_TOKENS.typography.weights.medium,
        textTransform: 'none',
      },
    },

    // 🌟 Sistema de sombras mejorado
    shadows: [
      'none',
      shadows.xs,
      shadows.sm,
      shadows.md,
      shadows.lg,
      shadows.xl,
      shadows['2xl'],
      shadows.inner,
      shadows.glow,
      shadows.card,
      shadows.floating,
      // Extender array para satisfacer TypeScript
      ...Array(14).fill(shadows.md),
    ] as any,

    // 🔘 Border radius consistente
    shape: {
      borderRadius: parseInt(DESIGN_TOKENS.radius.lg.replace('rem', '')) * 16, // Convert rem to px
    },

    // ⚡ Transiciones optimizadas
    transitions: {
      create: (props: string | string[], options?: any) => {
        const duration = options?.duration || DESIGN_TOKENS.transitions.duration.normal;
        const easing = options?.easing || DESIGN_TOKENS.transitions.easing.inOut;
        return `${props} ${duration} ${easing}`;
      },
      easing: {
        easeInOut: DESIGN_TOKENS.transitions.easing.inOut,
        easeOut: DESIGN_TOKENS.transitions.easing.out,
        easeIn: DESIGN_TOKENS.transitions.easing.in,
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: parseInt(DESIGN_TOKENS.transitions.duration.instant.replace('ms', '')),
        shorter: parseInt(DESIGN_TOKENS.transitions.duration.fast.replace('ms', '')),
        short: parseInt(DESIGN_TOKENS.transitions.duration.normal.replace('ms', '')),
        standard: parseInt(DESIGN_TOKENS.transitions.duration.normal.replace('ms', '')),
        complex: parseInt(DESIGN_TOKENS.transitions.duration.slow.replace('ms', '')),
        enteringScreen: parseInt(DESIGN_TOKENS.transitions.duration.normal.replace('ms', '')),
        leavingScreen: parseInt(DESIGN_TOKENS.transitions.duration.fast.replace('ms', '')),
      },
    },

  });

  return responsiveFontSizes(baseTheme);
};

// 🎯 PROVIDER PRINCIPAL
export const UnifiedThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<ThemeMode>('auto');

  // 🎨 Determinar esquema de color
  const colorScheme: ColorScheme = useMemo(() => {
    if (mode === 'auto') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemPrefersDark]);

  // 🎭 Crear tema dinámico
  const theme = useMemo(() => createProfessionalTheme(colorScheme), [colorScheme]);

  // 🔄 Cambiar modo de tema
  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    // Aplicar al HTML para CSS variables
    document.documentElement.setAttribute('data-theme', newMode === 'auto' ? (systemPrefersDark ? 'dark' : 'light') : newMode);
  }, [systemPrefersDark]);

  // 🔄 Alternar esquema de color
  const toggleColorScheme = useCallback(() => {
    const newMode = colorScheme === 'light' ? 'dark' : 'light';
    handleSetMode(newMode);
  }, [colorScheme, handleSetMode]);

  // 🎯 Efectos de inicialización
  useEffect(() => {
    // Aplicar tema inicial
    document.documentElement.setAttribute('data-theme', colorScheme);
    
    // Precargar fuentes críticas
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }, [colorScheme]);

  // 🎭 Contexto del tema
  const contextValue = useMemo(() => ({
    mode,
    colorScheme,
    setMode: handleSetMode,
    toggleColorScheme,
    systemPrefersDark,
    theme,
  }), [mode, colorScheme, handleSetMode, toggleColorScheme, systemPrefersDark, theme]);

  return (
    <UnifiedThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </UnifiedThemeContext.Provider>
  );
};

// 🎯 Hook para usar el tema
export const useUnifiedTheme = () => {
  const context = useContext(UnifiedThemeContext);
  if (!context) {
    throw new Error('useUnifiedTheme must be used within a UnifiedThemeProvider');
  }
  return context;
}; 