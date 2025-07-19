import React, { useRef, useState } from 'react';
import { Box, Avatar, IconButton, Typography, CircularProgress, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { motion } from 'motion/react';
import log from 'loglevel';

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const AvatarUploader: React.FC = () => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; error?: boolean }>({ open: false, message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setSnackbar({ open: true, message: 'Formato inválido. Solo JPG o PNG.', error: true });
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setSnackbar({ open: true, message: 'Archivo demasiado grande. Máximo 2MB.', error: true });
      return;
    }

    const reader = new FileReader();
    setLoading(true);
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setLoading(false);
      setSnackbar({ open: true, message: 'Avatar cargado (mock).', error: false });
      if (process.env.NODE_ENV !== 'production') {
        log.info(`[AvatarUploader] Preview generado correctamente.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
    if (process.env.NODE_ENV === 'development') {
      log.debug('[AvatarUploader] Selector de archivo abierto.');
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6" fontWeight={600}>Foto de Perfil</Typography>

      <motion.div
        key={preview || 'default'}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Avatar
          src={preview || '/default-avatar.png'}
          alt="Avatar preview"
          sx={{ width: 120, height: 120, boxShadow: theme.shadows[4] }}
        />
      </motion.div>

      <IconButton
        color="primary"
        onClick={handleUploadClick}
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
          '&:hover': { backgroundColor: theme.palette.action.hover },
        }}
      >
        <PhotoCameraIcon />
      </IconButton>

      <input
        type="file"
        ref={inputRef}
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        hidden
      />

      {loading && <CircularProgress size={28} color="secondary" />}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        ContentProps={{
          sx: snackbar.error ? { backgroundColor: theme.palette.error.main } : {},
        }}
      />
    </Box>
  );
};

export default AvatarUploader;
