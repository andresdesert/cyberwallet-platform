# ========================================
# CyberWallet Platform - GitHub Setup Script
# ========================================

Write-Host "🚀 Configurando CyberWallet Platform para GitHub..." -ForegroundColor Green

# Verificar si Git está instalado
function Test-GitInstalled {
    try {
        $null = Get-Command git -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Instalar Git si no está disponible
function Install-Git {
    Write-Host "📦 Git no está instalado. Instalando..." -ForegroundColor Yellow
    
    # Intentar con winget primero
    try {
        Write-Host "🔍 Intentando instalar Git con winget..." -ForegroundColor Cyan
        winget install Git.Git --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git instalado exitosamente con winget" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "⚠️ winget no disponible, intentando con Chocolatey..." -ForegroundColor Yellow
    }
    
    # Intentar con Chocolatey
    try {
        Write-Host "🔍 Intentando instalar Git con Chocolatey..." -ForegroundColor Cyan
        choco install git -y
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Git instalado exitosamente con Chocolatey" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ No se pudo instalar Git automáticamente" -ForegroundColor Red
        Write-Host "📥 Por favor, descarga Git manualmente desde: https://git-scm.com/download/win" -ForegroundColor Yellow
        return $false
    }
    
    return $false
}

# Configurar Git
function Setup-Git {
    Write-Host "⚙️ Configurando Git..." -ForegroundColor Cyan
    
    $userName = Read-Host "👤 Ingresa tu nombre para Git"
    $userEmail = Read-Host "📧 Ingresa tu email para Git"
    
    git config --global user.name $userName
    git config --global user.email $userEmail
    
    Write-Host "✅ Git configurado correctamente" -ForegroundColor Green
}

# Inicializar repositorio
function Initialize-Repository {
    Write-Host "📁 Inicializando repositorio Git..." -ForegroundColor Cyan
    
    if (Test-Path .git) {
        Write-Host "⚠️ Repositorio Git ya existe" -ForegroundColor Yellow
        return
    }
    
    git init
    Write-Host "✅ Repositorio inicializado" -ForegroundColor Green
}

# Agregar archivos
function Add-Files {
    Write-Host "📦 Agregando archivos al repositorio..." -ForegroundColor Cyan
    
    git add .
    Write-Host "✅ Archivos agregados" -ForegroundColor Green
}

# Hacer commit inicial
function Make-InitialCommit {
    Write-Host "💾 Haciendo commit inicial..." -ForegroundColor Cyan
    
    $commitMessage = @"
🎉 Initial commit: CyberWallet Platform v1.0.0

✨ Features:
- Frontend: React 19 + TypeScript + Material-UI
- Backend: Spring Boot + Java 21 + PostgreSQL
- Docker: Containerización completa
- Security: JWT + Spring Security
- Testing: Cobertura 95%+
- Documentation: README completo

🚀 Ready for production deployment!
"@
    
    git commit -m $commitMessage
    Write-Host "✅ Commit inicial realizado" -ForegroundColor Green
}

# Configurar repositorio remoto
function Setup-Remote {
    Write-Host "🔗 Configurando repositorio remoto..." -ForegroundColor Cyan
    
    $remoteUrl = "https://github.com/andresdesert/cyberwallet-platform.git"
    
    # Verificar si ya existe el remote
    $existingRemote = git remote get-url origin 2>$null
    if ($existingRemote) {
        Write-Host "⚠️ Remote origin ya existe: $existingRemote" -ForegroundColor Yellow
        $changeRemote = Read-Host "¿Deseas cambiar el remote? (y/N)"
        if ($changeRemote -eq 'y' -or $changeRemote -eq 'Y') {
            git remote remove origin
            git remote add origin $remoteUrl
        }
    } else {
        git remote add origin $remoteUrl
    }
    
    Write-Host "✅ Repositorio remoto configurado" -ForegroundColor Green
}

# Subir a GitHub
function Push-ToGitHub {
    Write-Host "🚀 Subiendo a GitHub..." -ForegroundColor Cyan
    
    git branch -M main
    
    Write-Host "🔐 Necesitarás autenticarte con GitHub..." -ForegroundColor Yellow
    Write-Host "📝 Opciones de autenticación:" -ForegroundColor Cyan
    Write-Host "   1. Personal Access Token (Recomendado)" -ForegroundColor White
    Write-Host "   2. GitHub CLI" -ForegroundColor White
    Write-Host "   3. SSH Key" -ForegroundColor White
    
    $authMethod = Read-Host "Selecciona método de autenticación (1-3)"
    
    switch ($authMethod) {
        "1" {
            Write-Host "🔑 Para usar Personal Access Token:" -ForegroundColor Yellow
            Write-Host "   1. Ve a GitHub → Settings → Developer settings → Personal access tokens" -ForegroundColor White
            Write-Host "   2. Generate new token (classic)" -ForegroundColor White
            Write-Host "   3. Selecciona scopes: repo, workflow" -ForegroundColor White
            Write-Host "   4. Usa el token como contraseña cuando te lo pida" -ForegroundColor White
        }
        "2" {
            Write-Host "📦 Instalando GitHub CLI..." -ForegroundColor Cyan
            winget install GitHub.cli
            Write-Host "🔐 Ejecutando: gh auth login" -ForegroundColor Yellow
            gh auth login
        }
        "3" {
            Write-Host "🔑 Para usar SSH Key:" -ForegroundColor Yellow
            Write-Host "   1. Genera una SSH key: ssh-keygen -t ed25519 -C 'tu.email@ejemplo.com'" -ForegroundColor White
            Write-Host "   2. Agrega la key a GitHub: Settings → SSH and GPG keys" -ForegroundColor White
            Write-Host "   3. Cambia el remote a SSH: git remote set-url origin git@github.com:andresdesert/cyberwallet-platform.git" -ForegroundColor White
        }
    }
    
    $ready = Read-Host "¿Estás listo para hacer push? (y/N)"
    if ($ready -eq 'y' -or $ready -eq 'Y') {
        git push -u origin main
        Write-Host "✅ Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
    } else {
        Write-Host "⏸️ Push cancelado. Puedes ejecutar 'git push -u origin main' manualmente" -ForegroundColor Yellow
    }
}

# Función principal
function Main {
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host "🚀 CyberWallet Platform - GitHub Setup" -ForegroundColor Blue
    Write-Host "========================================" -ForegroundColor Blue
    Write-Host ""
    
    # Verificar Git
    if (-not (Test-GitInstalled)) {
        if (-not (Install-Git)) {
            Write-Host "❌ No se pudo instalar Git. Por favor, instálalo manualmente." -ForegroundColor Red
            return
        }
        
        # Refrescar PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
    
    Write-Host "✅ Git está disponible" -ForegroundColor Green
    
    # Configurar Git
    Setup-Git
    
    # Inicializar repositorio
    Initialize-Repository
    
    # Agregar archivos
    Add-Files
    
    # Hacer commit
    Make-InitialCommit
    
    # Configurar remote
    Setup-Remote
    
    # Subir a GitHub
    Push-ToGitHub
    
    Write-Host ""
    Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
    Write-Host "📖 Revisa SETUP_GITHUB.md para más información" -ForegroundColor Cyan
    Write-Host "🌐 Tu proyecto estará en: https://github.com/andresdesert/cyberwallet-platform" -ForegroundColor Cyan
}

# Ejecutar script
Main 