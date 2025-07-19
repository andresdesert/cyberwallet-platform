# 🚀 Dockerfile simplificado para CyberWallet Frontend
# Usa build local para evitar problemas de crypto

FROM nginx:alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

# Configurar zona horaria
ENV TZ=America/Argentina/Buenos_Aires

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos localmente
COPY dist/ /usr/share/nginx/html/

# Crear directorio para logs y cambiar ownership
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run /usr/share/nginx/html /etc/nginx/conf.d

# Exponer puerto
EXPOSE 80

# Configurar healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"] 