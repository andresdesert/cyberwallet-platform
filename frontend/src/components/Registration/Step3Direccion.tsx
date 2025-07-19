import React, { useEffect, useState } from "react";
import {
    Box,
    InputAdornment,
    Skeleton,
    Alert,
    Tooltip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NeumorphicTextField from "@/components/ui/NeumorphicTextField";
import ProvinciaInput from "@/components/Registration/ProvinciaInput";
import PaisInput from "@/components/Registration/PaisInput";
import { useRegisterFormContext } from "@/context/RegisterFormContext";
import { countriesFallback } from "@/data/countriesFallback";
import log from "loglevel";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';

// 🎯 Interfaz actualizada para consistencia
interface Pais {
    id: number;
    name: string;
    iso2: string;
    iso3: string;
    phonecode: string;
    capital: string;
    currency: string;
    native: string;
    emoji: string;
}

const Step3Direccion: React.FC = () => {
    const theme = useTheme();
    
    const {
        form,
        errors,
        touched,
        handleChangeEvent,
        handleBlur,
    } = useRegisterFormContext();

    // 🎯 Estados optimizados
    const [paises] = useState<Pais[]>(countriesFallback); // Usar directamente el fallback
    const [loadingPaises] = useState(false); // Ya no necesitamos cargar
    const { t } = useTranslation();
    const [renderError, setRenderError] = useState<string | null>(null);

    useEffect(() => {
        log.debug('[DEV][Step3] Step3Direccion montado con países locales');
        return () => log.debug('[DEV][Step3] Step3Direccion desmontado');
    }, []);

    // 🎯 Funciones de validación mejoradas
    const validationStatus = (field: keyof typeof form): 'default' | 'success' | 'error' => {
        if (!touched[field]) return 'default';
        if (errors[field]) return 'error';
        return 'success';
    };

    const safeHelper = (field: string) =>
        touched[field] && errors[field] ? errors[field] : "";

    const handleFieldChange = (name: string) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        handleChangeEvent(e);
    };

    const handleFieldBlur = (name: string) => () => {
        handleBlur(name);
    };

    // 🎯 Helper texts mejorados
    const getPaisHelperText = () => {
        if (touched.pais && errors.pais) return errors.pais;
        return 'Selecciona tu país de residencia';
    };

    // 🎯 Contenido principal con mejor manejo de errores
    let content: React.ReactNode;
    try {
        content = (
            <Box
                component="section"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2.5, sm: 3 },
                    width: '100%',
                    mt: { xs: 2, sm: 0 },
                }}
                role="form"
                aria-label="Datos de dirección"
            >
                {/* 📍 Campo Calle - Validación mejorada */}
                <NeumorphicTextField
                    name="calle"
                    label="Calle"
                    placeholder="Ej: Av. Corrientes 1234"
                    value={form.calle}
                    onChange={handleFieldChange("calle")}
                    onBlur={handleFieldBlur("calle")}
                    validationStatus={validationStatus("calle")}
                    error={!!touched.calle && !!errors.calle}
                    helperText={safeHelper("calle") || "Nombre de la calle o avenida"}
                    required
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Tooltip title="Dirección de calle">
                                    <HomeIcon sx={{ color: theme.palette.text.secondary }} />
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    inputProps={{
                        maxLength: 100,
                        autoComplete: "street-address",
                        'aria-describedby': 'calle-helper-text',
                    }}
                />

                {/* 🔢 Campo Número - Mejorado */}
                <NeumorphicTextField
                    name="numero"
                    label="Número"
                    placeholder="1234"
                    value={form.numero || ''}
                    onChange={handleFieldChange("numero")}
                    onBlur={handleFieldBlur("numero")}
                    validationStatus={validationStatus("numero")}
                    error={!!touched.numero && !!errors.numero}
                    helperText={safeHelper("numero") || "Número de la dirección (1-9999)"}
                    required
                    fullWidth
                    type="number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Tooltip title="Número de dirección">
                                    <LocationOnIcon sx={{ color: theme.palette.text.secondary }} />
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                    inputProps={{
                        min: 1,
                        max: 9999,
                        autoComplete: "address-line2",
                        'aria-describedby': 'numero-helper-text',
                    }}
                />

                {/* 🌍 Selector de País - Optimizado */}
                {loadingPaises ? (
                    <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height={56} 
                        sx={{ borderRadius: 2 }}
                        animation="wave"
                    />
                ) : (
                    <PaisInput
                        value={form.pais}
                        onChange={handleFieldChange("pais")}
                        onBlur={handleFieldBlur("pais")}
                        error={!!touched.pais && !!errors.pais}
                        helperText={getPaisHelperText()}
                        touched={touched.pais}
                        opciones={paises.map(p => ({ nombre: p.name, iso2: p.iso2 }))} // Mapear al formato esperado
                        loading={loadingPaises}
                    />
                )}

                {/* 🗺️ Selector de Provincia - Dependiente del país */}
                <ProvinciaInput
                    value={form.provincia}
                    onChange={handleFieldChange("provincia")}
                    onBlur={handleFieldBlur("provincia")}
                    error={!!touched.provincia && !!errors.provincia}
                    helperText={safeHelper("provincia") || "Selecciona tu provincia/estado"}
                    pais={form.pais}
                    touched={touched.provincia}
                    loading={false}
                />

                {/* 🎯 Información adicional para el usuario */}
                {form.pais && (
                    <Alert 
                        severity="info" 
                        sx={{ 
                            borderRadius: 2,
                            backgroundColor: theme.palette.mode === 'dark' 
                                ? 'rgba(33, 150, 243, 0.1)' 
                                : 'rgba(33, 150, 243, 0.05)',
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        País seleccionado: {paises.find(p => p.iso2 === form.pais)?.name || form.pais} {paises.find(p => p.iso2 === form.pais)?.emoji}
                    </Alert>
                )}
            </Box>
        );
    } catch (error) {
        log.error('[Step3] Error en el render:', error);
        setRenderError(String(error));
        content = (
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
                <Alert 
                    severity="error"
                    action={
                        <button 
                            onClick={() => {
                                setRenderError(null);
                                window.location.reload();
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Recargar
                        </button>
                    }
                >
                    {t('error_render') || 'Error al cargar el formulario. Por favor, recarga la página.'}
                    {renderError && process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: 8 }}>
                            <summary>Detalles técnicos</summary>
                            <pre style={{ fontSize: 12, marginTop: 4 }}>{renderError}</pre>
                        </details>
                    )}
                </Alert>
            </Box>
        );
    }

    return content;
};

export default Step3Direccion;
