import React, { useEffect } from 'react';
import { Box, MenuItem, InputAdornment } from '@mui/material';
import NeumorphicTextField from '@/components/ui/NeumorphicTextField';
import {
    CalendarToday,
    Badge as DniIcon,
    Wc as GenderIcon,
    PhoneAndroid as PhoneIcon,
    ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { parseISO } from 'date-fns';
import { useRegisterFormContext } from '@/context/RegisterFormContext';
import log from 'loglevel';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const generos = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'No binario / Otro' },
    { value: 'Prefiero no decirlo', label: 'Prefiero no decirlo' },
];

const Step2DatosIdentidad: React.FC = () => {
    const theme = useTheme();
    const {
        form,
        errors,
        touched,
        handleChangeEvent,
        handleBlur,
    } = useRegisterFormContext();

    useEffect(() => {
        log.debug('[Step2DatosIdentidad] Montado');
        return () => log.debug('[Step2DatosIdentidad] Desmontado');
    }, []);

    const validateAge = (dateString: string): string | null => {
        if (!dateString) return 'Campo requerido.';
        const fecha = parseISO(dateString);
        if (isNaN(fecha.getTime())) return 'Formato de fecha inválido.';
        const hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const m = hoy.getMonth() - fecha.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
        if (edad < 18) return 'Debes tener al menos 18 años.';
        if (edad > 100) return 'La edad máxima permitida es 100 años.';
        return null;
    };

    const validationStatus = (field: keyof typeof form): 'default' | 'success' | 'error' => {
        if (!touched[field]) return 'default';
        if (errors[field]) return 'error';
        return 'success';
    };

    const safeHelper = (field: keyof typeof form) =>
        touched[field] && errors[field] ? errors[field] : '';

    const isFechaNacimientoError = (): boolean => {
        const ageError = validateAge(String(form.fechaNacimiento ?? ''));
        return touched.fechaNacimiento === true && (!!errors.fechaNacimiento || !!ageError);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeEvent(event);
    };

    return (
        <Box
            component="section"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 2.5 },
                width: '100%',
            }}
        >
            <NeumorphicTextField
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento || ''}
                onChange={handleDateChange}
                onBlur={(e) => handleBlur(e.target.name)}
                error={isFechaNacimientoError()}
                helperText={isFechaNacimientoError() ? (errors.fechaNacimiento || validateAge(String(form.fechaNacimiento ?? ''))) : ''}
                required
                tooltipMessage="Debes ser mayor de 18 años para registrarte."
                validationStatus={validationStatus('fechaNacimiento')}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Tooltip title="Selecciona tu fecha de nacimiento" arrow>
                                <CalendarToday sx={{ color: theme.palette.text.secondary }} />
                            </Tooltip>
                        </InputAdornment>
                    ),
                    endAdornment: isFechaNacimientoError() ? (
                        <InputAdornment position="end">
                            <ErrorOutlineIcon color="error" />
                        </InputAdornment>
                    ) : null,
                }}
            />

            <NeumorphicTextField
                label="DNI"
                name="dni"
                value={form.dni}
                onChange={handleChangeEvent}
                onBlur={() => handleBlur('dni')}
                error={!!safeHelper('dni')}
                helperText={safeHelper('dni') || ' '}
                required
                validationStatus={validationStatus('dni')}
                maxLength={10}
                tooltipMessage="Solo números, sin puntos ni guiones."
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Tooltip title="Número de DNI" arrow>
                                <DniIcon sx={{ color: theme.palette.text.secondary }} />
                            </Tooltip>
                        </InputAdornment>
                    ),
                    endAdornment: touched.dni && form.dni ? (
                        errors.dni ? (
                            <Tooltip title={errors.dni} arrow>
                                <ErrorIcon color="error" />
                            </Tooltip>
                        ) : (
                            <Tooltip title="DNI válido" arrow>
                                <CheckCircleIcon color="success" />
                            </Tooltip>
                        )
                    ) : null,
                    'aria-invalid': !!safeHelper('dni'),
                    'aria-describedby': 'register-dni-helper',
                }}
                FormHelperTextProps={{ id: 'register-dni-helper', 'aria-live': 'polite' }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 8 }}
            />

            <NeumorphicTextField
                label="Género"
                name="genero"
                value={form.genero}
                onChange={handleChangeEvent}
                onBlur={(e) => handleBlur(e.target.name)}
                error={!!touched.genero && !!errors.genero}
                helperText={safeHelper('genero')}
                required
                select
                tooltipMessage="Selecciona tu género"
                validationStatus={validationStatus('genero')}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Tooltip title="Género" arrow>
                                <GenderIcon sx={{ color: theme.palette.text.secondary }} />
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            >
                {generos.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? alpha(theme.palette.custom?.neumoSurface || theme.palette.background.paper, 0.8)
                                    : undefined,
                            color: theme.palette.text.primary,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            },
                        }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </NeumorphicTextField>

            <NeumorphicTextField
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChangeEvent}
                onBlur={(e) => handleBlur(e.target.name)}
                error={!!touched.telefono && !!errors.telefono}
                helperText={
                    safeHelper('telefono') || 'Debe tener 10 dígitos. No comenzar con 0 ni 15.'
                }
                required
                tooltipMessage="Ingresa un número válido sin 0 ni 15. Ej: 1123456789"
                validationStatus={validationStatus('telefono')}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Tooltip title="Número de teléfono" arrow>
                                <PhoneIcon sx={{ color: theme.palette.text.secondary }} />
                            </Tooltip>
                        </InputAdornment>
                    ),
                    endAdornment: !!touched.telefono && !!errors.telefono ? (
                        <InputAdornment position="end">
                            <ErrorOutlineIcon color="error" />
                        </InputAdornment>
                    ) : null,
                }}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
            />
        </Box>
    );
};

export default Step2DatosIdentidad;
