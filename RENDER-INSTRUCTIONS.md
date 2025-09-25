# 🎨 INSTRUCCIONES EXACTAS para Render.com

## 🚀 **Paso a Paso Detallado:**

### **Paso 1: Preparar la imagen Docker**

Tu imagen ya está lista: `adriancarrion14/whatsapp-bulk-messenger:latest`

### **Paso 2: Configurar en Render.com**

1. **Ve a [render.com](https://render.com)**
2. **Regístrate/Login** con GitHub (recomendado)
3. **Click en "New +"** (botón morado)
4. **Selecciona "Web Service"**

### **Paso 3: Configuración del servicio**

#### **En "Deploy" tab:**
- **Source:** `Docker Hub`
- **Image:** `adriancarrion14/whatsapp-bulk-messenger:latest`

#### **En "Details" tab:**
- **Name:** `whatsapp-bulk-messenger` (o el que prefieras)
- **Region:** `Oregon` (más rápido para Latam)
- **Plan:** `Free` 

#### **En "Environment Variables" tab:**
Agregar estas 3 variables:

```
NODE_ENV = production
PUPPETEER_EXECUTABLE_PATH = /usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
```

#### **En "Advanced" tab:**
- **Port:** `3000`
- **Health Check Path:** `/`

### **Paso 4: Deploy**
1. **Click "Create Web Service"**
2. **Esperar ~5-10 minutos** para el primer deploy
3. **Tu app estará en:** `https://tu-nombre-app.onrender.com`

## ✅ **Verificación post-deploy:**

### **1. Verificar que la app carga:**
- Abre la URL de tu app
- Deberías ver la interfaz de WhatsApp Bulk Messenger

### **2. Verificar logs:**
- En Render dashboard → tu servicio → "Logs"
- Deberías ver: "Server running on port 3000"

### **3. Probar funcionalidad:**
- Agregar algunos contactos
- Escribir mensaje con variables: `Hola [NOMBRE]`
- Click "Enviar Mensajes"
- Debería funcionar automáticamente con Puppeteer

## 🔧 **Si hay problemas:**

### **Error "Failed to launch browser":**
```yaml
# Agregar estas variables adicionales:
DISPLAY = :99
XVFB = true
```

### **Error de memoria:**
- Upgrade al plan Starter ($7/mes)
- Más RAM para Puppeteer

### **Error de timeout:**
- Los timeouts ya están configurados
- El modo headless está activado

## 📊 **Configuración óptima para Render:**

```yaml
# render.yaml (opcional, para automatizar)
services:
  - type: web
    name: whatsapp-bulk-messenger
    env: docker
    dockerfilePath: ./Dockerfile
    plan: free
    region: oregon
    envVars:
      - key: NODE_ENV
        value: production
      - key: PUPPETEER_EXECUTABLE_PATH
        value: /usr/bin/chromium-browser
      - key: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
        value: "true"
```

## 🎯 **Resultado final:**

✅ **URL pública:** `https://tu-app.onrender.com`
✅ **Envío automático:** Puppeteer funcionando
✅ **SSL:** Incluido automáticamente  
✅ **Escalabilidad:** Automática
✅ **Logs:** En tiempo real
✅ **Costo:** $0/mes en plan gratuito

## 📱 **Usar tu aplicación:**

1. **Abrir:** `https://tu-app.onrender.com`
2. **Agregar contactos** en la pestaña "Contactos"
3. **Escribir mensaje** con variables dinámicas
4. **Configurar tiempos** si necesitas
5. **Click "Enviar Mensajes"**
6. **¡Automático!** Puppeteer hará todo el trabajo

¿Listo para hacer el deploy? ¡Te asistimos en el proceso!