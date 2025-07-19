// src/pages/ForgotPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import NeumorphicTextField from '@/components/ui/NeumorphicTextField';
import NeumorphicSkeleton from '@/components/ui/NeumorphicSkeleton';
import { emailRegex } from '@/helpers/validators';
import ParticleBackground from '@/components/ParticleBackground';
import axiosInstance from '@/api/axiosInstance';
import log from 'loglevel';
import EmailIcon from '@mui/icons-material/Email';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AppLayout from '@/layout/AppLayout';
import PageContainer from '@/layout/PageContainer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null); // Specific error for email field
  const [generalError, setGeneralError] = useState<string | null>(null); // General error for Alert component
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // For submission loading
  const [pageLoading, setPageLoading] = useState(true); // For initial skeleton loading

  // Log component mount/unmount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      log.debug('[DEBUG][DEV][ForgotPasswordPage] Componente ForgotPasswordPage montado.');
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        log.debug('[DEBUG][DEV][ForgotPasswordPage] Componente ForgotPasswordPage desmontado.');
      }
    };
  }, []);

  // Simulate page loading with skeleton
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      if (process.env.NODE_ENV === 'development') {
        log.debug('[DEBUG][DEV][ForgotPasswordPage] Simulación de carga de página terminada.');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Internacionalización (simulada, reemplazar por useTranslation si se usa i18n)
  const t = (key: string) => {
    const dict: Record<string, string> = {
      'forgot.email_required': 'El email es obligatorio.',
      'forgot.email_invalid': 'El formato del email no es válido.',
      'forgot.email_valid': 'Email válido',
      'forgot.email_invalid_tooltip': 'Email inválido',
      'forgot.send_link': 'Enviar Enlace de Restablecimiento',
      'forgot.back_to_login': 'Volver al login',
      'forgot.success': '¡Listo! Si el correo ingresado está registrado, recibirás instrucciones para recuperar tu contraseña en breve.',
      'forgot.general_error': 'Por favor, corrige el email antes de continuar.',
      'forgot.title': 'Recuperar Contraseña',
      'forgot.email_label': 'Correo electrónico',
      'forgot.email_placeholder': 'Ingresa tu correo electrónico registrado',
    };
    return dict[key] || key;
  };

  // Validate email field on change and blur
  const validateEmailField = (value: string): string | null => {
    if (!value.trim()) {
      return t('forgot.email_required');
    }
    if (!emailRegex.test(value)) {
      return t('forgot.email_invalid');
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Validate instantly for feedback
    const errorMsg = validateEmailField(newEmail);
    setEmailError(errorMsg);
    // Clear general error if field becomes valid
    if (generalError && !errorMsg) {
      setGeneralError(null);
    }
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEBUG][DEV][ForgotPasswordPage] Email cambiado a: "${newEmail}". Error: ${errorMsg || 'Ninguno'}.`);
    }
  };

  const handleEmailBlur = () => {
    setTouched(true);
    // Validate on blur to show error if field is empty/invalid
    const errorMsg = validateEmailField(email);
    setEmailError(errorMsg);
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEBUG][DEV][ForgotPasswordPage] Email desenfocado. Error: ${errorMsg || 'Ninguno'}.`);
    } else if (process.env.NODE_ENV === 'test' && errorMsg) {
      log.warn(`[WARN][TEST][ForgotPasswordPage] Error en el campo de email al desenfocar: ${errorMsg}`);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    setTouched(true); // Ensure field is marked as touched on submission attempt
    setGeneralError(null); // Clear previous general errors
    setSuccess(false);

    // Final validation before submission
    const finalEmailError = validateEmailField(email);
    if (finalEmailError) {
      setEmailError(finalEmailError); // Make sure error is visible
      setGeneralError(t('forgot.general_error'));
      document.getElementById('forgot-email')?.focus();
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        log.warn(`[WARN][${process.env.NODE_ENV.toUpperCase()}][ForgotPasswordPage] Intento de envío con email inválido: "${email}". Error: ${finalEmailError}.`);
      }
      return; // DO NOT PROCEED IF THERE ARE ERRORS
    }

    setLoading(true);
    if (process.env.NODE_ENV === 'development') {
      log.info(`[INFO][DEV][ForgotPasswordPage] Enviando solicitud de recuperación de contraseña para: "${email}".`);
    } else if (process.env.NODE_ENV === 'test') {
      log.debug(`[DEBUG][TEST][ForgotPasswordPage] Solicitando restablecimiento para: "${email}".`);
    } else if (process.env.NODE_ENV === 'production') {
      log.info(`[INFO][PROD][ForgotPasswordPage] Solicitud de restablecimiento iniciada.`);
    }

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });

      if (response?.data?.message) {
        setSuccess(true);
        if (process.env.NODE_ENV === 'development') {
          log.debug('[DEBUG][DEV][ForgotPasswordPage] Solicitud de recuperación exitosa. Mensaje:', response.data.message);
        } else if (process.env.NODE_ENV === 'test') {
          log.info('[INFO][TEST][ForgotPasswordPage] Solicitud de recuperación exitosa.');
        } else if (process.env.NODE_ENV === 'production') {
          log.info('[INFO][PROD][ForgotPasswordPage] Enlace de recuperación enviado.');
        }
      } else {
        const errorMsg = 'No se recibió una respuesta válida del servidor al solicitar el restablecimiento.';
        setGeneralError(errorMsg);
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
          log.error(`[ERROR][${process.env.NODE_ENV.toUpperCase()}][ForgotPasswordPage] ${errorMsg} Respuesta:`, response?.data);
        } else if (process.env.NODE_ENV === 'production') {
          log.error(`[ERROR][PROD][ForgotPasswordPage] Fallo de respuesta de servidor en recuperación de contraseña.`);
        }
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const detail = apiError?.response?.data?.detail || 'Error al enviar el email de recuperación';
      setGeneralError(detail);
      log.error('[ForgotPassword] Error HTTP:', detail);
    } finally {
      setLoading(false);
      if (process.env.NODE_ENV === 'development') {
        log.debug('[DEBUG][DEV][ForgotPasswordPage] Solicitud de recuperación finalizada.');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (process.env.NODE_ENV === 'development') {
        log.debug('[DEBUG][DEV][ForgotPasswordPage] Tecla Enter presionada. Intentando enviar formulario.');
      }
      handleSubmit(event);
    }
  };

  const getEmailStatus = (): 'default' | 'success' | 'error' => {
    if (!email) return 'default';
    if (emailError) return 'error';
    return 'success';
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled = loading || (touched && !!emailError);

  return (
      <AppLayout>
        <ParticleBackground />
        <PageContainer maxWidth={480}>
          {pageLoading ? (
              <Stack spacing={3}>
                <NeumorphicSkeleton variant="rectangular" height={56} />
                <NeumorphicSkeleton variant="rectangular" height={48} width="60%" sx={{ mx: 'auto' }} />
                <NeumorphicSkeleton variant="rectangular" height={36} width="40%" sx={{ mx: 'auto' }} />
              </Stack>
          ) : (
              <Box
                  sx={{
                    width: '100%',
                    backgroundColor: alpha(theme.palette.background.paper, 0.85),
                    backdropFilter: 'blur(15px) saturate(180%)',
                    borderRadius: 4,
                    boxShadow: `0 8px 30px ${alpha(theme.palette.custom.neumoDarkShadow, theme.palette.mode === 'dark' ? 0.7 : 0.3)}`,
                    border: `1px solid ${theme.palette.custom.glassBorder}`,
                    transition: 'all 0.3s ease-in-out',
                    p: { xs: 3, sm: 4 },
                    position: 'relative',
                    zIndex: 1,
                  }}
              >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ textAlign: 'center', color: theme.palette.primary.main, mb: 3, fontWeight: 600 }}
                >
                  {t('forgot.title')}
                </Typography>

                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                  <NeumorphicTextField
                      id="forgot-email"
                      label={t('forgot.email_label')}
                      name="email"
                      fullWidth
                      required
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      error={touched && !!emailError}
                      helperText={touched ? (emailError || ' ') : ' '}
                      validationStatus={getEmailStatus()}
                      tooltipMessage={t('forgot.email_placeholder')}
                      inputProps={{ 'aria-label': t('forgot.email_label') }}
                      autoComplete="email"
                      inputMode="email"
                      maxLength={64}
                                                              sx={{ 
                                            mb: 2, 
                                            transition: 'box-shadow 0.2s', 
                                            boxShadow: touched && emailError 
                                                ? `0 0 0 2px ${theme.palette.error.main}` 
                                                : touched && !emailError && email 
                                                    ? `0 0 0 2px ${theme.palette.success.main}` 
                                                    : undefined 
                                        }}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <Tooltip title={t('forgot.email_label')} arrow>
                                <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                              </Tooltip>
                            </InputAdornment>
                        ),
                        endAdornment: touched && email ? (
                            emailError ? (
                              <InputAdornment position="end">
                                <Tooltip title={t('forgot.email_invalid_tooltip')} arrow>
                                  <ErrorOutlineIcon color="error" />
                                </Tooltip>
                              </InputAdornment>
                            ) : (
                              <InputAdornment position="end">
                                <Tooltip title={t('forgot.email_valid')} arrow>
                                  <CheckCircleIcon color="success" />
                                </Tooltip>
                              </InputAdornment>
                            )
                        ) : null,
                        'aria-invalid': Boolean(touched && emailError),
                        'aria-describedby': 'forgot-email-helper',
                      }}
                      FormHelperTextProps={{ id: 'forgot-email-helper', 'aria-live': 'polite' }}
                  />

                  {generalError && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {generalError}
                      </Alert>
                  )}
                  {success && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        ¡Listo! Si el correo ingresado está registrado, recibirás instrucciones para recuperar tu contraseña en breve.
                      </Alert>
                  )}

                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, px: { xs: 4, sm: 6 }, py: { xs: 1.5, sm: 2 }, fontSize: { xs: '1rem', sm: '1.1rem' }, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'background 0.2s, transform 0.1s', '&:hover': { background: theme.palette.primary.dark, transform: 'scale(1.02)' } }}
                      disabled={isSubmitDisabled}
                      aria-label={t('forgot.send_link')}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('forgot.send_link')}
                  </Button>

                  <Button
                      fullWidth
                      variant="text"
                      onClick={() => {
                        window.location.href = '/login';
                        if (process.env.NODE_ENV === 'development') {
                          log.info('[INFO][DEV][ForgotPasswordPage] Redirigiendo a la página de login.');
                        }
                      }}
                      sx={{
                        mt: 1.5,
                        fontSize: '0.9rem',
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          textDecoration: 'underline',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'transform 0.2s ease-in-out',
                      }}
                      aria-label={t('forgot.back_to_login')}
                  >
                    Volver al login
                  </Button>
                </form>
              </Box>
          )}
        </PageContainer>
      </AppLayout>
  );
  };
  export default ForgotPasswordPage;
