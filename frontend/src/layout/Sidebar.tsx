// ARCHIVO: src/layout/Sidebar.tsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  useTheme,
  Tooltip,
  Backdrop,
  Divider,
  useMediaQuery,
  Chip,
  Avatar,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as TransferIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Close as CloseIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  ExpandLess,
  ExpandMore,
  NotificationsActive,
  Help,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useUnifiedTheme } from '@/context/UnifiedThemeContext';

const drawerWidth = 280;
const miniDrawerWidth = 68;

interface MenuItemType {
  text: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
  children?: MenuItemType[];
}

const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) onSwipeLeft();
    if (isRightSwipe) onSwipeRight();
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};

const useUserPreferences = () => {
  const [preferences, setPreferences] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cyberwallet-sidebar-preferences');
      return saved ? JSON.parse(saved) : { collapsed: false, lastUsed: [] };
    }
    return { collapsed: false, lastUsed: [] };
  });

  const updatePreferences = useCallback((updates: Partial<typeof preferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cyberwallet-sidebar-preferences', JSON.stringify(newPrefs));
    }
  }, [preferences]);

  return { preferences, updatePreferences };
};

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  const { preferences, updatePreferences } = useUserPreferences();

  const menuItems: MenuItemType[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { 
      text: 'Mi Billetera', 
      icon: <WalletIcon />, 
      path: '/wallet',
      children: [
        { text: 'Balance', icon: <TrendingUp />, path: '/wallet/balance' },
        { text: 'Tarjetas', icon: <WalletIcon />, path: '/wallet/cards' },
      ]
    },
    { 
      text: 'Transacciones', 
      icon: <TransferIcon />, 
      path: '/transactions',
      children: [
        { text: 'Historial', icon: <HistoryIcon />, path: '/transactions/history' },
        { text: 'Transferir', icon: <TransferIcon />, path: '/transfer' },
        { text: 'Recibir', icon: <WalletIcon />, path: '/receive' },
      ]
    },
    { text: 'Historial', icon: <HistoryIcon />, path: '/history' },
    { 
      text: 'Configuración', 
      icon: <SettingsIcon />, 
      path: '/settings',
      children: [
        { text: 'Seguridad', icon: <SettingsIcon />, path: '/settings/security' },
        { text: 'Notificaciones', icon: <NotificationsActive />, path: '/settings/notifications', badge: 2 },
        { text: 'Ayuda', icon: <Help />, path: '/settings/help' },
      ]
    },
  ];

  const swipeGesture = useSwipeGesture(
    () => {
      if (open && isMobile) {
        setOpen(false);
      }
    },
    () => {
      if (!open && isMobile) {
        setOpen(true);
      }
    }
  );

  // 🎯 CRÍTICO: Funciones que faltaban para el sidebar
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCollapse = () => {
    setCollapsed(!collapsed);
    updatePreferences({ collapsed: !collapsed });
  };

  const handleExpandItem = (itemText: string) => {
    setExpandedItems(prev => 
      prev.includes(itemText) 
        ? prev.filter((text: string) => text !== itemText)
        : [...prev, itemText]
    );
  };

  const handleNavigate = (path: string, itemText: string) => {
    navigate(path);
    setOpen(false);
    
    // Actualizar preferencias de uso frecuente
    const newLastUsed = [
      itemText,
      ...preferences.lastUsed.filter((text: string) => text !== itemText)
    ].slice(0, 5); // Mantener solo los 5 más recientes
    
    updatePreferences({ lastUsed: newLastUsed });
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      
      if (
        toggleButtonRef.current?.contains(target) ||
        sidebarRef.current?.contains(target) ||
        !open
      ) {
        return;
      }
      
      setOpen(false);
    };

    if (open && isMobile) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [open, isMobile]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
      
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (isDesktop && !collapsed) {
      updatePreferences({ collapsed: false });
    }
  }, [isDesktop, collapsed, updatePreferences]);

  const renderMenuItem = (item: MenuItemType, level = 0) => {
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.text);
    const isFrequentlyUsed = preferences.lastUsed.includes(item.text);

    return (
      <React.Fragment key={item.text}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 }}
        >
          <ListItem
            component="button"
            onClick={() => {
              if (hasChildren) {
                handleExpandItem(item.text);
              } else {
                handleNavigate(item.path, item.text);
              }
            }}
            sx={{
              borderRadius: 'var(--border-radius-lg)',
              mb: 'var(--spacing-xs)',
              ml: level * 2,
              mr: 1,
              px: 'var(--spacing-md)',
              py: 'var(--spacing-sm)',
              backgroundColor: isActive 
                ? `var(--semantic-primary-subtle)` 
                : 'transparent',
              color: isActive 
                ? `var(--semantic-primary-intense)` 
                : `var(--text-primary)`,
              border: isActive 
                ? `1px solid var(--semantic-primary-muted)`
                : `1px solid transparent`,
              '&:hover': {
                backgroundColor: 'var(--surface-elevated)',
                transform: 'translateX(6px)',
                borderColor: 'var(--semantic-primary-muted)',
                boxShadow: 'var(--shadow-sm)',
              },
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: isActive ? '4px' : '0px',
                backgroundColor: 'var(--semantic-primary)',
                transition: 'width 0.3s ease',
              },
            }}
            role="menuitem"
            aria-label={item.text}
            tabIndex={0}
          >
            <ListItemIcon sx={{ 
              color: isActive ? 'var(--semantic-primary-intense)' : 'var(--text-secondary)',
              minWidth: 44,
              transition: 'color 0.2s ease',
            }}>
              <Badge 
                badgeContent={item.badge} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.7rem',
                    minWidth: 16,
                    height: 16,
                    backgroundColor: 'var(--semantic-error)',
                  }
                }}
              >
                {item.icon}
              </Badge>
            </ListItemIcon>
            
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: isActive ? 700 : 500,
                  fontSize: level > 0 ? '0.875rem' : '1rem',
                  color: 'inherit',
                }
              }}
            />
            
            {isFrequentlyUsed && (
              <Star 
                sx={{ 
                  fontSize: 16, 
                  color: 'var(--semantic-warning)',
                  opacity: 0.7 
                }} 
              />
            )}
            
            {hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </motion.div>
            )}
          </ListItem>
        </motion.div>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerVariant = isMobile ? 'temporary' : (collapsed ? 'permanent' : 'permanent');
  const currentDrawerWidth = isMobile ? drawerWidth : (collapsed ? miniDrawerWidth : drawerWidth);

  return (
    <>
      {/* Botón de Toggle Mejorado */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <IconButton
          ref={toggleButtonRef}
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: { xs: 12, sm: 16 },
            left: { xs: 12, sm: 16 },
            zIndex: theme.zIndex.drawer + 2,
            background: 'var(--glass-background)',
            backdropFilter: 'var(--glass-backdrop)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--shadow-md)',
            width: { xs: 44, sm: 48 },
            height: { xs: 44, sm: 48 },
            '&:hover': {
              backgroundColor: 'var(--surface-elevated)',
              transform: 'scale(1.05)',
              borderColor: 'var(--semantic-primary-muted)',
              boxShadow: 'var(--shadow-lg)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          aria-label="Abrir menú de navegación"
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <MenuIcon sx={{ color: 'var(--text-primary)' }} />
          </motion.div>
        </IconButton>
      </motion.div>

      {/* Backdrop Inteligente */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Backdrop
              open={open}
              onClick={handleDrawerClose}
              sx={{
                zIndex: theme.zIndex.drawer - 1,
                backgroundColor: 'var(--overlay-backdrop)',
                backdropFilter: 'blur(8px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Principal */}
      <Drawer
        variant={drawerVariant}
        open={isMobile ? open : true}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
          'aria-label': 'Menú de navegación principal',
        }}
        sx={{
          zIndex: theme.zIndex.drawer,
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            background: 'var(--glass-background-strong)',
            backdropFilter: 'var(--glass-backdrop)',
            borderRight: '1px solid var(--glass-border)',
            boxShadow: isMobile 
              ? 'var(--shadow-xl)'
              : 'var(--shadow-lg)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
          },
        }}
        {...(isMobile ? swipeGesture : {})}
      >
        <Box 
          ref={sidebarRef}
          sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
          }}
        >
          {/* Header Mejorado */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Box sx={{ 
              p: 'var(--spacing-lg)', 
              borderBottom: '1px solid var(--glass-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--gradient-primary-subtle)',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'var(--semantic-primary)',
                  width: 40,
                  height: 40,
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--on-primary)',
                }}>
                  CW
                </Avatar>
                {!collapsed && (
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      lineHeight: 1.2,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-heading)',
                    }}>
                      CyberWallet
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label="Pro" 
                        size="small" 
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          backgroundColor: 'var(--semantic-success)',
                          color: 'var(--on-success)',
                        }}
                      />
                      <Chip 
                        label="v2.0" 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          borderColor: 'var(--semantic-primary-muted)',
                          color: 'var(--text-secondary)',
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isMobile && (
                  <Tooltip title={collapsed ? "Expandir" : "Contraer"}>
                    <IconButton 
                      onClick={handleCollapse}
                      size="small"
                      sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': { 
                          color: 'var(--semantic-primary)',
                          backgroundColor: 'var(--surface-elevated)',
                        }
                      }}
                    >
                      {collapsed ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                  </Tooltip>
                )}
                
                <Tooltip title="Cerrar menú">
                  <IconButton 
                    onClick={handleDrawerClose}
                    size="small"
                    sx={{
                      color: 'var(--text-secondary)',
                      '&:hover': { 
                        color: 'var(--semantic-error)',
                        backgroundColor: 'var(--semantic-error-subtle)',
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </motion.div>

          {/* Menú de Navegación Principal */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', px: 'var(--spacing-md)', py: 'var(--spacing-sm)' }}>
            <List>
              {menuItems.map((item) => renderMenuItem(item))}
            </List>
          </Box>

          <Divider sx={{ borderColor: 'var(--glass-border)' }} />

          {/* Footer Mejorado */}
          {!collapsed && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Box sx={{ p: 'var(--spacing-lg)' }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  textAlign: 'center',
                  color: 'var(--text-primary)',
                }}>
                  Conecta conmigo
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip title="GitHub - Andres Simahan">
                    <IconButton
                      onClick={() => window.open('https://github.com/andresdesert', '_blank')}
                      sx={{
                        color: 'var(--text-secondary)',
                        background: 'var(--surface-elevated)',
                        '&:hover': { 
                          color: '#171515',
                          backgroundColor: 'var(--glass-background)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="LinkedIn - Andres Simahan">
                    <IconButton
                      onClick={() => window.open('https://www.linkedin.com/in/andres-simahan/', '_blank')}
                      sx={{
                        color: 'var(--text-secondary)',
                        background: 'var(--surface-elevated)',
                        '&:hover': { 
                          color: '#0a66c2',
                          backgroundColor: 'var(--glass-background)',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </motion.div>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
