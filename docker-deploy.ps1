# WhatsApp Bulk Messenger - Docker Build & Deploy Script (PowerShell)
# Uso: .\docker-deploy.ps1

$ErrorActionPreference = "Stop"

# Configuración
$DOCKER_USERNAME = "adriancarrion14"  # Tu username de Docker Hub
$IMAGE_NAME = "whatsapp-bulk-messenger"
$VERSION = "latest"
$FULL_IMAGE_NAME = "$DOCKER_USERNAME/$IMAGE_NAME`:$VERSION"

Write-Host "🐳 Iniciando build y deploy de WhatsApp Bulk Messenger..." -ForegroundColor Green

# Limpiar builds anteriores
Write-Host "🧹 Limpiando imágenes anteriores..." -ForegroundColor Yellow
try {
    docker rmi $FULL_IMAGE_NAME
} catch {
    Write-Host "No hay imágenes anteriores para limpiar" -ForegroundColor Gray
}

# Build de la imagen
Write-Host "🔨 Construyendo imagen Docker..." -ForegroundColor Blue
docker build -t $FULL_IMAGE_NAME .

# Verificar que la imagen se construyó
Write-Host "✅ Imagen construida: $FULL_IMAGE_NAME" -ForegroundColor Green
docker images | Select-String $IMAGE_NAME

# Push a Docker Hub
Write-Host "📤 Subiendo imagen a Docker Hub..." -ForegroundColor Cyan
docker push $FULL_IMAGE_NAME

Write-Host "🎉 Deploy completado!" -ForegroundColor Green
Write-Host "📋 Tu imagen estará disponible en: https://hub.docker.com/r/$DOCKER_USERNAME/$IMAGE_NAME" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para deployar en cualquier plataforma, usa:" -ForegroundColor Yellow
Write-Host "   docker run -p 3000:3000 $FULL_IMAGE_NAME" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Plataformas compatibles:" -ForegroundColor Yellow
Write-Host "   - DigitalOcean App Platform" -ForegroundColor White
Write-Host "   - Railway.app" -ForegroundColor White
Write-Host "   - Render.com" -ForegroundColor White
Write-Host "   - Google Cloud Run" -ForegroundColor White
Write-Host "   - AWS ECS" -ForegroundColor White
Write-Host "   - Azure Container Instances" -ForegroundColor White