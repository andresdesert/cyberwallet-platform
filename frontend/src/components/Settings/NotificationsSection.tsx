import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { motion } from 'motion/react';
import log from 'loglevel';
import { useSnackbar } from 'notistack';

const NotificationsSection: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [browserSupported, setBrowserSupported] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Cargar preferencias desde localStorage
  useEffect(() => {
    const savedEnabled = localStorage.getItem('notifications-enabled');
    const savedFrequency = localStorage.getItem('notifications-frequency');
    
    if (savedEnabled !== null) {
      setEnabled(JSON.parse(savedEnabled));
    }
    if (savedFrequency) {
      setFrequency(savedFrequency as 'instant' | 'daily' | 'weekly');
    }

    // Verificar soporte del navegador
    setBrowserSupported('Notification' in window);
  }, []);

  const handleToggle = async () => {
    const newEnabled = !enabled;
    
    if (newEnabled && browserSupported) {
      // Solicitar permiso para notificaciones
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setEnabled(newEnabled);
        localStorage.setItem('notifications-enabled', JSON.stringify(newEnabled));
        enqueueSnackbar('Notificaciones activadas correctamente', { variant: 'success' });
        log.info(`[INFO][Notifications] Notificaciones ${newEnabled ? 'activadas' : 'desactivadas'}.`);
      } else {
        enqueueSnackbar('Permiso de notificaciones denegado', { variant: 'warning' });
      }
    } else {
      setEnabled(newEnabled);
      localStorage.setItem('notifications-enabled', JSON.stringify(newEnabled));
      enqueueSnackbar(`Notificaciones ${newEnabled ? 'activadas' : 'desactivadas'}`, { 
        variant: newEnabled ? 'success' : 'info' 
      });
      log.info(`[INFO][Notifications] Notificaciones ${newEnabled ? 'activadas' : 'desactivadas'}.`);
    }
  };

  const handleFrequencyChange = (event: SelectChangeEvent<'instant' | 'daily' | 'weekly'>) => {
    const newFreq = event.target.value as 'instant' | 'daily' | 'weekly';
    setFrequency(newFreq);
    localStorage.setItem('notifications-frequency', newFreq);
    
    const freqLabels = {
      instant: 'instantáneas',
      daily: 'diarias',
      weekly: 'semanales'
    };
    
    enqueueSnackbar(`Frecuencia configurada: ${freqLabels[newFreq]}`, { variant: 'success' });
    log.info(`[INFO][Notifications] Frecuencia configurada: ${newFreq}.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Notificaciones
      </Typography>

      {!browserSupported && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Tu navegador no soporta notificaciones push.
        </Alert>
      )}

      <Box mt={2} display="flex" flexDirection="column" gap={3}>
        {/* Toggle principal */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={handleToggle}
                disabled={!browserSupported}
                inputProps={{ 'aria-label': 'Activar notificaciones' }}
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {enabled ? <NotificationsActiveIcon fontSize="small" /> : <NotificationsOffIcon fontSize="small" />}
                Notificaciones push
              </Box>
            }
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 5 }}>
            {enabled 
              ? 'Recibirás notificaciones sobre transacciones y actividad de tu cuenta' 
              : 'Las notificaciones están desactivadas'
            }
          </Typography>
        </Box>

        {/* Frecuencia */}
        {enabled && (
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel id="frequency-label">Frecuencia</InputLabel>
              <Select
                labelId="frequency-label"
                value={frequency}
                onChange={handleFrequencyChange}
                label="Frecuencia"
              >
                <MenuItem value="instant">Instantáneas</MenuItem>
                <MenuItem value="daily">Resumen diario</MenuItem>
                <MenuItem value="weekly">Resumen semanal</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {frequency === 'instant' && 'Recibirás notificaciones inmediatamente cuando ocurra una transacción'}
              {frequency === 'daily' && 'Recibirás un resumen diario de todas las transacciones'}
              {frequency === 'weekly' && 'Recibirás un resumen semanal de la actividad de tu cuenta'}
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

export default NotificationsSection;
