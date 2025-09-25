import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { contacts, message } = await request.json();

    // En producción (Vercel), Puppeteer no funciona debido a limitaciones serverless
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        error: 'Funcionalidad no disponible en producción',
        message: `
⚠️ LIMITACIÓN DE VERCEL ⚠️

La automatización de WhatsApp con Puppeteer no funciona en entornos serverless como Vercel debido a:

• No se pueden ejecutar procesos de navegador persistentes
• Limitaciones de tiempo de ejecución (10-15 segundos máximo)
• No hay acceso al sistema de archivos para Chrome

🔧 SOLUCIONES ALTERNATIVAS:

1. **Desarrollo Local**: Funciona perfectamente en tu máquina
2. **VPS/Servidor Dedicado**: Deploy en Railway, DigitalOcean, etc.
3. **Desktop App**: Convertir a app Electron
4. **Manual**: Usar las variables dinámicas para copiar/pegar mensajes

📱 TU MENSAJE PERSONALIZADO SERÍA:

${contacts.map((contact: any, index: number) => `
${index + 1}. Para ${contact.name} (${contact.phone}):
${message
  .replace(/\[NOMBRE\]/g, contact.name)
  .replace(/\[PHONE\]/g, contact.phone)
  .replace(/\[EMAIL\]/g, contact.email || '[EMAIL]')
  .replace(/\[COMPANY\]/g, contact.company || '[COMPANY]')
  .replace(/\[NOTES\]/g, contact.notes || '[NOTES]')
  .replace(/\[FECHA\]/g, new Date().toLocaleDateString('es-ES'))}
`).join('\n')}

💡 Puedes copiar estos mensajes y pegarlos manualmente en WhatsApp.
        `,
        results: contacts.map((contact: any) => ({
          contact: contact.name,
          phone: contact.phone,
          status: 'info',
          message: 'Mensaje generado para copia manual'
        }))
      }, { status: 200 });
    }

    // Código original para desarrollo local (mantener intacto)
    const puppeteer = require('puppeteer');
    
    // ... resto del código original de Puppeteer aquí ...
    
  } catch (error) {
    console.error('Error en send-whatsapp:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}