"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Info } from "lucide-react"

interface TimingSettingsProps {
  settings: {
    chatDelay: number
    imageDelay: number
    sendDelay: number
    messageDelay: number
  }
  setSettings: (settings: any) => void
}

export function TimingSettings({ settings, setSettings }: TimingSettingsProps) {
  const updateSetting = (key: string, value: number) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configuración de Tiempos
          </CardTitle>
          <CardDescription>Configure los retrasos entre acciones para evitar ser detectado como spam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="chatDelay">Retraso entre chats (segundos)</Label>
              <Input
                id="chatDelay"
                type="number"
                min="1"
                max="60"
                value={settings.chatDelay}
                onChange={(e) => updateSetting("chatDelay", Number.parseInt(e.target.value) || 1)}
              />
              <p className="text-sm text-muted-foreground">Tiempo de espera antes de abrir cada chat</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageDelay">Retraso para imágenes (segundos)</Label>
              <Input
                id="imageDelay"
                type="number"
                min="1"
                max="60"
                value={settings.imageDelay}
                onChange={(e) => updateSetting("imageDelay", Number.parseInt(e.target.value) || 1)}
              />
              <p className="text-sm text-muted-foreground">Tiempo adicional para cargar imágenes</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sendDelay">Retraso de envío (segundos)</Label>
              <Input
                id="sendDelay"
                type="number"
                min="1"
                max="60"
                value={settings.sendDelay}
                onChange={(e) => updateSetting("sendDelay", Number.parseInt(e.target.value) || 1)}
              />
              <p className="text-sm text-muted-foreground">Tiempo antes de presionar enviar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="messageDelay">Retraso entre mensajes (segundos)</Label>
              <Input
                id="messageDelay"
                type="number"
                min="1"
                max="60"
                value={settings.messageDelay}
                onChange={(e) => updateSetting("messageDelay", Number.parseInt(e.target.value) || 1)}
              />
              <p className="text-sm text-muted-foreground">Tiempo entre cada mensaje enviado</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Recomendaciones de Seguridad</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use retrasos de al menos 2-3 segundos entre mensajes</li>
                  <li>• Para listas grandes, considere retrasos más largos</li>
                  <li>• Evite enviar más de 50 mensajes por hora</li>
                  <li>• Mantenga WhatsApp Desktop activo durante el proceso</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
