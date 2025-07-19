# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a CyberWallet Platform! Este documento te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [🚀 Comenzando](#-comenzando)
- [🔧 Configuración del Entorno](#-configuración-del-entorno)
- [📝 Flujo de Trabajo](#-flujo-de-trabajo)
- [🧪 Testing](#-testing)
- [📊 Código de Conducta](#-código-de-conducta)
- [📞 Contacto](#-contacto)

## 🚀 Comenzando

### Prerrequisitos

- **Node.js 18+** para desarrollo frontend
- **Java 21+** para desarrollo backend
- **Docker & Docker Compose** para desarrollo local
- **Git** para control de versiones

### Fork y Clone

1. **Fork** el repositorio en GitHub
2. **Clone** tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/cyberwallet-platform.git
   cd cyberwallet-platform
   ```

## 🔧 Configuración del Entorno

### Desarrollo Local

```bash
# 1. Instalar dependencias frontend
cd frontend
npm install

# 2. Instalar dependencias backend
cd ../walletapi
mvn clean install

# 3. Iniciar con Docker
cd ..
docker-compose up -d
```

### Variables de Entorno

Crea archivos `.env` en los directorios correspondientes:

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

## 📝 Flujo de Trabajo

### 1. Crear una Rama

```bash
git checkout -b feature/nombre-de-la-funcionalidad
# o
git checkout -b fix/nombre-del-bug
# o
git checkout -b docs/nombre-de-la-documentacion
```

### 2. Desarrollar

- Escribe código limpio y bien documentado
- Sigue las convenciones del proyecto
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 3. Testing

```bash
# Frontend
cd frontend
npm run test
npm run test:coverage

# Backend
cd walletapi
mvn test
mvn test:coverage
```

### 4. Commit

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad

- Descripción detallada de los cambios
- Resuelve #123
- Breaking changes: ninguno"
```

### 5. Push y Pull Request

```bash
git push origin feature/nombre-de-la-funcionalidad
```

Luego crea un Pull Request en GitHub.

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Unit tests
npm run test

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Linting
npm run lint
```

### Backend Testing

```bash
cd walletapi

# Unit tests
mvn test

# Integration tests
mvn verify

# Coverage
mvn jacoco:report
```

### Cobertura Mínima

- **Frontend**: 90%+
- **Backend**: 90%+
- **E2E**: Casos críticos cubiertos

## 📊 Estándares de Código

### Frontend (React + TypeScript)

```typescript
// ✅ Bueno
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const UserComponent: React.FC<UserProps> = ({ id, name, email }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};

// ❌ Evitar
const UserComponent = (props) => {
  return <div>{props.name}</div>;
};
```

### Backend (Java + Spring Boot)

```java
// ✅ Bueno
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }
}

// ❌ Evitar
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
```

## 🔍 Code Review

### Checklist

- [ ] Código limpio y legible
- [ ] Tests incluidos y pasando
- [ ] Documentación actualizada
- [ ] Sin vulnerabilidades de seguridad
- [ ] Performance optimizada
- [ ] Accesibilidad considerada

### Proceso

1. **Autor** crea PR
2. **Reviewers** revisan código
3. **CI/CD** ejecuta tests automáticamente
4. **Autor** corrige feedback
5. **Maintainer** aprueba y mergea

## 📊 Código de Conducta

### Nuestros Estándares

- **Respeto**: Trata a todos con respeto
- **Colaboración**: Ayuda a otros desarrolladores
- **Aprendizaje**: Comparte conocimiento
- **Calidad**: Mantén altos estándares de código

### Comportamiento Inaceptable

- Comentarios ofensivos o discriminatorios
- Trolling o comportamiento hostil
- Spam o contenido no relacionado
- Violación de privacidad

## 🏷️ Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorizar código
test: agregar o corregir tests
chore: tareas de mantenimiento
```

### Ejemplos

```bash
feat(auth): implementar autenticación OAuth2
fix(api): corregir validación de email
docs(readme): actualizar instrucciones de instalación
test(frontend): agregar tests para UserComponent
```

## 📞 Contacto

### Canales de Comunicación

- **Issues**: [GitHub Issues](https://github.com/andresdesert/cyberwallet-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/andresdesert/cyberwallet-platform/discussions)
- **Email**: andres.simahan@gmail.com

### Mantenedores

- **Andrés Simahan** - [@andresdesert](https://github.com/andresdesert)

## 🙏 Agradecimientos

Gracias por contribuir a hacer CyberWallet Platform mejor cada día. Tu trabajo es valioso para la comunidad.

---

**¡Juntos construimos el futuro de las finanzas digitales! 🚀** 