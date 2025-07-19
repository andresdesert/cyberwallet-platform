// ARCHIVO: src/components/BalanceSummary/BalanceSummary.tsx

import React, { useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getWalletDetails } from '@/api/wallet';
import { useAuth } from '@/context/AuthContext';

interface WalletDetails {
  alias: string;
  balance: number;
  cvu: string;
}

const BalanceSummary: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  
  const [walletDetails, setWalletDetails] = React.useState<WalletDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWalletDetails = async () => {
      if (!user?.token) { 
        setError("Usuario no autenticado o token no disponible."); 
        setLoading(false); 
        return; 
      }
      setLoading(true);
      setError(null);
      try {
        const walletData = await getWalletDetails();
        setWalletDetails(walletData);
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: { detail?: string } }; message?: string };
        const errorMessage = apiError.response?.data?.detail || "No se pudieron cargar los detalles de la billetera.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletDetails();
  }, [user?.token]);

  useEffect(() => {
    if (walletDetails) {
      console.log('Detalles de billetera obtenidos:', walletDetails);
    }
  }, [walletDetails]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`${type} copiado al portapapeles`);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Paper 
          sx={{ 
            p: 'var(--spacing-lg)',
            background: 'var(--glass-background)',
            backdropFilter: 'var(--glass-backdrop)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Typography variant="h6" sx={{ color: 'var(--text-secondary)' }}>
            Cargando saldo...
          </Typography>
        </Paper>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Paper 
          sx={{ 
            p: 'var(--spacing-lg)',
            background: 'var(--glass-background)',
            backdropFilter: 'var(--glass-backdrop)',
            border: '1px solid var(--semantic-error-muted)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Typography variant="h6" sx={{ color: 'var(--semantic-error)' }}>
            Error: {error}
          </Typography>
        </Paper>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Paper 
        sx={{ 
          p: 'var(--spacing-lg)', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          background: 'var(--glass-background)',
          backdropFilter: 'var(--glass-backdrop)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--shadow-lg)',
            borderColor: 'var(--semantic-primary-muted)',
          }
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ 
            color: 'var(--text-secondary)', 
            mb: 'var(--spacing-sm)',
            fontWeight: 500,
          }}>
            Saldo Disponible
          </Typography>
          
          <Typography variant="h3" sx={{
            color: 'var(--semantic-primary)',
            fontWeight: 700,
            mb: 'var(--spacing-md)',
            fontFamily: 'var(--font-mono)',
            textShadow: 'var(--text-shadow-sm)',
          }}>
            ${walletDetails?.balance.toFixed(2) ?? '0.00'}
          </Typography>
          
          <Divider sx={{ 
            mb: 'var(--spacing-md)', 
            borderColor: 'var(--glass-border)',
          }} />
          
          <Box display="flex" alignItems="center" mb="var(--spacing-sm)">
            <Typography variant="body2" sx={{ 
              color: 'var(--text-secondary)', 
              mr: 'var(--spacing-sm)',
              fontWeight: 500,
            }}>
              CVU:
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'var(--text-primary)', 
              fontWeight: 600, 
              flexGrow: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
            }}>
              {walletDetails?.cvu || 'N/A'}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => walletDetails?.cvu && copyToClipboard(walletDetails.cvu, 'CVU')}
              sx={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--surface-elevated)',
                '&:hover': {
                  color: 'var(--semantic-primary)',
                  backgroundColor: 'var(--semantic-primary-subtle)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ 
              color: 'var(--text-secondary)', 
              mr: 'var(--spacing-sm)',
              fontWeight: 500,
            }}>
              Alias:
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'var(--text-primary)', 
              fontWeight: 600, 
              flexGrow: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
            }}>
              {walletDetails?.alias || 'N/A'}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => walletDetails?.alias && copyToClipboard(walletDetails.alias, 'Alias')}
              sx={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--surface-elevated)',
                '&:hover': {
                  color: 'var(--semantic-primary)',
                  backgroundColor: 'var(--semantic-primary-subtle)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<AccountBalanceWalletIcon />}
          onClick={() => navigate('/wallet-details')}
          sx={{ 
            mt: 'var(--spacing-md)',
            background: 'var(--gradient-primary)',
            color: 'var(--on-primary)',
            fontWeight: 600,
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-md)',
            '&:hover': {
              background: 'var(--gradient-primary-intense)',
              boxShadow: 'var(--shadow-lg)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 'var(--shadow-sm)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Ver Detalles de Billetera
        </Button>
      </Paper>
    </motion.div>
  );
};

export default BalanceSummary;
