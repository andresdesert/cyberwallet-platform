import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { motion } from 'motion/react';
import LockIcon from '@mui/icons-material/Lock';
import DevicesIcon from '@mui/icons-material/Devices';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import log from 'loglevel';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/context/AuthContext';

interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  active: boolean;
  lastAccess: string;
  current?: boolean;
}

const SecuritySection: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();

  // Cargar configuración de 2FA desde localStorage
  useEffect(() => {
    const saved2FA = localStorage.getItem('2fa-enabled');
    if (saved2FA !== null) {
      setTwoFactorEnabled(JSON.parse(saved2FA));
    }

    // Simular sesiones activas basadas en datos reales del navegador
    const currentSession: Session = {
      id: 'current',
      device: 'Dispositivo Actual',
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
               navigator.userAgent.includes('Firefox') ? 'Firefox' : 
               navigator.userAgent.includes('Safari') ? 'Safari' : 'Desconocido',
      os: navigator.platform.includes('Win') ? 'Windows' : 
          navigator.platform.includes('Mac') ? 'macOS' : 
          navigator.platform.includes('Linux') ? 'Linux' : 'Desconocido',
      location: 'Buenos Aires, AR', // En producción esto vendría del backend
      active: true,
      lastAccess: new Date().toLocaleString(),
      current: true
    };

    const mockSessions: Session[] = [
      currentSession,
      {
        id: 'session-2',
        device: 'iPhone 13',
        browser: 'Safari',
        os: 'iOS',
        location: 'Córdoba, AR',
        active: false,
        lastAccess: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 horas atrás
      },
      {
        id: 'session-3',
        device: 'Laptop',
        browser: 'Firefox',
        os: 'Linux',
        location: 'Rosario, AR',
        active: false,
        lastAccess: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(), // 1 día atrás
      }
    ];

    setSessions(mockSessions);
  }, []);

  const toggle2FA = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    localStorage.setItem('2fa-enabled', JSON.stringify(newValue));
    
    enqueueSnackbar(
      `Autenticación en dos pasos ${newValue ? 'activada' : 'desactivada'}`, 
      { variant: newValue ? 'success' : 'info' }
    );
    log.info(`[INFO][Security] 2FA ${newValue ? 'habilitado' : 'deshabilitado'}.`);
  };

  const handleLogoutAll = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogoutAll = () => {
    // Simular cierre de todas las sesiones
    setSessions(sessions.map(session => ({
      ...session,
      active: session.current ? true : false // Solo mantener activa la sesión actual
    })));
    
    setLogoutDialogOpen(false);
    enqueueSnackbar('Sesiones cerradas en todos los dispositivos', { variant: 'success' });
    log.info('[INFO][Security] Sesiones cerradas globalmente.');
  };

  const handleLogoutSpecific = (sessionId: string) => {
    if (sessions.find(s => s.id === sessionId)?.current) {
      // Si es la sesión actual, hacer logout completo
      logout();
      return;
    }

    // Cerrar sesión específica
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, active: false, lastAccess: new Date().toLocaleString() }
        : session
    ));
    
    enqueueSnackbar('Sesión cerrada correctamente', { variant: 'success' });
    log.info(`[INFO][Security] Sesión cerrada: ${sessionId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Seguridad
      </Typography>

      <Box mt={2} display="flex" flexDirection="column" gap={3}>
        {/* Two-Factor Auth */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={twoFactorEnabled}
                onChange={toggle2FA}
                inputProps={{ 'aria-label': '2FA Toggle' }}
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <LockIcon fontSize="small" />
                Autenticación en dos pasos (2FA)
              </Box>
            }
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            {twoFactorEnabled 
              ? 'Tu cuenta está protegida con 2FA simulado' 
              : 'Activa la verificación en dos pasos para mayor seguridad'
            }
          </Typography>
          
          {twoFactorEnabled && (
            <Alert severity="info" sx={{ mt: 1, ml: 5 }}>
              <Typography variant="body2">
                Modo simulado activado. En producción se conectaría con Google Authenticator o similar.
              </Typography>
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Active Sessions */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              Sesiones activas
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              color="warning"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutAll}
            >
              Cerrar todas
            </Button>
          </Box>
          
          <List dense disablePadding>
            {sessions.map((session) => (
              <ListItem 
                key={session.id}
                sx={{ 
                  mb: 1, 
                  borderRadius: 2,
                  backgroundColor: session.current ? 'action.hover' : 'transparent',
                  border: session.current ? '1px solid' : 'none',
                  borderColor: session.current ? 'primary.main' : 'transparent'
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {session.device}
                      {session.current && <Chip label="Actual" size="small" color="primary" />}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {session.browser} • {session.os} • {session.location}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Último acceso: {session.lastAccess}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box display="flex" alignItems="center" gap={1}>
                    <DevicesIcon 
                      color={session.active ? 'success' : 'disabled'} 
                      fontSize="small"
                    />
                    {!session.current && (
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleLogoutSpecific(session.id)}
                      >
                        Cerrar
                      </Button>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* Security Score */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500} mb={1}>
            Puntuación de seguridad
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <SecurityIcon color="primary" />
            <Box>
              <Typography variant="h6" color="primary">
                {twoFactorEnabled ? '85' : '65'}/100
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {twoFactorEnabled ? 'Buena seguridad' : 'Seguridad básica'}
              </Typography>
            </Box>
          </Box>
          {!twoFactorEnabled && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              <Typography variant="body2">
                Activa la autenticación en dos pasos para mejorar tu puntuación de seguridad.
              </Typography>
            </Alert>
          )}
        </Box>
      </Box>

      {/* Logout All Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="warning" />
            Cerrar todas las sesiones
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que quieres cerrar todas las sesiones activas? 
            Tendrás que volver a iniciar sesión en todos los dispositivos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmLogoutAll} color="warning" variant="contained">
            Cerrar todas
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default SecuritySection;
