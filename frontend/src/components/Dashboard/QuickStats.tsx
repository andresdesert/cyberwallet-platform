import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  alpha,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  SwapHoriz,
  Info
} from '@mui/icons-material';

interface QuickStatsProps {
  balance?: number;
  transactionCount?: number;
  lastTransactionDate?: string;
  isLoading?: boolean;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  balance = 0,
  transactionCount = 0,
  lastTransactionDate,
  isLoading = false
}) => {
  const theme = useTheme();

  // 🔍 LOGS ESTRATÉGICOS PARA DIAGNÓSTICO
  useEffect(() => {
    console.info('📊 [QuickStats] Componente cargado correctamente');
    console.info('📊 [QuickStats] Balance:', balance);
    console.info('📊 [QuickStats] TransactionCount:', transactionCount);
    console.info('📊 [QuickStats] LastTransactionDate:', lastTransactionDate);
    console.info('📊 [QuickStats] Loading:', isLoading);
  }, [balance, transactionCount, lastTransactionDate, isLoading]);

  const stats = [
    {
      title: 'Saldo Actual',
      value: `$${balance.toFixed(2)}`,
      icon: <AccountBalanceWallet />,
      color: theme.palette.primary.main,
      tooltip: 'Tu saldo disponible para transferencias'
    },
    {
      title: 'Transacciones',
      value: transactionCount.toString(),
      icon: <SwapHoriz />,
      color: theme.palette.secondary.main,
      tooltip: 'Total de transacciones realizadas'
    },
    {
      title: 'Última Transacción',
      value: lastTransactionDate ? new Date(lastTransactionDate).toLocaleDateString() : 'N/A',
      icon: <TrendingUp />,
      color: theme.palette.success.main,
      tooltip: 'Fecha de tu última transacción'
    }
  ];

  console.info('📊 [QuickStats] Renderizando quick stats...');

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Estadísticas Rápidas
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                minWidth: 120,
                height: 80,
                background: alpha(theme.palette.action.disabledBackground, 0.3),
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Cargando...
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Estadísticas Rápidas
        </Typography>
        <Tooltip title="Información actualizada en tiempo real">
          <IconButton size="small">
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {stats.map((stat) => (
          <Tooltip key={stat.title} title={stat.tooltip}>
            <Box
              sx={{
                flex: 1,
                minWidth: 120,
                p: 2,
                background: alpha(stat.color, 0.1),
                borderRadius: 2,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: alpha(stat.color, 0.15),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${alpha(stat.color, 0.3)}`
                }
              }}
            >
              <Box sx={{ color: stat.color, mb: 1 }}>
                {stat.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.title}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default QuickStats; 