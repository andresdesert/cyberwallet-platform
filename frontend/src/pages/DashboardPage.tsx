import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Container,
  useMediaQuery,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Stack,
  LinearProgress,
  Card,
  Avatar,
  useMediaQuery as useMediaQueryHook,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Switch,
  FormControlLabel,
  alpha,
  Divider,
} from '@mui/material';
import Layout from '@/layout/Layout';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Visibility,
  VisibilityOff,
  ContentCopy,
  Settings,
  Assessment,
  History,
  Send,
  GetApp,
  Notifications,
  Star,
  AttachMoney,
  Security,
  Help,
  Analytics,
  TrendingFlat,
  MonetizationOn,
  Refresh,
  ShoppingCart,
  Work,
  Favorite,
  FavoriteBorder,
  ColorLens,
  Subscriptions,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Add,
  QrCode,
  CreditCard,
  AccountBalance,
  Payment,
  Receipt,
  TrendingUpOutlined,
  TrendingDownOutlined,
  TrendingFlatOutlined,
  AutoAwesome,
  Bolt,
  Lock,
  TouchApp,
  Psychology,
  Diamond,
  RocketLaunch,
  Verified,
  Fingerprint,
  Face,
  SecurityUpdate,
  VpnKey,
  TwoWheeler,
  DirectionsCar,
  Flight,
  Hotel,
  Restaurant,
  LocalGroceryStore,
  LocalGasStation,
  LocalPharmacy,
  LocalHospital,
  School,
  Home,
  Weekend,
  Celebration,
  Cake,
  CardGiftcard,
  Redeem,
  Loyalty,
  Discount,
  Percent,
  LocalOffer,
  Tag,
  PriceCheck,
  PriceChange,
  TrendingUpOutlined as TrendingUpIcon,
  TrendingDownOutlined as TrendingDownIcon,
  TrendingFlatOutlined as TrendingFlatIcon,
  Edit,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import { 
  GlassmorphicHover, 
  FloatingCard, 
  TickerNumber, 
  ViewportReveal,
  GradientText,
  RippleButton
} from '@/components/ui/MicroInteractions';
import { DESIGN_TOKENS } from '@/theme/designTokens';
import log from 'loglevel';

// 🎨 Componente de Motion Paper para animaciones fluidas
const MotionCard = motion.create(Card);
const MotionBox = motion.create(Box);

// 🎯 Datos Mock para desarrollo (aplicando Ley de Miller - máximo 7±2 elementos)
const mockWalletData = {
  alias: 'crypto.wizard',
  balance: 125480.50,
  cvu: '0000003100012345678901',
  currency: 'ARS',
  level: 'Premium',
  score: 8.7,
  growth: 12.5,
  monthlyLimit: 500000,
  dailyLimit: 50000,
  transactions: 247,
  lastUpdate: new Date().toISOString(),
};

const mockTransactions = [
  { id: '1', type: 'INCOME', amount: 15000, description: 'Transferencia recibida', date: '2024-01-15T10:00:00Z', category: 'transfer' },
  { id: '2', type: 'EXPENSE', amount: -2500, description: 'Compra en Mercado Libre', date: '2024-01-14T15:30:00Z', category: 'shopping' },
  { id: '3', type: 'INCOME', amount: 8000, description: 'Pago freelance', date: '2024-01-13T09:15:00Z', category: 'work' },
  { id: '4', type: 'EXPENSE', amount: -1200, description: 'Netflix Premium', date: '2024-01-12T12:00:00Z', category: 'subscription' },
  { id: '5', type: 'EXPENSE', amount: -4500, description: 'Supermercado', date: '2024-01-11T18:45:00Z', category: 'shopping' },
];

