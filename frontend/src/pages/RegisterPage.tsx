import React, { useEffect } from 'react';
import { Box, Paper, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Step1DatosPersonales from '@/components/Registration/Step1DatosPersonales';
import Step2DatosIdentidad from '@/components/Registration/Step2DatosIdentidad';
import Step3Direccion from '@/components/Registration/Step3Direccion';
import BotonesRegistro from '@/components/Registration/BotonesRegistro';
import { RegisterFormProvider, useRegisterFormContext } from '@/context/RegisterFormContext';
import ParticleBackground from '@/components/ParticleBackground';
import AppLayout from '@/layout/AppLayout';
import PageContainer from '@/layout/PageContainer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import log from 'loglevel';

const steps = ['Datos personales', 'Datos de identidad', 'Dirección'];

const RegisterPageContent: React.FC = () => {
    const theme = useTheme();
    const {
        currentStep,
        handleNext,
        handleBack,
        loading,
    } = useRegisterFormContext();

    // 🔍 Debug: Verificar que las funciones existen
    useEffect(() => {
        console.log('🔍 [RegisterPage] Funciones del contexto:', {
            currentStep,
            handleNext: typeof handleNext,
            handleBack: typeof handleBack,
            loading
        });
    }, [currentStep, handleNext, handleBack, loading]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <Step1DatosPersonales />;
            case 2: return <Step2DatosIdentidad />;
            case 3: return <Step3Direccion />;
            default: return <Typography>Error: paso inválido</Typography>;
        }
    };

    useEffect(() => {
        console.log('📋 [RegisterPage] currentStep cambió a:', currentStep);
        log.info(`[RegisterPage] Paso actual: ${currentStep}/${steps.length}`);
    }, [currentStep]);

    return (
        <AppLayout>
            <ErrorBoundary>
                <ParticleBackground />

                <PageContainer maxWidth="md" sx={{ pb: { xs: 10, sm: 4 } }}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: { xs: 'var(--spacing-lg)', sm: 'var(--spacing-xl)' },
                            borderRadius: 'var(--border-radius-xl)',
                            background: 'var(--glass-background-strong)',
                            backdropFilter: 'var(--glass-backdrop)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: 'var(--shadow-floating)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header del formulario */}
                        <Box sx={{ textAlign: 'center', mb: 'var(--spacing-xl)' }}>
                            <Typography 
                                variant="h3" 
                                sx={{ 
                                    fontWeight: 800,
                                    mb: 'var(--spacing-md)',
                                    background: 'var(--gradient-primary)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontFamily: 'var(--font-heading)',
                                }}
                            >
                                Crear Cuenta
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'var(--text-secondary)',
                                    maxWidth: 400,
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                }}
                            >
                                Únete a la revolución financiera digital
                            </Typography>
                        </Box>

                        {/* Stepper mejorado */}
                        <Stepper 
                            activeStep={currentStep} 
                            alternativeLabel 
                            sx={{ 
                                mb: 'var(--spacing-xl)',
                                '& .MuiStepLabel-root .Mui-completed': {
                                    color: 'var(--semantic-success)',
                                },
                                '& .MuiStepLabel-root .Mui-active': {
                                    color: 'var(--semantic-primary)',
                                },
                                '& .MuiStepLabel-label': {
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                },
                                '& .MuiStepLabel-label.Mui-active': {
                                    color: 'var(--semantic-primary)',
                                    fontWeight: 600,
                                },
                                '& .MuiStepLabel-label.Mui-completed': {
                                    color: 'var(--semantic-success)',
                                    fontWeight: 600,
                                },
                                '& .MuiStepConnector-line': {
                                    borderColor: 'var(--border-light)',
                                },
                                '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                                    borderColor: 'var(--semantic-success)',
                                },
                                '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                                    borderColor: 'var(--semantic-primary)',
                                },
                            }}
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {/* Contenido del paso actual */}
                        <Box sx={{ 
                            minHeight: 400,
                            mb: 'var(--spacing-xl)',
                        }}>
                            {renderStepContent()}
                        </Box>

                        {/* Botones de navegación */}
                        <BotonesRegistro
                            currentStep={currentStep}
                            handleNext={handleNext}
                            handleBack={handleBack}
                            loading={loading}
                        />

                        {/* Efecto visual de fondo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -100,
                                right: -100,
                                width: 200,
                                height: 200,
                                background: 'var(--gradient-primary-subtle)',
                                borderRadius: 'var(--border-radius-full)',
                                opacity: 0.1,
                                zIndex: 0,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -50,
                                left: -50,
                                width: 150,
                                height: 150,
                                background: 'var(--gradient-secondary-subtle)',
                                borderRadius: 'var(--border-radius-full)',
                                opacity: 0.1,
                                zIndex: 0,
                            }}
                        />
                    </Paper>
                </PageContainer>
            </ErrorBoundary>
        </AppLayout>
    );
};

const RegisterPage: React.FC = () => {
    return (
        <RegisterFormProvider>
            <RegisterPageContent />
        </RegisterFormProvider>
    );
};

export default RegisterPage;
