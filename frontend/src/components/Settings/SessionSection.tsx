import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
  Tooltip
} from '@mui/material';
import { motion } from 'motion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DevicesIcon from '@mui/icons-material/Devices';
import log from 'loglevel';

const SessionSection: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(30); // en minutos
  const [confirmTransfers, setConfirmTransfers] = useState(true);

  const handleRememberToggle = () => {
    setRememberMe((prev) => !prev);
    log.info(`[INFO][Session] Recordarme: ${!rememberMe} (mock)`);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const minutes = typeof newValue === 'number' ? newValue : newValue[0];
    setSessionDuration(minutes);
    log.info(`[INFO][Session] Expiración de sesión: ${minutes} min (mock)`);
  };

  const handleConfirmToggle = () => {
    setConfirmTransfers((prev) => !prev);
    log.info(`[INFO][Session] Confirmación de transferencias: ${!confirmTransfers} (mock)`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Sesión & Navegación
      </Typography>

      <Box mt={2} display="flex" flexDirection="column" gap={3}>
        <FormControlLabel
          control={<Switch checked={rememberMe} onChange={handleRememberToggle} />}
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <DevicesIcon fontSize="small" />
              Recordarme en este dispositivo
            </Box>
          }
        />

        <Tooltip title="Tiempo máximo antes de cerrar sesión automáticamente (mockeado)">
          <Box>
            <Typography variant="body2" gutterBottom sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" />
              Expiración de sesión: {sessionDuration} minutos
            </Typography>
            <Slider
              value={sessionDuration}
              onChange={handleSliderChange}
              min={5}
              max={120}
              step={5}
              valueLabelDisplay="auto"
            />
          </Box>
        </Tooltip>

        <FormControlLabel
          control={<Switch checked={confirmTransfers} onChange={handleConfirmToggle} />}
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <VerifiedUserIcon fontSize="small" />
              Confirmar antes de transferencias
            </Box>
          }
        />

        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
          Estas configuraciones aún no se sincronizan con backend. Están preparadas para producción futura.
        </Typography>
      </Box>
    </motion.div>
  );
};

export default SessionSection;
