import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import axiosInstance from '../../api/axiosInstance';
import log from 'loglevel';

const CvuAliasManager: React.FC = () => {
  const theme = useTheme();
  const [newAlias, setNewAlias] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateAlias = async () => {
    const trimmedAlias = newAlias.trim();

    if (!trimmedAlias) {
      setError('El alias no puede estar vacío.');
      return;
    }

    if (!/^[a-z0-9.]+$/.test(trimmedAlias)) {
      setError('El alias solo puede contener minúsculas, números y puntos.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      log.info('[Alias] Intentando actualizar alias:', trimmedAlias);

      const response = await axiosInstance.put('/wallet/alias', {
        newAlias: trimmedAlias,
      });

      log.info('[Alias] Respuesta recibida:', response.data);
      setSuccessMessage('Alias actualizado correctamente.');
      setNewAlias('');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const detail = apiError?.response?.data?.detail || 'Error al actualizar el alias.';
      setError(detail);
      log.error('[Alias] Error al actualizar alias', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 4, boxShadow: theme.shadows[4], background: theme.palette.background.paper }}>
      <Typography variant="h6" gutterBottom>
        Cambiar alias CVU
      </Typography>
      <TextField
        fullWidth
        label="Nuevo alias"
        variant="outlined"
        value={newAlias}
        onChange={(e) => setNewAlias(e.target.value)}
        disabled={isSubmitting}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateAlias}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {isSubmitting ? 'Actualizando...' : 'Actualizar alias'}
      </Button>

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError('')}>
        <Alert severity="error" icon={<ErrorIcon />} onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={5000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success" icon={<CheckCircleIcon />} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CvuAliasManager;
