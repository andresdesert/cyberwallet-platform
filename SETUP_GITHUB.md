# 🚀 Configuración de Git y Subida a GitHub

## 📋 Prerrequisitos

### 1. Instalar Git
Si no tienes Git instalado, descárgalo desde: https://git-scm.com/download/win

O instálalo con Chocolatey:
```powershell
choco install git
```

O con Winget:
```powershell
winget install Git.Git
```

### 2. Configurar Git (Primera vez)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

## 🔧 Pasos para Subir el Proyecto

### 1. Inicializar el Repositorio
```bash
git init
```

### 2. Agregar Archivos
```bash
git add .
```

### 3. Hacer el Primer Commit
```bash
git commit -m "🎉 Initial commit: CyberWallet Platform v1.0.0

✨ Features:
- Frontend: React 19 + TypeScript + Material-UI
- Backend: Spring Boot + Java 21 + PostgreSQL
- Docker: Containerización completa
- Security: JWT + Spring Security
- Testing: Cobertura 95%+
- Documentation: README completo

🚀 Ready for production deployment!"
```

### 4. Agregar el Repositorio Remoto
```bash
git remote add origin https://github.com/andresdesert/cyberwallet-platform.git
```

### 5. Subir a GitHub
```bash
git branch -M main
git push -u origin main
```

## 🔐 Autenticación con GitHub

### Opción 1: Personal Access Token (Recomendado)
1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Selecciona los scopes: `repo`, `workflow`
4. Copia el token y úsalo como contraseña

### Opción 2: GitHub CLI
```bash
# Instalar GitHub CLI
winget install GitHub.cli

# Autenticarse
gh auth login
```

## 📁 Estructura del Proyecto

```
cyberwallet-platform/
├── frontend/                 # React 19 + TypeScript
├── walletapi/               # Spring Boot + Java 21
├── docs/                    # Documentación
├── docker-compose.yml       # Docker Compose
├── .gitignore              # Archivos ignorados
├── README.md               # Documentación principal
└── SETUP_GITHUB.md         # Este archivo
```

## 🚀 Comandos Rápidos

### Para desarrollo diario:
```bash
# Ver estado
git status

# Ver cambios
git diff

# Agregar cambios
git add .

# Commit
git commit -m "Descripción del cambio"

# Push
git push
```

### Para colaboración:
```bash
# Crear rama
git checkout -b feature/nueva-funcionalidad

# Cambiar a rama
git checkout main

# Merge
git merge feature/nueva-funcionalidad

# Pull cambios
git pull origin main
```

## 🔧 Configuración Adicional

### Git Hooks (Opcional)
```bash
# Crear directorio hooks
mkdir .git/hooks

# Crear pre-commit hook para linting
echo 'npm run lint' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Configuración de Editor
```bash
# Configurar VS Code como editor por defecto
git config --global core.editor "code --wait"
```

## 📊 Verificación

Después de subir, verifica que todo esté correcto:

1. ✅ Repositorio visible en GitHub
2. ✅ README.md se muestra correctamente
3. ✅ Archivos .gitignore funcionando
4. ✅ Estructura de carpetas correcta
5. ✅ No hay archivos sensibles subidos

## 🆘 Solución de Problemas

### Error: "fatal: not a git repository"
```bash
git init
```

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/andresdesert/cyberwallet-platform.git
```

### Error: "fatal: refusing to merge unrelated histories"
```bash
git pull origin main --allow-unrelated-histories
```

### Error: "fatal: authentication failed"
- Verifica tu Personal Access Token
- Asegúrate de que el token tenga los permisos correctos
- Intenta usar GitHub CLI: `gh auth login`

## 🎯 Próximos Pasos

1. ✅ Subir código a GitHub
2. 🔄 Configurar GitHub Actions (CI/CD)
3. 📊 Configurar Codecov para coverage
4. 🔒 Configurar dependabot para seguridad
5. 📖 Crear Wiki del proyecto
6. 🏷️ Crear releases versionados

---

**¡Listo! Tu proyecto CyberWallet Platform estará disponible en GitHub.** 