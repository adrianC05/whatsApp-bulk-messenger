// Script de automatización para WhatsApp Web
// Este script se ejecutará en el contexto de WhatsApp Web

(function() {
    console.log('🚀 WhatsApp Automation Script Loaded');
    
    // Función para encontrar y hacer clic en el botón de enviar
    function findAndClickSendButton() {
        const sendSelectors = [
            'button[data-testid="send"]',
            'button[aria-label*="Send"]',
            'button[aria-label*="Enviar"]',
            'span[data-testid="send"]',
            'button[title*="Send"]',
            'button[title*="Enviar"]',
            'button[tabindex="3"]',
            'footer button[tabindex="3"]',
            '[data-icon="send"]'
        ];

        for (let selector of sendSelectors) {
            const button = document.querySelector(selector);
            if (button && button.offsetParent !== null && !button.disabled) {
                console.log('✅ Botón de enviar encontrado:', selector);
                button.click();
                return true;
            }
        }

        // Intentar con Enter como alternativa
        const messageInput = document.querySelector('[contenteditable="true"][data-tab="10"]') || 
                           document.querySelector('div[contenteditable="true"]');
        
        if (messageInput && messageInput.textContent.trim().length > 0) {
            console.log('📝 Enviando mensaje con Enter...');
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                which: 13,
                keyCode: 13,
                bubbles: true,
                cancelable: true
            });
            messageInput.dispatchEvent(enterEvent);
            return true;
        }

        return false;
    }

    // Función para esperar que aparezca el botón de enviar
    function waitForSendButton(maxAttempts = 20, interval = 1000) {
        return new Promise((resolve) => {
            let attempts = 0;
            
            const checkForButton = () => {
                attempts++;
                console.log(`🔍 Buscando botón de enviar... Intento ${attempts}/${maxAttempts}`);
                
                if (findAndClickSendButton()) {
                    console.log('🎉 ¡Mensaje enviado exitosamente!');
                    resolve(true);
                    return;
                }
                
                if (attempts < maxAttempts) {
                    setTimeout(checkForButton, interval);
                } else {
                    console.log('❌ No se encontró el botón de enviar después de', maxAttempts, 'intentos');
                    resolve(false);
                }
            };
            
            checkForButton();
        });
    }

    // Función para verificar si WhatsApp está cargado
    function isWhatsAppLoaded() {
        const indicators = [
            document.querySelector('#side'),
            document.querySelector('[data-testid="search"]'),
            document.querySelector('._2Ts6i'),
            document.querySelector('[aria-label*="Chat list"]'),
            document.querySelector('div[title="Chat list"]')
        ];
        
        return indicators.some(el => el !== null);
    }

    // Función principal de automatización
    async function automateMessage() {
        console.log('🤖 Iniciando automatización...');
        
        // Verificar que WhatsApp esté cargado
        if (!isWhatsAppLoaded()) {
            console.log('⚠️ WhatsApp Web no está completamente cargado');
            return false;
        }

        // Esperar un poco para asegurar que la página esté lista
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Buscar y hacer clic en el botón de enviar
        const success = await waitForSendButton();
        
        if (success) {
            console.log('✅ Mensaje enviado correctamente');
            // Notificar al parent window si existe
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'MESSAGE_SENT',
                    success: true,
                    timestamp: new Date().toISOString()
                }, '*');
            }
        } else {
            console.log('❌ Error: No se pudo enviar el mensaje');
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'MESSAGE_SENT',
                    success: false,
                    timestamp: new Date().toISOString()
                }, '*');
            }
        }
        
        return success;
    }

    // Escuchar mensajes del parent window
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'EXECUTE_AUTOMATION') {
            console.log('📨 Recibida solicitud de automatización');
            automateMessage();
        }
    });

    // Auto-ejecutar si se detecta que hay un mensaje listo para enviar
    function autoExecuteIfReady() {
        const messageInput = document.querySelector('[contenteditable="true"][data-tab="10"]');
        const sendButton = document.querySelector('button[data-testid="send"]');
        
        if (messageInput && messageInput.textContent.trim().length > 0 && sendButton && !sendButton.disabled) {
            console.log('🎯 Mensaje detectado, ejecutando automatización...');
            setTimeout(automateMessage, 1000);
        }
    }

    // Observar cambios en la página para detectar cuando hay un mensaje listo
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Verificar si apareció el botón de enviar
                const sendButton = document.querySelector('button[data-testid="send"]');
                if (sendButton && !sendButton.disabled) {
                    // Esperar un momento y luego ejecutar
                    setTimeout(autoExecuteIfReady, 2000);
                }
            }
        });
    });

    // Iniciar observación
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('🎯 WhatsApp Automation Script initialized');
})();