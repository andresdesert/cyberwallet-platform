// ARCHIVO: src/components/Dashboard/RecentTransactions.tsx

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getTransactionHistory } from '@/api/wallet';
import { format as formatDate, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthWestIcon from '@mui/icons-material/SouthWest';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';

interface Transaction {
  type: string;
  amount: number;
  counterpart: string | null;
  date: string;
}

const RecentTransactions: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 🔍 LOGS ESTRATÉGICOS PARA DIAGNÓSTICO
  useEffect(() => {
    console.info('📊 [RecentTransactions] Componente cargado correctamente');
    console.info('📊 [RecentTransactions] Usuario:', user);
    console.info('📊 [RecentTransactions] Loading:', loading);
    console.info('📊 [RecentTransactions] Error:', error);
    console.info('📊 [RecentTransactions] Transacciones:', transactions.length);
  }, [user, loading, error, transactions.length]);

  // --- LA LÓGICA DE FETCH Y HANDLERS NO CAMBIA ---
  React.useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      if (!user?.token) { setError("Usuario no autenticado o token no disponible."); setLoading(false); return; }
      try {
        const transactionsData = await getTransactionHistory();
        setTransactions((transactionsData as Transaction[]) || []);
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: { detail?: string } } };
        const msg = apiError?.response?.data?.detail || "Error al obtener el historial de transacciones.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user?.token]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <AccountBalanceIcon />;
      case 'LOAD_CARD': return <CreditCardIcon />;
      case 'WITHDRAW': return <LogoutIcon />;
      case 'TRANSFER': case 'TRANSFER_ALIAS': return <NorthEastIcon />;
      case 'TRANSFER_IN': return <SouthWestIcon />;
      default: return <AccountBalanceIcon />;
    }
  };

  const getLabelForType = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Depósito';
      case 'LOAD_CARD': return 'Carga con tarjeta';
      case 'WITHDRAW': return 'Extracción';
      case 'TRANSFER': return 'Transferencia';
      case 'TRANSFER_ALIAS': return 'Transferencia por alias';
      case 'TRANSFER_IN': return 'Transferencia recibida';
      default: return 'Movimiento desconocido';
    }
  };

  console.info('📊 [RecentTransactions] Renderizando transacciones recientes...');

  return (
    // CAMBIO 1: El Paper ahora usa la variante 'glass'.
    <Paper variant="elevation" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Movimientos Recientes
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : transactions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              mb: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            {t('dashboard_sin_movimientos')}
          </Alert>
          
          {/* CTA para incentivar acciones */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ 
              color: theme.palette.text.secondary,
              mb: 2
            }}>
              ¿Listo para empezar a usar tu billetera?
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => navigate('/load-funds')}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              Cargar Fondos
            </Button>
          </Box>
        </Box>
      ) : (
        <List dense>
          {transactions.map((tx, index) => (
            <React.Fragment key={index}>
              {/* CAMBIO 2: Se ha eliminado la prop `sx` del ListItem. Ahora hereda su estilo del tema. */}
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
                    {getIconForType(tx.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${getLabelForType(tx.type)}${tx.counterpart ? ` a/de ${tx.counterpart}` : ''}`}
                  secondary={formatDate(parseISO(tx.date), "dd/MM/yyyy HH:mm")}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    minWidth: '80px',
                    textAlign: 'right',
                    color: tx.amount >= 0 ? 'success.main' : 'error.main',
                    textShadow: `1px 1px 2px ${alpha(theme.palette.mode === 'dark' ? '#000' : '#ccc', 0.3)}`
                  }}
                >
                  {tx.amount >= 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </Typography>
              </ListItem>
              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecentTransactions;
