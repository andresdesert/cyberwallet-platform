import React from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    alpha,
    useTheme,
    Button,
    Stack
} from '@mui/material';
import {
    LinkedIn as LinkedInIcon,
    GitHub as GitHubIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { FadeInUp, HoverScale } from '@/components/ui/MicroInteractions';

const Contacto: React.FC = () => {
    const theme = useTheme();

    const contactLinks = [
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/andres-simahan/',
            icon: <LinkedInIcon />,
            color: '#0077B5',
            description: 'Conecta profesionalmente'
        },
        {
            name: 'GitHub',
            url: 'https://github.com/andresdesert',
            icon: <GitHubIcon />,
            color: '#333',
            description: 'Revisa mi código'
        },
        {
            name: 'Email',
            url: 'mailto:deluxogvc@gmail.com',
            icon: <EmailIcon />,
            color: '#EA4335',
            description: 'deluxogvc@gmail.com'
        }
    ];

    const handleContactClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Box
            id="contacto"
            sx={{
                py: 8,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #2d3748 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e0 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.08)} 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }
            }}
        >
            <Container maxWidth="lg">
                <FadeInUp delay={0.2}>
                    <Typography
                        variant="h2"
                        align="center"
                        sx={{
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2
                        }}
                    >
                        Conecta conmigo
                    </Typography>
                    
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            color: 'var(--text-primary)',
                            mb: 6,
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Si buscas colaboración, asesoría o deseas conectar profesionalmente, 
                        puedes contactarme directamente a través de estos canales:
                    </Typography>
                </FadeInUp>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center' }}>
                    {contactLinks.map((link, index) => (
                        <FadeInUp key={link.name} delay={0.4 + index * 0.2}>
                            <HoverScale>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        background: 'var(--glass-background)',
                                        backdropFilter: 'var(--glass-backdrop)',
                                        border: `2px solid ${alpha(link.color, 0.2)}`,
                                        borderRadius: 'var(--radius-2xl)',
                                        boxShadow: 'var(--shadow-card)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            borderColor: alpha(link.color, 0.4),
                                            boxShadow: `0 8px 32px ${alpha(link.color, 0.2)}`
                                        },
                                        minWidth: { xs: '100%', md: 280 }
                                    }}
                                    onClick={() => handleContactClick(link.url)}
                                >
                                    <Stack spacing={3} alignItems="center">
                                        <Box
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: `linear-gradient(135deg, ${link.color}, ${alpha(link.color, 0.7)})`,
                                                color: 'white',
                                                fontSize: '2rem'
                                            }}
                                        >
                                            {link.icon}
                                        </Box>
                                        
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'var(--text-primary)'
                                            }}
                                        >
                                            {link.name}
                                        </Typography>
                                        
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'var(--text-primary)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {link.description}
                                        </Typography>
                                        
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            sx={{
                                                borderColor: link.color,
                                                color: link.color,
                                                '&:hover': {
                                                    backgroundColor: alpha(link.color, 0.1),
                                                    borderColor: link.color
                                                }
                                            }}
                                        >
                                            Conectar
                                        </Button>
                                    </Stack>
                                </Paper>
                            </HoverScale>
                        </FadeInUp>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default Contacto; 