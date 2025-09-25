"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Send } from "lucide-react"

interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  notes?: string
}

interface SendingProgressProps {
  contacts: Contact[]
}

export function SendingProgress({ contacts }: SendingProgressProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sentCount, setSentCount] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentIndex < contacts.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setSentCount((prev) => prev + 1)
        setProgress(((currentIndex + 1) / contacts.length) * 100)
      }, 2000) // Simulate 2 second delay per message

      return () => clearTimeout(timer)
    }
  }, [currentIndex, contacts.length])

  const currentContact = contacts[currentIndex]
  const isComplete = currentIndex >= contacts.length

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Progreso del Envío
        </CardTitle>
        <CardDescription>
          {isComplete ? "Envío completado" : `Enviando mensaje ${currentIndex + 1} de ${contacts.length}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">{sentCount}</p>
            <p className="text-sm text-muted-foreground">Enviados</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-600">{Math.max(0, contacts.length - sentCount)}</p>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{contacts.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        {!isComplete && currentContact && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium">Enviando a: {currentContact.name}</p>
                <p className="text-sm text-muted-foreground">{currentContact.phone}</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                En proceso
              </Badge>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">¡Envío completado!</p>
                <p className="text-sm text-green-700">Se enviaron {sentCount} mensajes exitosamente</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
