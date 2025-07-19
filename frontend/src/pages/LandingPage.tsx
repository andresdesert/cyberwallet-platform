// 🚀 CYBERWALLET LANDING PAGE 2025
// Página principal con diseño moderno y animaciones profesionales

import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    useTheme,
    Card,
    CardContent,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    ArrowForward,
    Security,
    Speed,
    Support,
    TrendingUp,
    VerifiedUser,
    Star,
    CheckCircle,
    PlayArrow,
    GitHub,
    LinkedIn,
    Twitter,
    Email,
    Phone,
    LocationOn,
    School,
    Work,
    Code,
    Palette,
    Cloud,
    Storage,
    Api,
    PhoneAndroid,
    Web,
    Computer,
    Laptop,
    Smartphone,
    Tablet,
    Watch,
    Headphones,
    Camera,
    SportsEsports,
    Keyboard,
    Mouse,
    Monitor,
    Print,
    Router,
    Dns,
    Hub,
    Shield,
    Lock,
    Key,
    Fingerprint,
    Visibility,
    VisibilityOff,
    Search,
    FilterList,
    Sort,
    Refresh,
    Download,
    Upload,
    Share,
    Bookmark,
    Favorite,
    ThumbUp,
    ThumbDown,
    Comment,
    Reply,
    Forward,
    ArrowBack,
    Home,
    Menu,
    Close,
    Settings,
    Notifications,
    AccountCircle,
    ExitToApp,
    Login,
    PersonAdd,
    VpnKey,
    LockOpen,
    LockOutlined,
    SecurityOutlined,
    VerifiedUserOutlined,
    StarOutline,
    CheckCircleOutline,
    PlayArrowOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';

// Componentes locales
import LandingHeader from '@/layout/LandingHeader';
import LandingSidebar from '@/layout/LandingSidebar';
import Hero from '@/components/Landing/Hero';
import SobreMi from '@/components/Landing/SobreMi';
import Contacto from '@/components/Landing/Contacto';
import CyberWalletLogo from '@/components/ui/CyberWalletLogo';
import { 
    FadeInUp, 
    HoverScale, 
    SlideInLeft, 
    SlideInRight, 
    RotateIn, 
    BounceIn, 
    FlipIn, 
    ZoomIn, 
    SlideUp, 
    FadeIn, 
    Pulse, 
    Shake, 
    Wave, 
    StaggerContainer, 
    StaggerItem,
    AnimatedCounter,
    ProgressBar,
    LoadingSpinner,
    BlurIn,
    SlideFadeIn,
    ScaleFadeIn,
    GlassmorphicHover,
    RippleButton,
    GradientText,
    LaserWrite,
    FloatingCard,
    TickerNumber,
    FloatingParticles,
    MaskReveal,
    PulseLoader,
    ViewportReveal,
} from '@/components/ui/MicroInteractions';

// 🎯 Interfaz para características
interface Feature {
    icon: React.ReactElement;
    title: string;
    description: string;
    color: string;
    gradient: string;
}

// 🎯 Interfaz para testimonios
interface Testimonial {
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
    rating: number;
}

// 🎯 Interfaz para estadísticas
interface Statistic {
    value: number;
    label: string;
    icon: React.ReactElement;
    color: string;
}

// 🎯 Interfaz para tecnologías
interface Technology {
    name: string;
    icon: React.ReactElement;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'design';
    proficiency: number;
    color: string;
}

// 🎯 Interfaz para proyectos
interface Project {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    link: string;
    github: string;
    category: 'web' | 'mobile' | 'desktop' | 'api';
}