// 🎭 Componente de Indicador de Progreso Circular Premium
const CircularProgress = ({ value, size = 120, thickness = 8, label }: {
  value: number;
  size?: number;
  thickness?: number;
  label?: string;
}) => {
  const theme = useTheme();
  const circumference = 2 * Math.PI * (size / 2 - thickness);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - thickness}
          stroke="var(--semantic-primary-muted)"
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - thickness}
          stroke="var(--semantic-primary)"
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ 
            transition: 'stroke-dashoffset 0.5s ease-in-out',
            filter: 'drop-shadow(0 0 8px var(--semantic-primary))',
          }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{ 
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
        {label && (
          <Typography
            variant="caption"
            component="div"
            sx={{ 
              color: 'var(--text-secondary)',
              mt: 0.5,
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// 🎨 Componente de Métrica con Microinteracciones Avanzadas
const MetricCard = ({ title, value, change, icon: Icon, trend, delay = 0 }: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const formatValue = typeof value === 'number' ? value.toLocaleString('es-AR') : value;

  // 🎯 Colores semánticos dinámicos
  const getSemanticColor = () => {
    if (title.toLowerCase().includes('ingreso') || title.toLowerCase().includes('income')) {
      return 'var(--semantic-success)';
    }
    if (title.toLowerCase().includes('gasto') || title.toLowerCase().includes('expense')) {
      return 'var(--semantic-error)';
    }
    if (title.toLowerCase().includes('balance') || title.toLowerCase().includes('total')) {
      return 'var(--semantic-primary)';
    }
    return 'var(--semantic-info)';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: 'var(--semantic-success)' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ color: 'var(--semantic-error)' }} />;
      default:
        return <TrendingFlatIcon sx={{ color: 'var(--semantic-info)' }} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 'var(--radius-2xl)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-backdrop)',
          WebkitBackdropFilter: 'var(--glass-backdrop)',
          border: '1px solid var(--glass-border)',
          boxShadow: isHovered ? 'var(--shadow-floating)' : 'var(--shadow-card)',
          transition: 'all 0.3s var(--smooth-ease)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: getSemanticColor(),
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: `linear-gradient(135deg, ${getSemanticColor()}15 0%, ${getSemanticColor()}05 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${getSemanticColor()}30`,
              }}
            >
              <Icon sx={{ color: getSemanticColor(), fontSize: 24 }} />
            </Box>
            {trend && (
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {getTrendIcon()}
              </motion.div>
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              mb: 1,
            }}
          >
            {formatValue}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-secondary)',
              fontWeight: 500,
              mb: 1,
            }}
          >
            {title}
          </Typography>

          {change !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: change >= 0 ? 'var(--semantic-success)' : 'var(--semantic-error)',
                  fontWeight: 600,
                }}
              >
                {change >= 0 ? '+' : ''}{change}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--text-tertiary)',
                }}
              >
                vs mes anterior
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

