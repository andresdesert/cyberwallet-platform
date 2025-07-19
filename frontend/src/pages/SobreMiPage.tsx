import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack,
  Work,
  School,
  Psychology,
  Security,
  Code,
  BugReport,
  TrendingUp,
  LinkedIn,
  GitHub,
  Email,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  GlassmorphicHover, 
  FloatingCard, 
  GradientText,
  ViewportReveal 
} from '@/components/ui/MicroInteractions';

const SobreMiPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleBackToLanding = () => {
    navigate('/');
  };

  const skills = [
    { name: 'Quality Assurance', icon: <BugReport />, level: 95 },
    { name: 'Testing Automation', icon: <Code />, level: 88 },
    { name: 'Performance Testing', icon: <TrendingUp />, level: 85 },
    { name: 'Agile Methodologies', icon: <Psychology />, level: 92 },
    { name: 'Manual Testing', icon: <Work />, level: 90 },
    { name: 'Security Testing', icon: <Security />, level: 82 },
  ];

  const experience = [
    {
      period: 'Ene 2025 - Presente',
      role: 'QA Engineer',
      company: 'BOZ IT Development / Intermex',
      description: 'Diseño y ejecución de casos de prueba desde Sprint 0, implementación de pruebas de carga con K6, y desarrollo de blueprint estratégico con .NET Aspire.',
    },
    {
      period: 'May 2023 - Ene 2025',
      role: 'Sr. QA Analyst',
      company: 'BOZ IT Development / Intermex',
      description: 'Ejecución de pruebas manuales especializadas para servicios de pagos, gestión de ambientes de pruebas y coordinación de resolución de errores en producción.',
    },
    {
      period: 'Jun 2022 - May 2023',
      role: 'QA Analyst',
      company: 'Qualis Lab',
      description: 'Validación y certificación de productos bancarios, coordinación con equipos de producto y gestión de tickets de soporte para clientes bancarios.',
    },
    {
      period: 'Oct 2021 - Jun 2022',
      role: 'QA Specialist',
      company: 'Penta Security Solutions',
      description: 'Pruebas funcionales y de regresión en plataformas móviles y web, automatizaciones con Selenium y Appium, y soporte en servidores Kubernetes.',
    },
    {
      period: 'Mar 2021 - Oct 2021',
      role: 'QA Analyst',
      company: 'Tata Consultancy Services',
      description: 'Pruebas de validación manual para sistemas de cheques y facturas, diseño de casos de prueba con IQP y ALM, y validación de integraciones bancarias.',
    },
    {
      period: 'Ene 2020 - Mar 2021',
      role: 'Desarrollador Java Junior',
      company: 'Defensoría del Pueblo de la Nación',
      description: 'Desarrollo de microservicios Java para sistemas internos, mantenimiento de APIs REST, y colaboración en proyectos de digitalización de procesos administrativos.',
    },
  ];

  const certifications = [
    {
      name: 'ISTQB Certified Tester',
      level: 'Foundation Level',
      year: '2024',
      badge: '/istqb-badge.jpg',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header con botón de regreso */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            onClick={handleBackToLanding}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
              '&:hover': {
                borderColor: 'var(--semantic-primary)',
                background: 'var(--semantic-primary-subtle)',
              },
            }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box
          className="glass-floating"
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 'var(--radius-3xl)',
            mb: 6,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                background: 'var(--gradient-primary)',
                fontSize: '3rem',
                fontWeight: 700,
                mb: 2,
              }}
            >
              AS
            </Avatar>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontFamily: 'var(--font-heading)',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Andrés Simahan
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: 'var(--text-secondary)',
              mb: 3,
              fontWeight: 500,
            }}
          >
            Sr. QA Analyst & Performance Testing Specialist
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'var(--text-secondary)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Especialista en calidad de software certificado en ISTQB Foundation Level 4.0, con amplia experiencia 
            en pruebas funcionales, manuales y de sistemas en entornos ágiles. Actualmente perfeccionándome en 
            automatización, pruebas de rendimiento con K6 y especializándome en ciberseguridad.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<LocationOn />}
              label="Buenos Aires, Argentina"
              variant="outlined"
              sx={{ borderColor: 'var(--border-default)' }}
            />
            <Chip
              icon={<Work />}
              label="QA Specialist"
              variant="outlined"
              sx={{ borderColor: 'var(--border-default)' }}
            />
            <Chip
              icon={<School />}
              label="ISTQB Foundation 4.0"
              variant="outlined"
              sx={{ borderColor: 'var(--border-default)' }}
            />
          </Box>
        </Box>
      </motion.div>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Columna Izquierda */}
        <Box sx={{ flex: { md: 2 } }}>
          {/* Experiencia */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ViewportReveal>
              <Card
                className="glass-floating"
                sx={{
                  mb: 4,
                  borderRadius: 'var(--radius-2xl)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Experiencia Profesional
                  </Typography>

                  {experience.map((exp, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Work sx={{ color: 'var(--semantic-primary)', mr: 1 }} />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {exp.role}
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: 'var(--semantic-primary)',
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        {exp.company}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--text-tertiary)',
                          display: 'block',
                          mb: 1,
                        }}
                      >
                        {exp.period}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--text-secondary)',
                          lineHeight: 1.6,
                        }}
                      >
                        {exp.description}
                      </Typography>
                      {index < experience.length - 1 && (
                        <Divider sx={{ my: 2, borderColor: 'var(--border-light)' }} />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </ViewportReveal>

            {/* Filosofía y Enfoque */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ViewportReveal>
                <Card
                  className="glass-floating"
                  sx={{
                    borderRadius: 'var(--radius-2xl)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Filosofía y Enfoque
                    </Typography>

                                         <Typography
                       variant="body1"
                       sx={{
                         color: 'var(--text-secondary)',
                         lineHeight: 1.8,
                         mb: 3,
                       }}
                     >
                       Con un sólido bagaje en testing, validación e integración de procesos críticos en sectores financieros y tecnológicos, 
                       mi enfoque se centra en la mejora continua y la optimización de procesos en proyectos de alta complejidad.
                     </Typography>

                     <Typography
                       variant="body1"
                       sx={{
                         color: 'var(--text-secondary)',
                         lineHeight: 1.8,
                       }}
                     >
                       Mi experiencia abarca desde pruebas manuales hasta automatización avanzada, incluyendo performance testing con K6, 
                       siempre manteniendo los más altos estándares de calidad y seguridad.
                     </Typography>
                  </CardContent>
                </Card>
              </ViewportReveal>
                         </motion.div>
           </motion.div>
         </Box>

        {/* Columna Derecha */}
        <Box sx={{ flex: { md: 1 } }}>
          {/* Certificaciones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ViewportReveal>
              <Card
                className="glass-floating"
                sx={{
                  mb: 4,
                  borderRadius: 'var(--radius-2xl)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Certificaciones
                  </Typography>

                                     {certifications.map((cert, index) => (
                     <Box key={index} sx={{ textAlign: 'center' }}>
                       <Box
                         component="img"
                         src={cert.badge}
                         alt={cert.name}
                         sx={{
                           width: 120,
                           height: 120,
                           borderRadius: 'var(--radius-lg)',
                           mb: 2,
                           boxShadow: 'var(--shadow-lg)',
                         }}
                       />
                       <Typography
                         variant="h6"
                         sx={{
                           fontWeight: 600,
                           color: 'var(--text-primary)',
                           mb: 1,
                         }}
                       >
                         {cert.name}
                       </Typography>
                       <Typography
                         variant="body2"
                         sx={{
                           color: 'var(--semantic-primary)',
                           fontWeight: 500,
                           mb: 1,
                         }}
                       >
                         {cert.level}
                       </Typography>
                       <Typography
                         variant="caption"
                         sx={{
                           color: 'var(--text-tertiary)',
                         }}
                       >
                         {cert.year}
                       </Typography>
                     </Box>
                   ))}

                   {/* Certificaciones adicionales */}
                   <Box sx={{ mt: 4 }}>
                     <Typography
                       variant="h6"
                       sx={{
                         fontWeight: 600,
                         color: 'var(--text-primary)',
                         mb: 2,
                         textAlign: 'center',
                       }}
                     >
                       Otras Certificaciones
                     </Typography>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                       <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                         • Especialización en Ciberseguridad - EducacionIT (en curso)
                       </Typography>
                       <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                         • Certificación Agile - Tata Consultancy Services (2023)
                       </Typography>
                       <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                         • Formación en Postman, JMeter, AWS - Instituto Web (2022)
                       </Typography>
                       <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                         • Curso de Performance Testing - Academy QA (2021)
                       </Typography>
                     </Box>
                   </Box>
                </CardContent>
              </Card>
            </ViewportReveal>

            {/* Habilidades */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ViewportReveal>
                <Card
                  className="glass-floating"
                  sx={{
                    borderRadius: 'var(--radius-2xl)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Habilidades Principales
                    </Typography>

                    {skills.map((skill, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ color: 'var(--semantic-primary)', mr: 1 }}>
                              {skill.icon}
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                color: 'var(--text-primary)',
                              }}
                            >
                              {skill.name}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'var(--text-tertiary)',
                              fontWeight: 600,
                            }}
                          >
                            {skill.level}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 6,
                            backgroundColor: 'var(--semantic-primary-muted)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${skill.level}%`,
                              height: '100%',
                              background: 'var(--gradient-primary)',
                              borderRadius: 'var(--radius-full)',
                              transition: 'width 1s ease-in-out',
                            }}
                          />
                        </Box>
                      </Box>
                                         ))}
                   </CardContent>
                 </Card>
               </ViewportReveal>
             </motion.div>

             {/* Tecnologías y Herramientas */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.8 }}
             >
               <ViewportReveal>
                 <Card
                   className="glass-floating"
                   sx={{
                     borderRadius: 'var(--radius-2xl)',
                   }}
                 >
                   <CardContent sx={{ p: 4 }}>
                     <Typography
                       variant="h5"
                       sx={{
                         fontWeight: 700,
                         mb: 3,
                         color: 'var(--text-primary)',
                       }}
                     >
                       Tecnologías y Herramientas
                     </Typography>

                     <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                       <Box>
                         <Typography
                           variant="h6"
                           sx={{
                             fontWeight: 600,
                             color: 'var(--semantic-primary)',
                             mb: 2,
                           }}
                         >
                           Testing & QA
                         </Typography>
                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • Selenium, Appium, Playwright, K6
                           </Typography>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • Postman, SoapUI, JMeter
                           </Typography>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • Jira, TestRail, ALM, IQP
                           </Typography>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • Azure DevOps, Docker, OpenShift
                           </Typography>
                         </Box>
                       </Box>

                       <Box>
                         <Typography
                           variant="h6"
                           sx={{
                             fontWeight: 600,
                             color: 'var(--semantic-primary)',
                             mb: 2,
                           }}
                         >
                           Desarrollo & DevOps
                         </Typography>
                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • Java, Python, JavaScript
                           </Typography>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • MySQL, SQL Server, MongoDB
                           </Typography>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • .NET Aspire, Scalar
                           </Typography>
                           <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                             • Kubernetes, SonarQube
                           </Typography>
                         </Box>
                       </Box>
                     </Box>
                   </CardContent>
                 </Card>
               </ViewportReveal>
             </motion.div>
           </motion.div>
         </Box>
       </Box>
     </Container>
   );
 };

export default SobreMiPage; 