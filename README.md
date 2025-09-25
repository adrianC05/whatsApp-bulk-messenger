# 📱 Multi-WhatsApp Bulk Messenger

Sistema avanzado de mensajería masiva para WhatsApp Web con variables dinámicas y personalización automática.

## ✨ Características

- 🔄 **Variables Dinámicas**: `[NOMBRE]`, `[PHONE]`, `[EMAIL]`, `[COMPANY]`, `[NOTES]`, `[FECHA]`
- 📱 **Automatización Completa**: Control de WhatsApp Web via Puppeteer
- 👥 **Gestión de Contactos**: Individual y en lote (CSV)
- 🎯 **Mensajes Personalizados**: Cada contacto recibe su mensaje único
- ⚡ **Envío por Bloques**: Todo el mensaje se envía como una unidad
- 🔍 **Vista Previa**: Ve cómo se verá tu mensaje antes de enviarlo

## 🚀 Despliegue

### Desarrollo Local ✅ (Recomendado)
```bash
npm install
npm run dev
```
**✅ Funcionalidad completa con Puppeteer**

### Producción en Vercel ⚠️ (Limitado)
```bash
vercel --prod
```
**⚠️ Solo genera mensajes para copia manual (sin automatización)**

### Alternativas de Producción 🔧

1. **Railway/DigitalOcean** - Servidores con soporte completo
2. **Desktop App** - Convertir a Electron
3. **Manual** - Usar variables para copiar/pegar

## 📝 Uso de Variables

```
¡Hola [NOMBRE]! 👋

Tenemos una oferta especial para [COMPANY] válida hasta [FECHA].

📧 Responde a [EMAIL] para más información.
📞 Tu número registrado: [PHONE]

Notas: [NOTES]

¡Saludos!
```

## 🛠️ Tecnologías

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático  
- **Tailwind CSS** - Estilos
- **Puppeteer** - Automatización de navegador
- **Radix UI** - Componentes accesibles

## ⚖️ Limitaciones

- **Vercel**: No soporta Puppeteer (serverless)
- **Desarrollo**: Requiere Chrome instalado
- **WhatsApp**: Sujeto a cambios en la interfaz web

---
Desarrollado con ❤️ para automatizar tu comunicación
