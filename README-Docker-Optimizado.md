# 🚀 CyberWallet - Docker Optimizado

## 📋 Requisitos Previos

- **Docker Desktop** instalado y ejecutándose
- **Windows 10/11** o **macOS/Linux**
- **4GB RAM** mínimo (8GB recomendado)
- **2GB** espacio libre en disco

## ⚡ Inicio Rápido (Plug & Play)

### 🎯 Opción 1: Script Automático (Recomendado)

```bash
# Windows
start-optimized.bat

# Linux/macOS
./start-optimized.sh
```

### 🎯 Opción 2: Comando Manual

```bash
# 1. Limpiar recursos Docker
docker system prune -f

# 2. Crear directorios necesarios
mkdir -p data/postgres

# 3. Construir y levantar servicios
docker-compose up --build -d

# 4. Verificar estado
docker-compose ps
```

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost | Aplicación web principal |
| **Backend API** | http://localhost:8080 | API REST |
| **Base de Datos** | localhost:5432 | PostgreSQL |

## 🛠️ Comandos Útiles

### 📊 Monitoreo
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Ver estado de servicios
docker-compose ps

# Ver uso de recursos
docker stats
```

### 🔄 Gestión de Servicios
```bash
# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart backend

# Parar todos los servicios
docker-compose down

# Parar y limpiar volúmenes
docker-compose down -v
```

### 🧹 Limpieza
```bash
# Limpiar recursos no utilizados
docker system prune -f

# Limpiar todo (incluyendo imágenes)
docker system prune -a

# Limpiar volúmenes
docker volume prune
```

## 🔧 Configuración Avanzada

### 📝 Variables de Entorno

El sistema usa las siguientes variables de entorno principales:

#### Backend (Spring Boot)
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=cyberwallet
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=cyberwallet-super-secret-jwt-key-2025-production
SPRING_PROFILES_ACTIVE=docker
```

#### Frontend (React)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CyberWallet
VITE_APP_VERSION=2.0.0
NODE_ENV=production
```

### 🎛️ Recursos Asignados

| Servicio | Memoria Mínima | Memoria Máxima |
|----------|----------------|----------------|
| **PostgreSQL** | 256MB | 512MB |
| **Backend** | 512MB | 1GB |
| **Frontend** | 128MB | 256MB |

## 🚨 Solución de Problemas

### ❌ Error: Puerto en uso
```bash
# Verificar puertos en uso
netstat -ano | findstr :80
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Cambiar puertos en docker-compose.yml si es necesario
```

### ❌ Error: Docker no responde
```bash
# Reiniciar Docker Desktop
# En Windows: Reiniciar desde la bandeja del sistema
# En macOS: docker system restart
```

### ❌ Error: Base de datos no conecta
```bash
# Verificar logs de PostgreSQL
docker-compose logs postgres

# Reiniciar solo la base de datos
docker-compose restart postgres
```

### ❌ Error: Frontend no carga
```bash
# Verificar logs del frontend
docker-compose logs frontend

# Reconstruir frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

## 📁 Estructura del Proyecto

```
Cyberwallet/
├── docker-compose.yml          # Configuración principal
├── start-optimized.bat         # Script de inicio Windows
├── stop-optimized.bat          # Script de parada Windows
├── data/                       # Datos persistentes
│   └── postgres/              # Base de datos PostgreSQL
├── frontend/                   # Aplicación React
│   ├── Dockerfile             # Imagen del frontend
│   └── src/                   # Código fuente
└── walletapi/                 # API Spring Boot
    ├── Dockerfile             # Imagen del backend
    └── src/                   # Código fuente
```

## 🔒 Seguridad

- **JWT Secret**: Cambiar en producción
- **Base de datos**: Credenciales por defecto (cambiar en producción)
- **Puertos**: Solo los necesarios expuestos
- **Redes**: Aislamiento con Docker networks

## 📈 Performance

### 🚀 Optimizaciones Implementadas

- **Multi-stage builds** para imágenes más pequeñas
- **Health checks** para monitoreo automático
- **Resource limits** para control de memoria
- **BuildKit cache** para builds más rápidos
- **Alpine Linux** para imágenes base más pequeñas

### 📊 Métricas Esperadas

- **Tiempo de inicio**: 2-3 minutos
- **Uso de memoria**: ~1.5GB total
- **Uso de CPU**: Bajo en idle
- **Tiempo de respuesta**: <100ms (frontend), <500ms (API)

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz tus cambios
4. Prueba con Docker
5. Envía un Pull Request

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Consulta esta documentación
4. Abre un issue en GitHub

---

**🎯 CyberWallet - El Futuro de las Finanzas Digitales** 