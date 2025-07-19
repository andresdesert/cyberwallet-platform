import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    Paper,
    Link,
    Divider,
    useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, ArrowBack } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLogin } from '@/hooks/useLogin';
import CyberWalletLogo from '@/components/ui/CyberWalletLogo';
import { motion } from 'motion/react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { doLogin, loading } = useLogin();

    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const validate = () => {
        const newErrors = { emailOrUsername: '', password: '' };

        if (!formData.emailOrUsername.trim()) {
            newErrors.emailOrUsername = 'Email o nombre de usuario es requerido';
        } else if (formData.emailOrUsername.length < 3) {
            newErrors.emailOrUsername = 'Debe tener al menos 3 caracteres';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return !newErrors.emailOrUsername && !newErrors.password;
    };

    const handleBlur = (field: 'emailOrUsername' | 'password') => () => {
        validate();
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            await doLogin({
                usernameOrEmail: formData.emailOrUsername,
                password: formData.password,
            });
            enqueueSnackbar('¡Bienvenido de vuelta!', { variant: 'success' });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error en login:', error);
            enqueueSnackbar('Credenciales incorrectas', { variant: 'error' });
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const handleBackToLanding = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // 🎯 CRÍTICO: REMOVIDO background propio para usar el background global
                p: 2,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Efectos de fondo mejorados */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -200,
                    left: -200,
                    width: 400,
                    height: 400,
                    background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -150,
                    right: -150,
                    width: 300,
                    height: 300,
                    background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
                    borderRadius: '50%',
                    animation: 'float 8s ease-in-out infinite reverse',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 4 },
                        maxWidth: 420,
                        width: '100%',
                        borderRadius: '24px',
                        background: theme.palette.mode === 'dark'
                            ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[800]} 100%)`
                            : `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 100%)`,
                        backdropFilter: 'blur(20px)',
                        border: `3px solid ${theme.palette.primary.main}20`,
                        boxShadow: theme.palette.mode === 'dark'
                            ? `0 20px 60px ${theme.palette.background.default}60, 0 8px 32px ${theme.palette.primary.main}20`
                            : `0 20px 60px ${theme.palette.grey[200]}80, 0 8px 32px ${theme.palette.primary.main}15`,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        }
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 2 }}>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <CyberWalletLogo size={64} animated />
                        </motion.div>
                        
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                                mt: 2,
                                fontFamily: 'var(--font-heading)',
                            }}
                        >
                            Bienvenido
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                            }}
                        >
                            Inicia sesión en tu cuenta
                        </Typography>
                    </Box>

                    {/* Formulario */}
                    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                        <TextField
                            fullWidth
                            label="Email o nombre de usuario"
                            variant="outlined"
                            value={formData.emailOrUsername}
                            onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                            onBlur={handleBlur('emailOrUsername')}
                            onKeyPress={handleKeyPress}
                            error={!!errors.emailOrUsername}
                            helperText={errors.emailOrUsername}
                            sx={{
                                mb: 'var(--spacing-lg)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 'var(--border-radius-lg)',
                                    backgroundColor: 'var(--surface-elevated)',
                                    backdropFilter: 'var(--glass-backdrop)',
                                    '& fieldset': {
                                        borderColor: 'var(--border-default)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--semantic-primary)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--semantic-primary)',
                                        boxShadow: 'var(--focus-ring)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-secondary)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--semantic-primary)',
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onBlur={handleBlur('password')}
                            onKeyPress={handleKeyPress}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                            sx={{ color: 'var(--text-secondary)' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 'var(--spacing-lg)',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 'var(--border-radius-lg)',
                                    backgroundColor: 'var(--surface-elevated)',
                                    backdropFilter: 'var(--glass-backdrop)',
                                    '& fieldset': {
                                        borderColor: 'var(--border-default)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--semantic-primary)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--semantic-primary)',
                                        boxShadow: 'var(--focus-ring)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'var(--text-secondary)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--semantic-primary)',
                                },
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                            disabled={loading}
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 'var(--spacing-md)',
                                borderRadius: 'var(--border-radius-lg)',
                                background: 'var(--gradient-primary)',
                                color: 'var(--on-primary)',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                boxShadow: 'var(--shadow-lg)',
                                mb: 'var(--spacing-lg)',
                                '&:hover': {
                                    background: 'var(--gradient-primary-intense)',
                                    boxShadow: 'var(--shadow-xl)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: 'var(--text-disabled)',
                                    color: 'var(--surface-paper)',
                                },
                            }}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </Box>

                    <Divider sx={{ 
                        mb: 'var(--spacing-lg)',
                        borderColor: 'var(--border-light)',
                    }} />

                    {/* Enlaces */}
                    <Box sx={{ textAlign: 'center', mb: 'var(--spacing-md)' }}>
                        <Link
                            component={RouterLink}
                            to="/forgot-password"
                            sx={{
                                color: 'var(--semantic-primary)',
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: 'var(--semantic-primary-intense)',
                                },
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                            ¿No tienes una cuenta?
                        </Typography>
                        <Link
                            component={RouterLink}
                            to="/register"
                            sx={{
                                color: 'var(--semantic-secondary)',
                                textDecoration: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: 'var(--semantic-secondary-intense)',
                                },
                            }}
                        >
                            Crear cuenta nueva
                        </Link>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 'var(--spacing-md)' }}>
                        <Link
                            onClick={handleBackToLanding}
                            sx={{
                                color: 'var(--semantic-primary)',
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: 'var(--semantic-primary-intense)',
                                },
                            }}
                        >
                            Volver al Inicio
                        </Link>
                    </Box>

                    {/* Efectos decorativos */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 100,
                            height: 100,
                            background: 'var(--gradient-primary-subtle)',
                            borderRadius: 'var(--border-radius-full)',
                            opacity: 0.1,
                            zIndex: 0,
                        }}
                    />
                </Paper>
            </motion.div>
        </Box>
    );
};

export default LoginPage;