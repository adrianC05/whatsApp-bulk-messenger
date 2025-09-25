'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { AutomationCodeDisplay } from "./automation-code-display"

interface WhatsAppIntegratedProps {
  isActive: boolean
  onClose: () => void
  contacts: Array<{ id: string; name: string; phone: string }>
  message: string
  currentProgress: string
  onProgressUpdate: (progress: string) => void
}

export function WhatsAppIntegrated({ 
  isActive, 
  onClose, 
  contacts, 
  message, 
  currentProgress,
  onProgressUpdate 
}: WhatsAppIntegratedProps) {

  if (!isActive) return null

  const timingSettings = {
    chatDelay: 3,
    messageDelay: 2,
    sendDelay: 1,
    imageDelay: 3
  }

  return (
    <div className="space-y-4">
      <AutomationCodeDisplay
        contacts={contacts}
        message={message}
        timingSettings={timingSettings}
        onClose={onClose}
      />
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            Estado del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">
              🚀 Código Generado
            </Badge>
            <Badge variant="outline">
              {contacts.length} contactos listos
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Estado:</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {currentProgress || "Código de automatización generado. Sigue las instrucciones arriba."}
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border text-yellow-800 dark:text-yellow-200">
            <p className="font-semibold">⚠️ Importante:</p>
            <ul className="text-sm space-y-1 mt-1">
              <li>• Este método funciona en el MISMO navegador</li>
              <li>• Es 100% automático una vez ejecutado</li>
              <li>• Usa tu sesión actual de WhatsApp Web</li>
              <li>• No hay restricciones de seguridad</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}