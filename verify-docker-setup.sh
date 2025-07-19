#!/bin/bash

# 🎯 Script de Verificación - CyberWallet Docker Setup
# Verifica que todos los archivos necesarios estén presentes

set -e

echo "🔍 Verificando setup Docker de CyberWallet..."

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1 - FALTANTE"
        exit 1
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
    else
        echo "❌ $1/ - FALTANTE"
        exit 1
    fi
}

echo ""
echo "📁 Verificando estructura de directorios..."
check_dir "walletapi"
check_dir "frontend"

echo ""
echo "🐳 Verificando archivos Docker principales..."
check_file "docker-compose.yml"
check_file "docker-compose.dev.yml"

echo ""
echo "📜 Verificando scripts de inicio..."
check_file "start.sh"
check_file "start-dev.sh"
check_file "start.bat"

echo ""
echo "🔧 Verificando Dockerfiles..."
check_file "walletapi/Dockerfile"
check_file "walletapi/Dockerfile.dev"
check_file "frontend/Dockerfile"
check_file "frontend/Dockerfile.dev"

echo ""
echo "🌐 Verificando configuraciones Nginx..."
check_file "frontend/nginx.conf"
check_file "frontend/nginx-default.conf"

echo ""
echo "🚫 Verificando .dockerignore..."
check_file "walletapi/.dockerignore"
check_file "frontend/.dockerignore"

echo ""
echo "📚 Verificando documentación..."
check_file "README-Docker.md"

echo ""
echo "🎯 Verificando Docker..."

# Verificar que Docker esté instalado
if command -v docker &> /dev/null; then
    echo "✅ Docker está instalado"
    docker --version
else
    echo "❌ Docker no está instalado"
    exit 1
fi

# Verificar que Docker Compose esté disponible
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo "✅ Docker Compose está disponible"
    if command -v docker-compose &> /dev/null; then
        docker-compose --version
    else
        docker compose version
    fi
else
    echo "❌ Docker Compose no está disponible"
    exit 1
fi

echo ""
echo "🎉 ¡Verificación completada exitosamente!"
echo ""
echo "📋 Resumen de archivos creados:"
echo "  - docker-compose.yml (Producción)"
echo "  - docker-compose.dev.yml (Desarrollo)"
echo "  - start.sh (Linux/Mac - Producción)"
echo "  - start-dev.sh (Linux/Mac - Desarrollo)"
echo "  - start.bat (Windows - Producción)"
echo "  - walletapi/Dockerfile (Backend - Producción)"
echo "  - walletapi/Dockerfile.dev (Backend - Desarrollo)"
echo "  - frontend/Dockerfile (Frontend - Producción)"
echo "  - frontend/Dockerfile.dev (Frontend - Desarrollo)"
echo "  - frontend/nginx.conf (Configuración Nginx)"
echo "  - frontend/nginx-default.conf (Configuración del sitio)"
echo "  - walletapi/.dockerignore (Optimización Backend)"
echo "  - frontend/.dockerignore (Optimización Frontend)"
echo "  - README-Docker.md (Documentación completa)"
echo ""
echo "🚀 Para iniciar el proyecto:"
echo "  Linux/Mac: ./start.sh (producción) o ./start-dev.sh (desarrollo)"
echo "  Windows: start.bat (producción)"
echo ""
echo "📖 Para más información, consulta README-Docker.md" 