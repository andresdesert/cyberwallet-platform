// src/utils/envConfig.ts

/**
 * 🔧 Sistema de configuración y validación de variables de entorno
 * Proporciona un acceso tipado y validado a las variables de entorno
 */

// 🎯 Tipos para la configuración de entorno
export type Environment = 'development' | 'test' | 'production';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface EnvironmentConfig {
  // Configuración básica
  NODE_ENV: Environment;
  MODE: string;
  
  // API Configuration
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;
  
  // Funcionalidades
  ENABLE_ANALYTICS: boolean;
  ENABLE_SENTRY: boolean;
  ENABLE_DEV_TOOLS: boolean;
  ENABLE_HOT_RELOAD: boolean;
  ENABLE_PWA: boolean;
  
  // Logging
  LOG_LEVEL: LogLevel;
  ENABLE_CONSOLE_LOGS: boolean;
  
  // Seguridad
  ENABLE_HTTPS: boolean;
  SECURE_COOKIES: boolean;
  
  // Performance
  ENABLE_LAZY_LOADING: boolean;
  ENABLE_CODE_SPLITTING: boolean;
  CHUNK_SIZE_WARNING_LIMIT: number;
  
  // Características experimentales
  ENABLE_EXPERIMENTAL_FEATURES: boolean;
  ENABLE_BETA_UI: boolean;
  
  // Información de la aplicación
  APP_VERSION: string;
  APP_NAME: string;
  BUILD_TIMESTAMP: string;
}

// 🎯 Configuración por defecto basada en el entorno
const getDefaultConfig = (env: Environment): EnvironmentConfig => {
  const baseConfig: EnvironmentConfig = {
    NODE_ENV: env,
    MODE: env,
    API_BASE_URL: '/api/v1',
    API_TIMEOUT: 15000,
    API_RETRY_ATTEMPTS: 3,
    ENABLE_ANALYTICS: false,
    ENABLE_SENTRY: false,
    ENABLE_DEV_TOOLS: false,
    ENABLE_HOT_RELOAD: false,
    ENABLE_PWA: true,
    LOG_LEVEL: 'info',
    ENABLE_CONSOLE_LOGS: true,
    ENABLE_HTTPS: false,
    SECURE_COOKIES: false,
    ENABLE_LAZY_LOADING: true,
    ENABLE_CODE_SPLITTING: true,
    CHUNK_SIZE_WARNING_LIMIT: 500,
    ENABLE_EXPERIMENTAL_FEATURES: false,
    ENABLE_BETA_UI: false,
    APP_VERSION: '2.0.0',
    APP_NAME: 'CyberWallet',
    BUILD_TIMESTAMP: new Date().toISOString(),
  };

  // Configuración específica por entorno
  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        API_BASE_URL: 'http://localhost:8080/api/v1',
        ENABLE_DEV_TOOLS: true,
        ENABLE_HOT_RELOAD: true,
        LOG_LEVEL: 'debug',
        ENABLE_EXPERIMENTAL_FEATURES: true,
        ENABLE_BETA_UI: true,
        API_TIMEOUT: 30000, // Mayor timeout en desarrollo
      };

    case 'test':
      return {
        ...baseConfig,
        API_BASE_URL: 'http://localhost:8080/api/v1',
        LOG_LEVEL: 'warn',
        ENABLE_CONSOLE_LOGS: false,
        API_RETRY_ATTEMPTS: 1, // Menos reintentos en tests
      };

    case 'production':
      return {
        ...baseConfig,
        ENABLE_ANALYTICS: true,
        ENABLE_SENTRY: true,
        ENABLE_HTTPS: true,
        SECURE_COOKIES: true,
        LOG_LEVEL: 'error',
        ENABLE_CONSOLE_LOGS: false,
        CHUNK_SIZE_WARNING_LIMIT: 1000,
      };

    default:
      return baseConfig;
  }
};

// 🔍 Funciones de validación
const validateEnvironment = (env: string): Environment => {
  const validEnvs: Environment[] = ['development', 'test', 'production'];
  return validEnvs.includes(env as Environment) ? (env as Environment) : 'production';
};

const validateBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

const validateNumber = (value: string | undefined, defaultValue: number, min?: number, max?: number): number => {
  if (value === undefined) return defaultValue;
  
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return defaultValue;
  
  if (min !== undefined && parsed < min) return min;
  if (max !== undefined && parsed > max) return max;
  
  return parsed;
};

const validateString = (value: string | undefined, defaultValue: string, allowEmpty = false): string => {
  if (value === undefined) return defaultValue;
  if (!allowEmpty && value.trim() === '') return defaultValue;
  return value;
};

