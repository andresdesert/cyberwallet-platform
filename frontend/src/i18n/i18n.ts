// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'es',
        debug: process.env.NODE_ENV === 'development',
        load: 'languageOnly',
        supportedLngs: ['es', 'en'],
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            // 🎯 CRÍTICO: Forzar recarga en desarrollo
            allowMultiLoading: false,
            crossDomain: false,
            reloadInterval: process.env.NODE_ENV === 'development' ? 1000 : false,
            // 🎯 CRÍTICO: Headers para evitar cache
            requestOptions: {
                cache: 'no-cache',
                mode: 'cors',
                credentials: 'same-origin',
            },
            // 🎯 CRÍTICO: Query params para cache busting
            queryStringParams: { 
                v: Date.now() 
            },
        },
        ns: ['common', 'landing', 'preferences'],
        defaultNS: 'common',
        react: {
            useSuspense: false, // Mantener en false para evitar problemas
        },
        // 🎯 CRÍTICO: Configuración de cache
        cache: {
            enabled: false, // Deshabilitar cache en desarrollo
        },
        // Configuración de fallback para desarrollo
        resources: {
            es: {
                common: {
                    "welcome": "Bienvenido",
                    "loading": "Cargando...",
                    "error": "Error",
                    "login": "Iniciar Sesión",
                    "register": "Registrarse",
                    "dashboard": "Panel de Control"
                },
                landing: {
                    "title": "CyberWallet",
                    "subtitle": "El Futuro de las Finanzas Digitales"
                },
                preferences: {
                    "language": "Idioma",
                    "theme": "Tema"
                }
            },
            en: {
                common: {
                    "welcome": "Welcome",
                    "loading": "Loading...",
                    "error": "Error",
                    "login": "Login",
                    "register": "Register",
                    "dashboard": "Dashboard"
                },
                landing: {
                    "title": "CyberWallet",
                    "subtitle": "The Future of Digital Finance"
                },
                preferences: {
                    "language": "Language",
                    "theme": "Theme"
                }
            }
        },
    });

// 🎯 CRÍTICO: Forzar recarga inmediata en desarrollo
if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
        console.log('🔄 [i18n] Forzando recarga de traducciones...');
        i18n.reloadResources(['es', 'en'], ['landing', 'common', 'preferences']).then(() => {
            console.log('✅ [i18n] Traducciones recargadas exitosamente');
        }).catch((error) => {
            console.error('❌ [i18n] Error al recargar traducciones:', error);
        });
    }, 1000);
}

export default i18n;
