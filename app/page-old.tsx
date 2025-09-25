"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Settings, Users, ImageIcon, FileText, Play, Square } from "lucide-react"
import { ContactManager } from "@/components/contact-manager"
import { MessageTemplates } from "@/components/message-templates"
import { TimingSettings } from "@/components/timing-settings"
import { SendingProgress } from "@/components/sending-progress"

export default function WhatsAppBulkMessenger() {
  const [contacts, setContacts] = useState<Array<{ id: string; name: string; phone: string }>>([])
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [showWebScraping, setShowWebScraping] = useState(false)
  const [currentProgress, setCurrentProgress] = useState("")
  const [timingSettings, setTimingSettings] = useState({
    chatDelay: 2,
    imageDelay: 3,
    sendDelay: 1,
    messageDelay: 2,
  })

  const [sendingProcess, setSendingProcess] = useState<AbortController | null>(null)

  const handleSendMessages = async () => {
    if (contacts.length === 0 || !message.trim()) {
      alert("Por favor, agregue contactos y escriba un mensaje")
      return
    }

    setIsSending(true)
    setShowWebScraping(true)
    setCurrentProgress("Iniciando proceso de envío...")
    
    // Crear AbortController para poder cancelar la operación
    const abortController = new AbortController()
    setSendingProcess(abortController)
    
    try {
      setCurrentProgress("Enviando solicitud al servidor...")
      
      const response = await fetch('/api/send-whatsapp-embedded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contacts,
          message,
          timingSettings
        }),
        signal: abortController.signal
      })

      setCurrentProgress("Procesando respuesta del servidor...")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar mensajes')
      }

      setIsSending(false)
      setSendingProcess(null)
      setCurrentProgress("Proceso completado exitosamente")
      
      // Mostrar resultados detallados
      let alertMessage = data.message + '\n\n📊 Resumen:\n'
      alertMessage += `✅ Exitosos: ${data.summary.success}\n`
      alertMessage += `❌ Errores: ${data.summary.errors}\n`
      alertMessage += `📱 Total: ${data.summary.total}\n\n`
      
      alertMessage += '📋 Detalles por contacto:\n'
      data.results.forEach((result: any) => {
        const statusIcon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'
        alertMessage += `${statusIcon} ${result.contact}: ${result.message}\n`
      })
      
      alert(alertMessage)
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setCurrentProgress("Proceso cancelado por el usuario")
        alert('Proceso de envío cancelado por el usuario')
      } else {
        setCurrentProgress(`Error: ${error.message}`)
        alert(`Error al enviar mensajes: ${error.message}`)
      }
      setIsSending(false)
      setSendingProcess(null)
    }
  }

  const handleStopSending = () => {
    if (sendingProcess) {
      sendingProcess.abort()
      setSendingProcess(null)
    }
    setIsSending(false)
    setCurrentProgress("Proceso detenido por el usuario")
    alert('Proceso de envío detenido')
  }

  const handleToggleWebScraping = () => {
    setShowWebScraping(!showWebScraping)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
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
                      placeholder="Escriba su mensaje aquí..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">{message.length} caracteres</p>
                  </div>

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
                    <Button
                      onClick={handleSendMessages}
                      size="lg"
                      className="gradient-primary text-white px-8"
                      disabled={contacts.length === 0 || !message.trim()}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar Envío
                    </Button>
                  ) : (
                    <Button onClick={handleStopSending} size="lg" variant="destructive" className="px-8">
                      <Square className="h-5 w-5 mr-2" />
                      Detener Envío
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm text-muted-foreground space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-semibold text-green-900 dark:text-green-100 mb-1">🤖 Envío Automático</p>
                    <p className="text-green-800 dark:text-green-200">Se abrirá un navegador automatizado que enviará los mensajes</p>
                    <p className="text-green-800 dark:text-green-200">El proceso es completamente automático usando web scraping</p>
                  </div>
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200">⚠️ Importante: Necesitas estar logueado en WhatsApp Web</p>
                    <p className="text-yellow-800 dark:text-yellow-200">💡 La primera vez puede pedirte escanear el código QR</p>
                  </div>
                  <p className="text-muted-foreground">� Los datos se borrarán al recargar la página</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
