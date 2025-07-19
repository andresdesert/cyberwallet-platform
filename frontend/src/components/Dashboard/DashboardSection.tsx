// DESPUÉS (El código refactorizado y final para DashboardSection.tsx)
import React from 'react';
import { Paper } from '@mui/material';
import type { PaperProps } from '@mui/material'; // Importamos PaperProps para un tipado robusto
import log from 'loglevel';

interface Props {
  children: React.ReactNode;
  sx?: PaperProps['sx']; // Permitimos que se puedan pasar `sx` para overrides de layout si es necesario
}

const DashboardSection: React.FC<Props> = ({ children, sx }) => {
  if (process.env.NODE_ENV === 'development') {
    log.debug(`[DEBUG][DEV][DashboardSection] Renderizando sección con la variante 'glass'.`);
  }

  // Ahora simplemente usamos la variante 'glass' que creamos en nuestro theme.ts
  // y mantenemos los estilos de padding y margen que son propios del layout de este componente.
  return (
    <Paper variant="elevation" sx={{ p: { xs: 2, sm: 4 }, mb: 4, ...sx }}>
      {children}
    </Paper>
  );
};

export default DashboardSection;
