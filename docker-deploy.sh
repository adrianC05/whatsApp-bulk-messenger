#!/bin/bash

# WhatsApp Bulk Messenger - Docker Build & Deploy Script
# Uso: ./docker-deploy.sh

set -e

# Configuración
DOCKER_USERNAME="adrianc05"  # Cambia por tu username de Docker Hub
IMAGE_NAME="whatsapp-bulk-messenger"
VERSION="latest"
FULL_IMAGE_NAME="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"

echo "🐳 Iniciando build y deploy de WhatsApp Bulk Messenger..."

# Limpiar builds anteriores
echo "🧹 Limpiando imágenes anteriores..."
docker rmi $FULL_IMAGE_NAME 2>/dev/null || true

# Build de la imagen
echo "🔨 Construyendo imagen Docker..."
docker build -t $FULL_IMAGE_NAME .

# Verificar que la imagen se construyó
echo "✅ Imagen construida: $FULL_IMAGE_NAME"
docker images | grep $IMAGE_NAME

# Push a Docker Hub
echo "📤 Subiendo imagen a Docker Hub..."
docker push $FULL_IMAGE_NAME

echo "🎉 Deploy completado!"
echo "📋 Tu imagen está disponible en: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME"
echo ""
echo "🚀 Para deployar en cualquier plataforma, usa:"
echo "   docker run -p 3000:3000 $FULL_IMAGE_NAME"
echo ""
echo "🌐 Plataformas compatibles:"
echo "   - DigitalOcean App Platform"
echo "   - Railway.app"
echo "   - Render.com"
echo "   - Google Cloud Run"
echo "   - AWS ECS"
echo "   - Azure Container Instances"