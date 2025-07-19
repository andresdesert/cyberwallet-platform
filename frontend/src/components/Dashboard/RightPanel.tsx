// ARCHIVO: src/components/Dashboard/RightPanel.tsx

import React from 'react';
import { Box, Drawer, Typography, Divider, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme, alpha } from '@mui/material/styles'; // Se mantiene porque se usa en el botón de logout
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import log from 'loglevel';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ isOpen, onClose }) => {
  const theme = useTheme(); // Se necesita para el color de hover del botón de logout
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.info('👤 [RightPanel] Componente RightPanel cargado correctamente');
  console.info('👤 [RightPanel] IsOpen:', isOpen);
  console.info('👤 [RightPanel] User:', user);

  // --- LA LÓGICA DE HANDLERS Y USEEFFECTS NO CAMBIA ---
  const handleLogout = () => {
    logout();
    log.warn(`[RightPanel] User logged out. Redirecting to /login.`);
    navigate('/login');
  };

  const handleClose = () => {
    log.debug('[DEV][RightPanel] Right panel is closing.');
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      log.debug('[DEV][RightPanel] Right panel opened.');
    }
  }, [isOpen]);

  // Se elimina el objeto `rightPanelButtonStyle`

  return (
    // CAMBIO 1: La prop `PaperProps.sx` ha sido limpiada.
    // El Drawer ahora hereda su estilo del tema.
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          // Solo se mantiene el `width` que es específico de este layout.
          width: { xs: '80%', sm: 300, md: 350 },
          // Los estilos de apariencia (`backgroundColor`, `boxShadow`, etc.) se heredan del tema.
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <AccountCircleIcon sx={{ fontSize: 80, color: 'text.primary', mb: 1 }} />
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {user?.email || 'Mi Perfil'}
          </Typography>
          {user?.alias && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Alias: {user.alias}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2, borderColor: 'custom.glassBorder' }} />

        {/* CAMBIO 2: Los botones ahora usan props estándar y `sx` localmente para mayor claridad. */}
        <Button
          fullWidth // Para que ocupe todo el ancho
          startIcon={<PersonIcon />}
          onClick={() => { navigate('/profile'); handleClose(); }}
          sx={{ mb: 1.5, justifyContent: 'flex-start', color: 'text.primary' }}
        >
          Mi Cuenta
        </Button>

        <Button
          fullWidth
          startIcon={<SettingsIcon />}
          onClick={() => { navigate('/settings'); handleClose(); }}
          sx={{ mb: 1.5, justifyContent: 'flex-start', color: 'text.primary' }}
        >
          Configuración
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          fullWidth
          variant="outlined" // Usamos 'outlined' para darle un borde sutil
          color="error" // Usamos el color de error del tema
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{
            mt: 2,
            justifyContent: 'flex-start',
            // El color se hereda de la prop `color="error"`
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Drawer>
  );
};

export default RightPanel;
