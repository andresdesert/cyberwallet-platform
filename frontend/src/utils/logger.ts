// src/utils/logger.ts
import log from 'loglevel';

// Use process.env.NODE_ENV for broader compatibility across build tools (Vite uses import.meta.env.MODE)
const ENV = process.env.NODE_ENV; // 'development' | 'production' | 'test'

const logger = log.getLogger('cyberwallet');

// 🔧 Nivel por entorno
if (ENV === 'development') {
  logger.setLevel('debug'); // Muestra todos los logs en desarrollo
} else if (ENV === 'test') {
  logger.setLevel('info'); // Muestra info, warn, error en test
} else { // ENV === 'production'
  logger.setLevel('warn'); // En producción, solo muestra advertencias y errores (no debug/info)
}

// 🧠 En producción, limitar los stacktrace largos:
if (ENV === 'production') {
  const originalFactory = logger.methodFactory;
  logger.methodFactory = (methodName, level, loggerName) => {
    const rawMethod = originalFactory(methodName, level, loggerName);
    return (...args: any[]) => {
      const cleanedArgs = args.map(arg => {
        if (arg instanceof Error && arg.stack) {
          // Limitar a solo las primeras 5 líneas del stack trace para reducir el volumen de logs en producción
          arg.stack = arg.stack.split('\n').slice(0, 5).join('\n');
        }
        return arg;
      });
      rawMethod(...cleanedArgs);
    };
  };
  logger.setLevel(logger.getLevel()); // Aplica la nueva fábrica de métodos forzando un reinicio del nivel
}

export const logError = (message: string, error?: unknown) => {
  console.error(`[ERROR] ${message}`, error);
};

export default logger;