const validateUrl = (value: string | undefined, defaultValue: string): string => {
  if (value === undefined) return defaultValue;
  
  try {
    // Permitir URLs relativas
    if (value.startsWith('/')) return value;
    
    // Validar URLs absolutas
    new URL(value);
    return value;
  } catch {
    console.warn(`[ENV_CONFIG] Invalid URL: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }
};

const validateLogLevel = (value: string | undefined, defaultValue: LogLevel): LogLevel => {
  const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  return validLevels.includes(value as LogLevel) ? (value as LogLevel) : defaultValue;
};

// 🎯 Sistema de construcción de configuración
class EnvironmentConfigBuilder {
  private config: EnvironmentConfig;

  constructor() {
    // Detectar entorno
    const rawEnv = typeof process !== 'undefined' 
      ? process.env.NODE_ENV 
      : (import.meta.env?.MODE || 'production');
    
    const environment = validateEnvironment(rawEnv || 'production');
    this.config = getDefaultConfig(environment);
  }

  // Configurar desde variables de entorno
  fromEnvironmentVariables(): this {
    if (typeof process === 'undefined' && typeof import.meta.env === 'undefined') {
      console.warn('[ENV_CONFIG] No environment variables available');
      return this;
    }

    const env = typeof process !== 'undefined' ? process.env : import.meta.env;
    
    // Helper para acceder a variables de entorno de forma segura
    const getEnvVar = (key: string): string | undefined => {
      return env?.[key] as string | undefined;
    };

    // Aplicar variables de entorno con validación
    this.config = {
      ...this.config,
      
      // API Configuration
      API_BASE_URL: validateUrl(env.VITE_API_BASE_URL as string | undefined, this.config.API_BASE_URL),
      API_TIMEOUT: validateNumber(env.VITE_API_TIMEOUT, this.config.API_TIMEOUT, 1000, 60000),
      API_RETRY_ATTEMPTS: validateNumber(env.VITE_API_RETRY_ATTEMPTS, this.config.API_RETRY_ATTEMPTS, 0, 10),
      
      // Funcionalidades
      ENABLE_ANALYTICS: validateBoolean(env.VITE_ENABLE_ANALYTICS, this.config.ENABLE_ANALYTICS),
      ENABLE_SENTRY: validateBoolean(env.VITE_ENABLE_SENTRY, this.config.ENABLE_SENTRY),
      ENABLE_DEV_TOOLS: validateBoolean(env.VITE_ENABLE_DEV_TOOLS, this.config.ENABLE_DEV_TOOLS),
      ENABLE_PWA: validateBoolean(env.VITE_ENABLE_PWA, this.config.ENABLE_PWA),
      
      // Logging
      LOG_LEVEL: validateLogLevel(env.VITE_LOG_LEVEL, this.config.LOG_LEVEL),
      ENABLE_CONSOLE_LOGS: validateBoolean(env.VITE_ENABLE_CONSOLE_LOGS, this.config.ENABLE_CONSOLE_LOGS),
      
      // Seguridad
      ENABLE_HTTPS: validateBoolean(env.VITE_ENABLE_HTTPS, this.config.ENABLE_HTTPS),
      SECURE_COOKIES: validateBoolean(env.VITE_SECURE_COOKIES, this.config.SECURE_COOKIES),
      
      // Performance
      CHUNK_SIZE_WARNING_LIMIT: validateNumber(env.VITE_CHUNK_SIZE_WARNING_LIMIT, this.config.CHUNK_SIZE_WARNING_LIMIT, 100, 5000),
      
      // Experimental
      ENABLE_EXPERIMENTAL_FEATURES: validateBoolean(env.VITE_ENABLE_EXPERIMENTAL_FEATURES, this.config.ENABLE_EXPERIMENTAL_FEATURES),
      ENABLE_BETA_UI: validateBoolean(env.VITE_ENABLE_BETA_UI, this.config.ENABLE_BETA_UI),
      
      // App Info
      APP_VERSION: validateString(env.VITE_APP_VERSION, this.config.APP_VERSION),
      APP_NAME: validateString(env.VITE_APP_NAME, this.config.APP_NAME),
    };

    return this;
  }

  // Aplicar overrides manuales
  override(overrides: Partial<EnvironmentConfig>): this {
    this.config = { ...this.config, ...overrides };
    return this;
  }

  // Validar configuración final
  validate(): this {
    const errors: string[] = [];

    // Validaciones críticas
    if (!this.config.API_BASE_URL) {
      errors.push('API_BASE_URL is required');
    }

    if (this.config.API_TIMEOUT < 1000) {
      errors.push('API_TIMEOUT must be at least 1000ms');
    }

    if (this.config.API_RETRY_ATTEMPTS < 0) {
      errors.push('API_RETRY_ATTEMPTS cannot be negative');
    }

    // Validaciones de coherencia
    if (this.config.NODE_ENV === 'production' && this.config.ENABLE_DEV_TOOLS) {
      console.warn('[ENV_CONFIG] DEV_TOOLS enabled in production environment');
    }

    if (this.config.ENABLE_HTTPS && this.config.API_BASE_URL.startsWith('http://')) {
      console.warn('[ENV_CONFIG] HTTPS enabled but API_BASE_URL uses HTTP');
    }

    if (errors.length > 0) {
      throw new Error(`Environment configuration errors: ${errors.join(', ')}`);
    }

    return this;
  }

  // Construir configuración final
  build(): EnvironmentConfig {
    return { ...this.config };
  }

  // Información de diagnóstico
  getDiagnosticInfo(): object {
    return {
      environment: this.config.NODE_ENV,
      apiBaseUrl: this.config.API_BASE_URL,
      logLevel: this.config.LOG_LEVEL,
      featuresEnabled: {
        analytics: this.config.ENABLE_ANALYTICS,
        devTools: this.config.ENABLE_DEV_TOOLS,
        pwa: this.config.ENABLE_PWA,
        experimental: this.config.ENABLE_EXPERIMENTAL_FEATURES,
      },
      buildInfo: {
        version: this.config.APP_VERSION,
        timestamp: this.config.BUILD_TIMESTAMP,
      }
    };
  }
}

// 🎯 Configuración global
let globalConfig: EnvironmentConfig | null = null;

export const initializeEnvironmentConfig = (overrides?: Partial<EnvironmentConfig>): EnvironmentConfig => {
  try {
    const builder = new EnvironmentConfigBuilder()
      .fromEnvironmentVariables();

    if (overrides) {
      builder.override(overrides);
    }

    globalConfig = builder.validate().build();

    // Log de inicialización
    if (globalConfig.ENABLE_CONSOLE_LOGS) {
      console.info('[ENV_CONFIG] Environment configuration initialized:', {
        environment: globalConfig.NODE_ENV,
        apiBaseUrl: globalConfig.API_BASE_URL,
        version: globalConfig.APP_VERSION,
      });

      if (globalConfig.LOG_LEVEL === 'debug') {
        console.debug('[ENV_CONFIG] Full configuration:', globalConfig);
      }
    }

    return globalConfig;
  } catch (error) {
    console.error('[ENV_CONFIG] Failed to initialize environment configuration:', error);
    // Usar configuración por defecto como fallback
    globalConfig = getDefaultConfig('production');
    return globalConfig;
  }
};

// 🎯 Acceso a la configuración
export const getEnvironmentConfig = (): EnvironmentConfig => {
  if (!globalConfig) {
    console.warn('[ENV_CONFIG] Configuration not initialized, using defaults');
    return initializeEnvironmentConfig();
  }
  return globalConfig;
};

// 🎯 Utilidades de conveniencia
export const isDevelopment = (): boolean => getEnvironmentConfig().NODE_ENV === 'development';
export const isProduction = (): boolean => getEnvironmentConfig().NODE_ENV === 'production';
export const isTest = (): boolean => getEnvironmentConfig().NODE_ENV === 'test';

export const getApiConfig = () => {
  const config = getEnvironmentConfig();
  return {
    baseURL: config.API_BASE_URL,
    timeout: config.API_TIMEOUT,
    retryAttempts: config.API_RETRY_ATTEMPTS,
  };
};

export const getLogConfig = () => {
  const config = getEnvironmentConfig();
  return {
    level: config.LOG_LEVEL,
    enableConsole: config.ENABLE_CONSOLE_LOGS,
  };
};

export const getFeatureFlags = () => {
  const config = getEnvironmentConfig();
  return {
    analytics: config.ENABLE_ANALYTICS,
    sentry: config.ENABLE_SENTRY,
    devTools: config.ENABLE_DEV_TOOLS,
    pwa: config.ENABLE_PWA,
    experimental: config.ENABLE_EXPERIMENTAL_FEATURES,
    betaUI: config.ENABLE_BETA_UI,
    lazyLoading: config.ENABLE_LAZY_LOADING,
    codeSplitting: config.ENABLE_CODE_SPLITTING,
  };
};

// 🎯 Hook para React
export const useEnvironmentConfig = () => {
  return {
    config: getEnvironmentConfig(),
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    isTest: isTest(),
    apiConfig: getApiConfig(),
    logConfig: getLogConfig(),
    featureFlags: getFeatureFlags(),
  };
};

// 🎯 Inicialización automática
if (typeof window !== 'undefined') {
  // Inicializar configuración al cargar el módulo
  initializeEnvironmentConfig();
}

export default getEnvironmentConfig; 