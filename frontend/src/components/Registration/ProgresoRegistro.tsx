// ARCHIVO: src/components/Registration/ProgresoRegistro.tsx

import React from "react";
import { Box, LinearProgress, Typography, useTheme, alpha } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion } from "motion/react";
import log from 'loglevel';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const ProgresoRegistro: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const theme = useTheme();
  const progress = (currentStep / totalSteps) * 100;

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEV][ProgresoRegistro] Renderizando. Paso: ${currentStep}/${totalSteps}`);
    }
  }, [currentStep, totalSteps, progress]);

  const stepLabels = ['Datos Personales', 'Datos de Identidad', 'Dirección'];

  return (
    <Box sx={{ mb: 4 }}>
      {/* Título del progreso */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          style={{ display: "inline-flex", alignItems: "center", marginRight: 10 }}
        >
          <SettingsIcon
            sx={{
              fontSize: '1.5rem',
              color: 'primary.main',
              textShadow: `1px 1px 3px ${alpha(theme.palette.primary.dark, 0.5)}`
            }}
          />
        </motion.div>

        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          {stepLabels[currentStep - 1] || 'Completando registro...'}
        </Typography>
      </Box>

      {/* Indicadores de pasos */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: isCompleted 
                      ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                      : isCurrent 
                        ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                        : alpha(theme.palette.grey[400], 0.3),
                    color: isCompleted || isCurrent ? 'white' : theme.palette.text.disabled,
                    border: isCurrent ? `3px solid ${theme.palette.primary.main}40` : 'none',
                    boxShadow: isCompleted || isCurrent 
                      ? `0 4px 12px ${isCompleted ? theme.palette.success.main : theme.palette.primary.main}40`
                      : 'none',
                  }}
                >
                  {isCompleted ? '✓' : stepNumber}
                </Box>
              </motion.div>
              
              {index < totalSteps - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    mx: 1,
                    background: stepNumber < currentStep 
                      ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                      : alpha(theme.palette.grey[400], 0.3),
                    borderRadius: 1,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Barra de progreso lineal */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.grey[400], 0.2),
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }
        }}
      />
      
      {/* Texto de progreso */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 1,
          color: 'text.secondary',
          fontWeight: 500,
        }}
      >
        Progreso: {Math.round(progress)}% completado
      </Typography>
    </Box>
  );
};

export default ProgresoRegistro;
