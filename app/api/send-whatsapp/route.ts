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

    // En producción (Vercel), Puppeteer no funciona debido a limitaciones serverless
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.log('🌐 Detectado entorno de producción - usando modo manual...');
      
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

💡 Copia cada mensaje y pégalo manualmente en WhatsApp Web.
🌐 Abre WhatsApp Web: https://web.whatsapp.com
        `,
        results: contacts.map((contact: any) => ({
          contact: contact.name,
          phone: contact.phone,
          status: 'success',
          message: 'Mensaje generado - Listo para copia manual',
          personalizedMessage: message
            .replace(/\[NOMBRE\]/g, contact.name)
            .replace(/\[PHONE\]/g, contact.phone)
            .replace(/\[EMAIL\]/g, contact.email || '[EMAIL]')
            .replace(/\[COMPANY\]/g, contact.company || '[COMPANY]')
            .replace(/\[NOTES\]/g, contact.notes || '[NOTES]')
            .replace(/\[FECHA\]/g, new Date().toLocaleDateString('es-ES'))
        }))
      }, { status: 200 });
    }

    // Código para desarrollo local - importar Puppeteer solo si no estamos en producción
    const puppeteer = await import('puppeteer');
    console.log('🚀 Iniciando proceso de envío automático...');

    let browser;
    
    try {
      // Intentar lanzar con Chrome del sistema primero
      console.log('🌐 Intentando lanzar Chrome del sistema...');
      browser = await puppeteer.default.launch({
        headless: false,
        defaultViewport: null,
        executablePath: undefined, // Usar Chrome del sistema
        args: [
          '--start-maximized',
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--user-data-dir=./chrome-user-data'
        ],
        timeout: 60000
      });
      console.log('✅ Chrome del sistema lanzado correctamente');
    } catch (systemChromeError) {
      console.log('⚠️ Error con Chrome del sistema, intentando con Chrome descargado de Puppeteer...');
      console.log('Error:', systemChromeError instanceof Error ? systemChromeError.message : 'Error desconocido');
      
      try {
        // Fallback: usar Chrome descargado por Puppeteer
        browser = await puppeteer.default.launch({
          headless: false,
          defaultViewport: null,
          args: [
            '--start-maximized',
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--disable-gpu'
          ],
          timeout: 60000
        });
        console.log('✅ Chrome de Puppeteer lanzado correctamente');
      } catch (puppeteerChromeError) {
        console.error('❌ Error lanzando ambos Chrome:', puppeteerChromeError);
        throw new Error(`Failed to launch browser: ${puppeteerChromeError instanceof Error ? puppeteerChromeError.message : 'Error desconocido'}`);
      }
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
            document.querySelector('div[title="Chat list"]')
          ];
          
          return indicators.some(el => el !== null);
        });

        if (authenticated) {
          console.log('✅ WhatsApp Web autenticado correctamente!');
          isAuthenticated = true;
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 4000));
      } catch (error) {
        console.log(`Error verificando autenticación: ${error}`);
      }
    }

    if (!isAuthenticated) {
      await browser.close();
      throw new Error('Timeout: No se pudo autenticar en WhatsApp Web');
    }

    console.log(`🎯 Iniciando envío a ${contacts.length} contactos...`);

    // Tiempo extra después de la autenticación para que WhatsApp Web se estabilice
    console.log('🔄 Esperando que WhatsApp Web se estabilice completamente...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Cerrar cualquier diálogo o notificación que pueda estar abierto
    try {
      // Buscar y cerrar posibles diálogos/modales
      const possibleDialogs = [
        '[data-testid="modal-close"]',
        '[aria-label*="Close"]',
        '[aria-label*="Cerrar"]',
        'button[title*="Close"]',
        'button[title*="Cerrar"]',
        '.close',
        '[data-icon="x"]'
      ];
      
      for (const selector of possibleDialogs) {
        try {
          const dialog = await page.$(selector);
          if (dialog) {
            console.log(`🗂️ Cerrando diálogo encontrado: ${selector}`);
            await page.click(selector);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (e) {
          // Ignorar errores al buscar diálogos
        }
      }
      
      // Presionar ESC para cerrar cualquier modal abierto
      await page.keyboard.press('Escape');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (dialogError) {
      console.log('ℹ️ No se encontraron diálogos para cerrar');
    }

    // Función para reemplazar variables dinámicas
    const replaceVariables = (template: string, contact: any) => {
      const now = new Date();
      const fecha = now.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      return template
        .replace(/\[NOMBRE\]/g, contact.name || '')
        .replace(/\[PHONE\]/g, contact.phone || '')
        .replace(/\[EMAIL\]/g, contact.email || '')
        .replace(/\[COMPANY\]/g, contact.company || '')
        .replace(/\[NOTES\]/g, contact.notes || '')
        .replace(/\[FECHA\]/g, fecha);
    };

    // Procesar cada contacto
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      try {
        console.log(`📱 [${i + 1}/${contacts.length}] Procesando: ${contact.name}`);
        
        // Generar mensaje personalizado para este contacto
        const personalizedMessage = replaceVariables(message, contact);
        console.log(`📝 Mensaje personalizado generado para ${contact.name}`);
        if (personalizedMessage !== message) {
          console.log(`🔄 Variables reemplazadas: ${message.substring(0, 50)}... -> ${personalizedMessage.substring(0, 50)}...`);
        }
        
        // Para el primer contacto, dar tiempo extra y validaciones adicionales
        const isFirstContact = i === 0;
        if (isFirstContact) {
          console.log('🏁 Este es el PRIMER contacto - aplicando verificaciones adicionales...');
          
          // Verificar que WhatsApp Web sigue funcionando correctamente
          const whatsappReady = await page.evaluate(() => {
            return document.querySelector('#side') !== null || 
                   document.querySelector('[data-testid="chat-list"]') !== null ||
                   document.querySelector('._2Ts6i') !== null;
          });
          
          if (!whatsappReady) {
            console.log('⚠️ WhatsApp Web no está listo, esperando más tiempo...');
            await new Promise(resolve => setTimeout(resolve, 8000));
          }
          
          // Tiempo extra para el primer contacto - muy importante
          console.log('⏳ Tiempo adicional para el primer contacto (10 segundos)...');
          await new Promise(resolve => setTimeout(resolve, 10000));
          
          // Verificar una vez más que está todo listo
          await page.evaluate(() => {
            // Forzar focus en la ventana
            window.focus();
          });
        }

        // Limpiar número de teléfono
        let phone = contact.phone.replace(/[\s\-\(\)\.]/g, '');
        if (!phone.startsWith('+') && !phone.startsWith('52')) {
          phone = '52' + phone;
        } else if (phone.startsWith('+')) {
          phone = phone.substring(1);
        }

        // Ir al chat del contacto
        const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}`;
        console.log(`🔗 Navegando a: ${whatsappUrl}`);
        
        // Para el primer contacto, ser más cuidadoso con la navegación
        if (isFirstContact) {
          console.log('🚀 Primer contacto: Navegación especial...');
          await page.goto(whatsappUrl, { 
            waitUntil: 'networkidle2',
            timeout: 45000 
          });
          // Tiempo extra de espera para el primer contacto
          await new Promise(resolve => setTimeout(resolve, 8000));
        } else {
          await page.goto(whatsappUrl, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
          });
          await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // Buscar campo de mensaje con múltiples selectores
        const messageSelectors = [
          'div[contenteditable="true"][data-tab="10"]',
          'div[contenteditable="true"]',
          '[data-testid="conversation-compose-box-input"]',
          'div[title="Type a message"]'
        ];

        let messageBox = null;
        let usedSelector = '';

        // Para el primer contacto, ser más persistente en la búsqueda
        const maxAttempts = isFirstContact ? 6 : 3;
        const timeoutPerAttempt = isFirstContact ? 8000 : 5000;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          console.log(`🔍 Intento ${attempt}/${maxAttempts} - Buscando campo de mensaje para ${contact.name}...`);
          
          for (const selector of messageSelectors) {
            try {
              messageBox = await page.waitForSelector(selector, { timeout: timeoutPerAttempt });
              if (messageBox) {
                usedSelector = selector;
                console.log(`💬 Campo de mensaje encontrado: ${selector}`);
                break;
              }
            } catch (e) {
              continue;
            }
          }
          
          if (messageBox) break;
          
          // Si no encontramos el campo y no es el último intento
          if (attempt < maxAttempts) {
            console.log(`⏳ Campo no encontrado, esperando antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Para el primer contacto, intentar recargar la página si no encuentra el campo
            if (isFirstContact && attempt === 2) {
              console.log('🔄 Primer contacto: Recargando página para asegurar funcionamiento...');
              await page.reload({ waitUntil: 'networkidle0' });
              await page.goto(whatsappUrl, { 
                waitUntil: 'networkidle0',
                timeout: 30000 
              });
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
        }

        if (!messageBox) {
          // Verificar si es número inválido
          const invalidPage = await page.evaluate(() => {
            return document.body.textContent?.includes('Phone number shared via url is invalid') ||
                   document.body.textContent?.includes('no es válido') ||
                   document.querySelector('[data-testid="invalid-phone-banner"]') !== null;
          });

          if (invalidPage) {
            results.push({
              contact: contact.name,
              phone: contact.phone,
              status: 'error',
              message: 'Número de teléfono inválido'
            });
            continue;
          }

          results.push({
            contact: contact.name,
            phone: contact.phone,
            status: 'error',
            message: 'No se pudo cargar el chat'
          });
          continue;
        }

        // Insertar mensaje completo como un BLOQUE ÚNICO
        console.log(`✍️ Insertando mensaje completo como un solo bloque para ${contact.name}...`);
        
        // Click en el campo de mensaje
        await page.click(usedSelector);
        await new Promise(resolve => setTimeout(resolve, isFirstContact ? 1000 : 500));
        
        // Método directo: Insertar TODO el contenido de una sola vez usando JavaScript
        const messageInserted = await page.evaluate((selector, fullMessage) => {
          const element = document.querySelector(selector) as HTMLElement;
          if (element) {
            // Enfoque el elemento
            element.focus();
            
            // Limpiar contenido previo
            element.innerHTML = '';
            element.textContent = '';
            
            // Crear un evento de input simulado
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/plain', fullMessage);
            
            // Insertar todo el texto como un bloque completo
            document.execCommand('insertText', false, fullMessage);
            
            // Verificar que se insertó correctamente
            const finalContent = element.textContent || element.innerText || '';
            console.log(`📋 Contenido insertado (${finalContent.length} chars):`, finalContent.substring(0, 100) + '...');
            
            return finalContent.trim() === fullMessage.trim();
          }
          return false;
        }, usedSelector, personalizedMessage);
        
        // Si el método JavaScript falló, usar método de clipboard como respaldo
        if (!messageInserted) {
          console.log('🔄 Método JavaScript falló, usando clipboard como respaldo...');
          
          // Copiar mensaje al clipboard
          await page.evaluate(async (text) => {
            await navigator.clipboard.writeText(text);
          }, personalizedMessage);
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Seleccionar todo y pegar
          await page.keyboard.down('Control');
          await page.keyboard.press('KeyA');
          await page.keyboard.up('Control');
          await new Promise(resolve => setTimeout(resolve, 200));
          
          await page.keyboard.down('Control');
          await page.keyboard.press('KeyV');
          await page.keyboard.up('Control');
        }
        
        console.log(`✅ Mensaje personalizado de ${personalizedMessage.length} caracteres insertado como un solo bloque`);
        
        // Validación especial para el primer contacto
        if (isFirstContact) {
          console.log('🔍 Primer contacto: Validando que el mensaje completo se insertó correctamente...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const finalValidation = await page.evaluate((selector, expectedMessage) => {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
              const actualContent = element.textContent || (element as any).innerText || '';
              const match = actualContent.trim() === expectedMessage.trim();
              console.log('✅ Validación final:', match ? 'CORRECTO' : 'ERROR');
              if (!match) {
                console.log('Expected length:', expectedMessage.length);
                console.log('Actual length:', actualContent.length);
              }
              return match;
            }
            return false;
          }, usedSelector, personalizedMessage);
          
          if (!finalValidation) {
            console.log('⚠️ Primer contacto: Reintento final con método directo...');
            await page.click(usedSelector);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await page.evaluate((selector, fullMessage) => {
              const element = document.querySelector(selector) as HTMLElement;
              if (element) {
                element.focus();
                element.innerHTML = '';
                element.textContent = fullMessage;
                
                // Disparar eventos para que WhatsApp detecte el cambio
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }, usedSelector, personalizedMessage);
          }
        }

        // Tiempo de espera antes de enviar
        await new Promise(resolve => setTimeout(resolve, isFirstContact ? 3000 : 1500));

        console.log(`📤 Buscando botón de enviar para ${contact.name}...`);

        // Lista completa de selectores del botón de enviar (más variaciones)
        const sendSelectors = [
          'span[data-icon="send"]',
          'button[data-testid="send"]', 
          '[data-testid="send"]',
          'span[data-testid="send"]',
          'button[aria-label="Enviar"]',
          'button[aria-label="Send"]',
          'div[role="button"][aria-label="Enviar"]',
          'div[role="button"][aria-label="Send"]',
          'span[title="Enviar"]',
          'span[title="Send"]',
          // Selectores más generales para el botón de enviar
          'footer button[type="submit"]',
          'footer div[role="button"]',
          '.compose-btn-send',
          'button:has(span[data-icon="send"])',
          // Buscar por posición en el footer
          'footer span:last-child',
          'div[contenteditable="true"] ~ span[role="button"]'
        ];

        let sent = false;
        const sendAttempts = isFirstContact ? 6 : 4;
        
        for (let attempt = 1; attempt <= sendAttempts; attempt++) {
          console.log(`🔍 Intento ${attempt}/${sendAttempts} - Buscando botón de enviar...`);
          
          // Primero intentar con selectores específicos
          for (const selector of sendSelectors) {
            try {
              const sendButton = await page.$(selector);
              if (sendButton) {
                // Verificar si el botón es visible y clickeable
                const isVisible = await page.evaluate((el) => {
                  if (!el) return false;
                  const rect = el.getBoundingClientRect();
                  return rect.width > 0 && rect.height > 0;
                }, sendButton);
                
                if (isVisible) {
                  console.log(`📤 ¡Botón encontrado! Enviando con selector: ${selector}`);
                  await page.click(selector);
                  await new Promise(resolve => setTimeout(resolve, isFirstContact ? 3000 : 2000));
                  sent = true;
                  break;
                }
              }
            } catch (e) {
              continue;
            }
          }
          
          if (sent) break;
          
          // Si no encuentra el botón con selectores, usar método alternativo
          if (!sent && attempt === Math.floor(sendAttempts / 2)) {
            console.log('🔄 Método alternativo: Buscando botón por coordenadas...');
            try {
              // Buscar cualquier elemento que contenga "send" en su HTML
              const sendButtonFound = await page.evaluate(() => {
                const allElements = document.querySelectorAll('*');
                for (let i = 0; i < allElements.length; i++) {
                  const el = allElements[i];
                  const html = el.innerHTML?.toLowerCase() || '';
                  const role = el.getAttribute('role');
                  const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || '';
                  
                  if ((html.includes('send') || html.includes('enviar') || 
                       ariaLabel.includes('send') || ariaLabel.includes('enviar')) &&
                      (role === 'button' || el.tagName === 'BUTTON' || el.tagName === 'SPAN')) {
                    
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                      (el as HTMLElement).click();
                      return true;
                    }
                  }
                }
                return false;
              });
              
              if (sendButtonFound) {
                console.log('✅ Botón enviado usando método alternativo!');
                sent = true;
                await new Promise(resolve => setTimeout(resolve, 2000));
                break;
              }
            } catch (e) {
              console.log('❌ Método alternativo falló:', e instanceof Error ? e.message : String(e));
            }
          }
          
          // Último recurso: Usar Enter
          if (!sent && attempt === sendAttempts) {
            console.log('🔄 Último recurso: Intentando enviar con Enter...');
            try {
              await page.click(usedSelector); // Asegurar focus en el campo de mensaje
              await new Promise(resolve => setTimeout(resolve, 500));
              await page.keyboard.press('Enter');
              sent = true;
              console.log('✅ Enviado con Enter!');
            } catch (e) {
              console.log('❌ Enter también falló:', e instanceof Error ? e.message : String(e));
            }
          }
          
          if (!sent && attempt < sendAttempts) {
            console.log(`⏳ Botón no encontrado, esperando antes del siguiente intento...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        if (sent) {
          console.log(`✅ Mensaje enviado a ${contact.name}`);
          results.push({
            contact: contact.name,
            phone: contact.phone,
            status: 'success',
            message: 'Mensaje enviado correctamente'
          });
        } else {
          results.push({
            contact: contact.name,
            phone: contact.phone,
            status: 'warning',
            message: 'Mensaje escrito, envío manual necesario'
          });
        }

        // Esperar entre contactos
        if (i < contacts.length - 1) {
          const delay = timingSettings.messageDelay;
          console.log(`⏱️ Esperando ${delay} segundos...`);
          await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }

      } catch (error) {
        console.error(`❌ Error procesando ${contact.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        results.push({
          contact: contact.name,
          phone: contact.phone,
          status: 'error',
          message: errorMessage
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    console.log(`🎉 Proceso completado: ${successCount} exitosos, ${errorCount} errores`);

    return NextResponse.json({
      success: true,
      results: results,
      summary: {
        total: contacts.length,
        success: successCount,
        errors: errorCount
      },
      message: `Proceso completado: ${successCount}/${contacts.length} mensajes enviados. El navegador permanece abierto para revisión.`
    });

  } catch (error) {
    console.error('❌ Error general:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}