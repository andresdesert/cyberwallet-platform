// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🎯 CRÍTICO: Traducciones hardcodeadas para evitar fallos
const resources = {
  es: {
    common: {
      "welcome": "Bienvenido",
      "loading": "Cargando...",
      "error": "Error",
      "login": "Iniciar Sesión",
      "register": "Registrarse",
      "dashboard": "Panel de Control",
      "back": "Atrás",
      "next": "Siguiente",
      "submit": "Enviar",
      "cancel": "Cancelar",
      "save": "Guardar",
      "delete": "Eliminar",
      "edit": "Editar",
      "close": "Cerrar",
      "confirm": "Confirmar",
      "yes": "Sí",
      "no": "No",
      "ok": "OK",
      "retry": "Reintentar",
      "refresh": "Actualizar"
    },
    landing: {
      "cyberwallet_titulo": "CyberWallet",
      "slogan": "Tu Billetera Digital Segura.",
      "header_cta_registro": "Registrarse",
      "header_cta_login": "Iniciar Sesión",
      "header_sobre_mi": "Sobre Mí",
      "header_contacto_rapido": "Contacto",
      "header_inicio": "Inicio",
      "header_caracteristicas": "Características",
      "header_contacto": "Contacto",
      "seguridad_verificada": "Seguridad Verificada",
      "transacciones_instantaneas": "Transacciones Instantáneas",
      "tecnologia_de_punta": "Tecnología de Punta",
      "iniciar_sesion": "Iniciar Sesión",
      "registrarse": "Registrarse",
      "hero_titulo": "El Futuro de las Finanzas Digitales",
      "hero_slogan": "Seguro por diseño. Ágil por naturaleza.",
      "hero_descripcion": "CyberWallet es la plataforma financiera más avanzada del mercado, diseñada para ofrecer seguridad, velocidad y control total sobre tus finanzas digitales.",
      "hero_cta_principal": "Comenzar Ahora",
      "hero_cta_secundario": "Sobre Mí",
      "hero_subtitulo": "Seguro por diseño. Ágil por naturaleza.",
      "hero_cta": "Crear Cuenta Gratis",
      "stats_titulo": "Nuestras Cifras",
      "stats_subtitle": "Métricas que hablan por sí solas",
      "stats_usuarios": "Usuarios Activos",
      "stats_usuarios_label": "Usuarios Registrados",
      "stats_transacciones": "Transacciones Procesadas",
      "stats_transacciones_label": "Transacciones Completadas",
      "stats_uptime": "Disponibilidad",
      "stats_uptime_label": "Disponibilidad del Sistema",
      "stats_paises_label": "Países Soportados",
      "features_titulo": "Características Destacadas",
      "features_subtitulo": "Tecnología de vanguardia para tu seguridad financiera",
      "feature_seguridad": "Seguridad Militar",
      "feature_seguridad_titulo": "Seguridad Avanzada",
      "feature_seguridad_desc": "Encriptación AES-256 y autenticación biométrica para proteger cada transacción.",
      "feature_velocidad": "Velocidad Extrema",
      "feature_velocidad_titulo": "Velocidad Instantánea",
      "feature_velocidad_desc": "Transacciones instantáneas con tecnología blockchain optimizada.",
      "feature_crecimiento": "Crecimiento Inteligente",
      "feature_crecimiento_titulo": "Crecimiento Automático",
      "feature_crecimiento_desc": "Inversiones automatizadas y análisis predictivo de mercado.",
      "feature_control": "Control Total",
      "feature_control_titulo": "Control Completo",
      "feature_control_desc": "Gestión completa de múltiples cuentas y monedas en una sola plataforma.",
      "testimonios_titulo": "Lo Que Dicen Nuestros Usuarios",
      "testimonio1": "CyberWallet transformó mi forma de manejar finanzas. La seguridad y velocidad son increíbles.",
      "testimonio1_nombre": "María García",
      "testimonio1_rol": "Empresaria",
      "testimonio1_contenido": "CyberWallet transformó mi forma de manejar finanzas. La seguridad y velocidad son increíbles.",
      "testimonio2": "La mejor plataforma que he usado. El análisis predictivo me ha ayudado a maximizar mis ganancias.",
      "testimonio2_nombre": "Carlos Rodríguez",
      "testimonio2_rol": "Inversionista",
      "testimonio2_contenido": "La mejor plataforma que he usado. El análisis predictivo me ha ayudado a maximizar mis ganancias.",
      "testimonio3": "Perfecta para recibir pagos internacionales. Comisiones bajas y transferencias instantáneas.",
      "testimonio3_nombre": "Ana Martínez",
      "testimonio3_rol": "Freelancer",
      "testimonio3_contenido": "Perfecta para recibir pagos internacionales. Comisiones bajas y transferencias instantáneas.",
      "cta_unete": "Únete a miles de usuarios que ya están transformando su relación con las finanzas digitales",
      "sobre_mi_titulo": "Sobre Mí",
      "sobre_mi_subtitulo": "Especialista en Quality Assurance y Seguridad Informática",
      "sobre_mi_contenido": "Soy Andrés, especialista en Quality Assurance (QA) enfocado en ingeniería de calidad y seguridad informática. Actualmente, me encuentro en proceso de transición y formación activa hacia el pentesting, integrando metodologías ágiles y procesos rigurosos.",
      "sobre_mi_vision": "Valoro el aprendizaje continuo, el análisis crítico y el pensamiento creativo aplicado al ámbito empresarial. Mi objetivo es contribuir al desarrollo de sistemas seguros y confiables.",
      "sobre_mi_contacto": "Mi experiencia se basa en la aplicación práctica de pruebas funcionales, de seguridad y análisis de vulnerabilidades, siempre con un enfoque en la mejora continua y la excelencia técnica.",
      "conecta_conmigo_titulo": "Conecta Conmigo",
      "conecta_conmigo_subtitulo": "Colaboración, asesoría o networking profesional",
      "sidebar_navegacion": "Navegación",
      "sidebar_navegacion_inicio": "Inicio",
      "sidebar_navegacion_caracteristicas": "Características",
      "sidebar_explora": "Explora todas las funcionalidades de CyberWallet",
      "sidebar_explora_funcionalidades": "Explora todas las funcionalidades",
      "sidebar_crear_cuenta": "Crear Cuenta",
      "sidebar_acciones_crear_cuenta": "Crear Cuenta",
      "sidebar_ingresar": "Ingresar",
      "sidebar_acciones_ingresar": "Ingresar",
      "sidebar_conecta": "Conecta con nosotros",
      "sidebar_conecta_nosotros": "Conecta con nosotros",
      "header_soporte": "Soporte",
      "header_conoce_mas": "Conoce Más",
      "header_blog": "Blog",
      "header_precios": "Precios",
      "header_seguridad": "Seguridad",
      "header_velocidad": "Velocidad",
      "header_crecimiento": "Crecimiento",
      "header_caracteristicas_destacadas": "Características Destacadas",
      "header_ingresar": "Ingresar",
      "header_registrarse": "Registrarse",
      "header_seguro": "Seguro",
      "header_rapido": "Rápido",
      "header_idioma_espanol": "Español",
      "header_idioma_ingles": "Inglés",
      "header_idioma_portugues": "Português",
      "preferencias_generales": "Preferencias Generales",
      "zona_riesgo": "Zona de Riesgo",
      "zona_riesgo_desc": "Esta acción eliminará tu cuenta de forma irreversible. Escribí 'ELIMINAR' para continuar.",
      "zona_riesgo_confirmar": "Confirmar con 'ELIMINAR'",
      "zona_riesgo_boton": "Borrar cuenta",
      "zona_riesgo_info": "Debes escribir 'ELIMINAR' exactamente.",
      "zona_riesgo_exito": "Tu cuenta fue eliminada correctamente.",
      "zona_riesgo_error": "No se pudo eliminar la cuenta.",
      "stats_experiencia_qa": "Años QA",
      "stats_proyectos": "Proyectos",
      "stats_precision": "% Precisión",
      "stats_disponibilidad": "Disponibilidad",
      "feature_soporte_titulo": "Soporte 24/7",
      "feature_soporte_desc": "Atención personalizada y soporte técnico en todo momento para resolver tus dudas y ayudarte a operar con tranquilidad.",
      "feature_analytics_titulo": "Análisis y Reportes",
      "feature_analytics_desc": "Visualiza estadísticas, reportes y análisis avanzados de tus movimientos y finanzas para tomar mejores decisiones.",
      "conecta_titulo": "Conecta Conmigo",
      "conecta_subtitulo": "Sígueme en mis redes sociales para más contenido sobre QA y seguridad informática",
      // 🎯 NUEVAS CLAVES PARA LANDING PAGE
      "features": {
        "title": "Características Destacadas",
        "subtitle": "Tecnología de vanguardia para tu seguridad financiera",
        "security": {
          "title": "Seguridad Militar",
          "description": "Encriptación AES-256 y autenticación biométrica para proteger cada transacción."
        },
        "speed": {
          "title": "Velocidad Extrema",
          "description": "Transacciones instantáneas con tecnología blockchain optimizada."
        },
        "support": {
          "title": "Soporte 24/7",
          "description": "Atención personalizada y soporte técnico en todo momento."
        },
        "analytics": {
          "title": "Análisis Inteligente",
          "description": "Visualiza estadísticas y reportes avanzados de tus finanzas."
        }
      },
      "stats": {
        "title": "Nuestros Números",
        "subtitle": "Métricas que hablan por sí mismas",
        "users": "Usuarios Activos",
        "transactions": "Transacciones Procesadas",
        "uptime": "Tiempo Activo",
        "support": "Soporte"
      },
      "technologies": {
        "title": "Tecnologías",
        "subtitle": "Stack tecnológico de vanguardia"
      },
      "projects": {
        "title": "Proyectos",
        "subtitle": "Portfolio de desarrollo",
        "cyberwallet": {
          "description": "Plataforma financiera digital con seguridad de nivel bancario"
        },
        "ecommerce": {
          "description": "Sistema de comercio electrónico completo"
        },
        "banking": {
          "description": "Aplicación bancaria móvil segura"
        }
      },
      "testimonials": {
        "title": "Lo que dicen nuestros usuarios",
        "subtitle": "Testimonios reales de clientes satisfechos",
        "maria": {
          "content": "CyberWallet transformó mi forma de manejar las finanzas. La seguridad y velocidad son increíbles."
        },
        "carlos": {
          "content": "La mejor plataforma que he usado. El análisis predictivo me ha ayudado a maximizar mis ganancias."
        },
        "ana": {
          "content": "Perfecto para recibir pagos internacionales. Bajas comisiones y transferencias instantáneas."
        }
      }
    },
    preferences: {
      "language": "Idioma",
      "theme": "Tema",
      "notifications": "Notificaciones",
      "security": "Seguridad",
      "privacy": "Privacidad",
      "account": "Cuenta",
      "profile": "Perfil",
      "settings": "Configuración",
      "logout": "Cerrar Sesión",
      "dark_mode": "Modo Oscuro",
      "light_mode": "Modo Claro",
      "auto_mode": "Automático",
      "spanish": "Español",
      "english": "Inglés",
      "portuguese": "Portugués"
    }
  },
  en: {
    common: {
      "welcome": "Welcome",
      "loading": "Loading...",
      "error": "Error",
      "login": "Login",
      "register": "Register",
      "dashboard": "Dashboard",
      "back": "Back",
      "next": "Next",
      "submit": "Submit",
      "cancel": "Cancel",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "close": "Close",
      "confirm": "Confirm",
      "yes": "Yes",
      "no": "No",
      "ok": "OK",
      "retry": "Retry",
      "refresh": "Refresh"
    },
    landing: {
      "cyberwallet_titulo": "CyberWallet",
      "slogan": "Your Secure Digital Wallet.",
      "header_cta_registro": "Sign Up",
      "header_cta_login": "Sign In",
      "header_sobre_mi": "About Me",
      "header_contacto_rapido": "Contact",
      "header_inicio": "Home",
      "header_caracteristicas": "Features",
      "header_contacto": "Contact",
      "seguridad_verificada": "Verified Security",
      "transacciones_instantaneas": "Instant Transactions",
      "tecnologia_de_punta": "Cutting-edge Technology",
      "iniciar_sesion": "Sign In",
      "registrarse": "Sign Up",
      "hero_titulo": "The Future of Digital Finance",
      "hero_slogan": "Secure by design. Agile by nature.",
      "hero_descripcion": "CyberWallet is the most advanced financial platform in the market, designed to offer security, speed and total control over your digital finances.",
      "hero_cta_principal": "Get Started Now",
      "hero_cta_secundario": "About Me",
      "hero_subtitulo": "Secure by design. Agile by nature.",
      "hero_cta": "Create Free Account",
      "stats_titulo": "Our Numbers",
      "stats_subtitle": "Metrics that speak for themselves",
      "stats_usuarios": "Active Users",
      "stats_usuarios_label": "Registered Users",
      "stats_transacciones": "Processed Transactions",
      "stats_transacciones_label": "Completed Transactions",
      "stats_uptime": "Uptime",
      "stats_uptime_label": "System Availability",
      "stats_paises_label": "Supported Countries",
      "features_titulo": "Outstanding Features",
      "features_subtitulo": "Cutting-edge technology for your financial security",
      "feature_seguridad": "Military Security",
      "feature_seguridad_titulo": "Advanced Security",
      "feature_seguridad_desc": "AES-256 encryption and biometric authentication to protect every transaction.",
      "feature_velocidad": "Extreme Speed",
      "feature_velocidad_titulo": "Instant Speed",
      "feature_velocidad_desc": "Instant transactions with optimized blockchain technology.",
      "feature_crecimiento": "Smart Growth",
      "feature_crecimiento_titulo": "Automatic Growth",
      "feature_crecimiento_desc": "Automated investments and predictive market analysis.",
      "feature_control": "Total Control",
      "feature_control_titulo": "Complete Control",
      "feature_control_desc": "Complete management of multiple accounts and currencies in a single platform.",
      "testimonios_titulo": "What Our Users Say",
      "testimonio1": "CyberWallet transformed my way of handling finances. The security and speed are incredible.",
      "testimonio1_nombre": "Maria Garcia",
      "testimonio1_rol": "Businesswoman",
      "testimonio1_contenido": "CyberWallet transformed my way of handling finances. The security and speed are incredible.",
      "testimonio2": "The best platform I've used. Predictive analysis has helped me maximize my profits.",
      "testimonio2_nombre": "Carlos Rodriguez",
      "testimonio2_rol": "Investor",
      "testimonio2_contenido": "The best platform I've used. Predictive analysis has helped me maximize my profits.",
      "testimonio3": "Perfect for receiving international payments. Low fees and instant transfers.",
      "testimonio3_nombre": "Ana Martinez",
      "testimonio3_rol": "Freelancer",
      "testimonio3_contenido": "Perfect for receiving international payments. Low fees and instant transfers.",
      "cta_unete": "Join thousands of users who are already transforming their relationship with digital finance",
      "sobre_mi_titulo": "About Me",
      "sobre_mi_subtitulo": "Quality Assurance and Information Security Specialist",
      "sobre_mi_contenido": "I'm Andres, a Quality Assurance (QA) specialist focused on quality engineering and information security. I'm currently in transition and active training towards pentesting, integrating agile methodologies and rigorous processes.",
      "sobre_mi_vision": "I value continuous learning, critical analysis and creative thinking applied to the business environment. My goal is to contribute to the development of secure and reliable systems.",
      "sobre_mi_contacto": "My experience is based on the practical application of functional testing, security testing and vulnerability analysis, always with a focus on continuous improvement and technical excellence.",
      "conecta_conmigo_titulo": "Connect With Me",
      "conecta_conmigo_subtitulo": "Collaboration, consulting or professional networking",
      "sidebar_navegacion": "Navigation",
      "sidebar_navegacion_inicio": "Home",
      "sidebar_navegacion_caracteristicas": "Features",
      "sidebar_explora": "Explore all CyberWallet features",
      "sidebar_explora_funcionalidades": "Explore all features",
      "sidebar_crear_cuenta": "Create Account",
      "sidebar_acciones_crear_cuenta": "Create Account",
      "sidebar_ingresar": "Sign In",
      "sidebar_acciones_ingresar": "Sign In",
      "sidebar_conecta": "Connect with us",
      "sidebar_conecta_nosotros": "Connect with us",
      "header_soporte": "Support",
      "header_conoce_mas": "Learn More",
      "header_blog": "Blog",
      "header_precios": "Pricing",
      "header_seguridad": "Security",
      "header_velocidad": "Speed",
      "header_crecimiento": "Growth",
      "header_caracteristicas_destacadas": "Outstanding Features",
      "header_ingresar": "Sign In",
      "header_registrarse": "Sign Up",
      "header_seguro": "Secure",
      "header_rapido": "Fast",
      "header_idioma_espanol": "Spanish",
      "header_idioma_ingles": "English",
      "header_idioma_portugues": "Portuguese",
      "preferencias_generales": "General Preferences",
      "zona_riesgo": "Risk Zone",
      "zona_riesgo_desc": "This action will permanently delete your account. Type 'DELETE' to continue.",
      "zona_riesgo_confirmar": "Confirm with 'DELETE'",
      "zona_riesgo_boton": "Delete account",
      "zona_riesgo_info": "You must type 'DELETE' exactly.",
      "zona_riesgo_exito": "Your account was successfully deleted.",
      "zona_riesgo_error": "Could not delete account.",
      "stats_experiencia_qa": "QA Years",
      "stats_proyectos": "Projects",
      "stats_precision": "% Accuracy",
      "stats_disponibilidad": "Availability",
      "feature_soporte_titulo": "24/7 Support",
      "feature_soporte_desc": "Personalized attention and technical support at all times to resolve your doubts and help you operate with peace of mind.",
      "feature_analytics_titulo": "Analysis and Reports",
      "feature_analytics_desc": "Visualize statistics, reports and advanced analysis of your movements and finances to make better decisions.",
      "conecta_titulo": "Connect With Me",
      "conecta_subtitulo": "Follow me on my social networks for more content about QA and information security",
      // 🎯 NEW KEYS FOR LANDING PAGE
      "features": {
        "title": "Outstanding Features",
        "subtitle": "Cutting-edge technology for your financial security",
        "security": {
          "title": "Military Security",
          "description": "AES-256 encryption and biometric authentication to protect every transaction."
        },
        "speed": {
          "title": "Extreme Speed",
          "description": "Instant transactions with optimized blockchain technology."
        },
        "support": {
          "title": "24/7 Support",
          "description": "Personalized attention and technical support at all times."
        },
        "analytics": {
          "title": "Smart Analytics",
          "description": "Visualize statistics and advanced reports of your finances."
        }
      },
      "stats": {
        "title": "Our Numbers",
        "subtitle": "Metrics that speak for themselves",
        "users": "Active Users",
        "transactions": "Processed Transactions",
        "uptime": "Uptime",
        "support": "Support"
      },
      "technologies": {
        "title": "Technologies",
        "subtitle": "Cutting-edge tech stack"
      },
      "projects": {
        "title": "Projects",
        "subtitle": "Development portfolio",
        "cyberwallet": {
          "description": "Digital financial platform with bank-grade security"
        },
        "ecommerce": {
          "description": "Complete e-commerce system"
        },
        "banking": {
          "description": "Secure mobile banking application"
        }
      },
      "testimonials": {
        "title": "What our users say",
        "subtitle": "Real testimonials from satisfied customers",
        "maria": {
          "content": "CyberWallet transformed my way of handling finances. The security and speed are incredible."
        },
        "carlos": {
          "content": "The best platform I've used. Predictive analysis has helped me maximize my profits."
        },
        "ana": {
          "content": "Perfect for receiving international payments. Low fees and instant transfers."
        }
      }
    },
    preferences: {
      "language": "Language",
      "theme": "Theme",
      "notifications": "Notifications",
      "security": "Security",
      "privacy": "Privacy",
      "account": "Account",
      "profile": "Profile",
      "settings": "Settings",
      "logout": "Logout",
      "dark_mode": "Dark Mode",
      "light_mode": "Light Mode",
      "auto_mode": "Auto",
      "spanish": "Spanish",
      "english": "English",
      "portuguese": "Portuguese"
    }
  }
};

