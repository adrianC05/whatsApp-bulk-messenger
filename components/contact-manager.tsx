"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, Upload } from "lucide-react"

interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  notes?: string
}

interface ContactManagerProps {
  contacts: Contact[]
  setContacts: (contacts: Contact[]) => void
}

export function ContactManager({ contacts, setContacts }: ContactManagerProps) {
  const [newContact, setNewContact] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    company: "", 
    notes: "" 
  })
  const [bulkContacts, setBulkContacts] = useState("")

  const placeholderText = "Juan Pérez, +1234567890, juan@email.com, Empresa XYZ, Cliente VIP\nMaría García, +0987654321, maria@email.com, ABC Corp"

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email || undefined,
        company: newContact.company || undefined,
        notes: newContact.notes || undefined,
      }
      setContacts([...contacts, contact])
      setNewContact({ name: "", phone: "", email: "", company: "", notes: "" })
    }
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id))
  }

  const addBulkContacts = () => {
    const lines = bulkContacts.split("\n").filter((line) => line.trim())
    const newContacts: Contact[] = []

    lines.forEach((line) => {
      const parts = line.split(",").map((p) => p.trim())
      if (parts.length >= 2) {
        newContacts.push({
          id: Date.now().toString() + Math.random(),
          name: parts[0],
          phone: parts[1],
          email: parts[2] || undefined,
          company: parts[3] || undefined,
          notes: parts[4] || undefined,
        })
      }
    })

    setContacts([...contacts, ...newContacts])
    setBulkContacts("")
  }

  const clearAllContacts = () => {
    if (confirm("¿Está seguro de que desea eliminar todos los contactos?")) {
      setContacts([])
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Agregar Contactos
          </CardTitle>
          <CardDescription>Agregue contactos individualmente o en lote</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Contacto Individual</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Nombre del contacto"
                  value={newContact.name}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  value={newContact.phone}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={newContact.email}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input
                  id="company"
                  placeholder="Nombre de la empresa"
                  value={newContact.company}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionales sobre el contacto..."
                value={newContact.notes}
                onChange={(e) => setNewContact((prev) => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
            <Button onClick={addContact} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Contacto
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Importación en Lote</h3>
            <div className="space-y-2">
              <Label htmlFor="bulk">Contactos (CSV: Nombre, Teléfono, Email, Empresa, Notas)</Label>
              <Textarea
                id="bulk"
                placeholder={placeholderText}
                value={bulkContacts}
                onChange={(e) => setBulkContacts(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Solo Nombre y Teléfono son obligatorios. Los campos opcionales pueden quedar vacíos.
              </p>
            </div>
            <Button onClick={addBulkContacts} variant="outline" className="w-full bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Importar Contactos
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Contactos
            </div>
            <Badge variant="secondary">{contacts.length} contactos</Badge>
          </CardTitle>
          <CardDescription>Gestione su lista de contactos para el envío masivo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={clearAllContacts} variant="destructive" size="sm" disabled={contacts.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Todo
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay contactos agregados</p>
                <p className="text-sm">Agregue contactos para comenzar</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    {contact.email && (
                      <p className="text-xs text-muted-foreground">📧 {contact.email}</p>
                    )}
                    {contact.company && (
                      <p className="text-xs text-muted-foreground">🏢 {contact.company}</p>
                    )}
                    {contact.notes && (
                      <p className="text-xs text-muted-foreground italic">💬 {contact.notes}</p>
                    )}
                  </div>
                  <Button onClick={() => removeContact(contact.id)} variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
