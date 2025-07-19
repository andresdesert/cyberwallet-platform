#!/bin/bash

# 🎯 Script de Inicio - CyberWallet Production
# 100% Plug & Play - Solo requiere Docker instalado

set -e

echo "🚀 Iniciando CyberWallet Production..."

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
    docker-compose down --remove-orphans
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

echo "📦 Construyendo imágenes..."
docker-compose build --no-cache

echo "🔧 Iniciando servicios..."
docker-compose up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 30

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."

# Verificar base de datos
if docker-compose exec -T postgres pg_isready -U postgres -d cyberwallet; then
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
if curl -f http://localhost:80/ > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERROR"
    exit 1
fi

echo ""
echo "🎉 ¡CyberWallet está listo!"
echo ""
echo "📱 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost:8080"
echo "📊 Swagger UI: http://localhost:8080/swagger-ui.html"
echo "🗄️  Base de datos: localhost:5432"
echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Detener: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
echo ""
echo "🔄 Los servicios se reiniciarán automáticamente si se detienen."
echo "💡 Presiona Ctrl+C para detener todos los servicios."

# Mantener el script ejecutándose
wait 