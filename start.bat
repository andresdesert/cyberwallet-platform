@echo off
REM 🎯 Script de Inicio - CyberWallet Production (Windows)
REM 100% Plug & Play - Solo requiere Docker instalado

echo 🚀 Iniciando CyberWallet Production...

REM Verificar que Docker esté instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker no está instalado. Por favor instala Docker Desktop primero.
    pause
    exit /b 1
)

REM Verificar que Docker Compose esté disponible
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker Compose no está disponible. Por favor instala Docker Compose.
    pause
    exit /b 1
)

echo 📦 Construyendo imágenes...
docker-compose build --no-cache

echo 🔧 Iniciando servicios...
docker-compose up -d

echo ⏳ Esperando que los servicios estén listos...
timeout /t 30 /nobreak >nul

echo 🔍 Verificando estado de los servicios...

REM Verificar backend
curl -f http://localhost:8080/actuator/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend API: ERROR
    echo 🔍 Revisando logs del backend...
    docker-compose logs backend
    pause
    exit /b 1
) else (
    echo ✅ Backend API: OK
)

REM Verificar frontend
curl -f http://localhost:80/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend: ERROR
    echo 🔍 Revisando logs del frontend...
    docker-compose logs frontend
    pause
    exit /b 1
) else (
    echo ✅ Frontend: OK
)

echo.
echo 🎉 ¡CyberWallet está listo!
echo.
echo 📱 Frontend: http://localhost
echo 🔧 Backend API: http://localhost:8080
echo 📊 Swagger UI: http://localhost:8080/swagger-ui.html
echo 🗄️  Base de datos: localhost:5432
echo.
echo 📋 Comandos útiles:
echo   - Ver logs: docker-compose logs -f
echo   - Detener: docker-compose down
echo   - Reiniciar: docker-compose restart
echo.
echo 🔄 Los servicios se reiniciarán automáticamente si se detienen.
echo 💡 Presiona cualquier tecla para detener todos los servicios.

pause

echo 🧹 Deteniendo servicios...
docker-compose down --remove-orphans

echo ✅ Servicios detenidos correctamente.
pause 