// 🎨 CYBERWALLET TOPBAR 2025
// Barra de navegación superior moderna con diseño fintech profesional

import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useMediaQuery,
  Fade,
  Badge,
  Chip,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Settings,
  Language,
  Search,
  SecurityRounded,
  TrendingUp,
  AccountBalanceWallet,
  BusinessCenter,
  MoreVert,
  LogoutRounded,
  PersonRounded,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSnackbar } from 'notistack';
import CyberWalletLogo from '@/components/ui/CyberWalletLogo';
import CotizacionesTopbar from '@/components/Dashboard/CotizacionesTopbar';
import { useUnifiedTheme } from '@/context/UnifiedThemeContext';
import { DESIGN_TOKENS, glassEffect } from '@/theme/designTokens';

// 🎯 Hook para scroll avanzado con rendimiento optimizado
const useAdvancedStickyHeader = () => {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    isScrolled: false,
    isScrollingUp: false,
    isAtTop: true,
    scrollDirection: 'up' as 'up' | 'down',
    scrollVelocity: 0,
  });

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - scrollState.scrollY;
    const isScrolled = currentScrollY > 10;
    const isScrollingUp = deltaY < 0 && currentScrollY > 80;
    const isAtTop = currentScrollY < 5;
    const scrollDirection = deltaY > 0 ? 'down' : 'up';
    const scrollVelocity = Math.abs(deltaY);

    setScrollState(prev => ({
      scrollY: currentScrollY,
      isScrolled,
      isScrollingUp,
      isAtTop,
      scrollDirection,
      scrollVelocity: Math.min(scrollVelocity, 20),
    }));
  }, [scrollState.scrollY]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollState]);

  return scrollState;
};

// 🎨 Función para crear estilos dinámicos del topbar
const createTopbarStyles = (theme: any, scrollState: any, isMobile: boolean, colorScheme: 'light' | 'dark') => {
  const { isScrolled, isAtTop, scrollY, scrollDirection, scrollVelocity } = scrollState;
  
  // Glass effect optimizado
  const glass = glassEffect.medium(colorScheme);
  
  // Cálculos de opacidad y efectos
  const backdropOpacity = Math.min(scrollY / 100, 0.98);
  const shadowIntensity = Math.min(scrollY / 50, 1);
  const blurIntensity = Math.min(12 + (scrollY / 20), 30);
  const shouldHide = scrollDirection === 'down' && scrollY > 150 && scrollVelocity > 5 && !isMobile;

  return {
    // AppBar principal con glass effect
    appBar: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1400, // Más alto que el drawer (1200) pero menor que modal (1500)
      elevation: 0,
      background: isAtTop 
        ? 'transparent'
        : glass.background,
      backdropFilter: isAtTop 
        ? 'none'
        : `${glass.backdropFilter}`,
      WebkitBackdropFilter: isAtTop 
        ? 'none'
        : `${glass.backdropFilter}`,
      borderBottom: isScrolled 
        ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
        : 'none',
      boxShadow: isScrolled 
        ? DESIGN_TOKENS.shadows[colorScheme].card
        : 'none',
      transform: shouldHide ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isAtTop 
          ? 'transparent'
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        pointerEvents: 'none',
        transition: 'background 0.3s ease',
      },
    },

    // Toolbar optimizado
    toolbar: {
      minHeight: { xs: 64, sm: 72 },
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 1, sm: 1.5 },
      transition: 'all 0.3s ease',
      position: 'relative',
      zIndex: 1,
    },

    // Sección de branding
    branding: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      transition: 'all 0.3s ease',
      transform: isScrolled ? 'scale(0.95)' : 'scale(1)',
      gap: { xs: 1, sm: 2 },
    },

    // Logo con efectos
    logoButton: {
      borderRadius: DESIGN_TOKENS.radius.xl,
      padding: DESIGN_TOKENS.spacing[1.5],
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      background: isScrolled 
        ? alpha(theme.palette.primary.main, 0.05)
        : 'transparent',
      border: `2px solid ${isScrolled 
        ? alpha(theme.palette.primary.main, 0.1) 
        : 'transparent'}`,
      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.08),
        borderColor: alpha(theme.palette.primary.main, 0.2),
        transform: 'scale(1.05)',
        boxShadow: DESIGN_TOKENS.shadows[colorScheme].sm,
      },
    },

    // Título con gradiente
    title: {
      fontWeight: 800,
      fontSize: { xs: '1.25rem', sm: '1.5rem' },
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'all 0.3s ease',
      letterSpacing: '-0.02em',
      fontFamily: DESIGN_TOKENS.typography.families.display,
    },

    // Sección de cotizaciones
    quotesSection: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 0,
      ml: { xs: 0, md: 4 },
      opacity: isScrolled ? 0.9 : 1,
      transform: isScrolled ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.3s ease',
    },

    // Sección de acciones
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: { xs: 0.5, sm: 1 },
      '& .MuiIconButton-root': {
        borderRadius: DESIGN_TOKENS.radius.xl,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid transparent`,
        backdropFilter: 'blur(8px)',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          borderColor: alpha(theme.palette.primary.main, 0.2),
          transform: 'scale(1.05)',
          boxShadow: DESIGN_TOKENS.shadows[colorScheme].sm,
        },
      },
    },

    // Botón de notificaciones especial
    notificationButton: {
      background: alpha(theme.palette.warning.main, 0.1),
      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
      color: theme.palette.warning.main,
      '&:hover': {
        background: alpha(theme.palette.warning.main, 0.15),
        borderColor: alpha(theme.palette.warning.main, 0.3),
        boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.2)}`,
      },
    },

    // Avatar del usuario
    userAvatar: {
      width: { xs: 36, sm: 40 },
      height: { xs: 36, sm: 40 },
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
      fontSize: { xs: '0.875rem', sm: '1rem' },
      fontWeight: 600,
      border: `2px solid ${alpha(theme.palette.background.paper, 0.9)}`,
      boxShadow: DESIGN_TOKENS.shadows[colorScheme].sm,
      transition: 'all 0.2s ease',
    },

    // Menú de usuario
    userMenu: {
      '& .MuiPaper-root': {
        minWidth: 280,
        background: glass.background,
        backdropFilter: glass.backdropFilter,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: DESIGN_TOKENS.radius['2xl'],
        boxShadow: DESIGN_TOKENS.shadows[colorScheme].floating,
        mt: 1,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        },
      },
    },

    // Items del menú
    menuItem: {
      borderRadius: DESIGN_TOKENS.radius.lg,
      mx: 1,
      my: 0.5,
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateX(4px)',
      },
    },
  };
};

