import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  alpha,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Notifications,
  Security,
  Info,
  Warning,
  CheckCircle,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications?: Notification[];
  isLoading?: boolean;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications = [],
  isLoading = false
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(true);

  // 🔍 LOGS ESTRATÉGICOS PARA DIAGNÓSTICO
  useEffect(() => {
    console.info('🔔 [NotificationsPanel] Componente cargado correctamente');
    console.info('🔔 [NotificationsPanel] Notifications:', notifications.length);
    console.info('🔔 [NotificationsPanel] Loading:', isLoading);
    console.info('🔔 [NotificationsPanel] Expanded:', expanded);
  }, [notifications.length, isLoading, expanded]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'security':
        return <Security color="warning" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'success':
        return <CheckCircle color="success" />;
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'security':
        return theme.palette.warning.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'success':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getNotificationChipColor = (type: Notification['type']) => {
    switch (type) {
      case 'security':
        return 'warning';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  const defaultNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Transferencia Exitosa',
      message: 'Tu transferencia de $500.00 se completó correctamente.',
      timestamp: '2025-01-15T10:30:00Z',
      read: false
    },
    {
      id: '2',
      type: 'security',
      title: 'Verificación de Seguridad',
      message: 'Se detectó un nuevo dispositivo conectado a tu cuenta.',
      timestamp: '2025-01-15T09:15:00Z',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Mantenimiento Programado',
      message: 'El sistema estará en mantenimiento el próximo domingo de 2:00 a 4:00 AM.',
      timestamp: '2025-01-14T16:00:00Z',
      read: true
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;
  const unreadCount = displayNotifications.filter(n => !n.read).length;

  console.info('🔔 [NotificationsPanel] Renderizando panel de notificaciones...');

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
          Notificaciones
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Cargando notificaciones...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          cursor: 'pointer',
          '&:hover': {
            background: alpha(theme.palette.action.hover, 0.1)
          }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Notifications color="primary" />
          <Typography variant="h6">
            Notificaciones
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              color="primary"
              sx={{ minWidth: 20, height: 20 }}
            />
          )}
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <List sx={{ p: 0 }}>
          {displayNotifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: notification.read 
                  ? 'transparent' 
                  : alpha(getNotificationColor(notification.type), 0.05),
                '&:hover': {
                  background: alpha(theme.palette.action.hover, 0.1)
                }
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </Typography>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={getNotificationChipColor(notification.type)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box component="div">
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default NotificationsPanel; 