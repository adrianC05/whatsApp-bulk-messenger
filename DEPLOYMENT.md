# 🚀 WhatsApp Bulk Messenger - Deploy Automático

## ⚠️ Importante: Vercel no soporta Puppeteer

Vercel es un entorno serverless que **NO PUEDE** ejecutar navegadores como Chrome/Puppeteer.

## 🎯 Soluciones para Envío Automático

### 1. 🚂 Railway.app (RECOMENDADO)

**Ventajas:**
- ✅ Deploy automático desde GitHub
- ✅ Soporte completo para Puppeteer  
- ✅ Configuración cero
- ✅ Plan gratuito disponible

**Pasos:**
1. Ve a [Railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Selecciona este repositorio
4. ¡Deploy automático!

### 2. 🎨 Render.com  

**Ventajas:**
- ✅ Plan gratuito generoso
- ✅ Soporte para Puppeteer
- ✅ SSL automático

**Pasos:**
1. Ve a [Render.com](https://render.com)
2. Conecta GitHub → "New Web Service"
3. Configuración:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV=production`
     - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false`

### 3. 🐳 DigitalOcean App Platform

**Ventajas:**
- ✅ Soporte completo para Docker
- ✅ Escalable
- ✅ $5/mes

**Pasos:**
1. Ve a [DigitalOcean Apps](https://www.digitalocean.com/products/app-platform)
2. Conecta GitHub
3. Usa el Dockerfile incluido
4. Deploy automático

### 4. 🖥️ VPS Tradicional (Para expertos)

**Opciones:**
- AWS EC2
- DigitalOcean Droplet  
- Google Cloud VM
- Linode

## 🔧 Configuración Local (Siempre funciona)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/whatsapp-bulk-messenger
cd whatsapp-bulk-messenger

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📊 Comparación de Plataformas

| Plataforma | Puppeteer | Gratuito | Facilidad | Recomendado |
|------------|-----------|----------|-----------|-------------|
| **Railway** | ✅ | ✅ | 🟢 Fácil | 🥇 SÍ |
| **Render** | ✅ | ✅ | 🟢 Fácil | 🥈 SÍ |
| **DigitalOcean** | ✅ | ❌ $5/mes | 🟡 Medio | 🥉 SÍ |
| **Vercel** | ❌ | ✅ | 🟢 Fácil | ❌ NO |

## 🎮 Funcionalidades

### Automático (Railway/Render/VPS):
- 🤖 Envío completamente automático
- 🌐 Abre WhatsApp Web automáticamente
- ⏱️ Delays configurables
- 📊 Reportes detallados
- 🔄 Reintento automático en errores

### Manual (Vercel):
- 📝 Genera mensajes personalizados
- 📋 Copia fácil con un clic
- 🔗 Enlace directo a WhatsApp Web
- 📱 Variables dinámicas reemplazadas

## 🚀 Deploy Rápido

### Railway (1 minuto):
```bash
# 1. Fork este repositorio
# 2. Ve a railway.app
# 3. "Deploy from GitHub"
# 4. Selecciona tu fork
# 5. ¡Listo!
```

### Render (2 minutos):
```bash
# 1. Fork este repositorio  
# 2. Ve a render.com
# 3. "New Web Service" → GitHub
# 4. Configurar variables (ver arriba)
# 5. Deploy
```

## 🐛 Troubleshooting

### Error: "Failed to launch browser"
- ✅ **Solución:** Migra a Railway/Render
- ❌ **No funciona en:** Vercel, Netlify, AWS Lambda

### Error: "Timeout waiting for authentication"
- ✅ Asegúrate de escanear el QR rápidamente
- ✅ Usa WhatsApp Web en el mismo navegador

### Error: "Contact not found"
- ✅ Verifica el formato del número: +1234567890
- ✅ Incluye código de país

## 💡 Recomendación Final

**Para envío automático:** Usa **Railway.app** - es gratis, fácil y funciona perfectamente con Puppeteer.

**Para desarrollo:** Ejecuta localmente con `npm run dev`.

**Para producción empresarial:** Usa DigitalOcean con Docker.

---

¿Necesitas ayuda? Abre un issue en GitHub.