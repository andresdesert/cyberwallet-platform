import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import NeumorphicTextField from '@/components/ui/NeumorphicTextField';
import { useRegisterFormContext } from '@/context/RegisterFormContext';
import log from 'loglevel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

const Step1DatosPersonales: React.FC = () => {
    const {
        form,
        errors,
        touched,
        handleChangeEvent,
        handleBlur,
        availability,
        loadingChecks,
    } = useRegisterFormContext();

    const { t } = useTranslation();

    useEffect(() => {
        log.debug('[Step1DatosPersonales] Montado.');
    }, []);

    const validationStatus = (field: keyof typeof form): 'default' | 'success' | 'error' => {
        if (!touched[field]) return 'default';
        if (errors[field]) return 'error';
        return 'success';
    };

    const safeHelper = (field: keyof typeof form) =>
        touched[field] && errors[field] ? errors[field] : '';

    const getEmailAdornment = () => {
        if (loadingChecks.email) return null;
        if (touched.email && form.email) {
            if (errors.email || availability.email === false) {
                return (
                    <Tooltip title={availability.email === false ? t('email_registrado') : errors.email} arrow>
                        <ErrorIcon color="error" />
                    </Tooltip>
                );
            }
            if (availability.email === true) {
                return (
                    <Tooltip title="Email disponible" arrow>
                        <CheckCircleIcon color="success" />
                    </Tooltip>
                );
            }
        }
        return null;
    };

    const getUsernameAdornment = () => {
        if (loadingChecks.username) return null;
        if (touched.username && form.username) {
            if (errors.username || availability.username === false) {
                return (
                    <Tooltip title={availability.username === false ? t('nombre_usuario_en_uso') : errors.username} arrow>
                        <ErrorIcon color="error" />
                    </Tooltip>
                );
            }
            if (availability.username === true) {
                return (
                    <Tooltip title="Nombre de usuario disponible" arrow>
                        <CheckCircleIcon color="success" />
                    </Tooltip>
                );
            }
        }
        return null;
    };

    return (
        <Box
            component="section"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 2.5 },
                width: '100%',
                mt: { xs: 2, sm: 0 },
            }}
        >
            <NeumorphicTextField
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('nombre')}
                error={!!safeHelper('nombre')}
                helperText={safeHelper('nombre')}
                required
                validationStatus={validationStatus('nombre')}
                maxLength={30}
                tooltipMessage="Solo letras y espacios. Mínimo 2, máximo 30 caracteres."
            />

            <NeumorphicTextField
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('apellido')}
                error={!!safeHelper('apellido')}
                helperText={safeHelper('apellido')}
                required
                validationStatus={validationStatus('apellido')}
                maxLength={40}
                tooltipMessage="Solo letras y espacios. Mínimo 2, máximo 40 caracteres."
            />

            <NeumorphicTextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('email')}
                error={!!safeHelper('email') || (touched.email && availability.email === false)}
                helperText={errors.email ? t('email_registrado') : ''}
                required
                validationStatus={validationStatus('email')}
                isLoadingValidation={loadingChecks.email}
                maxLength={64}
                tooltipMessage="Formato válido: usuario@dominio.com"
                InputProps={{
                    endAdornment: getEmailAdornment(),
                    'aria-invalid': !!safeHelper('email') || (touched.email && availability.email === false),
                    'aria-describedby': 'register-email-helper',
                }}
                FormHelperTextProps={{ id: 'register-email-helper', 'aria-live': 'polite' }}
            />

            <NeumorphicTextField
                label="Nombre de usuario"
                name="username"
                value={form.username}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('username')}
                error={!!safeHelper('username') || (touched.username && availability.username === false)}
                helperText={errors.username ? t('nombre_usuario_en_uso') : ''}
                required
                validationStatus={validationStatus('username')}
                isLoadingValidation={loadingChecks.username}
                maxLength={20}
                tooltipMessage="4–20 caracteres. Letras, números, guion y guión bajo."
                InputProps={{
                    endAdornment: getUsernameAdornment(),
                    'aria-invalid': !!safeHelper('username') || (touched.username && availability.username === false),
                    'aria-describedby': 'register-username-helper',
                }}
                FormHelperTextProps={{ id: 'register-username-helper', 'aria-live': 'polite' }}
            />

            <NeumorphicTextField
                label="Contraseña"
                name="password"
                value={form.password}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('password')}
                error={!!safeHelper('password')}
                helperText={safeHelper('password')}
                required
                enableVisibilityToggle
                validationStatus={validationStatus('password')}
                maxLength={64}
                tooltipMessage="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo."
            />

            <NeumorphicTextField
                label="Confirmar contraseña"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('confirmPassword')}
                error={!!safeHelper('confirmPassword')}
                helperText={safeHelper('confirmPassword')}
                required
                enableVisibilityToggle
                validationStatus={validationStatus('confirmPassword')}
                maxLength={64}
                tooltipMessage="Debe coincidir exactamente con la contraseña."
            />
        </Box>
    );
};

export default Step1DatosPersonales;
