#!/bin/bash

# 🎯 Script de Inicio - CyberWallet Development
# Hot reload y debugging habilitado

set -e

echo "🚀 Iniciando CyberWallet Development..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose no está disponible. Por favor instala Docker Compose."
    exit 1
fi

# Función para limpiar recursos
cleanup() {
    echo "🧹 Limpiando recursos..."
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

echo "📦 Construyendo imágenes de desarrollo..."
docker-compose -f docker-compose.dev.yml build --no-cache

echo "🔧 Iniciando servicios de desarrollo..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 45

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."

# Verificar base de datos
if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U postgres -d cyberwallet_dev; then
    echo "✅ Base de datos: OK"
else
    echo "❌ Base de datos: ERROR"
    exit 1
fi

# Verificar backend
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend API: OK"
else
    echo "❌ Backend API: ERROR"
    exit 1
fi

# Verificar frontend
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERROR"
    exit 1
fi

echo ""
echo "🎉 ¡CyberWallet Development está listo!"
echo ""
echo "📱 Frontend: http://localhost:3000 (Hot Reload)"
echo "🔧 Backend API: http://localhost:8080 (Hot Reload)"
echo "🐛 Debug Backend: localhost:5005"
echo "📊 Swagger UI: http://localhost:8080/swagger-ui.html"
echo "🗄️  Base de datos: localhost:5432"
echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "  - Ver logs backend: docker-compose -f docker-compose.dev.yml logs -f backend-dev"
echo "  - Ver logs frontend: docker-compose -f docker-compose.dev.yml logs -f frontend-dev"
echo "  - Detener: docker-compose -f docker-compose.dev.yml down"
echo "  - Reiniciar: docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "🔄 Hot reload está habilitado - los cambios se reflejarán automáticamente."
echo "💡 Presiona Ctrl+C para detener todos los servicios."

# Mantener el script ejecutándose
wait 