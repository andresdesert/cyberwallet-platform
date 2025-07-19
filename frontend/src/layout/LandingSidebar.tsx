// src/layout/LandingSidebar.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    alpha,
    Tooltip,
    Backdrop,
} from '@mui/material';
import {
    Home as HomeIcon,
    Security as SecurityIcon,
    Menu as MenuIcon,
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FadeInUp, HoverScale } from '@/components/ui/MicroInteractions';
import { useTranslation } from 'react-i18next';

const LandingSidebar: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const { t } = useTranslation('landing');
    const sidebarRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);

    // Cerrar sidebar con click fuera (mejorado)
    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            const target = event.target as Node;
            
            // No cerrar si el click fue en el botón de toggle o en el sidebar
            if (
                toggleButtonRef.current?.contains(target) ||
                sidebarRef.current?.contains(target) ||
                !open
            ) {
                return;
            }
            
            setOpen(false);
        };

        // Solo agregar listener cuando esté abierto
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [open]);

    // Cerrar sidebar con ESC
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open]);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const navigationItems = [
        {
            label: t('sidebar_navegacion_inicio') || 'Inicio',
            icon: <HomeIcon />,
            action: () => {
                navigate('/');
                setOpen(false);
            },
        },
        {
            label: t('sidebar_navegacion_caracteristicas') || 'Características',
            icon: <SecurityIcon />,
            action: () => {
                const element = document.getElementById('caracteristicas-destacadas');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
                setOpen(false);
            },
        },
    ];

    const quickActions = [
        {
            label: t('sidebar_acciones_crear_cuenta') || 'Crear Cuenta',
            icon: <SecurityIcon />,
            action: () => {
                navigate('/register');
                setOpen(false);
            },
            color: 'primary' as const,
            gradient: true
        },
        {
            label: t('sidebar_acciones_ingresar') || 'Ingresar',
            icon: <HomeIcon />,
            action: () => {
                navigate('/login');
                setOpen(false);
            },
            color: 'secondary' as const,
            gradient: false
        }
    ];

    const SidebarContent = () => (
        <Box 
            ref={sidebarRef}
            sx={{ 
                width: 320, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: theme.palette.background.paper,
            }}
        >
            {/* Header del Sidebar con botón de cierre */}
            <FadeInUp delay={0.1}>
                <Box sx={{ 
                    p: 3, 
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {t('sidebar_navegacion') || 'Navegación'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {t('sidebar_explora_funcionalidades') || 'Explora todas las funcionalidades'}
                        </Typography>
                    </Box>
                    <IconButton 
                        onClick={handleClose}
                        sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': { 
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </FadeInUp>

            {/* Navegación Principal */}
            <FadeInUp delay={0.3}>
                <List sx={{ px: 2, py: 1 }}>
                    {navigationItems.map((item) => (
                        <ListItem 
                            component="button" 
                            onClick={item.action} 
                            key={item.label}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    transform: 'translateX(4px)',
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.label}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </FadeInUp>

            {/* Acciones Rápidas */}
            <FadeInUp delay={0.4}>
                <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, mt: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Acciones Rápidas
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {quickActions.map((action) => (
                            <HoverScale key={action.label}>
                                <Button
                                    onClick={action.action}
                                    variant={action.gradient ? "contained" : "outlined"}
                                    color={action.color}
                                    startIcon={action.icon}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        ...(action.gradient && {
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                            }
                                        })
                                    }}
                                >
                                    {action.label}
                                </Button>
                            </HoverScale>
                        ))}
                    </Box>
                </Box>
            </FadeInUp>

            {/* Enlaces Sociales */}
            <FadeInUp delay={0.5}>
                <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        {t('sidebar_conecta_nosotros') || 'Conecta conmigo'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="GitHub - Andres Simahan">
                            <IconButton
                                onClick={() => window.open('https://github.com/andresdesert', '_blank')}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': { 
                                        color: '#171515',
                                        backgroundColor: alpha('#171515', 0.1)
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <GitHubIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="LinkedIn - Andres Simahan">
                            <IconButton
                                onClick={() => window.open('https://www.linkedin.com/in/andres-simahan/', '_blank')}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    '&:hover': { 
                                        color: '#0a66c2',
                                        backgroundColor: alpha('#0a66c2', 0.1)
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <LinkedInIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </FadeInUp>
        </Box>
    );

    return (
        <>
            {/* Botón de Toggle */}
            <IconButton
                ref={toggleButtonRef}
                onClick={handleToggle}
                sx={{
                    position: 'fixed',
                    top: 80, // Movido abajo del topbar
                    left: 16,
                    zIndex: 1200,
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(26, 26, 46, 0.9)' 
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
                    color: theme.palette.text.primary, // Asegura visibilidad en dark mode
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        transform: 'scale(1.05)',
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <MenuIcon />
            </IconButton>

            {/* Backdrop para click fuera */}
            <Backdrop
                open={open}
                onClick={handleClose}
                sx={{
                    zIndex: 1200, // Debajo del topbar (1400) pero encima del contenido
                    backgroundColor: alpha(theme.palette.common.black, 0.5),
                }}
            />

            {/* Sidebar */}
            <Drawer
                anchor="left"
                open={open}
                onClose={handleClose}
                variant="temporary"
                sx={{
                    zIndex: 1300, // Debajo del topbar (1400) pero encima del backdrop
                    '& .MuiDrawer-paper': {
                        background: theme.palette.mode === 'dark'
                            ? `linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.85) 100%)`
                            : `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
                        backdropFilter: 'blur(20px)',
                        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                }}
            >
                <SidebarContent />
            </Drawer>
        </>
    );
};

export default LandingSidebar;
