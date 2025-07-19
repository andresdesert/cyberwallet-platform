// ARCHIVO: src/components/Dashboard/EditAliasModule.tsx

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, Alert, CircularProgress, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NeumorphicTextField from '@/components/ui/NeumorphicTextField';
import { useSnackbar } from 'notistack';
import { useAuth } from '@/context/AuthContext';
import { getWalletDetails, updateWalletAlias } from '@/api/wallet';
import log from 'loglevel';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const EditAliasModule: React.FC = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const [currentAlias, setCurrentAlias] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [aliasFieldError, setAliasFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validateAlias = (alias: string): string | null => {
    if (alias.trim() === '') return 'El alias no puede estar vacío.';
    if (!/^[a-zA-Z0-9.-]{6,30}$/.test(alias)) {
      return 'El alias debe tener entre 6 y 30 caracteres y solo contener letras, números, puntos o guiones.';
    }
    return null;
  };

  useEffect(() => {
    const fetchAlias = async () => {
      if (!user?.token) {
        setGeneralError('Usuario no autenticado o token no disponible.');
        log.warn('[EditAliasModule] Usuario sin token. Abortando fetch.');
        return;
      }
      try {
        const walletData = await getWalletDetails();
        const alias = walletData.alias || '';
        setCurrentAlias(alias);
        setNewAlias(alias);
        log.debug(`[EditAliasModule] Alias actual obtenido: ${alias}`);
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: { detail?: string } } };
        const detail = apiError?.response?.data?.detail || 'No se pudo cargar el alias actual.';
        setGeneralError(detail);
        log.error('[EditAliasModule] Error al cargar alias actual:', detail);
      }
    };
    fetchAlias();
  }, [user?.token]);

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewAlias(value);
    const validationError = validateAlias(value);
    setAliasFieldError(validationError);
    if (generalError && !validationError) setGeneralError(null);
  };

  const handleAliasBlur = () => {
    const validationError = validateAlias(newAlias);
    setAliasFieldError(validationError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validationError = validateAlias(newAlias);
    if (validationError) {
      setAliasFieldError(validationError);
      setGeneralError('Por favor, corrige el alias antes de guardar.');
      log.warn('[EditAliasModule] Validación fallida al guardar alias:', validationError);
      return;
    }

    if (newAlias === currentAlias) {
      enqueueSnackbar('El alias es el mismo que el actual. No se requieren cambios.', { variant: 'info' });
      log.info('[EditAliasModule] Alias sin cambios. Operación omitida.');
      return;
    }

    setSubmitting(true);
    try {
      await updateWalletAlias({ newAlias });
      setCurrentAlias(newAlias);
      enqueueSnackbar('Alias actualizado correctamente.', { variant: 'success' });
      setAliasFieldError(null);
      log.info(`[EditAliasModule] Alias actualizado a: ${newAlias}`);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const msg = apiError?.response?.data?.detail || 'No se pudo actualizar el alias.';
      setGeneralError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
      log.error('[EditAliasModule] Error HTTP al guardar alias:', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitDisabled =
      submitting || newAlias === currentAlias || !!aliasFieldError || newAlias.trim() === '';

  return (
      <Paper variant="elevation" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Editar Alias de tu Billetera
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NeumorphicTextField
              label="Nuevo Alias"
              value={newAlias}
              onChange={handleAliasChange}
              onBlur={handleAliasBlur}
              required
              error={!!aliasFieldError}
              helperText={aliasFieldError}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <EditIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                ),
                endAdornment: aliasFieldError ? (
                    <InputAdornment position="end">
                      <ErrorOutlineIcon color="error" />
                    </InputAdornment>
                ) : null,
              }}
          />
          {generalError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {generalError}
              </Alert>
          )}
          <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitDisabled}
              sx={{ 
                alignSelf: 'flex-start',
                // Mejora del contraste en modo oscuro
                ...(theme.palette.mode === 'dark' && {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                  '&:disabled': {
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                }),
              }}
          >
            {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Guardar Alias'}
          </Button>
        </Box>
      </Paper>
  );
};

export default EditAliasModule;
