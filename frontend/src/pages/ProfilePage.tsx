import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Avatar,
    IconButton,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
    Save as SaveIcon, 
    Edit as EditIcon, 
    PhotoCamera as PhotoCameraIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import log from 'loglevel';

interface ProfileData {
    calle: string;
    numero: string;
    avatar?: string;
}

const ProfilePage: React.FC = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');

    const [formData, setFormData] = useState<ProfileData>({
        calle: '',
        numero: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        // Simular carga de datos del perfil
        setFormData({
            calle: 'Av. Corrientes',
            numero: '1234'
        });
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.calle.trim()) {
            newErrors.calle = 'La calle es requerida';
        }

        if (!formData.numero.trim()) {
            newErrors.numero = 'El número es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof ProfileData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        // Limpiar error cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            enqueueSnackbar('Por favor, corrige los errores del formulario', { variant: 'error' });
            return;
        }

        setLoading(true);
        
        try {
            // Simular llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            log.info('[ProfilePage] Perfil actualizado exitosamente');
            setShowSuccessDialog(true);
            enqueueSnackbar('Perfil actualizado correctamente', { variant: 'success' });
        } catch (error) {
            log.error('[ProfilePage] Error al actualizar perfil:', error);
            enqueueSnackbar('Error al actualizar el perfil', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessDialog = () => {
        setShowSuccessDialog(false);
    };

    return (
        <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            p: 3,
            minHeight: '100vh',
            background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        }}>
            <Paper
                elevation={8}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(18, 24, 38, 0.9)'
                        : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            mb: 1,
                            textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                    >
                        {t('profile_titulo')}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            opacity: 0.8
                        }}
                    >
                        {t('profile_subtitulo')}
                    </Typography>
                </Box>

                {/* Avatar Section */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            src={avatarPreview || undefined}
                            sx={{
                                width: 100,
                                height: 100,
                                fontSize: '2rem',
                                backgroundColor: theme.palette.primary.main,
                                border: `3px solid ${theme.palette.primary.main}`,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                            }}
                        >
                            {user?.alias?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <IconButton
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: theme.palette.background.paper,
                                border: `2px solid ${theme.palette.primary.main}`,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                },
                            }}
                        >
                            <PhotoCameraIcon />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                        {t('profile_avatar_desc')}
                    </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Calle Field */}
                    <TextField
                        fullWidth
                        label={t('profile_calle_label')}
                        variant="outlined"
                        value={formData.calle}
                        onChange={handleInputChange('calle')}
                        error={!!errors.calle}
                        helperText={errors.calle}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EditIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    />

                    {/* Número Field */}
                    <TextField
                        fullWidth
                        label={t('profile_numero_label')}
                        variant="outlined"
                        value={formData.numero}
                        onChange={handleInputChange('numero')}
                        error={!!errors.numero}
                        helperText={errors.numero}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EditIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                        }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                            '&:hover': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                                transform: 'translateY(-1px)',
                            },
                            '&:disabled': {
                                background: theme.palette.action.disabledBackground,
                                color: theme.palette.action.disabled,
                            },
                        }}
                    >
                        {loading ? 'Guardando...' : t('profile_guardar_cambios')}
                    </Button>
                </Box>
            </Paper>

            {/* Success Dialog */}
            <Dialog
                open={showSuccessDialog}
                onClose={handleCloseSuccessDialog}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: theme.palette.background.paper,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ 
                            fontSize: 60, 
                            color: theme.palette.success.main 
                        }} />
                    </Box>
                    ¡Perfil Actualizado!
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        {t('profile_cambios_exitosos')}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleCloseSuccessDialog}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            fontWeight: 600,
                            textTransform: 'none',
                        }}
                    >
                        Continuar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProfilePage;
