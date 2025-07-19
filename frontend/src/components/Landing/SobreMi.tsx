import React from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    alpha,
    useTheme,
    Chip,
    Avatar
} from '@mui/material';
import {
    Security as SecurityIcon,
    Code as CodeIcon,
    Psychology as PsychologyIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { FadeInUp, HoverScale } from '@/components/ui/MicroInteractions';

interface Skill {
    label: string;
    icon: React.ReactElement;
    color: 'primary' | 'secondary' | 'success' | 'warning';
}

const SobreMi: React.FC = () => {
    const theme = useTheme();

    const skills: Skill[] = [
        { label: 'Quality Assurance', icon: <SecurityIcon />, color: 'primary' },
        { label: 'Pentesting', icon: <CodeIcon />, color: 'secondary' },
        { label: 'Análisis Crítico', icon: <PsychologyIcon />, color: 'success' },
        { label: 'Metodologías Ágiles', icon: <TrendingUpIcon />, color: 'warning' }
    ];

    return (
        <Box
            id="sobre-mi"
            sx={{
                py: 8,
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 50%, #4a5568 100%)'
                    : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `radial-gradient(circle at 30% 70%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%),
                                radial-gradient(circle at 70% 30%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 50%)`,
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
                            mb: 6
                        }}
                    >
                        Sobre mí
                    </Typography>
                </FadeInUp>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    <Box sx={{ flex: { xs: 'none', md: '2 1 66%' } }}>
                        <FadeInUp delay={0.4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    background: 'var(--glass-background)',
                                    backdropFilter: 'var(--glass-backdrop)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-2xl)',
                                    boxShadow: 'var(--shadow-card)'
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 3,
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    QA Engineer & Security Specialist
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '1.1rem',
                                        lineHeight: 1.8,
                                        mb: 3,
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    Especialista en Quality Assurance enfocado en seguridad informática y metodologías ágiles. 
                                    Combino análisis crítico con soluciones técnicas innovadoras para garantizar la calidad en cada proyecto.
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '1.1rem',
                                        lineHeight: 1.8,
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    Creador de CyberWallet como demostración de habilidades en desarrollo full-stack, 
                                    testing automatizado y arquitectura de software segura.
                                </Typography>
                            </Paper>
                        </FadeInUp>
                    </Box>

                    <Box sx={{ flex: { xs: 'none', md: '1 1 33%' } }}>
                        <FadeInUp delay={0.6}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    background: 'var(--glass-background)',
                                    backdropFilter: 'var(--glass-backdrop)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-2xl)',
                                    boxShadow: 'var(--shadow-card)',
                                    height: 'fit-content'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 3,
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    Especialidades
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                                    {skills.map((skill) => (
                                        <HoverScale key={skill.label}>
                                            <Chip
                                                icon={React.isValidElement(skill.icon) ? skill.icon : <SecurityIcon />}
                                                label={skill.label}
                                                variant="outlined"
                                                                sx={{
                    borderColor: alpha((theme.palette as unknown as Record<string, { main: string }>)[skill.color]?.main || theme.palette.primary.main, 0.3),
                    color: (theme.palette as unknown as Record<string, { main: string }>)[skill.color]?.main || theme.palette.primary.main,
                    backgroundColor: alpha((theme.palette as unknown as Record<string, { main: string }>)[skill.color]?.main || theme.palette.primary.main, 0.05),
                    '& .MuiChip-icon': {
                        color: (theme.palette as unknown as Record<string, { main: string }>)[skill.color]?.main || theme.palette.primary.main,
                    },
                    '&:hover': {
                        backgroundColor: alpha((theme.palette as unknown as Record<string, { main: string }>)[skill.color]?.main || theme.palette.primary.main, 0.1),
                                                        transform: 'translateX(5px)',
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            />
                                        </HoverScale>
                                    ))}
                                </Box>

                                {/* ISTQB Badge */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    p: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 600,
                                            mb: 2,
                                            color: theme.palette.primary.main,
                                            textAlign: 'center'
                                        }}
                                    >
                                        Certificación
                                    </Typography>
                                    <Avatar
                                        src={new URL('/istqb-badge.jpg', import.meta.url).href}
                                        alt="ISTQB Certified Tester"
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mb: 1,
                                            border: `2px solid ${theme.palette.primary.main}`,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                            textAlign: 'center',
                                            fontWeight: 500
                                        }}
                                    >
                                        ISTQB Certified Tester
                                    </Typography>
                                </Box>
                            </Paper>
                        </FadeInUp>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default SobreMi; 