import React, { useRef, useEffect } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useCotizaciones } from '@/hooks/useCotizaciones';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const CotizacionesTopbar: React.FC = () => {
  const theme = useTheme();
  const { cotizaciones, isLoading } = useCotizaciones();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reiniciar animación cuando cambian las cotizaciones
    if (scrollRef.current && cotizaciones && cotizaciones.length > 0) {
      const element = scrollRef.current;
      element.style.animation = 'none';
      element.offsetHeight; // Trigger reflow
      element.style.animation = 'cotizaciones-scroll 25s linear infinite';
    }
  }, [cotizaciones]);

  if (isLoading || !cotizaciones || cotizaciones.length === 0) {
    return (
      <Box
        sx={{
          width: '75%', // Exactamente 3/4 del ancho
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 48,
          color: 'text.secondary',
          fontSize: '0.95rem',
          mx: 'auto', // Centrar horizontalmente
        }}
      >
        <Typography variant="body2">Cargando cotizaciones...</Typography>
      </Box>
    );
  }

  // Duplicar los ítems para el efecto infinito
  const items = [...cotizaciones, ...cotizaciones, ...cotizaciones];

  return (
    <Box
      sx={{
        width: '75%', // Exactamente 3/4 del ancho
        height: 48,
        overflow: 'hidden',
        position: 'relative',
        mx: 'auto', // Centrar horizontalmente
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          animation: 'cotizaciones-scroll 25s linear infinite',
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {items.map((rate, index) => (
          <Box
            key={`${rate.nombre}-${index}`}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 2,
              mx: 1,
              py: 0.5,
              borderRadius: 1,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                background: alpha(theme.palette.background.paper, 1),
                transform: 'translateY(-1px)',
                boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.15)}`,
              },
            }}
          >
            {rate.change === 'up' && (
              <ArrowDropUpIcon sx={{ color: theme.palette.success.main, fontSize: '1rem', mr: 0.5 }} />
            )}
            {rate.change === 'down' && (
              <ArrowDropDownIcon sx={{ color: theme.palette.error.main, fontSize: '1rem', mr: 0.5 }} />
            )}
            {rate.change === 'neutral' && (
              <TrendingFlatIcon sx={{ color: theme.palette.text.secondary, fontSize: '1rem', mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color:
                  rate.change === 'up'
                    ? theme.palette.success.main
                    : rate.change === 'down'
                    ? theme.palette.error.main
                    : theme.palette.text.primary,
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.02em',
                textShadow: `1px 1px 2px ${alpha(theme.palette.common.black, 0.1)}`,
              }}
            >
              {`${rate.nombre}: $${rate.compra} / $${rate.venta}`}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CotizacionesTopbar; 