// src/components/Profile/DangerZoneSection.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { motion } from 'motion/react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useSnackbar } from 'notistack';
import axiosInstance from '@/api/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const DangerZoneSection: React.FC = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const { t } = useTranslation('landing');

  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = () => {
    if (confirmationText === 'ELIMINAR') {
      setOpenDialog(true);
    } else {
      enqueueSnackbar(t('zona_riesgo_info'), { variant: 'info' });
    }
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.delete('/user/profile');
      enqueueSnackbar(t('zona_riesgo_exito'), { variant: 'success' });
      logout();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const detail = apiError?.response?.data?.detail || 'Error al eliminar la cuenta';
      enqueueSnackbar(detail, { variant: 'error' });
      // log.error('[DangerZone] Error al eliminar cuenta:', detail); // This line was commented out in the original file
    } finally {
      setIsLoading(false);
      setOpenDialog(false);
    }
  };

  return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box
            sx={{
              border: `1px solid ${theme.palette.error.main}`,
              borderRadius: 2,
              p: 3,
              backgroundColor:
                  theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
            }}
        >
          <Typography variant="h6" fontWeight={600} color="error" gutterBottom>
            <WarningAmberIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {t('zona_riesgo')}
          </Typography>

          <Typography variant="body2" mb={2}>
            {t('zona_riesgo_desc')}
          </Typography>

          <TextField
              fullWidth
              variant="outlined"
              label={t('zona_riesgo_confirmar')}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              sx={{ mb: 2 }}
          />

          <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              disabled={confirmationText !== 'ELIMINAR'}
              onClick={handleDeleteClick}
          >
            {t('zona_riesgo_boton')}
          </Button>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>{t('zona_riesgo_confirmar_dialog_title')}</DialogTitle>
            <DialogContent>
              {t('zona_riesgo_confirmar_dialog_desc')}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} disabled={isLoading}>
                {t('zona_riesgo_confirmar_dialog_cancelar')}
              </Button>
              <Button
                  onClick={confirmDelete}
                  color="error"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />
                  }
              >
                {isLoading ? t('zona_riesgo_confirmar_dialog_eliminando') : t('zona_riesgo_confirmar_dialog_confirmar')}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </motion.div>
  );
};

export default DangerZoneSection;
