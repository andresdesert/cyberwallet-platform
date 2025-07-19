// src/components/CarouselBand/CarouselBand.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface DollarRate {
  nombre: string;
  compra: number;
  venta: number;
  change?: 'up' | 'down' | 'neutral';
}

interface Props {
  dollarRates: DollarRate[];
}

const scrollAnimation = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

const bounceFadeChange = keyframes`
  0% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); opacity: 0.9; }
`;

const CarouselBand: React.FC<Props> = ({ dollarRates }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para asegurar que el contenido esté renderizado
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!dollarRates || dollarRates.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}>
        <Typography variant="body2">Cargando cotizaciones...</Typography>
      </Box>
    );
  }

  const getColor = (change?: 'up' | 'down' | 'neutral') => {
    if (change === 'up') return theme.palette.success.main;
    if (change === 'down') return theme.palette.error.main;
    return theme.palette.text.primary;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: isVisible ? `${scrollAnimation} 30s linear infinite` : 'none',
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {/* Primera copia */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {dollarRates.map((rate, index) => (
            <Box
              key={`first-${rate.nombre}-${index}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 3,
                mr: 2,
                borderRight:
                  index < dollarRates.length - 1
                    ? `1px solid ${alpha(theme.palette.text.primary, 0.2)}`
                    : 'none',
              }}
            >
              {rate.change === 'up' && (
                <ArrowDropUpIcon
                  sx={{ color: theme.palette.success.main, fontSize: '1.2rem', mr: 0.5 }}
                />
              )}
              {rate.change === 'down' && (
                <ArrowDropDownIcon
                  sx={{ color: theme.palette.error.main, fontSize: '1.2rem', mr: 0.5 }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: getColor(rate.change),
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  letterSpacing: '0.02em',
                  textShadow: `1px 1px 3px ${alpha(theme.palette.custom?.neumoDarkShadow || '#000', 0.5)}`,
                  animation:
                    rate.change !== 'neutral'
                      ? `${bounceFadeChange} 0.6s ease`
                      : 'none',
                }}
              >
                {`${rate.nombre}: Compra ${rate.compra} / Venta ${rate.venta}`}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Segunda copia para el efecto infinito */}
        <Box sx={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {dollarRates.map((rate, index) => (
            <Box
              key={`second-${rate.nombre}-${index}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 3,
                mr: 2,
                borderRight:
                  index < dollarRates.length - 1
                    ? `1px solid ${alpha(theme.palette.text.primary, 0.2)}`
                    : 'none',
              }}
            >
              {rate.change === 'up' && (
                <ArrowDropUpIcon
                  sx={{ color: theme.palette.success.main, fontSize: '1.2rem', mr: 0.5 }}
                />
              )}
              {rate.change === 'down' && (
                <ArrowDropDownIcon
                  sx={{ color: theme.palette.error.main, fontSize: '1.2rem', mr: 0.5 }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: getColor(rate.change),
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  letterSpacing: '0.02em',
                  textShadow: `1px 1px 3px ${alpha(theme.palette.custom?.neumoDarkShadow || '#000', 0.5)}`,
                  animation:
                    rate.change !== 'neutral'
                      ? `${bounceFadeChange} 0.6s ease`
                      : 'none',
                }}
              >
                {`${rate.nombre}: Compra ${rate.compra} / Venta ${rate.venta}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CarouselBand;
