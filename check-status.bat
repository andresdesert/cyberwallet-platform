@echo off
echo.
echo ========================================
echo 📊 CyberWallet - Estado del Sistema
echo ========================================
echo.

:: Verificar estado de contenedores
echo [1/3] Estado de Contenedores:
docker-compose ps

echo.
echo [2/3] Uso de Recursos:
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo.
echo [3/3] URLs de Acceso:
echo Frontend: http://localhost
echo Backend API: http://localhost:8080
echo Base de Datos: localhost:5432

echo.
echo ========================================
echo 🎯 Sistema Listo para Usar
echo ========================================
echo.
pause 