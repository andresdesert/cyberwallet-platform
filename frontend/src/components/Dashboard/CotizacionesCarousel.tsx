import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import CarouselBand from '@/components/CarouselBand/CarouselBand';
import { useCotizaciones } from '@/hooks/useCotizaciones';

const CotizacionesCarousel: React.FC = () => {
  const theme = useTheme();
  const { cotizaciones, isLoading, isError } = useCotizaciones();

  // 🔍 LOGS ESTRATÉGICOS PARA DIAGNÓSTICO
  useEffect(() => {
    console.info('📈 [CotizacionesCarousel] Componente cargado correctamente');
    console.info('📈 [CotizacionesCarousel] Loading:', isLoading);
    console.info('📈 [CotizacionesCarousel] Error:', isError);
    console.info('📈 [CotizacionesCarousel] Cotizaciones:', cotizaciones?.length || 0);
  }, [isLoading, isError, cotizaciones]);

  console.info('📈 [CotizacionesCarousel] Renderizando carousel...');

  if (isLoading) {
    return (
      <Box
        sx={{
          mt: 3,
          mb: 4,
          p: 2,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
          Cargando cotizaciones...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          mt: 3,
          mb: 4,
          p: 2,
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
        }}
      >
        <Alert severity="warning" sx={{ mb: 0 }}>
          No se pudieron cargar las cotizaciones. Intenta más tarde.
        </Alert>
      </Box>
    );
  }

  if (!cotizaciones || cotizaciones.length === 0) {
    return (
      <Box
        sx={{
          mt: 3,
          mb: 4,
          p: 2,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No hay cotizaciones disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 3,
        mb: 4,
        p: 2,
        height: 60,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <CarouselBand dollarRates={cotizaciones} />
    </Box>
  );
};

export default CotizacionesCarousel; 