# 🎯 CyberWallet - Docker Setup
## 100% Plug & Play - Solo requiere Docker instalado

### 📋 Requisitos Previos

- **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
- **Docker Compose** (incluido en Docker Desktop)
- **Git** (para clonar el repositorio)

### 🚀 Inicio Rápido

#### **Opción 1: Script Automático (Recomendado)**

**Linux/Mac:**
```bash
# Clonar repositorio
git clone <tu-repositorio>
cd Cyberwallet

# Dar permisos de ejecución
chmod +x start.sh start-dev.sh

# Iniciar producción
./start.sh

# O iniciar desarrollo
./start-dev.sh
```

**Windows:**
```cmd
# Clonar repositorio
git clone <tu-repositorio>
cd Cyberwallet

# Iniciar producción
start.bat
```

#### **Opción 2: Comandos Manuales**

**Producción:**
```bash
# Construir e iniciar todos los servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Desarrollo:**
```bash
# Construir e iniciar servicios de desarrollo
docker-compose -f docker-compose.dev.yml up -d --build

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

### 🌐 URLs de Acceso

#### **Producción:**
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Base de datos:** localhost:5432

#### **Desarrollo:**
- **Frontend:** http://localhost:3000 (Hot Reload)
- **Backend API:** http://localhost:8080 (Hot Reload)
- **Debug Backend:** localhost:5005
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Base de datos:** localhost:5432

### 🏗️ Arquitectura Docker

```
Cyberwallet/
├── docker-compose.yml          # Producción
├── docker-compose.dev.yml      # Desarrollo
├── start.sh                    # Script Linux/Mac (Producción)
├── start-dev.sh               # Script Linux/Mac (Desarrollo)
├── start.bat                  # Script Windows (Producción)
├── walletapi/
│   ├── Dockerfile             # Backend (Producción)
│   └── Dockerfile.dev         # Backend (Desarrollo)
└── frontend/
    ├── Dockerfile             # Frontend (Producción)
    ├── Dockerfile.dev         # Frontend (Desarrollo)
    ├── nginx.conf             # Configuración Nginx
    └── nginx-default.conf     # Configuración del sitio
```

### 🔧 Servicios

#### **1. Base de Datos (PostgreSQL)**
- **Imagen:** postgres:15-alpine
- **Puerto:** 5432
- **Base de datos:** cyberwallet (prod) / cyberwallet_dev (dev)
- **Usuario:** postgres
- **Contraseña:** postgres

#### **2. Backend API (Spring Boot)**
- **Java:** 17 (Eclipse Temurin)
- **Puerto:** 8080
- **Debug puerto:** 5005 (solo desarrollo)
- **Health check:** /actuator/health

#### **3. Frontend (React + Vite)**
- **Node.js:** 18
- **Puerto:** 80 (prod) / 3000 (dev)
- **Servidor:** Nginx (prod) / Vite Dev Server (dev)
- **Hot reload:** Habilitado en desarrollo

### 📊 Comandos Útiles

#### **Gestión de Servicios**
```bash
# Ver estado de servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

#### **Desarrollo**
```bash
# Ver logs de desarrollo
docker-compose -f docker-compose.dev.yml logs -f

# Acceder al contenedor del backend
docker-compose -f docker-compose.dev.yml exec backend-dev sh

# Acceder al contenedor del frontend
docker-compose -f docker-compose.dev.yml exec frontend-dev sh

# Acceder a la base de datos
docker-compose exec postgres psql -U postgres -d cyberwallet
```

#### **Mantenimiento**
```bash
# Limpiar imágenes no utilizadas
docker image prune -f

# Limpiar contenedores detenidos
docker container prune -f

# Limpiar volúmenes no utilizados
docker volume prune -f

# Limpiar todo (¡CUIDADO!)
docker system prune -a -f
```

### 🔒 Seguridad

#### **Configuraciones Implementadas:**
- **Usuarios no-root:** Todos los contenedores ejecutan con usuarios no privilegiados
- **Health checks:** Monitoreo automático de la salud de los servicios
- **Headers de seguridad:** CSP, HSTS, XSS Protection, etc.
- **Redes aisladas:** Comunicación interna entre servicios
- **Volúmenes persistentes:** Datos de base de datos preservados

#### **Variables de Entorno Sensibles:**
```bash
# JWT Secret (cambiar en producción)
JWT_SECRET=cyberwallet-super-secret-jwt-key-2025

# Credenciales de base de datos (cambiar en producción)
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### 🐛 Troubleshooting

#### **Problemas Comunes:**

**1. Puerto ya en uso:**
```bash
# Verificar qué está usando el puerto
netstat -tulpn | grep :8080
lsof -i :8080

# Cambiar puerto en docker-compose.yml
ports:
  - "8081:8080"  # Cambiar 8080 por 8081
```

**2. Problemas de permisos (Linux):**
```bash
# Dar permisos al directorio
sudo chown -R $USER:$USER .

# Dar permisos de ejecución a scripts
chmod +x start.sh start-dev.sh
```

**3. Problemas de memoria:**
```bash
# Aumentar memoria de Docker Desktop
# Docker Desktop > Settings > Resources > Memory: 4GB+

# O ajustar variables de entorno
MAVEN_OPTS="-Xmx1024m"  # Reducir memoria de Maven
```

**4. Problemas de red:**
```bash
# Verificar redes Docker
docker network ls

# Recrear red
docker-compose down
docker network prune -f
docker-compose up -d
```

#### **Logs de Debug:**
```bash
# Ver logs detallados
docker-compose logs --tail=100 -f

# Ver logs de un servicio específico
docker-compose logs backend --tail=50 -f

# Ver logs de desarrollo
docker-compose -f docker-compose.dev.yml logs --tail=100 -f
```

### 📈 Monitoreo

#### **Health Checks:**
- **Base de datos:** pg_isready
- **Backend:** /actuator/health
- **Frontend:** /health

#### **Métricas:**
- **Backend:** http://localhost:8080/actuator/metrics
- **Prometheus:** http://localhost:8080/actuator/prometheus

### 🔄 Actualizaciones

#### **Actualizar código:**
```bash
# Detener servicios
docker-compose down

# Actualizar código
git pull

# Reconstruir e iniciar
docker-compose up -d --build
```

#### **Actualizar dependencias:**
```bash
# Backend
docker-compose exec backend mvn dependency:resolve

# Frontend
docker-compose exec frontend npm update
```

### 📝 Notas Importantes

1. **Primera ejecución:** La primera vez puede tardar varios minutos en descargar imágenes y construir contenedores.

2. **Base de datos:** Los datos se preservan en volúmenes Docker. Para resetear completamente, usar `docker-compose down -v`.

3. **Desarrollo:** En modo desarrollo, los cambios en el código se reflejan automáticamente (hot reload).

4. **Producción:** En modo producción, los contenedores se reinician automáticamente si fallan.

5. **Recursos:** Asegúrate de tener al menos 4GB de RAM disponible para Docker.

### 🆘 Soporte

Si encuentras problemas:

1. **Verificar logs:** `docker-compose logs -f`
2. **Verificar estado:** `docker-compose ps`
3. **Reiniciar servicios:** `docker-compose restart`
4. **Reconstruir:** `docker-compose up -d --build`

---

**🎉 ¡Disfruta usando CyberWallet con Docker!** 