// 🎨 Componente de Transacción con Glassmorfismo
const TransactionCard = ({ transaction, index }: {
  transaction: any;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      transfer: <SwapHoriz />,
      shopping: <ShoppingCart />,
      work: <Work />,
      subscription: <Subscriptions />,
      food: <Restaurant />,
      transport: <DirectionsCar />,
      health: <LocalHospital />,
      education: <School />,
      entertainment: <Celebration />,
    };
    return icons[category] || <Receipt />;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      transfer: 'var(--semantic-primary)',
      shopping: 'var(--semantic-warning)',
      work: 'var(--semantic-success)',
      subscription: 'var(--semantic-info)',
      food: 'var(--semantic-error)',
      transport: 'var(--semantic-primary)',
      health: 'var(--semantic-error)',
      education: 'var(--semantic-info)',
      entertainment: 'var(--semantic-warning)',
    };
    return colors[category] || 'var(--semantic-info)';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ x: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 'var(--radius-xl)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-backdrop)',
          WebkitBackdropFilter: 'var(--glass-backdrop)',
          border: '1px solid var(--glass-border)',
          boxShadow: isHovered ? 'var(--shadow-floating)' : 'var(--shadow-card)',
          transition: 'all 0.3s var(--smooth-ease)',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-lg)',
              background: `linear-gradient(135deg, ${getCategoryColor(transaction.category)}15 0%, ${getCategoryColor(transaction.category)}05 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${getCategoryColor(transaction.category)}30`,
            }}
          >
            <Box sx={{ color: getCategoryColor(transaction.category), fontSize: 20 }}>
              {getCategoryIcon(transaction.category)}
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'var(--text-primary)',
                mb: 0.5,
              }}
            >
              {transaction.description}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--text-tertiary)',
              }}
            >
              {formatDate(transaction.date)}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: transaction.amount >= 0 ? 'var(--semantic-success)' : 'var(--semantic-error)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
            </Typography>
            <Chip
              label={transaction.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
              size="small"
              sx={{
                background: transaction.type === 'INCOME' ? 'var(--semantic-success-subtle)' : 'var(--semantic-error-subtle)',
                color: transaction.type === 'INCOME' ? 'var(--semantic-success)' : 'var(--semantic-error)',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

// 🎯 Componente principal DashboardPage
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQueryHook(theme.breakpoints.down('md'));
  const { cotizaciones, isLoading: cotizacionesLoading } = useCotizaciones();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [cardDataVisible, setCardDataVisible] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // 🎯 Métricas principales
  const metrics = [
    {
      title: 'Balance Total',
      value: balanceVisible ? mockWalletData.balance : '****',
      change: mockWalletData.growth,
      icon: AccountBalanceWallet,
      trend: 'up' as const,
      delay: 0,
    },
    {
      title: 'Ingresos del Mes',
      value: balanceVisible ? 45000 : '****',
      change: 8.2,
      icon: TrendingUp,
      trend: 'up' as const,
      delay: 1,
    },
    {
      title: 'Gastos del Mes',
      value: balanceVisible ? 28500 : '****',
      change: -3.1,
      icon: TrendingDown,
      trend: 'down' as const,
      delay: 2,
    },
    {
      title: 'Transacciones',
      value: mockWalletData.transactions,
      change: 15.4,
      icon: Receipt,
      trend: 'up' as const,
      delay: 3,
    },
  ];

  const quickActions = [
    { icon: Send, name: 'Enviar', action: () => navigate('/send') },
    { icon: QrCode, name: 'QR', action: () => navigate('/qr') },
    { icon: CreditCard, name: 'Agregar Tarjeta', action: () => navigate('/load-funds') },
    { icon: Assessment, name: 'Reportes', action: () => navigate('/reports') },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copiado al portapapeles', { variant: 'success' });
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 🎯 Header del Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  mb: 1,
                }}
              >
                Aquí tienes un resumen de tus finanzas
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setBalanceVisible(!balanceVisible)}
                sx={{
                  color: 'var(--text-secondary)',
                  '&:hover': {
                    color: 'var(--semantic-primary)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s var(--smooth-ease)',
                }}
              >
                {balanceVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>

              <IconButton
                onClick={() => navigate('/settings')}
                sx={{
                  color: 'var(--text-secondary)',
                  '&:hover': {
                    color: 'var(--semantic-primary)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s var(--smooth-ease)',
                }}
              >
                <Settings />
              </IconButton>
            </Box>
          </Box>

          {/* 🎯 CRÍTICO: Balance Total en 2 módulos separados */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
            
            {/* 🎯 MÓDULO IZQUIERDO: Balance y Datos de Cuenta */}
            <Box
              className="glass-floating"
              sx={{
                p: 4,
                borderRadius: 'var(--radius-3xl)',
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-backdrop)',
                WebkitBackdropFilter: 'var(--glass-backdrop)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-floating)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--gradient-primary)',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Balance Total */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'var(--text-secondary)',
                        mb: 1,
                      }}
                    >
                      Balance Total
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {balanceVisible ? `$${mockWalletData.balance.toLocaleString()}` : '****'}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={`+${mockWalletData.growth}%`}
                      color="success"
                      sx={{
                        background: 'var(--semantic-success-subtle)',
                        color: 'var(--semantic-success)',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Este mes
                    </Typography>
                  </Box>
                </Box>

                {/* 🎯 CRÍTICO: Alias solo en Balance Total */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      mb: 1,
                    }}
                  >
                    Tu alias:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'var(--semantic-primary)',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {mockWalletData.alias}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(mockWalletData.alias)}
                      sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': {
                          color: 'var(--semantic-primary)',
                        },
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>
                </Box>

                {/* CVU */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      mb: 1,
                    }}
                  >
                    CVU:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {mockWalletData.cvu}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(mockWalletData.cvu)}
                      sx={{
                        color: 'var(--text-secondary)',
                        '&:hover': {
                          color: 'var(--semantic-primary)',
                        },
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 🎯 MÓDULO DERECHO: Tarjeta Bancaria */}
            <Box
              className="glass-floating"
              sx={{
                p: 4,
                borderRadius: 'var(--radius-3xl)',
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-backdrop)',
                WebkitBackdropFilter: 'var(--glass-backdrop)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--shadow-floating)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'var(--gradient-success)',
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Header de la tarjeta */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                    }}
                  >
                    Banco Galicia
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 25,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        VISA
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Número de tarjeta */}
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    mb: 2,
                    letterSpacing: '2px',
                  }}
                >
                  {cardDataVisible ? '4532 1234 5678 9012' : '**** **** **** 9012'}
                </Typography>

                {/* Datos del titular y fecha */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-tertiary)',
                        mb: 0.5,
                      }}
                    >
                      Titular:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      JUAN PÉREZ
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-tertiary)',
                        mb: 0.5,
                      }}
                    >
                      Válida hasta:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      **/**
                    </Typography>
                  </Box>
                </Box>

                {/* Límite disponible */}
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-tertiary)',
                      mb: 1,
                    }}
                  >
                    Límite disponible: $45,000
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      height: 6,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--semantic-primary-muted)',
                      '& .MuiLinearProgress-bar': {
                        background: 'var(--gradient-success)',
                        borderRadius: 'var(--radius-full)',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* 🎯 Métricas Principales */}
      <Box sx={{ mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              mb: 3,
            }}
          >
            Resumen Financiero
          </Typography>
        </motion.div>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </Box>
      </Box>

      {/* 🎯 Contenido Principal */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* 🎯 Transacciones Recientes */}
        <Box>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Transacciones Recientes
              </Typography>
              <Button
                variant="text"
                onClick={() => navigate('/transactions')}
                sx={{
                  color: 'var(--semantic-primary)',
                  '&:hover': {
                    background: 'var(--semantic-primary-subtle)',
                  },
                }}
              >
                Ver todas
              </Button>
            </Box>
          </motion.div>

          <Stack spacing={2}>
            {mockTransactions.map((transaction, index) => (
              <TransactionCard key={transaction.id} transaction={transaction} index={index} />
            ))}
          </Stack>
        </Box>

        {/* 🎯 Sidebar con Información Adicional */}
        <Box>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* 🎯 Progreso de Metas */}
            <Box
              className="glass-floating"
              sx={{
                p: 3,
                borderRadius: 'var(--radius-2xl)',
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                Progreso de Metas
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress value={75} label="Ahorro Mensual" />
              </Box>
            </Box>

            {/* 🎯 Límites de Transacción */}
            <Box
              className="glass-floating"
              sx={{
                p: 3,
                borderRadius: 'var(--radius-2xl)',
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                Límites de Transacción
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      Diario
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      $45,000 / $50,000
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(45000 / 50000) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--semantic-primary-muted)',
                      '& .MuiLinearProgress-bar': {
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-full)',
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      Mensual
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      $285,000 / $500,000
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(285000 / 500000) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--semantic-primary-muted)',
                      '& .MuiLinearProgress-bar': {
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-full)',
                      },
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* 🎯 Acciones Rápidas */}
            <Box
              className="glass-floating"
              sx={{
                p: 3,
                borderRadius: 'var(--radius-2xl)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  mb: 2,
                }}
              >
                Acciones Rápidas
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      onClick={action.action}
                      startIcon={<action.icon />}
                      sx={{
                        width: '100%',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                        '&:hover': {
                          borderColor: 'var(--semantic-primary)',
                          background: 'var(--semantic-primary-subtle)',
                        },
                      }}
                    >
                      {action.name}
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* 🎯 Speed Dial para Acciones Rápidas */}
      <SpeedDial
        ariaLabel="Acciones rápidas"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          '& .MuiFab-primary': {
            background: 'var(--gradient-primary)',
            '&:hover': {
              background: 'var(--gradient-primary-intense)',
            },
          },
        }}
        icon={<Add />}
        open={quickActionsOpen}
        onOpen={() => setQuickActionsOpen(true)}
        onClose={() => setQuickActionsOpen(false)}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={<action.icon />}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              setQuickActionsOpen(false);
            }}
            sx={{
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-backdrop)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              '&:hover': {
                background: 'var(--semantic-primary-subtle)',
                color: 'var(--semantic-primary)',
              },
            }}
          />
        ))}
      </SpeedDial>
    </Container>
    </Layout>
  );
};

export default DashboardPage;