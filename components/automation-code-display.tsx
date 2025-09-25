"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Play } from "lucide-react"

interface AutomationCodeDisplayProps {
  contacts: Array<{ id: string; name: string; phone: string }>
  message: string
  timingSettings: {
    chatDelay: number
    imageDelay: number
    sendDelay: number
    messageDelay: number
  }
  onClose: () => void
}

export function AutomationCodeDisplay({
  contacts,
  message,
  timingSettings,
  onClose
}: AutomationCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const automationCode = `// 🚀 CÓDIGO DE AUTOMATIZACIÓN PARA WHATSAPP WEB
// INSTRUCCIONES:
// 1. Ve a WhatsApp Web (https://web.whatsapp.com)
// 2. Asegúrate de estar autenticado
// 3. Presiona F12 para abrir Developer Tools
// 4. Ve a la pestaña "Console"
// 5. Copia y pega este código completo
// 6. Presiona Enter para ejecutar
// 7. ¡El proceso será completamente automático!

(async function() {
  console.log('🚀 Iniciando WhatsApp Bulk Messenger - Automatización Completa');
  console.log('📋 Desarrollado para envío masivo inteligente');
  
  const contacts = ${JSON.stringify(contacts, null, 2)};
  const message = ${JSON.stringify(message)};
  const timingSettings = ${JSON.stringify(timingSettings, null, 2)};
  
  console.log(\`📊 Configuración del envío:
  📱 Contactos: \${contacts.length}
  💬 Mensaje: "\${message.substring(0, 50)}\${message.length > 50 ? '...' : ''}"
  ⏱️ Delay entre chats: \${timingSettings.chatDelay}s
  📤 Delay entre mensajes: \${timingSettings.messageDelay}s\`);

  // Función para esperar
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Función para limpiar números de teléfono
  const cleanPhone = (phone) => {
    let clean = phone.replace(/[^\\d]/g, '');
    if (!clean.startsWith('52') && !clean.startsWith('+52')) {
      clean = '52' + clean;
    }
    return clean.replace('+', '');
  };

  // Función para encontrar y hacer clic en el botón de enviar
  const findAndClickSend = async () => {
    console.log('🔍 Buscando botón de enviar...');
    
    const selectors = [
      'button[data-testid="send"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="Enviar"]',
      'span[data-testid="send"]',
      '[data-icon="send"]',
      'button[title*="Send"]',
      'button[title*="Enviar"]',
      'footer button[tabindex="3"]'
    ];

    for (let attempt = 0; attempt < 30; attempt++) {
      // Buscar botón de enviar
      for (let selector of selectors) {
        const btn = document.querySelector(selector);
        if (btn && !btn.disabled && btn.offsetParent) {
          console.log(\`✅ Botón encontrado con selector: \${selector}\`);
          btn.click();
          await wait(1000);
          return true;
        }
      }
      
      // Intentar con Enter en el campo de mensaje
      const input = document.querySelector('[contenteditable="true"][data-tab="10"]');
      if (input && input.textContent && input.textContent.trim().length > 0) {
        console.log('📝 Intentando enviar con Enter...');
        
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        
        input.dispatchEvent(enterEvent);
        await wait(2000);
        
        // Verificar si el mensaje se envió (campo vacío)
        if (!input.textContent.trim()) {
          console.log('✅ Mensaje enviado con Enter');
          return true;
        }
      }
      
      console.log(\`⏳ Intento \${attempt + 1}/30 - Esperando botón de enviar...\`);
      await wait(1000);
    }
    
    console.log('❌ No se pudo encontrar el botón de enviar después de 30 intentos');
    return false;
  };

  // Verificar que WhatsApp esté cargado
  const checkWhatsAppLoaded = () => {
    const indicators = [
      document.querySelector('#side'),
      document.querySelector('[data-testid="search"]'),
      document.querySelector('._2Ts6i')
    ];
    return indicators.some(el => el !== null);
  };

  if (!checkWhatsAppLoaded()) {
    alert('⚠️ ERROR: WhatsApp Web no está completamente cargado.\\n\\n🔧 SOLUCIÓN:\\n1. Asegúrate de estar en https://web.whatsapp.com\\n2. Verifica que estés autenticado\\n3. Espera que cargue completamente\\n4. Vuelve a ejecutar este código');
    return;
  }

  console.log('✅ WhatsApp Web detectado correctamente');
  console.log('🎯 Iniciando proceso de envío masivo...');

  let successCount = 0;
  let errorCount = 0;

  // Procesar cada contacto
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const progress = \`[\${i + 1}/\${contacts.length}]\`;
    
    console.log(\`\\n📱 \${progress} Procesando: \${contact.name} (\${contact.phone})\`);
    
    try {
      // Limpiar número y crear URL
      const phone = cleanPhone(contact.phone);
      const encodedMessage = encodeURIComponent(message);
      const url = \`https://web.whatsapp.com/send?phone=\${phone}&text=\${encodedMessage}\`;
      
      console.log(\`🔗 Navegando al chat...\`);
      
      // Navegar al contacto
      window.location.href = url;
      
      // Esperar que cargue la conversación
      console.log(\`⏳ Esperando que cargue el chat...\`);
      await wait(6000);
      
      console.log(\`📤 Intentando enviar mensaje...\`);
      
      // Intentar enviar el mensaje
      const success = await findAndClickSend();
      
      if (success) {
        successCount++;
        console.log(\`✅ \${progress} ¡Mensaje enviado exitosamente a \${contact.name}!\`);
      } else {
        errorCount++;
        console.log(\`❌ \${progress} Error: No se pudo enviar mensaje a \${contact.name}\`);
      }
      
      // Esperar antes del siguiente contacto (solo si no es el último)
      if (i < contacts.length - 1) {
        const delay = (timingSettings.chatDelay + timingSettings.messageDelay) * 1000;
        console.log(\`⏸️ Esperando \${delay/1000} segundos antes del siguiente contacto...\`);
        await wait(delay);
      }
      
    } catch (error) {
      errorCount++;
      console.error(\`❌ \${progress} Error procesando \${contact.name}:\`, error);
    }
  }
  
  console.log(\`\\n🎉 ¡PROCESO COMPLETADO!\\n📊 Resumen:\\n✅ Exitosos: \${successCount}\\n❌ Errores: \${errorCount}\\n📱 Total: \${contacts.length}\`);
  
  const summary = \`🎉 ¡Automatización WhatsApp completada!\\n\\n📊 RESUMEN FINAL:\\n✅ Mensajes enviados: \${successCount}\\n❌ Errores: \${errorCount}\\n📱 Total contactos: \${contacts.length}\\n\\n¿Todo correcto? Revisa tus conversaciones en WhatsApp.\`;
  
  alert(summary);
  
})();`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(automationCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback para navegadores que no soporten clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = automationCode
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openWhatsApp = () => {
    window.open('https://web.whatsapp.com', '_blank')
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-6 w-6 text-green-600" />
          Código de Automatización - Mismo Navegador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Badge variant="secondary">
            📱 {contacts.length} contactos
          </Badge>
          <Badge variant="secondary">
            💬 {message.length} caracteres
          </Badge>
          <Badge variant="secondary">
            ⏱️ {timingSettings.chatDelay}s delay
          </Badge>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📋 Instrucciones (Muy fácil):
          </h3>
          <ol className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
            <li><strong>1.</strong> Haz clic en "Abrir WhatsApp Web" para abrir en nueva pestaña</li>
            <li><strong>2.</strong> Asegúrate de estar autenticado (escanear QR si es necesario)</li>
            <li><strong>3.</strong> Presiona <kbd className="bg-blue-200 dark:bg-blue-800 px-1 rounded">F12</kbd> para abrir Developer Tools</li>
            <li><strong>4.</strong> Ve a la pestaña <strong>"Console"</strong></li>
            <li><strong>5.</strong> Haz clic en "Copiar Código" y pega en la consola</li>
            <li><strong>6.</strong> Presiona <kbd className="bg-blue-200 dark:bg-blue-800 px-1 rounded">Enter</kbd> - ¡Se ejecutará automáticamente!</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <Button onClick={openWhatsApp} className="flex-1" variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir WhatsApp Web
          </Button>
          <Button onClick={copyToClipboard} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "¡Copiado!" : "Copiar Código"}
          </Button>
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border">
          <div className="text-xs font-mono max-h-60 overflow-y-auto whitespace-pre-wrap">
            {automationCode}
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border">
          <p className="text-green-800 dark:text-green-200 text-sm">
            <strong>✅ Ventajas de este método:</strong> Funciona en el mismo navegador, sin restricciones CORS, 
            100% automático una vez ejecutado, usa tu sesión actual de WhatsApp Web.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}