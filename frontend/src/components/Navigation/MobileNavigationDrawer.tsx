// src/components/Navigation/MobileNavigationDrawer.tsx
import React from 'react';
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import log from 'loglevel'; // Import loglevel

interface Props {
  open: boolean;
  onClose: () => void;
}

const MobileNavigationDrawer: React.FC<Props> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Inicio', icon: <HomeIcon />, path: '/dashboard' },
    { label: 'Mi Cuenta', icon: <AccountCircleIcon />, path: '/profile' },
    { label: 'Cargar Fondos', icon: <AttachMoneyIcon />, path: '#load' },
    { label: 'Transferencias', icon: <SwapHorizIcon />, path: '#transfer' },
    { label: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigate = (path: string) => {
    if (path.startsWith('#')) {
      const id = path.replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      if (process.env.NODE_ENV === 'development') {
        log.debug(`[DEBUG][DEV][MobileNav] Scrolling to section: ${id}`);
      }
    } else {
      navigate(path);
      if (process.env.NODE_ENV === 'development') {
        log.debug(`[DEBUG][DEV][MobileNav] Navigating to: ${path}`);
      } else if (process.env.NODE_ENV === 'test') {
        log.info(`[INFO][TEST][MobileNav] User navigated to: ${path}`);
      }
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      log.warn(`[WARN][${process.env.NODE_ENV.toUpperCase()}][MobileNav] User logged out from mobile drawer. Redirecting.`);
    } else if (process.env.NODE_ENV === 'production') {
      log.info('[INFO][PROD][MobileNav] Mobile session ended.');
    }
    navigate('/login');
    onClose(); // Close drawer after logout
  };

  // Log when the drawer opens or closes
  React.useEffect(() => {
    if (open) {
      if (process.env.NODE_ENV === 'development') {
        log.debug('[DEBUG][DEV][MobileNav] Mobile navigation drawer opened.');
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        log.debug('[DEBUG][DEV][MobileNav] Mobile navigation drawer closed.');
      }
    }
  }, [open]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: alpha(theme.palette.custom.bodyBackgroundPrimary, 0.85), // 🔧 reemplazo
          backdropFilter: 'blur(14px) saturate(160%)',
          borderRight: `1px solid ${theme.palette.custom.glassBorder}`,
          boxShadow: `6px 0px 20px ${alpha(theme.palette.custom.neumoDarkShadow, 0.3)}`,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" px={2} py={1.5}>
        <Typography variant="h6" fontWeight={600}>CyberWallet</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: theme.palette.custom.glassBorder }} />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={location.pathname === item.path && !item.path.startsWith('#')} // Only highlight if it's a route, not a scroll-to-section
            onClick={() => handleNavigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1, borderColor: theme.palette.custom.glassBorder }} />

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
        <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ color: 'error.main' }} />
      </ListItemButton>
    </Drawer>
  );
};

export default MobileNavigationDrawer;