// 🎯 CONFIGURACIÓN ROBUSTA DE I18N
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // 🎯 CRÍTICO: Recursos hardcodeados para evitar fallos
        resources,
        
        // 🎯 Configuración básica
        fallbackLng: 'es',
        debug: false, // Deshabilitar debug para producción
        load: 'languageOnly',
        supportedLngs: ['es', 'en'],
        
        // 🎯 Configuración de interpolación
        interpolation: {
            escapeValue: false,
        },
        
        // 🎯 Configuración de namespaces
        ns: ['common', 'landing', 'preferences'],
        defaultNS: 'common',
        
        // 🎯 Configuración de React
        react: {
            useSuspense: false, // Mantener en false para evitar problemas
        },
        
        // 🎯 Configuración de detección de idioma
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
        
        // 🎯 Configuración de fallback
        fallbackNS: 'common',
        
        // 🎯 Configuración de cache
        cache: {
            enabled: true,
        },
        
        // 🎯 Configuración de key separators
        keySeparator: '.',
        nsSeparator: ':',
        
        // 🎯 Configuración de plurales
        pluralSeparator: '_',
        contextSeparator: '_',
        
        // 🎯 Configuración de missing key handler
        saveMissing: false,
        missingKeyHandler: (lng, ns, key, fallbackValue) => {
            console.warn(`🔍 [i18n] Missing key: ${key} in namespace: ${ns} for language: ${lng}`);
            return fallbackValue || key;
        },
        
        // 🎯 Configuración de parse
        parseMissingKeyHandler: (key) => {
            console.warn(`🔍 [i18n] Parse missing key: ${key}`);
            return key;
        },
    });

// 🎯 CRÍTICO: Función para cambiar idioma de forma segura
export const changeLanguage = async (language: string) => {
    try {
        await i18n.changeLanguage(language);
        console.log(`✅ [i18n] Idioma cambiado a: ${language}`);
        return true;
    } catch (error) {
        console.error(`❌ [i18n] Error al cambiar idioma:`, error);
        return false;
    }
};

// 🎯 CRÍTICO: Función para obtener traducción de forma segura
export const safeTranslate = (key: string, options?: any) => {
    try {
        const translation = i18n.t(key, options);
        return translation === key ? key : translation;
    } catch (error) {
        console.error(`❌ [i18n] Error al traducir clave: ${key}`, error);
        return key;
    }
};

// 🎯 CRÍTICO: Verificar que i18n esté listo
export const isI18nReady = () => {
    return i18n.isInitialized;
};

// 🎯 CRÍTICO: Log de inicialización
console.log('🚀 [i18n] Inicializando sistema de internacionalización...');
console.log('✅ [i18n] Idiomas soportados:', i18n.languages);
console.log('✅ [i18n] Idioma actual:', i18n.language);
console.log('✅ [i18n] Namespaces disponibles:', i18n.options.ns);

export default i18n;
