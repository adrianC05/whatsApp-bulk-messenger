# Usar imagen más liviana
FROM node:18-alpine

# Instalar dependencias básicas de Alpine para Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Instalar dependencias adicionales necesarias
RUN apk add --no-cache \
    wget \
    gnupg \
    ca-certificates

WORKDIR /app

# Copiar archivos de dependencias primero (para cache de Docker)
COPY package*.json ./

# Configurar Puppeteer para usar Chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Instalar dependencias Node.js
RUN npm install --omit=dev --legacy-peer-deps

# Copiar código de la aplicación
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Cambiar permisos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Comando de inicio
CMD ["npm", "start"]