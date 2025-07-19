// src/components/MobileAccordionSection/MobileAccordionSection.tsx
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme, alpha } from '@mui/material/styles';
import log from 'loglevel'; // Import loglevel

interface MobileAccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const MobileAccordionSection: React.FC<MobileAccordionSectionProps> = ({
  title,
  icon,
  children,
  defaultExpanded = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Log component render in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      log.debug(`[DEBUG][DEV][MobileAccordion] Renderizando sección: "${title}". Default Expanded: ${defaultExpanded}. Es móvil: ${isMobile}.`);
    }
  }, [title, defaultExpanded, isMobile]);

  // Handle accordion expansion/collapse events for logging
    const handleAccordionChange = (_: unknown, isExpanded: boolean) => {
        if (process.env.NODE_ENV === 'development') {
      log.info(`[INFO][DEV][MobileAccordion] Sección "${title}" ${isExpanded ? 'expandida' : 'colapsada'}.`);
    } else if (process.env.NODE_ENV === 'test') {
      log.debug(`[DEBUG][TEST][MobileAccordion] "${title}" state: ${isExpanded ? 'Expanded' : 'Collapsed'}.`);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: 4,
        mb: 2,
          backgroundColor: theme.palette.custom.bodyBackgroundPrimary,
        backdropFilter: 'blur(10px) saturate(180%)',
        border: `1px solid ${theme.palette.custom.glassBorder}`,
        boxShadow: `0 8px 20px ${alpha(
          theme.palette.custom.neumoDarkShadow,
          0.3
        )}, inset 0 0 5px ${alpha(
          theme.palette.custom.neumoLightShadow,
          0.08
        )}`,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Accordion
        defaultExpanded={defaultExpanded}
        elevation={0}
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
        onChange={handleAccordionChange} // Add onChange handler for logging
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 2,
            py: 1.5,
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 1.5,
            },
          }}
        >
          {icon}
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2 }}>{children}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MobileAccordionSection;
