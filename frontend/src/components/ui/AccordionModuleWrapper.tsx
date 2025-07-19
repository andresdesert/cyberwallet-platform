// ARCHIVO: src/components/ui/AccordionModuleWrapper.tsx

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useMediaQuery,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles'; // Se mantiene para el useMediaQuery
import log from 'loglevel';

interface AccordionModuleWrapperProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const AccordionModuleWrapper: React.FC<AccordionModuleWrapperProps> = ({
  title,
  children,
  defaultExpanded = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // --- LA LÓGICA DE USEEFFECT Y HANDLERS NO CAMBIA ---
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEV][AccordionWrapper] Renderizando "${title}". Modo: ${isMobile ? 'Móvil (Accordion)' : 'Escritorio (Box)'}.`);
    }
  }, [title, isMobile]);

  const handleAccordionChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    if (process.env.NODE_ENV === 'development') {
      log.info(`[DEV][AccordionWrapper] Sección móvil "${title}" ${isExpanded ? 'expandida' : 'colapsada'}.`);
    }
  };

  if (!isMobile) {
    return <Box sx={{ mb: 3 }}>{children}</Box>;
  }

  return (
    // CAMBIO: Se ha eliminado la prop `sx`. El componente ahora hereda
    // toda su apariencia y comportamiento desde el `styleOverride` en theme.ts.
    <Accordion
      defaultExpanded={defaultExpanded}
      onChange={handleAccordionChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}
        aria-controls={`${title}-content`}
        id={`${title}-header`}
        sx={{ px: 2 }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pt: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionModuleWrapper;
