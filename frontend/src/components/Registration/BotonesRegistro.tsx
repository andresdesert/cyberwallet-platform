import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Home, ArrowForward, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import log from 'loglevel';
import { alpha } from '@mui/material/styles';
import { useRegisterFormContext } from '@/context/RegisterFormContext';

interface Props {
    currentStep: number;
    handleNext: () => void;
    handleBack: () => void;
    loading?: boolean;
}

const BotonesRegistro: React.FC<Props> = ({
                                              currentStep,
                                              handleNext,
                                              handleBack,
                                              loading = false,
                                          }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { form, errors } = useRegisterFormContext();

    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            log.debug(`[DEBUG][BotonesRegistro] Paso actual: ${currentStep}`);
        }
    }, [currentStep]);

    const handleVolverInicioClick = () => {
        console.log('🏠 [BotonesRegistro] Botón Volver al Inicio clickeado');
        log.info(`[BotonesRegistro] Usuario vuelve al inicio desde paso ${currentStep}`);
        navigate('/');
    };

    return (
        <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent={{ xs: 'center', sm: 'space-between' }}
            alignItems="center"
            gap={2}
            mt={{ xs: 4, sm: 6 }}
            mb={{ xs: 2, sm: 0 }}
            width="100%"
            position="relative" // 🎯 CRÍTICO: Asegura posicionamiento correcto
        >
            {/* Izquierda */}
            <Box display="flex" gap={2} order={{ xs: 1, sm: 1 }}>
                {/* Botón Atrás - visible en pasos 2 y 3 */}
                {currentStep > 1 && (
                    <Button
                        variant="text"
                        color="info"
                        onClick={() => {
                            console.log('🔙 [BotonesRegistro] Botón Atrás clickeado, paso actual:', currentStep);
                            console.log('🔙 [BotonesRegistro] handleBack es función:', typeof handleBack);
                            if (typeof handleBack === 'function') {
                                handleBack();
                            } else {
                                console.error('❌ [BotonesRegistro] handleBack no es una función:', handleBack);
                            }
                        }}
                        disabled={loading}
                        startIcon={<ArrowBack />}
                        sx={{
                            color: theme.palette.mode === 'dark' 
                                ? '#90caf9'
                                : theme.palette.info.main,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? alpha('#90caf9', 0.15)
                                : alpha(theme.palette.info.main, 0.1),
                            border: theme.palette.mode === 'dark'
                                ? '1px solid rgba(144, 202, 249, 0.3)'
                                : '1px solid rgba(25, 118, 210, 0.2)',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? alpha('#90caf9', 0.25)
                                    : alpha(theme.palette.info.main, 0.2),
                                borderColor: theme.palette.mode === 'dark'
                                    ? 'rgba(144, 202, 249, 0.5)'
                                    : 'rgba(25, 118, 210, 0.4)',
                                color: theme.palette.mode === 'dark' 
                                    ? '#bbdefb' 
                                    : theme.palette.info.main,
                                transform: 'translateY(-1px)',
                            },
                            '&:disabled': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? alpha('#90caf9', 0.08)
                                    : alpha(theme.palette.info.main, 0.05),
                                color: theme.palette.mode === 'dark' 
                                    ? '#64b5f6' 
                                    : theme.palette.info.light,
                                borderColor: theme.palette.mode === 'dark'
                                    ? 'rgba(144, 202, 249, 0.15)'
                                    : 'rgba(25, 118, 210, 0.1)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Atrás
                    </Button>
                )}
                
                {/* Botón Volver al Inicio - siempre visible */}
                <Button
                    variant="text"
                    color="info"
                    onClick={handleVolverInicioClick}
                    startIcon={<Home />}
                    size="small"
                    sx={{
                        order: { xs: 3, sm: 2 },
                        textAlign: 'center',
                        flexShrink: 0,
                        color: theme.palette.mode === 'dark' 
                            ? '#90caf9'
                            : theme.palette.info.main,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? alpha('#90caf9', 0.15)
                            : alpha(theme.palette.info.main, 0.1),
                        border: theme.palette.mode === 'dark'
                            ? '1px solid rgba(144, 202, 249, 0.3)'
                            : '1px solid rgba(25, 118, 210, 0.2)',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? alpha('#90caf9', 0.25)
                                : alpha(theme.palette.info.main, 0.2),
                            borderColor: theme.palette.mode === 'dark'
                                ? 'rgba(144, 202, 249, 0.5)'
                                : 'rgba(25, 118, 210, 0.4)',
                            color: theme.palette.mode === 'dark' 
                                ? '#bbdefb' 
                                : theme.palette.info.main,
                            transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    Volver al inicio
                </Button>
            </Box>

            {/* Derecha */}
            <Box order={{ xs: 2, sm: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={loading}
                    endIcon={currentStep === 3 ? <CheckCircle /> : <ArrowForward />}
                    size="large"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 4px 24px rgba(0,91,170,0.18)',
                      background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: '#fff',
                      transition: 'box-shadow 0.3s, background 0.3s',
                      '&:hover': {
                        boxShadow: '0 0 0 4px #e2001a33',
                        background: (theme) => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      },
                      '&:focus-visible': {
                        outline: '2px solid #1976d2',
                        outlineOffset: '2px',
                      },
                    }}
                    aria-label={currentStep === 3 ? 'Crear cuenta' : 'Siguiente paso'}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (currentStep === 3 ? 'Crear cuenta' : 'Siguiente')}
                  </Button>
            </Box>
        </Box>
    );
};

export default BotonesRegistro;
