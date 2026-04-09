"use client"

import { useState } from "react"
import { Sparkles, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BrandPanel } from "@/components/brand-panel"
import type { BrandSettings } from "@/lib/types"
import { LAYOUTS, type AdState, type AdLayout } from "./types"

interface AdStylePanelProps {
  ad: AdState
  set: (k: keyof AdState, v: unknown) => void
  brand: BrandSettings
  onBrandUpdate: (updates: Partial<BrandSettings>) => void
  onBrandClear: () => void
  onGenerated: (data: Partial<AdState>) => void
}

export function AdStylePanel({ ad, set, brand, onBrandUpdate, onBrandClear, onGenerated }: AdStylePanelProps) {
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout: ad.layout, topic, brand }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error generando")
      onGenerated(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Generar con IA</h3>
        <p className="mt-1 text-xs text-muted-foreground">Escoge el tipo y describe tu producto</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">

        {/* Ad type picker */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Tipo de anuncio</Label>
          <div className="grid grid-cols-1 gap-1.5">
            {LAYOUTS.map(({ id, label, emoji, description }) => (
              <button
                key={id}
                onClick={() => set("layout", id as AdLayout)}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all ${
                  ad.layout === id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <span className="text-base">{emoji}</span>
                <div>
                  <p className="text-xs font-medium">{label}</p>
                  <p className="text-[10px] opacity-60">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Topic input + generate */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">¿Sobre qué es el anuncio?</Label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Ej: app de productividad para freelancers que ahorra 3h al día"
            rows={3}
            className="w-full resize-none rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate() }}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generar con IA</>
            )}
          </Button>
        </div>

        <div className="border-t border-border/30" />

        {/* Accent color + brand swatches */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">Color acento</Label>
          {brand.colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {brand.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => set("accentColor", color)}
                  title={color}
                  className="h-7 w-7 rounded-full border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: ad.accentColor === color ? "#fff" : "transparent",
                    boxShadow: ad.accentColor === color ? "0 0 0 1px rgba(255,255,255,0.4)" : "none",
                  }}
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={ad.accentColor}
              onChange={e => set("accentColor", e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-border/50 bg-transparent p-0.5"
            />
            <span className="text-xs text-muted-foreground font-mono">{ad.accentColor}</span>
          </div>
        </div>

        <div className="border-t border-border/30" />

        {/* Brand panel */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Marca</Label>
          <BrandPanel brand={brand} onUpdate={onBrandUpdate} onClear={onBrandClear} />
        </div>

      </div>

      {/* Export */}
      <div className="border-t border-border/50 p-4">
        <Button disabled className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
          <Download className="mr-2 h-4 w-4" />
          Exportar anuncio
        </Button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground/50">Próximamente</p>
      </div>
    </div>
  )
}
