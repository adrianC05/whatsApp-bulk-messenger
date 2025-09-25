import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { contacts, message, timingSettings } = await request.json();

    if (!contacts || contacts.length === 0 || !message) {
      return NextResponse.json(
        { error: 'Contactos y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Detectar si estamos en Vercel (serverless) vs entorno con soporte completo
    const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const isProduction = process.env.NODE_ENV === 'production';

    if (isServerless) {
      console.log('🌐 Detectado entorno serverless - usando modo manual...');
      
      return NextResponse.json({
        error: 'Funcionalidad no disponible en entorno serverless',
        message: `
⚠️ LIMITACIÓN DE ENTORNO SERVERLESS ⚠️

La automatización de WhatsApp con Puppeteer requiere un entorno con navegador completo.

🔧 SOLUCIONES PARA AUTOMATIZACIÓN COMPLETA:

1. **Railway.app** (Recomendado): Deploy con soporte completo para Puppeteer
2. **DigitalOcean App Platform**: Usando Dockerfile  
3. **VPS Tradicional**: AWS EC2, DigitalOcean Droplet, etc.
4. **Render.com**: Con configuración de navegador

📱 TUS MENSAJES PERSONALIZADOS:

${contacts.map((contact: any, index: number) => `
────────────────────────────────────
${index + 1}. Para: ${contact.name}
📱 Teléfono: ${contact.phone}
────────────────────────────────────

${message
  .replace(/\[NOMBRE\]/g, contact.name)
  .replace(/\[PHONE\]/g, contact.phone)  
  .replace(/\[EMAIL\]/g, contact.email || '[EMAIL]')
  .replace(/\[COMPANY\]/g, contact.company || '[COMPANY]')
  .replace(/\[NOTES\]/g, contact.notes || '[NOTES]')
  .replace(/\[FECHA\]/g, new Date().toLocaleDateString('es-ES'))
}

`).join('\n')}

💡 Mientras tanto, copia cada mensaje y pégalo manualmente en WhatsApp Web.
🚀 Para automatización completa, considera migrar a Railway o usar Docker.
        `,
        results: contacts.map((contact: any) => ({
          contact: contact.name,
          phone: contact.phone,
          status: 'manual',
          message: 'Mensaje generado - Requiere copia manual',
          personalizedMessage: message
            .replace(/\[NOMBRE\]/g, contact.name)
            .replace(/\[PHONE\]/g, contact.phone)
            .replace(/\[EMAIL\]/g, contact.email || '[EMAIL]')
            .replace(/\[COMPANY\]/g, contact.company || '[COMPANY]')
            .replace(/\[NOTES\]/g, contact.notes || '[NOTES]')
            .replace(/\[FECHA\]/g, new Date().toLocaleDateString('es-ES'))
        })),
        migrationInfo: {
          railway: "https://railway.app - Deploy directo desde GitHub",
          digitalocean: "https://www.digitalocean.com/products/app-platform - Usar Dockerfile",
          render: "https://render.com - Configurar navegador en el build"
        }
      }, { status: 200 });
    }

    // Código para entornos con soporte completo (desarrollo local, VPS, Railway, etc.)
    const puppeteer = await import('puppeteer');
    console.log('🚀 Iniciando proceso de envío automático completo...');

    let browser;
    
    try {
      // Configuración optimizada según el entorno
      const launchOptions = {
        headless: isProduction ? true : false,
        defaultViewport: null,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          ...(isProduction ? [
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-default-apps',
            '--disable-background-networking'
          ] : [
            '--start-maximized'
          ]),
          '--user-data-dir=./chrome-user-data'
        ],
        timeout: 60000
      };

      console.log(`🌐 Lanzando navegador en modo ${isProduction ? 'headless' : 'visible'}...`);
      browser = await puppeteer.default.launch(launchOptions);
      console.log('✅ Navegador lanzado correctamente');
    } catch (launchError) {
      console.error('❌ Error lanzando navegador:', launchError);
      throw new Error(`Failed to launch browser: ${launchError instanceof Error ? launchError.message : 'Error desconocido'}`);
    }

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const results = [];

    // Navegar a WhatsApp Web
    console.log('🌐 Abriendo WhatsApp Web...');
    await page.goto('https://web.whatsapp.com/', { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });

    // Esperar autenticación
    console.log('⏳ Esperando autenticación...');
    let isAuthenticated = false;
    let attempts = 0;
    const maxAttempts = 30;

    while (!isAuthenticated && attempts < maxAttempts) {
      attempts++;
      console.log(`Verificando autenticación... ${attempts}/${maxAttempts}`);

      try {
        // Buscar elementos que indican que está autenticado
        const authenticated = await page.evaluate(() => {
          // Buscar varios indicadores de que WhatsApp está cargado
          const indicators = [
            document.querySelector('#side'),
            document.querySelector('[data-testid="search"]'),
            document.querySelector('._2Ts6i'), // Lista de chats
            document.querySelector('[aria-label*="Chat list"]'),
            document.querySelector('[data-testid="chat-list"]'),
          ];
          return indicators.some(el => el !== null);
        });

        if (authenticated) {
          console.log('✅ Usuario autenticado correctamente');
          isAuthenticated = true;
        } else {
          console.log('⏳ Esperando autenticación...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.log('Error verificando autenticación:', error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!isAuthenticated) {
      await browser.close();
      return NextResponse.json(
        { error: 'No se pudo autenticar en WhatsApp Web. Por favor, escanea el QR code.' },
        { status: 400 }
      );
    }

    // Procesar cada contacto
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      console.log(`📱 Procesando contacto ${i + 1}/${contacts.length}: ${contact.name} (${contact.phone})`);

      try {
        // Personalizar mensaje
        const personalizedMessage = message
          .replace(/\[NOMBRE\]/g, contact.name)
          .replace(/\[PHONE\]/g, contact.phone)
          .replace(/\[EMAIL\]/g, contact.email || '[EMAIL]')
          .replace(/\[COMPANY\]/g, contact.company || '[COMPANY]')
          .replace(/\[NOTES\]/g, contact.notes || '[NOTES]')
          .replace(/\[FECHA\]/g, new Date().toLocaleDateString('es-ES'));

        // Buscar el contacto por teléfono
        const searchBox = await page.waitForSelector('[data-testid="search"] div[contenteditable="true"]', { timeout: 10000 });
        
        if (!searchBox) {
          throw new Error('No se encontró el cuadro de búsqueda');
        }

        // Limpiar búsqueda anterior
        await searchBox.click({ clickCount: 3 });
        await searchBox.type(contact.phone);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar si el contacto existe
        const contactFound = await page.evaluate(() => {
          const chatItems = document.querySelectorAll('[data-testid="chat-list"] > div');
          return chatItems.length > 0;
        });

        if (!contactFound) {
          // Crear nuevo chat
          console.log(`📱 Contacto no encontrado, creando nuevo chat para ${contact.phone}`);
          
          // Navegar directamente a WhatsApp con el número
          const whatsappUrl = `https://web.whatsapp.com/send?phone=${contact.phone.replace(/[^0-9]/g, '')}`;
          await page.goto(whatsappUrl, { waitUntil: 'networkidle0' });
          
          // Esperar que cargue el chat
          await page.waitForSelector('[data-testid="conversation-compose-box-input"]', { timeout: 15000 });
        } else {
          // Hacer clic en el primer resultado
          console.log(`📱 Contacto encontrado: ${contact.name}`);
          await page.click('[data-testid="chat-list"] > div:first-child');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Esperar que aparezca el cuadro de mensaje
        const messageBox = await page.waitForSelector('[data-testid="conversation-compose-box-input"]', { timeout: 10000 });
        
        if (!messageBox) {
          throw new Error('No se encontró el cuadro de mensaje');
        }

        // Escribir mensaje
        console.log(`💬 Escribiendo mensaje personalizado...`);
        await messageBox.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Limpiar y escribir mensaje
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyA');
        await page.keyboard.up('Control');
        
        // Escribir el mensaje línea por línea para manejar saltos de línea
        const messageLines = personalizedMessage.split('\n');
        for (let j = 0; j < messageLines.length; j++) {
          await page.keyboard.type(messageLines[j]);
          if (j < messageLines.length - 1) {
            await page.keyboard.down('Shift');
            await page.keyboard.press('Enter');
            await page.keyboard.up('Shift');
          }
        }

        await new Promise(resolve => setTimeout(resolve, timingSettings.messageDelay * 1000));

        // Enviar mensaje
        console.log(`📤 Enviando mensaje...`);
        await page.keyboard.press('Enter');
        
        // Esperar confirmación de envío
        await new Promise(resolve => setTimeout(resolve, timingSettings.sendDelay * 1000));

        console.log(`✅ Mensaje enviado exitosamente a ${contact.name}`);
        results.push({
          contact: contact.name,
          phone: contact.phone,
          status: 'success',
          message: 'Mensaje enviado correctamente'
        });

        // Pausa entre contactos (excepto el último)
        if (i < contacts.length - 1) {
          console.log(`⏳ Esperando ${timingSettings.chatDelay}s antes del siguiente contacto...`);
          await new Promise(resolve => setTimeout(resolve, timingSettings.chatDelay * 1000));
        }

      } catch (contactError) {
        console.error(`❌ Error enviando mensaje a ${contact.name}:`, contactError);
        results.push({
          contact: contact.name,
          phone: contact.phone,
          status: 'error',
          message: contactError instanceof Error ? contactError.message : 'Error desconocido'
        });
      }
    }

    await browser.close();

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log(`🎉 Proceso completado: ${successCount} exitosos, ${errorCount} errores`);

    return NextResponse.json({
      success: true,
      message: `Proceso completado: ${successCount} mensajes enviados, ${errorCount} errores`,
      results,
      summary: {
        total: contacts.length,
        success: successCount,
        errors: errorCount
      }
    });

  } catch (error) {
    console.error('Error en send-whatsapp:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
