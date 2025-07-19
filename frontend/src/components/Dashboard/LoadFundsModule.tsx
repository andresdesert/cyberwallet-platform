// src/components/Dashboard/LoadFundsModule.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  CalendarMonth
} from '@mui/icons-material';
import { motion } from 'motion/react';
import NeumorphicTextField from '@/components/ui/NeumorphicTextField';
import { loadCardFunds } from '@/api/wallet';
import { useSnackbar } from 'notistack';
import log from 'loglevel';
import { useTranslation } from 'react-i18next';

const getCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'desconocida' => {
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  return 'desconocida';
};

const CardIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'visa': return <img src="/icons/visa.svg" alt="Visa" height={24} />;
    case 'mastercard': return <img src="/icons/mastercard.svg" alt="Mastercard" height={24} />;
    case 'amex': return <img src="/icons/amex.svg" alt="Amex" height={24} />;
    default: return <CreditCard />;
  }
};

const LoadFundsModule: React.FC = () => {
  const { t } = useTranslation('common');
  const { enqueueSnackbar } = useSnackbar();

  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'desconocida'>('desconocida');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
    const type = getCardType(value);
    setCardType(type);
    log.debug(`[LoadFunds] Card updated: ${value} (${type})`);
  };

  const handleSubmit = async () => {
    if (!cardNumber || !expirationDate || !cvv || !cardHolderName || !amount) {
      enqueueSnackbar(t('loadFunds.incompleteFields'), { variant: 'warning' });
      log.warn('[LoadFunds] Campos incompletos al enviar');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0.01) {
      enqueueSnackbar(t('loadFunds.invalidAmount'), { variant: 'error' });
      log.warn(`[LoadFunds] Monto inválido ingresado: ${amount}`);
      return;
    }

    setLoading(true);
      try {
          await loadCardFunds({
              cardNumber,
              expiryDate: expirationDate,
              cvv,
              amount: parsedAmount
          });

          // Opcional: log interno con los datos de tarjeta (sin enviar)
          if (process.env.NODE_ENV !== 'production') {
              log.debug('[LoadFundsModule] Datos de tarjeta simulados:', {
                  cardNumber,
                  expirationDate,
                  cvv,
                  cardHolderName
              });
          }

          enqueueSnackbar(t('loadFunds.fundsLoaded', { amount: parsedAmount.toFixed(2) }), { variant: 'success' });
          log.info(`[LoadFunds] Carga exitosa de $${parsedAmount.toFixed(2)}`);

          setCardNumber('');
          setExpirationDate('');
          setCvv('');
          setCardHolderName('');
          setAmount('');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { detail?: string } } };
      const detail = apiError?.response?.data?.detail || t('loadFunds.errorLoadingFunds');
      enqueueSnackbar(detail, { variant: 'error' });
      log.error('[LoadFunds] Error HTTP:', detail);
    } finally {
      setLoading(false);
    }
  };

  return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.03)',
            }}
        >
          <Typography variant="h5" gutterBottom>
            {t('loadFunds.loadFundsWithCard')}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <NeumorphicTextField
                  label={t('loadFunds.cardNumber')}
                  value={cardNumber}
                  onChange={handleCardChange}
                  inputProps={{ inputMode: 'numeric', maxLength: 16 }}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <CardIcon type={cardType} />
                        </InputAdornment>
                    ),
                  }}
              />
            </Box>
            <Box sx={{ width: { xs: '50%', sm: '25%' } }}>
              <NeumorphicTextField
                  label={t('loadFunds.expiry')}
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  inputProps={{ maxLength: 5 }}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth />
                        </InputAdornment>
                    ),
                  }}
              />
            </Box>
            <Box sx={{ width: { xs: '50%', sm: '25%' } }}>
              {/* Otro campo aquí si corresponde */}
            </Box>
            <Box sx={{ width: '100%' }}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : undefined
                    }
                >
                  {loading ? t('loadFunds.loading') : t('loadFunds.loadFunds')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </motion.div>
  );
};

export default LoadFundsModule;