// 🎯 Componente principal del Topbar
const Topbar: React.FC = () => {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const { colorScheme, toggleColorScheme } = useUnifiedTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // Estados del componente
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationCount] = useState(3);
  const [searchVisible, setSearchVisible] = useState(false);

  // Hook de scroll optimizado
  const scrollState = useAdvancedStickyHeader();
  
  // Estilos dinámicos
  const styles = createTopbarStyles(theme, scrollState, isMobile, colorScheme);

  console.info('🔝 [Topbar] Componente Topbar 2025 cargado correctamente');

  // 🎯 Manejadores de eventos
  const handleLogout = async () => {
    setUserMenuAnchor(null);
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuAnchor(mobileMenuAnchor ? null : document.body);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setUserMenuAnchor(null);
    setMobileMenuAnchor(null);
  };

  // 🎭 Componente de usuario compacto
  const UserInfo: React.FC = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      px: 2,
      py: 1.5,
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      background: alpha(theme.palette.primary.main, 0.02),
    }}>
      <Avatar sx={styles.userAvatar}>
        {user?.alias?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
      </Avatar>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={600} color="text.primary" noWrap>
          {user?.alias || 'Usuario'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {user?.email || 'email@ejemplo.com'}
        </Typography>
      </Box>
      <Chip
        label="Pro"
        size="small"
        sx={{
          height: 20,
          fontSize: '0.65rem',
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          border: 'none',
        }}
      />
    </Box>
  );

  // 🎯 Opciones del menú de usuario
  const userMenuOptions = [
    {
      icon: <PersonRounded />,
      label: 'Mi Perfil',
      action: () => handleNavigation('/profile'),
      color: theme.palette.primary.main,
    },
    {
      icon: <AccountBalanceWallet />,
      label: 'Mi Billetera',
      action: () => handleNavigation('/wallet'),
      color: theme.palette.secondary.main,
    },
    {
      icon: <TrendingUp />,
      label: 'Estadísticas',
      action: () => handleNavigation('/analytics'),
      color: theme.palette.info.main,
    },
    {
      icon: <SecurityRounded />,
      label: 'Seguridad',
      action: () => handleNavigation('/security'),
      color: theme.palette.warning.main,
    },
    {
      icon: <Settings />,
      label: 'Configuración',
      action: () => handleNavigation('/settings'),
      color: theme.palette.text.secondary,
    },
  ];

  return (
    <AppBar sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        {/* 🎨 Sección de Branding */}
        <Box sx={styles.branding}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleLogoClick}
              sx={styles.logoButton}
              aria-label="Ir al dashboard"
            >
              <CyberWalletLogo size={isMobile ? 32 : 36} animated />
            </IconButton>
          </motion.div>
          
          <Typography component="div" sx={styles.title}>
            CyberWallet
          </Typography>

          {/* 🎯 Indicador de versión Beta */}
          <AnimatePresence>
            {scrollState.isAtTop && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Chip
                  label="Beta"
                  size="small"
                  sx={{
                    ml: 1,
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: alpha(theme.palette.secondary.main, 0.1),
                    color: theme.palette.secondary.main,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🌊 Carrusel de cotizaciones (solo desktop) */}
          {!isMobile && !isTablet && (
            <Box sx={styles.quotesSection}>
              <CotizacionesTopbar />
            </Box>
          )}
        </Box>

        {/* 🎯 Sección de Acciones */}
        {isMobile ? (
          // Menú móvil compacto
          <>
            <IconButton
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
              }}
              aria-label="Menú principal"
            >
              <MoreVert />
            </IconButton>

            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={() => setMobileMenuAnchor(null)}
              TransitionComponent={Fade}
              sx={styles.userMenu}
            >
              <UserInfo />
              {userMenuOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={option.action}
                  sx={{
                    ...styles.menuItem,
                    '&:hover': {
                      ...styles.menuItem['&:hover'],
                      background: alpha(option.color, 0.08),
                    },
                  }}
                >
                  <Box sx={{ color: option.color, mr: 2, display: 'flex' }}>
                    {option.icon}
                  </Box>
                  <Typography variant="body2" color="text.primary">
                    {option.label}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout} sx={{
                ...styles.menuItem,
                color: theme.palette.error.main,
                '&:hover': {
                  background: alpha(theme.palette.error.main, 0.08),
                },
              }}>
                <LogoutRounded sx={{ mr: 2 }} />
                <Typography variant="body2">Cerrar Sesión</Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          // Acciones para desktop
          <Box sx={styles.actions}>
            {/* Notificaciones */}
            <Tooltip title="Notificaciones" arrow>
              <IconButton
                color="inherit"
                onClick={() => navigate('/notifications')}
                sx={styles.notificationButton}
                aria-label="Ver notificaciones"
              >
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Búsqueda inteligente */}
            <Tooltip title="Buscar transacciones, contactos o funciones" arrow>
              <IconButton
                color="inherit"
                onClick={() => {
                  const searchTerm = prompt('¿Qué estás buscando?', '');
                  if (searchTerm) {
                    // Simular búsqueda inteligente
                    const lowerTerm = searchTerm.toLowerCase();
                    if (lowerTerm.includes('transferir') || lowerTerm.includes('enviar')) {
                      navigate('/dashboard'); // En el dashboard ya está el botón de transferir
                      enqueueSnackbar('Te llevo a las opciones de transferencia', { variant: 'info' });
                    } else if (lowerTerm.includes('alias') || lowerTerm.includes('cambiar')) {
                      navigate('/dashboard');
                      enqueueSnackbar('En el dashboard puedes cambiar tu alias con el botón amarillo', { variant: 'info' });
                    } else if (lowerTerm.includes('historial') || lowerTerm.includes('transacciones')) {
                      navigate('/transactions');
                    } else if (lowerTerm.includes('perfil') || lowerTerm.includes('configuración')) {
                      navigate('/settings');
                    } else {
                      enqueueSnackbar(`Buscando: ${searchTerm}. Revisa el dashboard para acciones rápidas.`, { variant: 'info' });
                      navigate('/dashboard');
                    }
                  }
                }}
                sx={{
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  '&:hover': {
                    background: alpha(theme.palette.success.main, 0.15),
                    borderColor: alpha(theme.palette.success.main, 0.3),
                  },
                }}
                aria-label="Búsqueda inteligente"
              >
                <Search />
              </IconButton>
            </Tooltip>

            {/* Toggle de tema */}
            <Tooltip title={`Cambiar a modo ${colorScheme === 'dark' ? 'claro' : 'oscuro'}`} arrow>
              <IconButton
                color="inherit"
                onClick={toggleColorScheme}
                sx={{
                  background: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  '&:hover': {
                    background: alpha(theme.palette.info.main, 0.15),
                    borderColor: alpha(theme.palette.info.main, 0.3),
                  },
                }}
                aria-label="Cambiar tema"
              >
                {colorScheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Idioma */}
            <Tooltip title="Idioma y región" arrow>
              <IconButton
                color="inherit"
                onClick={() => navigate('/settings')}
                sx={{
                  background: alpha(theme.palette.secondary.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                  '&:hover': {
                    background: alpha(theme.palette.secondary.main, 0.15),
                    borderColor: alpha(theme.palette.secondary.main, 0.3),
                  },
                }}
                aria-label="Configuración de idioma"
              >
                <Language />
              </IconButton>
            </Tooltip>

            {/* Avatar y menú de usuario */}
            <Tooltip title="Menú de usuario" arrow>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  padding: 0.5,
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.15),
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    transform: 'scale(1.05)',
                  },
                }}
                aria-label="Menú de usuario"
              >
                <Avatar sx={styles.userAvatar}>
                  {user?.alias?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Menú de usuario */}
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              TransitionComponent={Fade}
              sx={styles.userMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <UserInfo />
              {userMenuOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={option.action}
                  sx={{
                    ...styles.menuItem,
                    '&:hover': {
                      ...styles.menuItem['&:hover'],
                      background: alpha(option.color, 0.08),
                    },
                  }}
                >
                  <Box sx={{ color: option.color, mr: 2, display: 'flex' }}>
                    {option.icon}
                  </Box>
                  <Typography variant="body2" color="text.primary">
                    {option.label}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleLogout} sx={{
                ...styles.menuItem,
                mt: 1,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                color: theme.palette.error.main,
                '&:hover': {
                  background: alpha(theme.palette.error.main, 0.08),
                },
              }}>
                <LogoutRounded sx={{ mr: 2 }} />
                <Typography variant="body2">Cerrar Sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
