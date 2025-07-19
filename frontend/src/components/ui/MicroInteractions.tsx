import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';

// Componente de texto con efecto typewriter mejorado
export const TypewriterText: React.FC<{ text: string; speed?: number; className?: string }> = ({ 
    text, 
    speed = 100,
    className = ''
}) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    // Reset cuando cambia el texto
    useEffect(() => {
        setDisplayText('');
        setCurrentIndex(0);
    }, [text]);

    return (
        <Typography 
            component="span" 
            className={`typewriter ${className}`}
            sx={{
                display: 'inline-block',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: '-2px',
                    top: '0',
                    height: '100%',
                    width: '2px',
                    backgroundColor: 'primary.main',
                    animation: 'blink 1s infinite',
                }
            }}
        >
            {displayText}
        </Typography>
    );
};

// Componente de animación FadeInUp mejorado
export const FadeInUp: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    className?: string;
}> = ({ children, delay = 0, duration = 0.6, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de hover con escala mejorado
export const HoverScale: React.FC<{ 
    children: React.ReactNode; 
    scale?: number;
    className?: string;
}> = ({ children, scale = 1.05, className = '' }) => {
    return (
        <motion.div
            whileHover={{ 
                scale,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.95 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de entrada desde la izquierda
export const SlideInLeft: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.6 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de entrada desde la derecha
export const SlideInRight: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.6 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de rotación
export const RotateIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    angle?: number;
}> = ({ children, delay = 0, duration = 0.6, angle = 360 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, rotate: -angle }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de rebote
export const BounceIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.8 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.68, -0.55, 0.265, 1.55]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de flip
export const FlipIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.6 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de zoom
export const ZoomIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    scale?: number;
}> = ({ children, delay = 0, duration = 0.6, scale = 1.2 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de deslizamiento
export const SlideUp: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    distance?: number;
}> = ({ children, delay = 0, duration = 0.6, distance = 30 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: distance }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de aparición con fade
export const FadeIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.6 }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de pulso
export const Pulse: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 2 }) => {
    return (
        <motion.div
            animate={{ 
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1]
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de shake
export const Shake: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.6 }) => {
    return (
        <motion.div
            animate={{ 
                x: [0, -10, 10, -10, 10, 0]
            }}
            transition={{
                duration,
                delay,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de wave
export const Wave: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 1 }) => {
    return (
        <motion.div
            animate={{ 
                y: [0, -10, 0]
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de aparición escalonada
export const StaggerContainer: React.FC<{ 
    children: React.ReactNode; 
    staggerDelay?: number;
    className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de item escalonado
export const StaggerItem: React.FC<{ 
    children: React.ReactNode; 
    className?: string;
}> = ({ children, className = '' }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de contador
export const AnimatedCounter: React.FC<{ 
    value: number; 
    duration?: number;
    delay?: number;
    className?: string;
}> = ({ value, duration = 2, delay = 0, className = '' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const increment = value / (duration * 60);
            const interval = setInterval(() => {
                setCount(prev => {
                    if (prev >= value) {
                        clearInterval(interval);
                        return value;
                    }
                    return prev + increment;
                });
            }, 1000 / 60);
            return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(timer);
    }, [value, duration, delay]);

    return (
        <span className={className}>
            {Math.floor(count).toLocaleString()}
        </span>
    );
};

// Componente de animación de progreso
export const ProgressBar: React.FC<{ 
    progress: number; 
    duration?: number;
    delay?: number;
    className?: string;
}> = ({ progress, duration = 1, delay = 0, className = '' }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
            }}
            className={className}
        >
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                    duration,
                    delay,
                    ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #5B3DF5, #00C9A7)',
                    borderRadius: '2px'
                }}
            />
        </Box>
    );
};

// Componente de animación de loading
export const LoadingSpinner: React.FC<{ 
    size?: number;
    color?: string;
    className?: string;
}> = ({ size = 40, color = '#5B3DF5', className = '' }) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                width: size,
                height: size,
                border: `3px solid rgba(91, 61, 245, 0.2)`,
                borderTop: `3px solid ${color}`,
                borderRadius: '50%'
            }}
            className={className}
        />
    );
};

// Componente de animación de aparición con blur
export const BlurIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}> = ({ children, delay = 0, duration = 0.6 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de aparición con slide y fade
export const SlideFadeIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, delay = 0, duration = 0.6, direction = 'up' }) => {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 30 };
            case 'down': return { opacity: 0, y: -30 };
            case 'left': return { opacity: 0, x: 30 };
            case 'right': return { opacity: 0, x: -30 };
            default: return { opacity: 0, y: 30 };
        }
    };

    return (
        <motion.div
            initial={getInitialPosition()}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de animación de aparición con scale y fade
export const ScaleFadeIn: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    scale?: number;
}> = ({ children, delay = 0, duration = 0.6, scale = 0.8 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// 🎯 NUEVAS MICROINTERACCIONES AVANZADAS 2025

// Componente de hover con efectos glassmórficos modernos
export const GlassmorphicHover: React.FC<{ 
    children: React.ReactNode; 
    className?: string;
    intensity?: 'subtle' | 'medium' | 'strong';
}> = ({ children, className = '', intensity = 'medium' }) => {
    const getIntensityValues = () => {
        switch (intensity) {
            case 'subtle': return { scale: 1.02, blur: '8px', brightness: 1.05 };
            case 'strong': return { scale: 1.08, blur: '20px', brightness: 1.15 };
            default: return { scale: 1.05, blur: '12px', brightness: 1.1 };
        }
    };

    const { scale, blur, brightness } = getIntensityValues();

    return (
        <motion.div
            whileHover={{ 
                scale,
                filter: `blur(0px) brightness(${brightness})`,
                backdropFilter: `blur(${blur})`,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            style={{ 
                cursor: 'pointer',
                willChange: 'transform, filter'
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de botón con animación de ondas (ripple effect)
export const RippleButton: React.FC<{ 
    children: React.ReactNode; 
    onClick?: () => void;
    className?: string;
    color?: string;
}> = ({ children, onClick, className = '', color = '#6366f1' }) => {
    const [ripples, setRipples] = useState<Array<{id: string, x: number, y: number}>>([]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now().toString();
        
        setRipples(prev => [...prev, { id, x, y }]);
        
        // Limpiar el ripple después de la animación
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 600);
        
        onClick?.();
    };

    return (
        <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
            className={className}
        >
            {children}
            {ripples.map(ripple => (
                <motion.div
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        position: 'absolute',
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: color,
                        pointerEvents: 'none',
                        zIndex: 0
                    }}
                />
            ))}
        </motion.div>
    );
};

// Componente de texto con gradiente animado
export const GradientText: React.FC<{ 
    children: React.ReactNode; 
    gradient?: string;
    animate?: boolean;
    className?: string;
}> = ({ 
    children, 
    gradient = 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
    animate = true,
    className = ''
}) => {
    return (
        <motion.div
            initial={animate ? { backgroundPosition: '0% 50%' } : undefined}
            animate={animate ? { backgroundPosition: '100% 50%' } : undefined}
            transition={animate ? {
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear'
            } : undefined}
            style={{
                background: gradient,
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de aparición con efecto de escritura láser
export const LaserWrite: React.FC<{ 
    text: string;
    speed?: number;
    className?: string;
}> = ({ text, speed = 50, className = '' }) => {
    const [visibleChars, setVisibleChars] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setVisibleChars(prev => {
                if (prev >= text.length) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return (
        <Box className={className} sx={{ position: 'relative', display: 'inline-block' }}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: index < visibleChars ? 1 : 0,
                        scale: index < visibleChars ? 1 : 0.5
                    }}
                    transition={{
                        duration: 0.1,
                        ease: "easeOut"
                    }}
                    style={{
                        display: 'inline-block',
                        color: index < visibleChars ? 'inherit' : 'transparent'
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1em',
                    backgroundColor: '#6366f1',
                    marginLeft: '2px'
                }}
            />
        </Box>
    );
};

// Componente de card con efecto de flotación
export const FloatingCard: React.FC<{ 
    children: React.ReactNode; 
    className?: string;
    intensity?: 'subtle' | 'medium' | 'strong';
}> = ({ children, className = '', intensity = 'medium' }) => {
    const getFloatValues = () => {
        switch (intensity) {
            case 'subtle': return { y: [-2, 2], duration: 4 };
            case 'strong': return { y: [-8, 8], duration: 2 };
            default: return { y: [-4, 4], duration: 3 };
        }
    };

    const { y, duration } = getFloatValues();

    return (
        <motion.div
            animate={{ y }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
            }}
            whileHover={{
                y: 0,
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Componente de número con animación de ticker
export const TickerNumber: React.FC<{ 
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
    className?: string;
}> = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1, className = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const startValue = displayValue;
        const difference = value - startValue;

        const updateValue = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const currentValue = startValue + (difference * progress);

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        };

        requestAnimationFrame(updateValue);
    }, [value, duration]);

    return (
        <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={className}
        >
            {prefix}{displayValue.toFixed(decimals)}{suffix}
        </motion.span>
    );
};

// Componente de partículas flotantes decorativas
export const FloatingParticles: React.FC<{ 
    count?: number;
    size?: number;
    color?: string;
    speed?: number;
}> = ({ count = 5, size = 4, color = '#6366f1', speed = 10 }) => {
    const particles = Array.from({ length: count }, (_, i) => i);

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
            {particles.map(particle => (
                <motion.div
                    key={particle}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: window.innerHeight + 50,
                        opacity: 0
                    }}
                    animate={{
                        y: -50,
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: speed,
                        repeat: Infinity,
                        delay: particle * (speed / count),
                        ease: 'linear'
                    }}
                    style={{
                        position: 'absolute',
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: '50%',
                        opacity: 0.6
                    }}
                />
            ))}
        </Box>
    );
};

// Componente de revelar texto con efecto de máscara
export const MaskReveal: React.FC<{ 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
    direction?: 'left' | 'right' | 'top' | 'bottom';
}> = ({ children, delay = 0, duration = 0.8, direction = 'left' }) => {
    const getMaskStyle = () => {
        switch (direction) {
            case 'right': return { clipPath: 'inset(0 100% 0 0)' };
            case 'top': return { clipPath: 'inset(100% 0 0 0)' };
            case 'bottom': return { clipPath: 'inset(0 0 100% 0)' };
            default: return { clipPath: 'inset(0 0 0 100%)' };
        }
    };

    return (
        <motion.div
            initial={getMaskStyle()}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
};

// Componente de indicador de carga con pulso
export const PulseLoader: React.FC<{ 
    size?: number;
    color?: string;
    count?: number;
}> = ({ size = 8, color = '#6366f1', count = 3 }) => {
    const dots = Array.from({ length: count }, (_, i) => i);

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {dots.map(dot => (
                <motion.div
                    key={dot}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.2,
                        ease: 'easeInOut'
                    }}
                    style={{
                        width: size,
                        height: size,
                        backgroundColor: color,
                        borderRadius: '50%'
                    }}
                />
            ))}
        </Box>
    );
};

// Hook para detectar visibilidad en viewport
export const useInView = (threshold = 0.1) => {
    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold }
        );

        observer.observe(ref);

        return () => observer.disconnect();
    }, [ref, threshold]);

    return [setRef, inView] as const;
};

// Componente de animación cuando entra en viewport
export const ViewportReveal: React.FC<{ 
    children: React.ReactNode; 
    animation?: 'fade' | 'slide' | 'scale' | 'blur';
    threshold?: number;
    className?: string;
}> = ({ children, animation = 'fade', threshold = 0.1, className = '' }) => {
    const [ref, inView] = useInView(threshold);

    const getAnimationProps = () => {
        switch (animation) {
            case 'slide':
                return {
                    initial: { opacity: 0, y: 50 },
                    animate: { opacity: inView ? 1 : 0, y: inView ? 0 : 50 }
                };
            case 'scale':
                return {
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: inView ? 1 : 0, scale: inView ? 1 : 0.8 }
                };
            case 'blur':
                return {
                    initial: { opacity: 0, filter: 'blur(10px)' },
                    animate: { opacity: inView ? 1 : 0, filter: inView ? 'blur(0px)' : 'blur(10px)' }
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: inView ? 1 : 0 }
                };
        }
    };

    return (
        <motion.div
            ref={ref}
            {...getAnimationProps()}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}; 