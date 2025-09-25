"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Settings, Users, ImageIcon, FileText, Play, Square, Copy } from "lucide-react"
import { ContactManager } from "@/components/contact-manager"
import { MessageTemplates } from "@/components/message-templates"
import { TimingSettings } from "@/components/timing-settings"
import { SendingProgress } from "@/components/sending-progress"

export default function WhatsAppBulkMessenger() {
  const [contacts, setContacts] = useState<Array<{ 
    id: string; 
    name: string; 
    phone: string; 
    email?: string; 
    company?: string; 
    notes?: string; 
  }>>([])
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [currentProgress, setCurrentProgress] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [timingSettings, setTimingSettings] = useState({
    chatDelay: 2,
    imageDelay: 3,
    sendDelay: 1,
    messageDelay: 2,
  })

  // Función para generar vista previa del mensaje
  const generatePreview = (template: string, contact: any) => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return template
      .replace(/\[NOMBRE\]/g, contact?.name || '[NOMBRE]')
      .replace(/\[PHONE\]/g, contact?.phone || '[PHONE]')
      .replace(/\[EMAIL\]/g, contact?.email || '[EMAIL]')
      .replace(/\[COMPANY\]/g, contact?.company || '[COMPANY]')
      .replace(/\[NOTES\]/g, contact?.notes || '[NOTES]')
      .replace(/\[FECHA\]/g, fecha);
  };

  // Solo mantenemos la función para Chrome Separado
  const handleSendMessagesAutomatic = async () => {
    if (contacts.length === 0 || !message.trim()) {
      alert("Por favor, agregue contactos y escriba un mensaje")
      return
    }

    setIsSending(true)
    setCurrentProgress("Iniciando proceso...")

    try {
      const response = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts,
          message,
          timingSettings
        }),
      })

      const result = await response.json()

      if (response.ok) {
          if (result.error && result.error.includes('Funcionalidad no disponible en entorno serverless')) {
            // Modo producción - mostrar mensajes personalizados Y opciones de deploy
            setCurrentProgress("⚠️ Entorno serverless detectado - Ver opciones de automatización")
            
            // Crear ventana emergente con opciones de migración y mensajes
            const newWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes')
            if (newWindow) {
              newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>WhatsApp Bulk Messenger - Opciones de Automatización</title>
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; line-height: 1.6; background: #f5f5f5; }
                      .container { max-width: 800px; margin: 0 auto; }
                      .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
                      .deployment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                      .option-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid transparent; transition: all 0.3s ease; }
                      .option-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
                      .option-card.recommended { border-color: #10b981; }
                      .option-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
                      .option-header h3 { margin: 0; color: #333; }
                      .badge { background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                      .badge.free { background: #3b82f6; }
                      .badge.paid { background: #f59e0b; }
                      .deploy-btn { 
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; 
                        border: none; 
                        padding: 12px 24px; 
                        border-radius: 8px; 
                        cursor: pointer; 
                        font-weight: bold;
                        text-decoration: none;
                        display: inline-block;
                        margin-top: 15px;
                        transition: all 0.3s ease;
                      }
                      .deploy-btn:hover { transform: scale(1.05); }
                      .manual-section { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                      .message-block { 
                        background: #f8fafc; 
                        padding: 15px; 
                        margin: 10px 0; 
                        border-radius: 8px; 
                        border-left: 4px solid #25D366;
                      }
                      .copy-btn { 
                        background: #25D366; 
                        color: white; 
                        border: none; 
                        padding: 8px 15px; 
                        cursor: pointer; 
                        border-radius: 4px; 
                        margin-top: 10px;
                        transition: all 0.3s ease;
                      }
                      .copy-btn:hover { background: #20c157; transform: scale(1.05); }
                      .contact-header { 
                        font-weight: bold; 
                        color: #333; 
                        margin-bottom: 10px; 
                        font-size: 16px;
                      }
                      .pro-tip { background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="hero">
                        <h1>🚀 WhatsApp Bulk Messenger</h1>
                        <p>Tu aplicación está en un entorno serverless que no soporta navegadores.</p>
                        <p><strong>¡Pero tenemos soluciones automáticas para ti!</strong></p>
                      </div>
                      
                      <h2>🎯 Opciones para Envío Automático Completo</h2>
                      
                      <div class="deployment-options">
                        <div class="option-card recommended">
                          <div class="option-header">
                            <h3>🚂 Railway.app</h3>
                            <span class="badge">RECOMENDADO</span>
                            <span class="badge free">GRATIS</span>
                          </div>
                          <ul>
                            <li>✅ Deploy en 30 segundos</li>
                            <li>✅ Soporte completo para Puppeteer</li>
                            <li>✅ Configuración automática</li>
                            <li>✅ Plan gratuito generoso</li>
                          </ul>
                          <a href="https://railway.app" target="_blank" class="deploy-btn">🚀 Deploy en Railway</a>
                        </div>
                        
                        <div class="option-card">
                          <div class="option-header">
                            <h3>🎨 Render.com</h3>
                            <span class="badge free">GRATIS</span>
                          </div>
                          <ul>
                            <li>✅ Plan gratuito robusto</li>
                            <li>✅ SSL automático</li>
                            <li>✅ Deploy desde GitHub</li>
                            <li>⚡ Configuración manual</li>
                          </ul>
                          <a href="https://render.com" target="_blank" class="deploy-btn">🎨 Deploy en Render</a>
                        </div>
                        
                        <div class="option-card">
                          <div class="option-header">
                            <h3>🐳 DigitalOcean</h3>
                            <span class="badge paid">$5/mes</span>
                          </div>
                          <ul>
                            <li>✅ Máxima compatibilidad</li>
                            <li>✅ Escalable</li>
                            <li>✅ Dockerfile incluido</li>
                            <li>💼 Para uso profesional</li>
                          </ul>
                          <a href="https://www.digitalocean.com/products/app-platform" target="_blank" class="deploy-btn">🐳 Deploy en DO</a>
                        </div>
                        
                        <div class="option-card">
                          <div class="option-header">
                            <h3>🖥️ Desarrollo Local</h3>
                            <span class="badge free">GRATIS</span>
                          </div>
                          <ul>
                            <li>✅ Funciona al 100%</li>
                            <li>✅ Sin limitaciones</li>
                            <li>✅ Para pruebas</li>
                            <li>💻 Solo en tu PC</li>
                          </ul>
                          <div style="margin-top: 15px; font-family: monospace; background: #1f2937; color: #e5e7eb; padding: 10px; border-radius: 6px; font-size: 14px;">
                            npm run dev
                          </div>
                        </div>
                      </div>
                      
                      <div class="pro-tip">
                        <h3>💡 Recomendación</h3>
                        <p><strong>Para automatización completa:</strong> Usa Railway.app - es gratis y funciona en 30 segundos.</p>
                        <p><strong>Para desarrollo:</strong> Ejecuta localmente con <code>npm run dev</code>.</p>
                      </div>
                      
                      <div class="manual-section">
                        <h2>� Mensajes Manuales (Mientras tanto)</h2>
                        <p><strong>Instrucciones:</strong> Abre <a href="https://web.whatsapp.com" target="_blank">WhatsApp Web</a>, busca cada contacto y pega el mensaje personalizado.</p>
                        
                        ${result.results.map((item: any, index: number) => `
                          <div class="message-block">
                            <div class="contact-header">
                              ${index + 1}. ${item.contact} - ${item.phone}
                            </div>
                            <div id="message-${index}">
                              ${item.personalizedMessage.replace(/\n/g, '<br>')}
                            </div>
                            <button class="copy-btn" onclick="copyMessage(${index})">
                              📋 Copiar Mensaje
                            </button>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                    
                    <script>
                      function copyMessage(index) {
                        const messageElement = document.getElementById('message-' + index);
                        const text = messageElement.innerText;
                        navigator.clipboard.writeText(text).then(() => {
                          const btn = event.target;
                          btn.textContent = '✅ Copiado!';
                          btn.style.background = '#10b981';
                          setTimeout(() => {
                            btn.textContent = '📋 Copiar Mensaje';
                            btn.style.background = '#25D366';
                          }, 2000);
                        });
                      }
                    </script>
                  </body>
                </html>
              `)
              newWindow.document.close()
            }
          } else {
          setCurrentProgress("¡Envío automático completado!")
        }
      } else {
        setCurrentProgress(`Error: ${result.error}`)
        console.error('Error:', result.error)
      }
    } catch (error) {
      setCurrentProgress("Error en el proceso de envío")
      console.error('Error:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleProgressUpdate = (progress: string) => {
    setCurrentProgress(progress)
  }

  const handleStopSending = () => {
    setIsSending(false)
    setCurrentProgress("Proceso detenido por el usuario")
    alert('Proceso de envío detenido')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Vista principal */}
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-2xl gradient-primary">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">WhatsApp Bulk Messenger</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Envía mensajes masivos de WhatsApp de forma eficiente y profesional
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <Users className="h-4 w-4 mr-1" />
                {contacts.length} contactos
              </Badge>
              <Badge variant={isSending ? "destructive" : "default"} className="text-sm">
                {isSending ? "Enviando..." : "Listo para enviar"}
              </Badge>
              {typeof window !== 'undefined' && window.location.hostname.includes('vercel') && (
                <Badge variant="outline" className="text-sm border-orange-300 text-orange-700 dark:text-orange-300">
                  🌐 Modo Producción (Manual)
                </Badge>
              )}
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="compose" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="compose" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Componer
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contactos
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración
              </TabsTrigger>
              <TabsTrigger value="send" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Enviar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="gradient-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Mensaje Principal
                    </CardTitle>
                    <CardDescription>Escriba el mensaje que desea enviar a todos los contactos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">Contenido del mensaje</Label>
                      <Textarea
                        id="message"
                        placeholder="¡Hola [NOMBRE]! 👋&#10;&#10;Tenemos una oferta especial para [COMPANY] válida hasta [FECHA].&#10;&#10;📧 Responde a [EMAIL] para más información.&#10;&#10;Saludos!"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        className="resize-none"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <p>{message.length} caracteres</p>
                        {message.length > 0 && (
                          <p className="text-green-600 font-semibold">✅ Se insertará como UN SOLO BLOQUE COMPLETO</p>
                        )}
                      </div>
                    </div>

                    {/* Variables dinámicas disponibles */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-blue-900 dark:text-blue-100">🔄 Variables Dinámicas Disponibles:</p>
                        {message && contacts.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-xs"
                          >
                            {showPreview ? "Ocultar" : "Ver Ejemplo"}
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="space-y-1">
                          <p><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[NOMBRE]</code> - Nombre del contacto</p>
                          <p><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[PHONE]</code> - Número de teléfono</p>
                          <p><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[EMAIL]</code> - Email del contacto</p>
                        </div>
                        <div className="space-y-1">
                          <p><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[COMPANY]</code> - Empresa</p>
                          <p><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[NOTES]</code> - Notas</p>
                          <p><code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">[FECHA]</code> - Fecha actual</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                        💡 Las variables se reemplazan automáticamente con los datos de cada contacto
                      </p>
                    </div>

                    {/* Vista previa del mensaje personalizado */}
                    {showPreview && message && contacts.length > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                          📝 Vista Previa - Mensaje para "{contacts[0].name}":
                        </p>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded border text-sm whitespace-pre-wrap">
                          {generatePreview(message, contacts[0])}
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                          ℹ️ Este es un ejemplo con el primer contacto. Cada persona recibirá su mensaje personalizado.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Archivos adjuntos</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.multiple = true
                            input.accept = "image/*,video/*,audio/*,.pdf,.doc,.docx"
                            input.onchange = (e) => {
                              const files = Array.from((e.target as HTMLInputElement).files || [])
                              setAttachments((prev) => [...prev, ...files.map((f) => f.name)])
                            }
                            input.click()
                          }}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Seleccionar archivos
                        </Button>
                      </div>
                      {attachments.length > 0 && (
                        <div className="space-y-1">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{file}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <MessageTemplates onSelectTemplate={setMessage} />
              </div>
            </TabsContent>

            <TabsContent value="contacts">
              <ContactManager contacts={contacts} setContacts={setContacts} />
            </TabsContent>

            <TabsContent value="settings">
              <TimingSettings settings={timingSettings} setSettings={setTimingSettings} />
            </TabsContent>

            <TabsContent value="send" className="space-y-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Envío de Mensajes
                  </CardTitle>
                  <CardDescription>Revise la configuración y proceda con el envío masivo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{contacts.length}</p>
                      <p className="text-sm text-muted-foreground">Contactos</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{message.length}</p>
                      <p className="text-sm text-muted-foreground">Caracteres</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{attachments.length}</p>
                      <p className="text-sm text-muted-foreground">Archivos</p>
                    </div>
                  </div>

                  {isSending && <SendingProgress contacts={contacts} />}

                  <div className="flex gap-4 justify-center">
                    {!isSending ? (
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={handleSendMessagesAutomatic}
                          size="lg"
                          className="gradient-primary text-black px-8"
                          disabled={contacts.length === 0 || !message.trim()}
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Enviar con Puppeteer
                        </Button>
                        <div className="text-center text-xs text-muted-foreground ">
                          <p>Automatización completa con Chrome independiente</p>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={handleStopSending} size="lg" variant="destructive" className="px-8">
                        <Square className="h-5 w-5 mr-2" />
                        Detener Envío
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-muted-foreground space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="font-semibold text-green-900 dark:text-green-100 mb-2">🤖 Puppeteer Automation</p>
                      <ul className="text-green-800 dark:text-green-200 text-xs space-y-1 text-left">
                        <li>• Abre Chrome independiente automáticamente</li>
                        <li>• <strong>Inserta todo el mensaje como un solo bloque completo</strong></li>
                        <li>• No envía línea por línea, sino todo junto de una vez</li>
                        <li>• Proceso completamente automatizado</li>
                        <li>• Requiere escanear código QR la primera vez</li>
                        <li>• No interfiere con tu navegador actual</li>
                        <li>• Manejo automático de errores y reintentos</li>
                      </ul>
                    </div>
                    
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-yellow-800 dark:text-yellow-200">
                        ⚠️ <strong>Importante:</strong> La primera vez deberás escanear el código QR en la ventana de Chrome que se abre
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                        💡 Una vez autenticado, el proceso es completamente automático
                      </p>
                    </div>
                  </div>

                  {currentProgress && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                        📊 Estado: {currentProgress}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
