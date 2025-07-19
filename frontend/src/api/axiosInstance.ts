import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import log from 'loglevel';

const ENV = process.env.NODE_ENV ?? 'production';

// Configuración de loglevel basada en el entorno
if (ENV === 'development') {
  log.setLevel('debug');
} else if (ENV === 'test') {
  log.setLevel('info');
} else {
  log.setLevel('error');
}

// 🎯 Interfaces para manejo de errores
interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

interface ErrorDetails {
  url?: string;
  method?: string;
  status?: number;
  message: string;
  code?: string;
  detail?: string;
  isNetworkError: boolean;
  isTimeout: boolean;
  isRetryable: boolean;
}

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

// 🔄 Sistema de reintentos con backoff exponencial
class RetrySystem {
  private static retryConfigs = new Map<string, RetryConfig>();
  
  static setRetryConfig(baseURL: string, config: RetryConfig) {
    this.retryConfigs.set(baseURL, config);
  }

  static getRetryConfig(url: string): RetryConfig {
    const defaultConfig: RetryConfig = {
      retries: 3,
      retryDelay: 1000,
      retryCondition: (error: AxiosError) => {
        // Reintentar en errores de red, timeouts, y errores 5xx
        return !error.response || 
               error.code === 'ECONNABORTED' || 
               error.code === 'NETWORK_ERROR' ||
               (error.response.status >= 500 && error.response.status < 600);
      }
    };

    for (const [baseURL, config] of this.retryConfigs) {
      if (url.includes(baseURL)) {
        return { ...defaultConfig, ...config };
      }
    }

    return defaultConfig;
  }

  static calculateDelay(attempt: number, baseDelay: number): number {
    // Backoff exponencial con jitter
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Hasta 1 segundo de jitter
    return Math.min(exponentialDelay + jitter, 30000); // Máximo 30 segundos
  }
}

// 🔋 Circuit Breaker para endpoints que fallan frecuentemente
class CircuitBreaker {
  private static breakers = new Map<string, CircuitBreakerState>();
  private static readonly FAILURE_THRESHOLD = 5;
  private static readonly TIMEOUT_WINDOW = 60000; // 1 minuto
  private static readonly HALF_OPEN_MAX_CALLS = 3;

  static shouldAllowRequest(url: string): boolean {
    const breaker = this.getBreaker(url);
    const now = Date.now();

    switch (breaker.state) {
      case 'CLOSED':
        return true;
      
      case 'OPEN':
        if (now - breaker.lastFailureTime > this.TIMEOUT_WINDOW) {
          breaker.state = 'HALF_OPEN';
          breaker.failures = 0;
          return true;
        }
        return false;
      
      case 'HALF_OPEN':
        return breaker.failures < this.HALF_OPEN_MAX_CALLS;
      
      default:
        return true;
    }
  }

  static onSuccess(url: string) {
    const breaker = this.getBreaker(url);
    breaker.failures = 0;
    breaker.state = 'CLOSED';
  }

  static onFailure(url: string) {
    const breaker = this.getBreaker(url);
    breaker.failures += 1;
    breaker.lastFailureTime = Date.now();

    if (breaker.failures >= this.FAILURE_THRESHOLD) {
      breaker.state = 'OPEN';
      log.warn(`[CIRCUIT_BREAKER] Endpoint ${url} circuit opened due to ${breaker.failures} failures`);
    }
  }

  private static getBreaker(url: string): CircuitBreakerState {
    const key = new URL(url, 'http://localhost').pathname;
    if (!this.breakers.has(key)) {
      this.breakers.set(key, {
        failures: 0,
        lastFailureTime: 0,
        state: 'CLOSED'
      });
    }
    return this.breakers.get(key)!;
  }
}

// 🌐 Monitor de estado de red
class NetworkMonitor {
  private static listeners: Array<(isOnline: boolean) => void> = [];
  private static isOnline = navigator.onLine;

