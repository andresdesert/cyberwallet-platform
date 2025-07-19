// ARCHIVO: src/components/Dashboard/UserHeader.tsx

import React, { useEffect, useState } from 'react';
import {
  Box, Avatar, Typography, Button, Stack, CircularProgress
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getWalletDetails } from '@/api/wallet';
import log from 'loglevel';
import { useNavigate } from 'react-router-dom';

// 🔍 Logging estratégico por entorno
const logEnv = (level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: unknown) => {
  const env = process.env.NODE_ENV;
  if (env === 'development' || env === 'test') {
    log[level](`[${env.toUpperCase()}][UserHeader] ${message}`, meta ?? '');
  } else if (env === 'production' && level !== 'debug') {
    log[level](`[PROD][UserHeader] ${message}`, meta ?? '');
  }
};

const UserHeader: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const nombre = user?.alias ?? 'Usuario';
  const letra = nombre.charAt(0).toUpperCase();

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 LOGS ESTRATÉGICOS PARA DIAGNÓSTICO
  useEffect(() => {
    console.info('👤 [UserHeader] Componente cargado correctamente');
    console.info('👤 [UserHeader] Usuario:', user);
    console.info('👤 [UserHeader] Nombre:', nombre);
  }, [user, nombre]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.token) {
        logEnv('warn', 'No user token available. Cannot fetch balance.');
        setBalance(0);
        setLoading(false);
        return;
      }

      logEnv('info', 'Fetching user balance...');
      setLoading(true);

      try {
        const walletData = await getWalletDetails();
        const fetchedBalance = walletData.balance ?? 0;
        setBalance(fetchedBalance);
        logEnv('debug', `Balance fetched: $${fetchedBalance.toFixed(2)}`);
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: { detail?: string }, status?: number } };
        const detail = apiError?.response?.data?.detail ?? (err as Error).message;
        const status = apiError?.response?.status;
        setBalance(0);
        logEnv('error', `Error fetching balance.`, { detail, status, full: err });
      } finally {
        setLoading(false);
        logEnv('debug', 'Balance fetch completed.');
      }
    };

    fetchBalance();
  }, [user?.token, nombre]);

  console.info('👤 [UserHeader] Renderizando header...');

  return (
      <Box
          sx={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
            backdropFilter: 'blur(20px)',
            px: 3,
            py: 2,
            mb: 4,
            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
      >
        {/* 👤 Usuario */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.7),
                color: theme.palette.getContrastText(theme.palette.primary.main),
                fontWeight: 600,
              }}
          >
            {letra}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {nombre}
          </Typography>
        </Stack>

        {/* 💰 Saldo y Acción */}
        <Stack direction="row" spacing={2} alignItems="center">
          {loading ? (
              <CircularProgress size={22} />
          ) : (
              <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    color: theme.palette.success.main,
                  }}
              >
                Saldo: ${balance?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </Typography>
          )}

          <Button
              variant="contained"
              size="small"
              startIcon={<AttachMoneyIcon />}
              onClick={() => navigate('/load-funds')} // Corregido para navegar a la página correcta
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.25s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
          >
            Cargar Fondos
          </Button>
        </Stack>
      </Box>
  );
};

export default UserHeader;
