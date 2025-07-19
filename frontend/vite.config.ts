// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [
      react({
        // Configuración básica para React
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Configuración de desarrollo
    server: {
      port: 5173,
      host: true,
      proxy: {
        // Proxy para el backend
        '/api/v1': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          timeout: 15000,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('🔴 [Proxy Error]:', err.message);
            });
            proxy.on('proxyReq', (_proxyReq, req, _res) => {
              console.log('🔵 [Proxy Request]:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('🟢 [Proxy Response]:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
    // Configuración básica de CSS
    css: {
      devSourcemap: true, // Habilitar sourcemaps para debugging
    },
    // Optimizaciones básicas de dependencias
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mui/material',
        '@mui/icons-material',
        'react-router-dom',
        'axios',
      ],
    },
    // Configuración básica de build
    build: {
      target: 'es2015',
      minify: false, // Deshabilitar minificación para debugging
      sourcemap: true, // Habilitar sourcemaps para debugging
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
          },
        },
      },
    },
    // Variables de entorno
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  };
});