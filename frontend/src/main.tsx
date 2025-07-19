import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { UnifiedThemeProvider } from '@/context/UnifiedThemeContext';
import '@/index.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import logger from '@/utils/logger';

// 🔍 DEBUG: Logs detallados para auditoría
console.log('🔵 [MAIN] Iniciando carga de main.tsx');
console.log('🔵 [MAIN] NODE_ENV:', process.env.NODE_ENV);
console.log('🔵 [MAIN] Imports completados exitosamente');

// 🎯 Inicialización optimizada del logger para desarrollo full-stack
if (process.env.NODE_ENV === 'development') {
  logger.info('[🚀 DEV] CyberWallet 2025 - Iniciando aplicación en modo desarrollo');
  console.log('🔵 [MAIN] Logger inicializado para desarrollo');
} else if (process.env.NODE_ENV === 'test') {
  logger.info('[🧪 TEST] CyberWallet - Entorno de testing iniciado');
} else if (process.env.NODE_ENV === 'production') {
  logger.info('[⚡ PROD] CyberWallet - Aplicación web iniciada');
}

// 🔍 DEBUG: Verificar DOM
const rootElement = document.getElementById('root');
console.log('🔵 [MAIN] Root element encontrado:', !!rootElement);

if (!rootElement) {
  console.error('🔴 [MAIN] ERROR: No se encontró el elemento root en el DOM');
  throw new Error('Root element not found');
}

console.log('🔵 [MAIN] Creando React root...');
const root = ReactDOM.createRoot(rootElement);

console.log('🔵 [MAIN] Iniciando renderizado de la aplicación...');

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <UnifiedThemeProvider>
            <AuthProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <App />
              </LocalizationProvider>
            </AuthProvider>
          </UnifiedThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('🟢 [MAIN] Renderizado iniciado exitosamente');
} catch (error) {
  console.error('🔴 [MAIN] ERROR en renderizado:', error);
  
  // Renderizado de emergencia
  root.render(
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#333' }}>
      <h1>Error de Renderizado</h1>
      <p>Error: {error instanceof Error ? error.message : 'Error desconocido'}</p>
      <p>Revisa la consola para más detalles</p>
    </div>
  );
}