const LandingPage: React.FC = () => {
    const { t } = useTranslation('landing');
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    console.log('🎯 LandingPage renderizando...');
    console.log('🎯 Tema:', theme.palette.mode);

    // 🎯 Características principales
    const features: Feature[] = [
        {
            icon: <Security sx={{ fontSize: '2rem' }} />,
            title: t('features.security.title'),
            description: t('features.security.description'),
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        },
        {
            icon: <Speed sx={{ fontSize: '2rem' }} />,
            title: t('features.speed.title'),
            description: t('features.speed.description'),
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        },
        {
            icon: <Support sx={{ fontSize: '2rem' }} />,
            title: t('features.support.title'),
            description: t('features.support.description'),
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        },
        {
            icon: <TrendingUp sx={{ fontSize: '2rem' }} />,
            title: t('features.analytics.title'),
            description: t('features.analytics.description'),
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        },
    ];

    // 🎯 Estadísticas
    const statistics: Statistic[] = [
        {
            value: 1000,
            label: t('stats.users'),
            icon: <VerifiedUser sx={{ fontSize: '1.5rem' }} />,
            color: '#3b82f6',
        },
        {
            value: 50000,
            label: t('stats.transactions'),
            icon: <TrendingUp sx={{ fontSize: '1.5rem' }} />,
            color: '#10b981',
        },
        {
            value: 99.9,
            label: t('stats.uptime'),
            icon: <Security sx={{ fontSize: '1.5rem' }} />,
            color: '#f59e0b',
        },
        {
            value: 24,
            label: t('stats.support'),
            icon: <Support sx={{ fontSize: '1.5rem' }} />,
            color: '#ef4444',
        },
    ];

    // 🎯 Tecnologías
    const technologies: Technology[] = [
        {
            name: 'React',
            icon: <Code />,
            category: 'frontend',
            proficiency: 95,
            color: '#61dafb',
        },
        {
            name: 'TypeScript',
            icon: <Code />,
            category: 'frontend',
            proficiency: 90,
            color: '#3178c6',
        },
        {
            name: 'Node.js',
            icon: <Api />,
            category: 'backend',
            proficiency: 88,
            color: '#339933',
        },
        {
            name: 'PostgreSQL',
            icon: <Storage />,
            category: 'database',
            proficiency: 85,
            color: '#336791',
        },
        {
            name: 'Docker',
            icon: <Cloud />,
            category: 'devops',
            proficiency: 82,
            color: '#2496ed',
        },
        {
            name: 'Material-UI',
            icon: <Palette />,
            category: 'frontend',
            proficiency: 90,
            color: '#0081cb',
        },
    ];

    // 🎯 Proyectos destacados
    const projects: Project[] = [
        {
            title: 'CyberWallet',
            description: t('projects.cyberwallet.description'),
            image: '/api/placeholder/400/300',
            technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
            link: '#',
            github: 'https://github.com/cyberwallet',
            category: 'web',
        },
        {
            title: 'E-Commerce Platform',
            description: t('projects.ecommerce.description'),
            image: '/api/placeholder/400/300',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            link: '#',
            github: 'https://github.com/ecommerce',
            category: 'web',
        },
        {
            title: 'Mobile Banking App',
            description: t('projects.banking.description'),
            image: '/api/placeholder/400/300',
            technologies: ['React Native', 'Firebase', 'Redux'],
            link: '#',
            github: 'https://github.com/banking',
            category: 'mobile',
        },
    ];

    // 🎯 Testimonios
    const testimonials: Testimonial[] = [
        {
            name: 'María González',
            role: 'CEO',
            company: 'TechCorp',
            content: t('testimonials.maria.content'),
            avatar: '/api/placeholder/100/100',
            rating: 5,
        },
        {
            name: 'Carlos Rodríguez',
            role: 'CTO',
            company: 'InnovateLab',
            content: t('testimonials.carlos.content'),
            avatar: '/api/placeholder/100/100',
            rating: 5,
        },
        {
            name: 'Ana Martínez',
            role: 'Product Manager',
            company: 'DigitalBank',
            content: t('testimonials.ana.content'),
            avatar: '/api/placeholder/100/100',
            rating: 5,
        },
    ];

    // 🎯 Manejadores de eventos
    const handleGetStarted = () => {
        navigate('/register');
    };

    const handleLearnMore = () => {
        const element = document.getElementById('features');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleContact = () => {
        const element = document.getElementById('contact');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    // 🎯 Componente de característica individual
    const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => (
        <StaggerItem>
            <GlassmorphicHover intensity="medium">
                <Card
                    sx={{
                        height: '100%',
                        background: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: feature.gradient,
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                            opacity: 1,
                        },
                    }}
                >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: feature.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                                color: 'white',
                                boxShadow: `0 8px 32px ${theme.palette.primary.main}`,
                            }}
                        >
                            {feature.icon}
                        </Box>
                        <Typography
                            variant="h6"
                            component="h3"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: feature.gradient,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {feature.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                        >
                            {feature.description}
                        </Typography>
                    </CardContent>
                </Card>
            </GlassmorphicHover>
        </StaggerItem>
    );

    // 🎯 Componente de estadística individual
    const StatisticCard: React.FC<{ statistic: Statistic; index: number }> = ({ statistic, index }) => (
        <StaggerItem>
            <FloatingCard intensity="subtle">
                <Card
                    sx={{
                        background: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 3,
                        textAlign: 'center',
                        p: 3,
                    }}
                >
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            color: 'white',
                        }}
                    >
                        {statistic.icon}
                    </Box>
                    <TickerNumber
                        value={statistic.value}
                        suffix={statistic.label.includes('%') ? '%' : statistic.label.includes('+') ? '+' : ''}
                        duration={2}
                        className="statistic-value"
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, fontWeight: 500 }}
                    >
                        {statistic.label}
                    </Typography>
                </Card>
            </FloatingCard>
        </StaggerItem>
    );

    // 🎯 Componente de tecnología individual
    const TechnologyCard: React.FC<{ technology: Technology; index: number }> = ({ technology, index }) => (
        <StaggerItem>
            <Card
                sx={{
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 3,
                    p: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 40px ${theme.palette.primary.main}`,
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: theme.palette.primary.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: technology.color,
                        }}
                    >
                        {technology.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {technology.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {technology.category}
                        </Typography>
                    </Box>
                </Box>
                <ProgressBar
                    progress={technology.proficiency}
                    duration={1.5}
                    delay={index * 0.1}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {technology.proficiency}% proficiency
                </Typography>
            </Card>
        </StaggerItem>
    );

    // 🎯 Componente de proyecto individual
    const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
        <StaggerItem>
            <HoverScale scale={1.02}>
                <Card
                    sx={{
                        background: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Box
                        sx={{
                            height: 200,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                        }}
                    >
                        <Typography variant="h4" color="text.secondary">
                            {project.title}
                        </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                            {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {project.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {project.technologies.map((tech, techIndex) => (
                                <Chip
                                    key={techIndex}
                                    label={tech}
                                    size="small"
                                    sx={{
                                        background: theme.palette.primary.main,
                                        color: 'white',
                                        fontSize: '0.7rem',
                                    }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <RippleButton>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlayArrow />}
                                    onClick={() => window.open(project.link, '_blank')}
                                >
                                    Demo
                                </Button>
                            </RippleButton>
                            <RippleButton>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<GitHub />}
                                    onClick={() => window.open(project.github, '_blank')}
                                >
                                    Code
                                </Button>
                            </RippleButton>
                        </Box>
                    </CardContent>
                </Card>
            </HoverScale>
        </StaggerItem>
    );

    // 🎯 Componente de testimonio individual
    const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => (
        <StaggerItem>
            <Card
                sx={{
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: 3,
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                        <Star key={starIndex} sx={{ color: '#fbbf24', fontSize: '1.2rem' }} />
                    ))}
                </Box>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flex: 1, fontStyle: 'italic', mb: 2 }}
                >
                    "{testimonial.content}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {testimonial.role} at {testimonial.company}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </StaggerItem>
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* 🎨 Partículas flotantes decorativas */}
            <FloatingParticles count={20} size={3} color={theme.palette.primary.main} speed={15} />

            {/* 🎨 Header */}
            <LandingHeader />

            {/* 🎨 Contenido principal */}
            <Box component="main">
                {/* 🎯 Sección Hero */}
                <Hero />

                {/* 🎯 Sección de características */}
                <Box id="features" sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <ViewportReveal animation="fade">
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <GradientText
                                    gradient="linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)"
                                    className="section-title"
                                >
                                    <Typography variant="h3" component="h2" fontWeight={700}>
                                        {t('features.title')}
                                    </Typography>
                                </GradientText>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}
                                >
                                    {t('features.subtitle')}
                                </Typography>
                            </Box>
                        </ViewportReveal>

                        <StaggerContainer staggerDelay={0.1}>
                            <Grid container spacing={4}>
                                {features.map((feature, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                        <FeatureCard feature={feature} index={index} />
                                    </Grid>
                                ))}
                            </Grid>
                        </StaggerContainer>
                    </Container>
                </Box>

                {/* 🎯 Sección de estadísticas */}
                <Box sx={{ py: 8, background: theme.palette.primary.main }}>
                    <Container maxWidth="lg">
                        <ViewportReveal animation="fade">
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography variant="h3" component="h2" fontWeight={700}>
                                    {t('stats.title')}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 2 }}
                                >
                                    {t('stats.subtitle')}
                                </Typography>
                            </Box>
                        </ViewportReveal>

                        <StaggerContainer staggerDelay={0.1}>
                            <Grid container spacing={4}>
                                {statistics.map((statistic, index) => (
                                    <Grid size={{ xs: 6, md: 3 }} key={index}>
                                        <StatisticCard statistic={statistic} index={index} />
                                    </Grid>
                                ))}
                            </Grid>
                        </StaggerContainer>
                    </Container>
                </Box>

                {/* 🎯 Sección Sobre Mí */}
                <SobreMi />

                {/* 🎯 Sección de tecnologías */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <ViewportReveal animation="fade">
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography variant="h3" component="h2" fontWeight={700}>
                                    {t('technologies.title')}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 2 }}
                                >
                                    {t('technologies.subtitle')}
                                </Typography>
                            </Box>
                        </ViewportReveal>

                        <StaggerContainer staggerDelay={0.1}>
                            <Grid container spacing={3}>
                                {technologies.map((technology, index) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                        <TechnologyCard technology={technology} index={index} />
                                    </Grid>
                                ))}
                            </Grid>
                        </StaggerContainer>
                    </Container>
                </Box>

                {/* 🎯 Sección de proyectos */}
                <Box sx={{ py: 8, background: theme.palette.primary.main }}>
                    <Container maxWidth="lg">
                        <ViewportReveal animation="fade">
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography variant="h3" component="h2" fontWeight={700}>
                                    {t('projects.title')}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 2 }}
                                >
                                    {t('projects.subtitle')}
                                </Typography>
                            </Box>
                        </ViewportReveal>

                        <StaggerContainer staggerDelay={0.1}>
                            <Grid container spacing={4}>
                                {projects.map((project, index) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                                        <ProjectCard project={project} index={index} />
                                    </Grid>
                                ))}
                            </Grid>
                        </StaggerContainer>
                    </Container>
                </Box>

                {/* 🎯 Sección de testimonios */}
                <Box sx={{ py: 8 }}>
                    <Container maxWidth="lg">
                        <ViewportReveal animation="fade">
                            <Box sx={{ textAlign: 'center', mb: 6 }}>
                                <Typography variant="h3" component="h2" fontWeight={700}>
                                    {t('testimonials.title')}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ mt: 2 }}
                                >
                                    {t('testimonials.subtitle')}
                                </Typography>
                            </Box>
                        </ViewportReveal>

                        <StaggerContainer staggerDelay={0.1}>
                            <Grid container spacing={4}>
                                {testimonials.map((testimonial, index) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                                        <TestimonialCard testimonial={testimonial} index={index} />
                                    </Grid>
                                ))}
                            </Grid>
                        </StaggerContainer>
                    </Container>
                </Box>

                {/* 🎯 Sección de contacto */}
                <Contacto />
            </Box>

            {/* 🎨 Sidebar para móviles */}
            {isMobile && <LandingSidebar />}

            {/* 🎨 Estilos CSS personalizados */}
            <style>{`
                .section-title {
                    background-size: 200% 200%;
                    animation: gradientShift 3s ease infinite;
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .statistic-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: ${theme.palette.primary.main};
                }

                @media (max-width: 600px) {
                    .statistic-value {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </Box>
    );
};

export default LandingPage;