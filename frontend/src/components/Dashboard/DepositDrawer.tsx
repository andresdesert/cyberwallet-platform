// src/components/Dashboard/DepositDrawer.tsx
import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { depositFunds } from '@/api/wallet';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'motion/react';
import log from 'loglevel';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
}

const DepositDrawer: React.FC<Props> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('common');

  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [amountError, setAmountError] = React.useState<string | null>(null);

  const validateAmount = (value: string): string | null => {
    const parsed = parseFloat(value);
    if (!value.trim()) return t('deposit_drawer.amount_empty');
    if (isNaN(parsed)) return t('deposit_drawer.amount_not_number');
    if (parsed < 0.01) return t('deposit_drawer.amount_min');
    if (parsed > 3_000_000) return t('deposit_drawer.amount_max');
    return null;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAmount(newValue);
    const error = validateAmount(newValue);
    setAmountError(error);
    if (error === null) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAmount(amount);
    if (validationError) {
      setAmountError(validationError);
      setError(t('deposit_drawer.validation_error'));
      log.warn(`[WARN][DepositDrawer] Validación fallida: ${validationError}`);
      return;
    }

    setLoading(true);
    const parsed = parseFloat(amount);
    try {
      await depositFunds({
        amount: parsed,
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
      enqueueSnackbar(t('deposit_drawer.deposit_success', { amount: parsed.toFixed(2) }), { variant: 'success' });
      setAmount('');
      setAmountError(null);
      onClose();
      log.info(`[DepositDrawer] Depósito exitoso: $${parsed}`);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const detail = apiError?.response?.data?.detail || t('deposit_drawer.deposit_error');
      setError(detail);
      log.error(`[DepositDrawer] Error HTTP:`, detail);
    } finally {
      setLoading(false);
    }
  };

  return (
      <AnimatePresence>
        {open && (
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                PaperProps={{
                  component: motion.div,
                  initial: { x: '100%', opacity: 0, filter: 'blur(12px)' },
                  animate: { x: 0, opacity: 1, filter: 'blur(0px)' },
                  exit: { x: '100%', opacity: 0, filter: 'blur(8px)' },
                  transition: { type: 'spring', stiffness: 180, damping: 20 },
                  sx: {
                    width: isMobile ? '100%' : 400,
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
                    backdropFilter: 'blur(20px)',
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    px: 3,
                    py: 4,
                  },
                }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  {t('deposit_drawer.deposit_title')}
                </Typography>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 3, borderColor: theme.palette.divider }} />

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label={t('deposit_drawer.amount_label')}
                    value={amount}
                    onChange={handleAmountChange}
                    fullWidth
                    required
                    type="number"
                    error={!!amountError}
                    helperText={amountError}
                    onBlur={() => setAmountError(validateAmount(amount))}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon />
                          </InputAdornment>
                      ),
                      endAdornment: amountError && (
                          <InputAdornment position="end">
                            <ErrorOutlineIcon color="error" />
                          </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                />

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || !!amountError || !amount}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('deposit_drawer.deposit_button')}
                </Button>
              </Box>
            </Drawer>
        )}
      </AnimatePresence>
  );
};

export default DepositDrawer;