  static {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      log.info('[NETWORK] Connection restored');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
      log.warn('[NETWORK] Connection lost');
    });
  }

  static getStatus(): boolean {
    return this.isOnline;
  }

  static addListener(callback: (isOnline: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private static notifyListeners(isOnline: boolean) {
    this.listeners.forEach(callback => {
      try {
        callback(isOnline);
      } catch (error) {
        log.error('[NETWORK] Error in network status listener:', error);
      }
    });
  }
}

// 📱 Sistema de notificaciones para errores
class ErrorNotificationSystem {
  private static notificationQueue: Array<{ message: string, type: 'error' | 'warning' | 'info', duration?: number }> = [];
  private static listeners: Array<(notification: any) => void> = [];

  static addListener(callback: (notification: any) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  static notify(message: string, type: 'error' | 'warning' | 'info' = 'error', duration = 5000) {
    const notification = { message, type, duration, timestamp: Date.now() };
    this.notificationQueue.push(notification);
    
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        log.error('[NOTIFICATIONS] Error in notification listener:', error);
      }
    });
  }

  static getNotificationQueue() {
    return [...this.notificationQueue];
  }

  static clearQueue() {
    this.notificationQueue = [];
  }
}

// 🎯 Funciones de utilidad para manejo de errores
const createErrorDetails = (error: AxiosError): ErrorDetails => {
  const { response, request, message, code } = error;
  const responseData = response?.data as any;
  
  return {
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    status: response?.status,
    message: responseData?.message || responseData?.detail || message,
    code,
    detail: responseData?.detail,
    isNetworkError: !response && !!request,
    isTimeout: code === 'ECONNABORTED',
    isRetryable: !response || (response.status >= 500 && response.status < 600) || code === 'ECONNABORTED'
  };
};

const getUserFriendlyMessage = (errorDetails: ErrorDetails): string => {
  const { status, isNetworkError, isTimeout } = errorDetails;

  if (isNetworkError) {
    return 'Sin conexión a internet. Verifica tu conexión y vuelve a intentar.';
  }

  if (isTimeout) {
    return 'La solicitud tardó demasiado. Vuelve a intentar en unos momentos.';
  }

  switch (status) {
    case 400:
      return 'Los datos enviados no son válidos. Revisa la información e inténtalo de nuevo.';
    case 401:
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no fue encontrado.';
    case 409:
      return 'Conflicto con el estado actual. Es posible que los datos hayan cambiado.';
    case 422:
      return 'Los datos enviados contienen errores de validación.';
    case 429:
      return 'Demasiadas solicitudes. Espera un momento antes de intentar nuevamente.';
    case 500:
      return 'Error interno del servidor. Nuestro equipo ha sido notificado.';
    case 502:
    case 503:
    case 504:
      return 'El servicio no está disponible temporalmente. Inténtalo más tarde.';
    default:
      return 'Ocurrió un error inesperado. Vuelve a intentar en unos momentos.';
  }
};

// 🔧 Interceptor de reintentos mejorado
const retryInterceptor = async (error: AxiosError): Promise<any> => {
  const config = error.config as AxiosRequestConfig & { _retryCount?: number };
  
  if (!config) {
    return Promise.reject(error);
  }

  const retryConfig = RetrySystem.getRetryConfig(config.url || '');
  const currentRetry = config._retryCount || 0;

  // Verificar si el error es reintentable
  if (currentRetry >= retryConfig.retries || !retryConfig.retryCondition?.(error)) {
    return Promise.reject(error);
  }

  config._retryCount = currentRetry + 1;
  const delay = RetrySystem.calculateDelay(currentRetry, retryConfig.retryDelay);

  log.warn(`[RETRY] Attempting retry ${config._retryCount}/${retryConfig.retries} for ${config.method?.toUpperCase()} ${config.url} after ${delay}ms`);

  await new Promise(resolve => setTimeout(resolve, delay));

  return api(config);
};

