import React from 'react';
import { Box } from '@mui/material';


interface Props {
    children: React.ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: 'background.default',
                position: 'relative',
            }}
        >


            {/* Contenido principal */}
            {children}

            {/* Footer opcional */}
            {/* <AppFooter /> */}
        </Box>
    );
};

export default AppLayout;
