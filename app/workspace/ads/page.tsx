"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Smartphone, Square, Monitor, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const FORMATS = [
  { id: "story",     label: "Story",     icon: Smartphone, aspect: "9/16", w: 160, h: 285, description: "1080 × 1920 px" },
  { id: "square",    label: "Square",    icon: Square,     aspect: "1/1",  w: 240, h: 240, description: "1080 × 1080 px" },
  { id: "landscape", label: "Landscape", icon: Monitor,    aspect: "16/9", w: 320, h: 180, description: "1920 × 1080 px" },
] as const

type FormatId = typeof FORMATS[number]["id"]

export default function AdsPage() {
  const [format, setFormat] = useState<FormatId>("story")
  const [headline, setHeadline] = useState("")
  const [body, setBody] = useState("")
  const [cta, setCta] = useState("")
  const [bgColor, setBgColor] = useState("#111111")
  const [textColor, setTextColor] = useState("#ffffff")

  const selected = FORMATS.find((f) => f.id === format)!

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0">

          {/* Left panel — controls */}
          <div className="border-r border-border overflow-y-auto">
            <div className="border-b border-border/50 p-4">
              <h3 className="text-sm font-medium text-foreground">Crear Anuncio</h3>
              <p className="mt-1 text-xs text-muted-foreground">Diseña tu anuncio manualmente</p>
            </div>

            <div className="space-y-6 p-4">
              {/* Format */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Formato</Label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map(({ id, label, icon: Icon, description }) => (
                    <button
                      key={id}
                      onClick={() => setFormat(id)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-xs transition-all ${
                        format === id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{label}</span>
                      <span className="text-[9px] opacity-60">{description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Titular</Label>
                <textarea
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Ej: Transforma tu negocio con IA"
                  rows={2}
                  className="w-full resize-none rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Descripción</Label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Ej: Crea contenido de calidad en minutos, sin experiencia de diseño."
                  rows={3}
                  className="w-full resize-none rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Botón CTA</Label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="Ej: Empieza gratis"
                  className="w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Fondo</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-border/50 bg-transparent p-0.5" />
                    <span className="text-xs text-muted-foreground font-mono">{bgColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Texto</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border border-border/50 bg-transparent p-0.5" />
                    <span className="text-xs text-muted-foreground font-mono">{textColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 p-4">
              <Button disabled className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
                <Download className="mr-2 h-4 w-4" />
                Exportar anuncio
              </Button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground/50">Exportación disponible próximamente</p>
            </div>
          </div>

          {/* Right panel — preview */}
          <div className="bg-muted/30 flex items-center justify-center p-8 overflow-auto">
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs text-muted-foreground">
                Vista previa — {selected.label} · {selected.description}
              </p>

              {/* Ad preview */}
              <div
                className="relative overflow-hidden rounded-xl shadow-2xl flex flex-col"
                style={{
                  width: selected.w,
                  height: selected.h,
                  backgroundColor: bgColor,
                  color: textColor,
                }}
              >
                {/* Content */}
                <div className="flex flex-1 flex-col justify-end p-4 gap-2">
                  {headline && (
                    <p className="font-bold leading-tight" style={{ fontSize: selected.id === "story" ? 14 : 18 }}>
                      {headline}
                    </p>
                  )}
                  {body && (
                    <p className="opacity-80 leading-snug" style={{ fontSize: selected.id === "story" ? 10 : 12 }}>
                      {body}
                    </p>
                  )}
                  {cta && (
                    <div
                      className="mt-1 self-start rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{ backgroundColor: textColor, color: bgColor }}
                    >
                      {cta}
                    </div>
                  )}

                  {!headline && !body && !cta && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
                      <selected.icon className="h-8 w-8" />
                      <span className="text-xs">Tu anuncio aquí</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground/50 text-center max-w-[240px]">
                Más funcionalidades próximamente: imágenes, IA generativa, plantillas y exportación.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
