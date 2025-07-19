# 🎯 Dockerfile para CyberWallet Backend API
# Build simplificado para desarrollo

FROM maven:3.9.6-eclipse-temurin-17-alpine

# Configurar variables de entorno para Maven
ENV MAVEN_OPTS="-Xmx2048m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Configurar zona horaria
ENV TZ=America/Argentina/Buenos_Aires

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .

# Descargar dependencias (capa separada para cache)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src/ src/

# Compilar aplicación
RUN mvn clean package -DskipTests -B

# Exponer puerto
EXPOSE 8080

# Configurar healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando de inicio
CMD ["java", "-jar", "target/walletapi-0.0.1-SNAPSHOT.jar"] 