// src/layout/PageContainer.tsx
import React from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import type { ContainerProps } from '@mui/material';

interface PageContainerProps extends Omit<ContainerProps, 'maxWidth'> {
    children: React.ReactNode;
    maxWidth?: number | string;
    disablePadding?: boolean;
}

/**
 * Contenedor responsivo central para páginas.
 * Maneja paddings adaptativos, altura mínima y límites de ancho.
 */
const PageContainer: React.FC<PageContainerProps> = ({
                                                         children,
                                                         maxWidth = 800,
                                                         disablePadding = false,
                                                         sx,
                                                         ...rest
                                                     }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const containerMaxWidth =
        isMobile ? '100%' : typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            minHeight="100dvh"
            sx={{
                backgroundColor: theme.palette.background.default,
                overflowX: 'hidden',
                overflowY: 'auto',
                pt: disablePadding ? 0 : { xs: 2, sm: 4 },
                pb: disablePadding ? 0 : { xs: 10, sm: 6 },
                px: disablePadding ? 0 : { xs: 2, sm: 4, md: 6 },
                ...sx, // permite estilos externos al componente
            }}
        >
            <Container
                maxWidth={false}
                disableGutters
                sx={{
                    width: '100%',
                    maxWidth: containerMaxWidth,
                }}
                {...rest}
            >
                {children}
            </Container>
        </Box>
    );
};

export default PageContainer;
