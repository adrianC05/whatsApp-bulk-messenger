"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Star } from "lucide-react"

interface MessageTemplatesProps {
  onSelectTemplate: (template: string) => void
}

const templates = [
  {
    id: 1,
    name: "Promoción de Producto",
    category: "Marketing",
    content:
      "¡Hola! 👋\n\nTenemos una oferta especial para ti. Descuento del 20% en todos nuestros productos hasta el final del mes.\n\n🎯 Código: DESCUENTO20\n🕒 Válido hasta: [FECHA]\n\n¡No te lo pierdas!\n\nSaludos,\n[TUS EMPRESAS]",
  },
  {
    id: 2,
    name: "Recordatorio de Cita",
    category: "Servicios",
    content:
      "Hola [NOMBRE],\n\nTe recordamos tu cita programada para:\n\n📅 Fecha: [FECHA]\n🕐 Hora: [HORA]\n📍 Lugar: [DIRECCIÓN]\n\nSi necesitas reprogramar, contáctanos con anticipación.\n\n¡Te esperamos!",
  },
  {
    id: 3,
    name: "Seguimiento de Venta",
    category: "Ventas",
    content:
      "¡Hola [NOMBRE]!\n\nEspero que estés bien. Quería hacer seguimiento a nuestra conversación sobre [PRODUCTO/SERVICIO].\n\n¿Tienes alguna pregunta adicional? Estoy aquí para ayudarte a tomar la mejor decisión.\n\n¡Espero tu respuesta!\n\nSaludos cordiales",
  },
  {
    id: 4,
    name: "Invitación a Evento",
    category: "Eventos",
    content:
      "🎉 ¡Estás invitado!\n\nTe invitamos cordialmente a nuestro evento:\n\n📋 Evento: [NOMBRE DEL EVENTO]\n📅 Fecha: [FECHA]\n🕐 Hora: [HORA]\n📍 Lugar: [UBICACIÓN]\n\nConfirma tu asistencia respondiendo a este mensaje.\n\n¡Te esperamos!",
  },
]

export function MessageTemplates({ onSelectTemplate }: MessageTemplatesProps) {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Plantillas de Mensajes
        </CardTitle>
        <CardDescription>Seleccione una plantilla predefinida para agilizar su trabajo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelectTemplate(template.content)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="outline" className="text-xs mt-1">
                    {template.category}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{template.content.substring(0, 100)}...</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            💡 Personalice las plantillas con variables como [NOMBRE], [FECHA], etc.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
