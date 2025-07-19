import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  LinkedIn,
  GitHub,
  Email,
  Phone,
  LocationOn,
  Send,
  CheckCircle,
  Schedule,
  Language,
} from '@mui/icons-material';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  GlassmorphicHover, 
  FloatingCard, 
  ViewportReveal 
} from '@/components/ui/MicroInteractions';

const ContactoPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleContactClick = (type: 'linkedin' | 'github' | 'email') => {
    const urls = {
      linkedin: 'https://www.linkedin.com/in/andres-simahan/',
      github: 'https://github.com/andres-simahan',
      email: 'mailto:andres.simahan@gmail.com',
    };

    window.open(urls[type], '_blank');
  };

  const handleEmailCopy = () => {
    navigator.clipboard.writeText('andres.simahan@gmail.com');
    setSnackbarMessage('Email copiado al portapapeles');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const contactMethods = [
    {
      title: 'LinkedIn',
      description: 'Conecta profesionalmente',
      icon: <LinkedIn />,
      action: () => handleContactClick('linkedin'),
      color: '#0077B5',
      url: 'https://www.linkedin.com/in/andres-simahan/',
    },
    {
      title: 'GitHub',
      description: 'Revisa mis proyectos',
      icon: <GitHub />,
      action: () => handleContactClick('github'),
      color: '#333',
      url: 'https://github.com/andres-simahan',
    },
    {
      title: 'Email',
      description: 'andres.simahan@gmail.com',
      icon: <Email />,
      action: handleEmailCopy,
      color: '#EA4335',
      url: 'mailto:andres.simahan@gmail.com',
    },
  ];

  const availability = [
    {
      day: 'Lunes - Viernes',
      hours: '9:00 AM - 6:00 PM',
      timezone: 'GMT-3 (Argentina)',
    },
    {
      day: 'Sábados',
      hours: '10:00 AM - 2:00 PM',
      timezone: 'GMT-3 (Argentina)',
    },
    {
      day: 'Domingos',
      hours: 'Cerrado',
      timezone: 'Descanso',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header con botón de regreso */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            onClick={handleBackToLanding}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
              '&:hover': {
                borderColor: 'var(--semantic-primary)',
                background: 'var(--semantic-primary-subtle)',
              },
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box
          className="glass-floating"
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 'var(--radius-3xl)',
            mb: 6,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Conecta Conmigo
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'var(--text-secondary)',
              mb: 3,
              fontWeight: 500,
            }}
          >
            Colaboración, asesoría o networking profesional
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Estoy siempre abierto a nuevas oportunidades, colaboraciones y conexiones profesionales. 
            Si tienes un proyecto interesante o quieres discutir sobre QA y seguridad informática, 
            no dudes en contactarme.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<LocationOn />}
              label="Buenos Aires, Argentina"
              variant="outlined"
              sx={{ borderColor: 'var(--border-default)' }}
            />
            <Chip
              icon={<Schedule />}
              label="Disponible para proyectos"
              variant="outlined"
              sx={{ borderColor: 'var(--border-default)' }}
            />
            <Chip
              icon={<Language />}
              label="Español / Inglés"
              variant="outlined"
              sx={{ borderColor: 'var(--border-default)' }}
            />
          </Box>
        </Box>
      </motion.div>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
        {/* Columna Izquierda - Métodos de Contacto */}
        <Box sx={{ flex: { lg: 2 } }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ViewportReveal>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'var(--text-primary)',
                }}
              >
                Métodos de Contacto
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 * index }}
                  >
                    <Card
                      className="glass-floating"
                      sx={{
                        borderRadius: 'var(--radius-2xl)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 'var(--shadow-floating)',
                        },
                      }}
                      onClick={method.action}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              background: method.color,
                              fontSize: '1.5rem',
                            }}
                          >
                            {method.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                mb: 1,
                              }}
                            >
                              {method.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'var(--text-secondary)',
                                mb: 2,
                              }}
                            >
                              {method.description}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={method.title === 'Email' ? <Send /> : <CheckCircle />}
                              sx={{
                                borderColor: method.color,
                                color: method.color,
                                '&:hover': {
                                  background: `${method.color}10`,
                                  borderColor: method.color,
                                },
                              }}
                            >
                              {method.title === 'Email' ? 'Copiar Email' : 'Conectar'}
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </ViewportReveal>
          </motion.div>
        </Box>

        {/* Columna Derecha - Información Adicional */}
        <Box sx={{ flex: { lg: 1 } }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <ViewportReveal>
              {/* Horarios de Disponibilidad */}
              <Card
                className="glass-floating"
                sx={{
                  mb: 4,
                  borderRadius: 'var(--radius-2xl)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Schedule />
                    Horarios de Disponibilidad
                  </Typography>

                  {availability.map((item, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          mb: 1,
                        }}
                      >
                        {item.day}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--semantic-primary)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        {item.hours}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {item.timezone}
                      </Typography>
                      {index < availability.length - 1 && (
                        <Box sx={{ borderBottom: '1px solid var(--border-light)', my: 2 }} />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Información de Ubicación */}
              <Card
                className="glass-floating"
                sx={{
                  borderRadius: 'var(--radius-2xl)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocationOn />
                    Ubicación
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'var(--text-secondary)',
                      mb: 2,
                      fontWeight: 500,
                    }}
                  >
                    Buenos Aires, Argentina
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    Trabajo principalmente de forma remota, pero estoy disponible para reuniones 
                    presenciales en el área metropolitana de Buenos Aires.
                  </Typography>

                  <Chip
                    label="Disponible para trabajo remoto"
                    color="success"
                    variant="outlined"
                    sx={{
                      borderColor: 'var(--semantic-success)',
                      color: 'var(--semantic-success)',
                    }}
                  />
                </CardContent>
              </Card>
            </ViewportReveal>
          </motion.div>
        </Box>
      </Box>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactoPage; 