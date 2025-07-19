@echo off
echo.
echo ========================================
echo 🚀 CyberWallet - Inicio Optimizado
echo ========================================
echo.

:: Verificar si Docker está instalado y ejecutándose
echo [1/5] Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Docker no está instalado o no está ejecutándose
    echo Por favor, instala Docker Desktop y asegúrate de que esté ejecutándose
    pause
    exit /b 1
)
echo ✅ Docker está disponible

:: Limpiar recursos Docker no utilizados
echo [2/5] Limpiando recursos Docker...
docker system prune -f
echo ✅ Limpieza completada

:: Crear directorio de datos si no existe
echo [3/5] Preparando directorios...
if not exist "data\postgres" mkdir "data\postgres"
echo ✅ Directorios preparados

:: Construir y levantar servicios
echo [4/5] Construyendo y levantando servicios...
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo ❌ ERROR: Fallo al levantar los servicios
    pause
    exit /b 1
)
echo ✅ Servicios levantados correctamente

:: Esperar a que los servicios estén listos
echo [5/5] Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

:: Mostrar estado de los servicios
echo.
echo ========================================
echo 📊 Estado de los Servicios
echo ========================================
docker-compose ps

echo.
echo ========================================
echo 🌐 URLs de Acceso
echo ========================================
echo Frontend: http://localhost
echo Backend API: http://localhost:8080
echo Base de Datos: localhost:5432
echo.

echo ========================================
echo 🎯 CyberWallet está listo!
echo ========================================
echo.
echo Para detener los servicios: docker-compose down
echo Para ver logs: docker-compose logs -f
echo Para reiniciar: docker-compose restart
echo.
pause 