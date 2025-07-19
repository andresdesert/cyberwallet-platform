// src/components/Dashboard/WithdrawModule.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import NeumorphicTextField from '@/components/ui/NeumorphicTextField';
import { withdrawFunds } from '@/api/wallet';
import { useAuth } from '@/context/AuthContext';
import log from 'loglevel';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const WithdrawModule: React.FC = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const { t } = useTranslation('common');

  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const [amountError, setAmountError] = React.useState<string | null>(null);

  const validateAmount = (value: string): string | null => {
    const parsed = parseFloat(value.replace(',', '.'));
    if (value.trim() === '') return t('withdraw.amountEmptyError');
    if (isNaN(parsed)) return t('withdraw.amountInvalidError');
    if (parsed <= 0.00) return t('withdraw.amountZeroError');
    return null;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAmount(newValue);
    const validationError = validateAmount(newValue);
    setAmountError(validationError);
    if (generalError && !validationError) setGeneralError(null);
    if (validationError) log.debug(`[VALIDATION][Withdraw] Monto inválido: "${newValue}". Error: ${validationError}`);
  };

  const handleAmountBlur = () => {
    const validationError = validateAmount(amount);
    setAmountError(validationError);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validationErrorOnSubmit = validateAmount(amount);
    if (validationErrorOnSubmit) {
      setAmountError(validationErrorOnSubmit);
      setGeneralError(t('withdraw.amountError'));
      log.warn(`[WARN][Withdraw] Intento con error: ${amount}.`);
      return;
    }

    setLoading(true);
    const parsedAmount = parseFloat(amount.replace(',', '.'));
    log.info(`[INFO][Withdraw] Enviando solicitud de retiro: $${parsedAmount.toFixed(2)}`);

    try {
      await withdrawFunds({
        amount: parsedAmount,
        cbu: '',
        bankName: ''
      });
      enqueueSnackbar(t('withdraw.withdrawSuccess', { amount: parsedAmount.toFixed(2) }), { variant: 'success' });
      setAmount('');
      setAmountError(null);
      setGeneralError(null);
      log.debug('[DEBUG][Withdraw] Retiro exitoso.');
    } catch (err: unknown) {
      const apiError = err as { response?: { status?: number; data?: { detail?: string } } };
      const status = apiError?.response?.status;
      const detail = apiError?.response?.data?.detail || t('withdraw.withdrawError');
      if (status === 401) {
        enqueueSnackbar(t('withdraw.sessionExpired'), { variant: 'info' });
        logout();
      } else if ([403, 429].includes(status as number)) {
        enqueueSnackbar(detail, { variant: 'warning' });
      } else {
        setGeneralError(detail);
      }
      log.error(`[ERROR][Withdraw] Código: ${status}. Mensaje: ${detail}`);
    } finally {
      setLoading(false);
      log.debug('[DEBUG][Withdraw] Operación finalizada.');
    }
  };

  const isSubmitDisabled = loading || !!amountError || amount.trim() === '';

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
        backdropFilter: 'blur(20px)',
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {t('withdraw.withdrawTitle')}
      </Typography>

      <Box component="form" onSubmit={handleWithdraw} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NeumorphicTextField
          label={t('withdraw.amountLabel')}
          value={amount}
          onChange={handleAmountChange}
          onBlur={handleAmountBlur}
          required
          type="text"
          error={!!amountError}
          helperText={amountError}
          inputProps={{ inputMode: 'decimal', pattern: '^[0-9]+([.,][0-9]{1,2})?$' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon sx={{ color: theme.palette.text.secondary }} />
              </InputAdornment>
            ),
            endAdornment: amountError ? (
              <InputAdornment position="end">
                <ErrorOutlineIcon color="error" />
              </InputAdornment>
            ) : null,
          }}
        />

        {generalError && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {generalError}
          </Alert>
        )}

        <motion.div
          initial={{ scale: 1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitDisabled}
            sx={{ width: '100%', py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('withdraw.withdrawButton')}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default WithdrawModule;
