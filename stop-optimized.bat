@echo off
echo.
echo ========================================
echo 🛑 CyberWallet - Parada Optimizada
echo ========================================
echo.

:: Detener servicios
echo [1/3] Deteniendo servicios...
docker-compose down
if %errorlevel% neq 0 (
    echo ❌ ERROR: Fallo al detener los servicios
    pause
    exit /b 1
)
echo ✅ Servicios detenidos

:: Limpiar recursos no utilizados
echo [2/3] Limpiando recursos Docker...
docker system prune -f
echo ✅ Limpieza completada

:: Mostrar estado final
echo [3/3] Estado final...
docker ps -a --filter "name=cyberwallet" --format "table {{.Names}}\t{{.Status}}"

echo.
echo ========================================
echo ✅ CyberWallet detenido correctamente
echo ========================================
echo.
echo Para volver a iniciar: start-optimized.bat
echo Para limpiar todo: docker system prune -a
echo.
pause 