// 🎯 Configuración principal de Axios
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000, // Aumentado para mejor estabilidad
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// 🔑 Interceptor de request mejorado
api.interceptors.request.use(
  (config) => {
    // Verificar circuit breaker
    if (!CircuitBreaker.shouldAllowRequest(config.url || '')) {
      const error = new Error('Circuit breaker is OPEN for this endpoint') as any;
      error.isCircuitBreakerError = true;
      return Promise.reject(error);
    }

    // Verificar estado de red
    if (!NetworkMonitor.getStatus()) {
      log.warn('[NETWORK] Request blocked: offline');
      ErrorNotificationSystem.notify('Sin conexión a internet', 'warning');
      return Promise.reject(new Error('No internet connection'));
    }

    // Inyección de token JWT
    let token = localStorage.getItem('token');
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          token = userObj.token;
        } catch (error) {
          log.warn('[AUTH] Invalid user object in localStorage');
        }
      }
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      if (ENV === 'development') {
        log.debug('[AUTH] JWT token injected in headers');
      }
    }

    // Logging de request
    if (ENV === 'development') {
      log.debug(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    log.error(`[REQUEST_ERROR] ${error.message}`);
    return Promise.reject(error);
  }
);

// 🔄 Interceptor de response mejorado
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Éxito en circuit breaker
    CircuitBreaker.onSuccess(response.config.url || '');

    if (ENV === 'development') {
      log.debug(`[RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }

    return response;
  },
  async (error: AxiosError) => {
    const errorDetails = createErrorDetails(error);
    const userMessage = getUserFriendlyMessage(errorDetails);

    // Circuit breaker failure
    if (error.config?.url) {
      CircuitBreaker.onFailure(error.config.url);
    }

    // Logging detallado
    if (ENV === 'development' || ENV === 'test') {
      const logData = {
        url: errorDetails.url,
        method: errorDetails.method,
        status: errorDetails.status,
        message: errorDetails.message,
        code: errorDetails.code,
        isRetryable: errorDetails.isRetryable,
      };

      if (errorDetails.isNetworkError) {
        log.warn('[NETWORK_ERROR]', logData);
      } else if (errorDetails.isTimeout) {
        log.warn('[TIMEOUT_ERROR]', logData);
      } else {
        log.warn('[HTTP_ERROR]', logData);
      }
    }

    // Manejo de errores específicos
    if (errorDetails.status === 401) {
      // Token expirado o inválido - Solo hacer logout si no estamos ya en login
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        ErrorNotificationSystem.notify('Tu sesión ha expirado. Serás redirigido al login.', 'warning');
        
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } else if (errorDetails.status === 429) {
      // Rate limiting
      ErrorNotificationSystem.notify('Demasiadas solicitudes. Espera un momento.', 'warning', 8000);
    } else if (errorDetails.isNetworkError || errorDetails.isTimeout) {
      // Errores de red o timeout
      ErrorNotificationSystem.notify(userMessage, 'error', 6000);
    } else if (errorDetails.status && errorDetails.status >= 500) {
      // Errores del servidor
      ErrorNotificationSystem.notify('Error del servidor. Inténtalo más tarde.', 'error');
    } else if (errorDetails.status && errorDetails.status >= 400) {
      // Errores del cliente (400-499)
      ErrorNotificationSystem.notify(userMessage, 'warning');
    }

    // Intentar reintento
    try {
      return await retryInterceptor(error);
    } catch (retryError) {
      // Si los reintentos fallan, mostrar notificación final
      if (ENV === 'production') {
        log.error('[API_ERROR]', {
          url: errorDetails.url,
          method: errorDetails.method,
          status: errorDetails.status,
          message: errorDetails.message,
        });
      }

      return Promise.reject(error);
    }
  }
);

// 🎯 Configurar reintentos para diferentes endpoints
RetrySystem.setRetryConfig('/auth', { retries: 2, retryDelay: 500 });
RetrySystem.setRetryConfig('/wallet', { retries: 3, retryDelay: 1000 });
RetrySystem.setRetryConfig('/transactions', { retries: 3, retryDelay: 2000 });

// 🔄 Exportar utilidades adicionales
export { 
  NetworkMonitor, 
  ErrorNotificationSystem, 
  CircuitBreaker,
  RetrySystem,
  type ErrorDetails 
};

export default api;
