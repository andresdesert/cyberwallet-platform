// src/components/ui/NeumorphicTextField.tsx

import React, { useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Box,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Info as InfoIcon,
  CheckCircle,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface NeumorphicTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  enableVisibilityToggle?: boolean;
  validationStatus?: 'success' | 'error' | 'warning' | 'default';
  isLoadingValidation?: boolean;
  tooltipMessage?: string;
  maxLength?: number;
}

const NeumorphicTextField: React.FC<NeumorphicTextFieldProps> = ({
  enableVisibilityToggle = false,
  validationStatus = 'default',
  isLoadingValidation = false,
  tooltipMessage,
  maxLength,
  ...props
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getValidationIcon = () => {
    if (isLoadingValidation) {
      return <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${theme.palette.primary.main}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />;
    }

    switch (validationStatus) {
      case 'success':
        return <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 20 }} />;
      case 'error':
        return <ErrorIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getValidationColor = () => {
    switch (validationStatus) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // 🎯 MEJORADO: Función para crear efecto glow
  const createGlowEffect = (color: string, intensity: number = 0.3) => {
    return `0 0 0 3px ${alpha(color, intensity)}`;
  };

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <TextField
        {...props}
        variant="outlined"
        type={enableVisibilityToggle && props.type === 'password' ? (showPassword ? 'text' : 'password') : props.type}
        InputProps={{
          ...props.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              {getValidationIcon()}
              {enableVisibilityToggle && props.type === 'password' && (
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  sx={{ ml: 1 }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
              {tooltipMessage && (
                <Tooltip
                  title={tooltipMessage}
                  open={showTooltip}
                  onClose={() => setShowTooltip(false)}
                  placement="top"
                >
                  <IconButton
                    size="small"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    sx={{ ml: 1 }}
                  >
                    <InfoIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  </IconButton>
                </Tooltip>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          // 🎯 MEJORADO: Contenedor principal con mejor espaciado
          '& .MuiFormControl-root': {
            marginBottom: 0,
          },
          
          // 🎯 MEJORADO: Labels con posicionamiento correcto
          '& .MuiInputLabel-root': {
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
            fontWeight: 500,
            fontSize: '0.875rem',
            transform: 'translate(14px, 16px) scale(1)', // Posición inicial correcta
            '&.Mui-focused': {
              color: getValidationColor(),
              transform: 'translate(14px, -9px) scale(0.75)', // Posición cuando está enfocado
            },
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)', // Posición cuando tiene valor
            },
          },
          
          // 🎯 MEJORADO: Input con mejor padding y efectos
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: theme.palette.mode === 'dark'
              ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.05)'
              : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
            
            // 🎯 MEJORADO: Padding interno para que el label quede encima
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '16px',
            paddingRight: '16px',
            
            // 🎯 NUEVO: Efectos de hover mejorados
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.4),
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(255, 255, 255, 0.9)',
              boxShadow: theme.palette.mode === 'dark'
                ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.4), inset -2px -2px 4px rgba(255, 255, 255, 0.08), 0 0 0 2px rgba(99, 102, 241, 0.1)'
                : 'inset 2px 2px 4px rgba(0, 0, 0, 0.15), inset -2px -2px 4px rgba(255, 255, 255, 0.9), 0 0 0 2px rgba(99, 102, 241, 0.08)',
            },
            
            // 🎯 NUEVO: Efecto glow on-focus
            '&.Mui-focused': {
              borderColor: getValidationColor(),
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 1)',
              boxShadow: theme.palette.mode === 'dark'
                ? `inset 1px 1px 2px rgba(0, 0, 0, 0.2), inset -1px -1px 2px rgba(255, 255, 255, 0.1), ${createGlowEffect(getValidationColor(), 0.3)}`
                : `inset 1px 1px 2px rgba(0, 0, 0, 0.1), inset -1px -1px 2px rgba(255, 255, 255, 1), ${createGlowEffect(getValidationColor(), 0.2)}`,
              transform: 'translateY(-1px)',
            },
            
            // 🎯 MEJORADO: Estado de error
            '&.Mui-error': {
              borderColor: theme.palette.error.main,
              boxShadow: theme.palette.mode === 'dark'
                ? `inset 1px 1px 2px rgba(0, 0, 0, 0.2), inset -1px -1px 2px rgba(255, 255, 255, 0.1), ${createGlowEffect(theme.palette.error.main, 0.3)}`
                : `inset 1px 1px 2px rgba(0, 0, 0, 0.1), inset -1px -1px 2px rgba(255, 255, 255, 1), ${createGlowEffect(theme.palette.error.main, 0.2)}`,
            },
            
            // 🎯 MEJORADO: Input interno con mejor contraste
            '& input': {
              color: theme.palette.mode === 'dark' ? '#F8FAFC' : '#1F2937',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '8px 0',
              '&::placeholder': {
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                opacity: 1,
              },
            },
            
            // 🎯 MEJORADO: Textarea con mejor contraste
            '& textarea': {
              color: theme.palette.mode === 'dark' ? '#F8FAFC' : '#1F2937',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '8px 0',
              '&::placeholder': {
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                opacity: 1,
              },
            },
            
            // 🎯 MEJORADO: Select con mejor contraste
            '& .MuiSelect-select': {
              color: theme.palette.mode === 'dark' ? '#F8FAFC' : '#1F2937',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '8px 0',
            },
            
            // 🎯 MEJORADO: Outline del input
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none', // Removemos el outline por defecto
            },
            
            // 🎯 MEJORADO: Iconos de validación
            '& .MuiInputAdornment-root': {
              marginLeft: 1,
              '& .MuiIconButton-root': {
                color: theme.palette.text.secondary,
                '&:hover': {
                  color: getValidationColor(),
                  backgroundColor: alpha(getValidationColor(), 0.1),
                },
              },
            },
          },
          
          // 🎯 MEJORADO: Helper text con mejor contraste
          '& .MuiFormHelperText-root': {
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            fontSize: '0.875rem',
            fontWeight: 400,
            marginTop: '8px',
            marginLeft: '16px',
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
          },
        }}
      />
      
      {/* 🎯 NUEVO: Contador de caracteres mejorado */}
      {maxLength && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -24,
            right: 0,
            fontSize: '0.75rem',
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            padding: '2px 6px',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
          }}
        >
          {props.value?.toString().length || 0}/{maxLength}
        </Box>
      )}
    </Box>
  );
};

export default NeumorphicTextField;
