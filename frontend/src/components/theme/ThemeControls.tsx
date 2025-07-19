// 🎨 CYBERWALLET THEME CONTROLS 2025
// Controles de tema profesionales con diseño moderno

import React from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Fab,
  Chip,
  Badge,
  Zoom,
  Fade,
} from '@mui/material';
import {
  LightMode,
  DarkMode,
  SettingsBrightness,
  Check,
  Palette,
  AutoAwesome,
  Computer,
  BrightnessHigh,
  Brightness4,
  Circle,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useUnifiedTheme } from '@/context/UnifiedThemeContext';
import { motion, AnimatePresence } from 'motion/react';

// 🎯 Interfaz para opciones de tema
interface ThemeOption {
  value: 'light' | 'dark' | 'auto';
  label: string;
  description: string;
  icon: React.ReactElement;
  shortcut?: string;
  gradient?: string;
}

// 🎨 Componente principal del control de temas
export const ThemeControls: React.FC = () => {
  const theme = useTheme();
  const { mode, colorScheme, setMode, systemPrefersDark } = useUnifiedTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const open = Boolean(anchorEl);

  // 🎯 Opciones de tema con gradientes modernos
  const themeOptions: ThemeOption[] = [
    {
      value: 'light',
      label: 'Modo Claro',
      description: 'Interfaz clara y brillante',
      icon: <LightMode />,
      shortcut: '⌘L',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
    },
    {
      value: 'dark',
      label: 'Modo Oscuro',
      description: 'Interfaz oscura y elegante',
      icon: <DarkMode />,
      shortcut: '⌘D',
      gradient: 'linear-gradient(135deg, #374151 0%, #111827 100%)',
    },
    {
      value: 'auto',
      label: 'Automático',
      description: `Se adapta al sistema (${systemPrefersDark ? 'Oscuro' : 'Claro'})`,
      icon: <SettingsBrightness />,
      shortcut: '⌘A',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
  ];

  // 🎨 Función para obtener el icono dinámico
  const getDynamicIcon = () => {
    if (mode === 'auto') {
      return <AutoAwesome sx={{ fontSize: '1.2rem' }} />;
    }
    return colorScheme === 'dark' 
      ? <Brightness4 sx={{ fontSize: '1.2rem' }} /> 
      : <BrightnessHigh sx={{ fontSize: '1.2rem' }} />;
  };

  // 🎨 Función para obtener colores dinámicos
  const getThemeColors = () => {
    const isLight = colorScheme === 'light';
    
    return {
      fabBg: isLight 
        ? alpha(theme.palette.background.paper, 0.95)
        : alpha(theme.palette.background.paper, 0.9),
      fabBorder: alpha(theme.palette.primary.main, isLight ? 0.2 : 0.3),
      fabShadow: isLight
        ? '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(99, 102, 241, 0.15)'
        : '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(99, 102, 241, 0.2)',
      fabHoverShadow: isLight
        ? '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(99, 102, 241, 0.2)'
        : '0 12px 40px rgba(0, 0, 0, 0.5), 0 6px 20px rgba(99, 102, 241, 0.3)',
      menuBg: isLight
        ? alpha(theme.palette.background.paper, 0.98)
        : alpha(theme.palette.background.paper, 0.95),
      menuBorder: alpha(theme.palette.primary.main, 0.1),
      iconColor: theme.palette.primary.main,
    };
  };

  const colors = getThemeColors();

  // 🎯 Manejadores de eventos
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode: 'light' | 'dark' | 'auto') => {
    setMode(newMode);
    handleClose();
    
    // Vibración sutil en dispositivos compatibles
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // ⌨️ Atajos de teclado
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'l':
            event.preventDefault();
            setMode('light');
            break;
          case 'd':
            event.preventDefault();
            setMode('dark');
            break;
          case 'a':
            event.preventDefault();
            setMode('auto');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  // 🎭 Componente Badge personalizado para mostrar el modo actual
  const ModeIndicator: React.FC = () => (
    <Box
      sx={{
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: colorScheme === 'dark' 
          ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: `2px solid ${theme.palette.background.paper}`,
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
      }}
    />
  );

  // 🎨 Componente de opción de tema individual
  const ThemeOptionItem: React.FC<{ option: ThemeOption; isSelected: boolean }> = ({ 
    option, 
    isSelected 
  }) => (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <MenuItem
        onClick={() => handleModeChange(option.value)}
        selected={isSelected}
        sx={{
          py: 2,
          px: 2.5,
          mx: 1,
          my: 0.5,
          borderRadius: 2,
          minHeight: 64,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isSelected 
            ? alpha(theme.palette.primary.main, 0.08)
            : 'transparent',
          border: isSelected 
            ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            : '1px solid transparent',
          '&:hover': {
            background: isSelected
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette.action.hover, 0.08),
            borderColor: alpha(theme.palette.primary.main, 0.3),
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: isSelected ? option.gradient : 'transparent',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 48,
            color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiSvgIcon-root': {
              fontSize: '1.4rem',
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: isSelected 
                ? alpha(theme.palette.primary.main, 0.1)
                : alpha(theme.palette.text.secondary, 0.05),
              transition: 'all 0.2s ease',
            }}
          >
            {option.icon}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check sx={{ fontSize: '0.75rem', color: 'white' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </ListItemIcon>
        
        <ListItemText
          primary={
            <Typography 
              variant="subtitle2" 
              fontWeight={isSelected ? 600 : 500}
              color={isSelected ? 'primary.main' : 'text.primary'}
            >
              {option.label}
            </Typography>
          }
          secondary={
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
            >
              {option.description}
            </Typography>
          }
        />
        
        {option.shortcut && (
          <Chip
            label={option.shortcut}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 500,
              background: alpha(theme.palette.text.secondary, 0.1),
              color: theme.palette.text.secondary,
              '& .MuiChip-label': {
                px: 0.75,
              },
            }}
          />
        )}
      </MenuItem>
    </motion.div>
  );

  return (
    <>
      {/* 🎨 FAB Principal con indicadores */}
      <Tooltip 
        title={
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Tema: {themeOptions.find(opt => opt.value === mode)?.label}
            </Typography>
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
              Click para cambiar • {themeOptions.find(opt => opt.value === mode)?.shortcut}
            </Typography>
          </Box>
        }
        arrow
        placement="left"
        TransitionComponent={Zoom}
      >
        <Fab
          onClick={handleClick}
          size="medium"
          sx={{
            position: 'fixed',
            top: '50%',
            right: 24,
            transform: 'translateY(-50%)',
            zIndex: 1500, // Aumentado para evitar conflictos
            backgroundColor: colors.fabBg,
            color: colors.iconColor,
            border: `2px solid ${colors.fabBorder}`,
            boxShadow: colors.fabShadow,
            backdropFilter: 'blur(20px) saturate(180%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            pointerEvents: 'auto', // Asegurar que el evento pointer funcione
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderColor: alpha(theme.palette.primary.main, 0.4),
              boxShadow: colors.fabHoverShadow,
              transform: 'translateY(-50%) scale(1.05)',
            },
            '&:active': {
              transform: 'translateY(-50%) scale(0.95)',
            },
            // Responsivo
            '@media (max-width: 640px)': {
              right: 16,
              top: 'auto',
              bottom: 80,
              transform: 'none',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            },
          }}
          aria-label="Controles de tema"
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {getDynamicIcon()}
              </motion.div>
            </AnimatePresence>
            <ModeIndicator />
          </Box>
        </Fab>
      </Tooltip>

      {/* 🎨 Menú Desplegable Moderno */}
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'theme-button',
          dense: false,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'center' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 320,
            maxWidth: 400,
            backgroundColor: colors.menuBg,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid ${colors.menuBorder}`,
            borderRadius: 3,
            boxShadow: colorScheme === 'dark'
              ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(99, 102, 241, 0.15)'
              : '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(99, 102, 241, 0.1)',
            mt: 1,
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              right: -8,
              width: 16,
              height: 16,
              backgroundColor: 'inherit',
              border: 'inherit',
              borderWidth: '1px 1px 0 0',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: -1,
            },
          },
        }}
      >
        {/* Header del menú */}
        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Palette sx={{ fontSize: '1.1rem' }} />
            </Box>
            <Box>
              <Typography 
                variant="subtitle1" 
                fontWeight={700}
                color="text.primary"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Configuración de Tema
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', mt: 0.25 }}
              >
                Personaliza la apariencia de CyberWallet
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Opciones de tema */}
        <Box sx={{ py: 1 }}>
          {themeOptions.map((option) => (
            <ThemeOptionItem
              key={option.value}
              option={option}
              isSelected={mode === option.value}
            />
          ))}
        </Box>

        {/* Footer informativo */}
        <Box sx={{ 
          px: 3, 
          py: 2, 
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          background: alpha(theme.palette.primary.main, 0.02),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Computer sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Sistema: {systemPrefersDark ? 'Modo oscuro' : 'Modo claro'}
            </Typography>
          </Box>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}
          >
            Los cambios se guardan automáticamente
          </Typography>
        </Box>
      </Menu>
    </>
  );
}; 