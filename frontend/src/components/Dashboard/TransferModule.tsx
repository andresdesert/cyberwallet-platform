// ARCHIVO: src/components/TransferModule/TransferModule.tsx

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  ToggleButtonGroup, 
  ToggleButton, 
  Alert, 
  CircularProgress,
  InputAdornment,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { 
  AccountBalanceWallet, 
  Key, 
  AttachMoney, 
  ErrorOutline 
} from '@mui/icons-material';
import NeumorphicTextField from '../ui/NeumorphicTextField';
import { transferByAlias, transferByCvu } from '@/api/wallet';
import log from 'loglevel';

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
  message?: string;
}

const TransferModule: React.FC = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [transferType, setTransferType] = useState<'alias' | 'cvu'>('alias');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [targetIdentifierError, setTargetIdentifierError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Validadores ---
  const validateTargetIdentifier = (value: string, type?: 'alias' | 'cvu'): string | null => {
    if (value.trim() === '') return 'Este campo es obligatorio.';
    if (type === 'cvu') {
      if (!/^\d{22}$/.test(value)) return 'El CVU debe tener exactamente 22 dígitos.';
    } else if (type === 'alias') {
      if (value.length < 3) return 'El alias debe tener al menos 3 caracteres.';
      if (!/^[a-zA-Z0-9.]+$/.test(value)) return 'El alias solo puede contener letras, números y puntos.';
    }
    return null;
  };

  const validateAmount = (value: string): string | null => {
    const parsed = parseFloat(value);
    if (value.trim() === '') return 'El monto no puede estar vacío.';
    if (isNaN(parsed)) return 'El monto debe ser numérico.';
    if (parsed <= 0) return 'El monto debe ser mayor a $0.';
    return null;
  };

  // --- Handlers dinámicos ---
  const createHandleChange = (
      setter: React.Dispatch<React.SetStateAction<string>>,
      validator: (value: string, _type?: 'alias' | 'cvu') => string | null,
      errorSetter: React.Dispatch<React.SetStateAction<string | null>>,
      validationType?: 'alias' | 'cvu'
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setter(newValue);
    const validationError = validator(newValue, validationType);
    errorSetter(validationError);
    if (generalError && !validationError) setGeneralError(null);
    if (validationError) log.debug(`[VALIDATION][Transfer] ${validationType} inválido: "${newValue}". Error: ${validationError}`);
  };

  const createHandleBlur = (
      validator: (value: string, _type?: 'alias' | 'cvu') => string | null,
      errorSetter: React.Dispatch<React.SetStateAction<string | null>>,
      currentValue: string,
      validationType?: 'alias' | 'cvu'
  ) => () => {
    const validationError = validator(currentValue, validationType);
    errorSetter(validationError);
    if (generalError && !validationError) setGeneralError(null);
    if (validationError) log.debug(`[VALIDATION][Transfer] ${validationType} inválido en blur: "${currentValue}". Error: ${validationError}`);
  };

  const handleTargetIdentifierChange = createHandleChange(setTargetIdentifier, validateTargetIdentifier, setTargetIdentifierError, transferType);
  const handleAmountChange = createHandleChange(setAmount, validateAmount, setAmountError);
  const handleTargetIdentifierBlur = createHandleBlur(validateTargetIdentifier, setTargetIdentifierError, targetIdentifier, transferType);
  const handleAmountBlur = createHandleBlur(validateAmount, setAmountError, amount);

  const handleTransferTypeChange = (_: unknown, newType: 'alias' | 'cvu' | null) => {
    if (newType) {
      setTransferType(newType);
      setTargetIdentifier('');
      setTargetIdentifierError(null);
      setGeneralError(null);
    }
  };

  const handleSubmit = async (_e: React.FormEvent) => {
    _e.preventDefault();
    setGeneralError(null);

    const errors = {
      targetIdentifier: validateTargetIdentifier(targetIdentifier, transferType),
      amount: validateAmount(amount),
    };

    setTargetIdentifierError(errors.targetIdentifier);
    setAmountError(errors.amount);

    if (Object.values(errors).some(Boolean)) {
      setGeneralError('Por favor, corregí los errores del formulario.');
      return;
    }

    setLoading(true);
    const parsedAmount = parseFloat(amount);

    if (process.env.NODE_ENV === 'production') {
      log.info(`[PROD][Transfer] ${transferType} - $${parsedAmount}`);
    }

    try {
      if (transferType === 'alias') {
        await transferByAlias({ targetAlias: targetIdentifier, amount: parsedAmount });
      } else {
        await transferByCvu({ targetCvu: targetIdentifier, amount: parsedAmount });
      }

      const msg = `Transferencia exitosa de $${parsedAmount.toFixed(2)}.`;
      enqueueSnackbar(msg, { variant: 'success' });
      setTargetIdentifier('');
      setAmount('');
      setTargetIdentifierError(null);
      setAmountError(null);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const detail = apiError.response?.data?.detail || 'Error al realizar la transferencia.';
      setGeneralError(detail);
      log.error(`[${process.env.NODE_ENV?.toUpperCase()}][Transfer][${transferType}]`, err);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || !!targetIdentifierError || !!amountError || !targetIdentifier.trim() || !amount.trim();

  const renderNeumorphicTextField = (
      label: string,
      name: string,
      value: string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
      onBlur: () => void,
      error: string | null,
      icon: React.ReactElement,
      inputProps?: Record<string, unknown>,
      type: string = 'text'
  ) => (
      <NeumorphicTextField
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fullWidth
          required
          type={type}
          error={!!error}
          helperText={error}
          inputProps={inputProps}
          InputProps={{
            startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
            endAdornment: error ? <InputAdornment position="end"><ErrorOutline color="error" /></InputAdornment> : null
          }}
      />
  );

  return (
      <Paper variant="elevation" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Transferir Dinero
        </Typography>

        <ToggleButtonGroup
            value={transferType}
            exclusive
            onChange={handleTransferTypeChange}
            sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}
        >
          <ToggleButton value="alias">Por Alias</ToggleButton>
          <ToggleButton value="cvu">Por CVU</ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {renderNeumorphicTextField(
              transferType === 'alias' ? 'Alias Destino' : 'CVU Destino',
              "targetIdentifier",
              targetIdentifier,
              handleTargetIdentifierChange,
              handleTargetIdentifierBlur,
              targetIdentifierError,
              transferType === 'alias'
                  ? <AccountBalanceWallet sx={{ color: theme.palette.text.secondary }} />
                  : <Key sx={{ color: theme.palette.text.secondary }} />,
              {
                inputMode: transferType === 'cvu' ? 'numeric' : 'text',
                pattern: transferType === 'cvu' ? '[0-9]*' : undefined,
                maxLength: transferType === 'cvu' ? 22 : 30,
              },
              'text'
          )}

          {renderNeumorphicTextField(
              "Monto a Transferir",
              "amount",
              amount,
              handleAmountChange,
              handleAmountBlur,
              amountError,
              <AttachMoney sx={{ color: theme.palette.text.secondary }} />,
              { inputMode: 'decimal', pattern: '[0-9.]*' },
              'number'
          )}

          {generalError && (
              <Alert severity="error" sx={{
                transition: 'all 0.3s ease-in-out',
                boxShadow: `0 4px 8px ${alpha(theme.palette.error.dark, 0.2)}`,
                borderRadius: 2,
              }}>
                {generalError}
              </Alert>
          )}

          <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitDisabled}
              sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Transferir'}
          </Button>
        </Box>
      </Paper>
  );
};

export default TransferModule;
