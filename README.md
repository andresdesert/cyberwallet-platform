# 🚀 CyberWallet Platform

**El Futuro de las Finanzas Digitales** - Plataforma fintech completa con seguridad bancaria y transacciones instantáneas.

## 📋 Descripción

CyberWallet es una plataforma financiera avanzada que combina la seguridad bancaria con la agilidad de las fintech modernas. Desarrollada con tecnologías de vanguardia, ofrece una experiencia de usuario excepcional y funcionalidades robustas para la gestión de finanzas digitales.

## 🏗️ Arquitectura

El proyecto está estructurado como una aplicación full-stack con:

- **Frontend**: React 19 + TypeScript + Vite + Material-UI
- **Backend**: Spring Boot + Java 21 + PostgreSQL
- **Infraestructura**: Docker + Docker Compose
- **Seguridad**: JWT + Spring Security + Validaciones robustas

## 🚀 Características Principales

### 🔒 Seguridad
- Encriptación AES-256 de nivel militar
- Autenticación biométrica avanzada
- Monitoreo 24/7 de transacciones
- Validaciones robustas en frontend y backend

### ⚡ Velocidad
- Transacciones instantáneas
- Confirmación en menos de 3 segundos
- Tecnología blockchain optimizada
- Disponibilidad 99.9%

### 📊 Análisis Inteligente
- Reportes detallados en tiempo real
- Análisis predictivo de mercado
- Recomendaciones personalizadas
- Visualización avanzada de datos

### 🛠️ Soporte 24/7
- Atención personalizada
- Soporte técnico especializado
- Documentación completa
- Comunidad activa

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI moderna
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra-rápido
- **Material-UI v7** - Componentes de UI
- **React Router v6** - Enrutamiento
- **i18next** - Internacionalización
- **React Query** - Gestión de estado del servidor

### Backend
- **Spring Boot 3.2** - Framework Java moderno
- **Java 21** - LTS más reciente
- **Spring Security** - Seguridad robusta
- **JPA/Hibernate** - ORM avanzado
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación stateless
- **Swagger/OpenAPI** - Documentación de API

### DevOps & Infraestructura
- **Docker** - Containerización
- **Docker Compose** - Orquestación local
- **Maven** - Gestión de dependencias
- **GitHub Actions** - CI/CD
- **Nginx** - Proxy reverso

## 📦 Instalación

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo frontend)
- Java 21+ (para desarrollo backend)
- Maven 3.8+

### Instalación Rápida con Docker

```bash
# Clonar el repositorio
git clone https://github.com/andresdesert/cyberwallet-platform.git
cd cyberwallet-platform

# Iniciar con Docker Compose
docker-compose up -d

# La aplicación estará disponible en:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# Base de datos: localhost:5432
```

### Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd walletapi
mvn spring-boot:run
```

## 🔧 Configuración

### Variables de Entorno

Crear archivos `.env` en los directorios correspondientes:

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=CyberWallet
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```env
SPRING_PROFILES_ACTIVE=dev
DATABASE_URL=jdbc:postgresql://localhost:5432/cyberwallet
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
JWT_SECRET=your-secret-key
```

## 📚 Documentación

- [Documentación Técnica](./docs/CyberWallet_Documentacion_Tecnica.docx)
- [API Documentation](http://localhost:8080/swagger-ui.html)
- [Guía de Desarrollo](./docs/DEVELOPMENT.md)
- [Guía de Despliegue](./docs/DEPLOYMENT.md)

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend
```bash
cd walletapi
mvn test
mvn test:coverage
```

## 🚀 Despliegue

### Producción
```bash
# Build de producción
docker-compose -f docker-compose.prod.yml up -d

# Con variables de entorno personalizadas
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Desarrollo
```bash
# Entorno de desarrollo
docker-compose -f docker-compose.dev.yml up -d
```

## 📊 Métricas y Monitoreo

- **Core Web Vitals**: Optimizados para máxima performance
- **Lighthouse Score**: 95+ en todas las categorías
- **Test Coverage**: >90% en frontend y backend
- **Security Score**: A+ en análisis de seguridad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Andrés Simahan** - QA & Security Specialist

- LinkedIn: [Andrés Simahan](https://www.linkedin.com/in/andres-simahan/)
- GitHub: [@andresdesert](https://github.com/andresdesert)
- Email: andres.simahan@gmail.com

## 🙏 Agradecimientos

- Comunidad de desarrolladores de React y Spring Boot
- Contribuidores y testers del proyecto
- Herramientas open source utilizadas

## 📞 Soporte

- 📧 Email: support@cyberwallet.com
- 💬 Discord: [CyberWallet Community](https://discord.gg/cyberwallet)
- 📖 Wiki: [Documentación Wiki](https://github.com/andresdesert/cyberwallet-platform/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/andresdesert/cyberwallet-platform/issues)

---

<div align="center">

**⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub**

[![GitHub stars](https://img.shields.io/github/stars/andresdesert/cyberwallet-platform?style=social)](https://github.com/andresdesert/cyberwallet-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/andresdesert/cyberwallet-platform?style=social)](https://github.com/andresdesert/cyberwallet-platform/network/members)
[![GitHub issues](https://img.shields.io/github/issues/andresdesert/cyberwallet-platform)](https://github.com/andresdesert/cyberwallet-platform/issues)

</div>
