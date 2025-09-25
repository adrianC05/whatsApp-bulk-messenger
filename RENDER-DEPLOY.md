# 🎨 Deploy en Render.com con Docker

## 📋 Pasos para deploy:

### **1. Tu imagen Docker está lista:**
```
adriancarrion14/whatsapp-bulk-messenger:latest
```

### **2. Proceso de deploy en Render.com:**

#### **Paso 1: Ir a Render.com**
1. Ve a [render.com](https://render.com)
2. Crea cuenta / Login
3. Click en **"New +"**
4. Selecciona **"Web Service"**

#### **Paso 2: Configuración del servicio**
- **Source:** Docker Hub
- **Image URL:** `adriancarrion14/whatsapp-bulk-messenger:latest`
- **Name:** `whatsapp-bulk-messenger`
- **Plan:** Free (0$/month)

#### **Paso 3: Configuración avanzada**
```yaml
# Auto-deployed from Docker Hub
name: whatsapp-bulk-messenger
type: web
env: docker
dockerCommand: npm start
plan: free
region: oregon
buildFilter:
  paths:
  - "**"
envVars:
- key: NODE_ENV
  value: production
- key: PUPPETEER_EXECUTABLE_PATH
  value: /usr/bin/chromium-browser
- key: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
  value: "true"
```

## ⚙️ **Variables de entorno necesarias:**

En la sección "Environment Variables" de Render, agregar:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium-browser` |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | `true` |

## 🚀 **Después del deploy:**

✅ Tu aplicación estará disponible en: `https://tu-app-name.onrender.com`
✅ **Envío completamente automático** con Puppeteer
✅ Chrome/Chromium instalado y funcionando
✅ SSL automático incluido
✅ Monitoreo y logs integrados

## 📊 **Ventajas de Render + Docker:**

| Característica | Estado |
|----------------|--------|
| **Costo** | 🆓 Gratis |
| **Puppeteer** | ✅ Funciona |
| **Escalabilidad** | ✅ Automática |
| **SSL** | ✅ Incluido |
| **Logs** | ✅ En tiempo real |
| **Tiempo de deploy** | ⏱️ ~5 minutos |

## 🔧 **Si hay problemas:**

### **Error de memoria:**
- Upgrade al plan Starter ($7/mes) para más RAM

### **Error de timeout:**
- Puppeteer ya está configurado para modo headless
- Los timeouts están optimizados

### **Error de Chrome:**
- La imagen usa Chromium de Alpine (más ligero)
- Variables de entorno configuradas correctamente

## 📱 **Prueba local antes del deploy:**

```bash
# Ejecutar tu imagen localmente
docker run -p 3000:3000 -e NODE_ENV=production adriancarrion14/whatsapp-bulk-messenger:latest

# Abrir en navegador
# http://localhost:3000
```

## 🎯 **Siguiente paso:**

1. Espera a que termine el build de Docker
2. Ve a render.com 
3. New Web Service → Docker Hub
4. Usa tu imagen: `adriancarrion14/whatsapp-bulk-messenger:latest`
5. ¡Deploy automático!

¿Necesitas ayuda con algún paso específico?