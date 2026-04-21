"use client"

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
  topic: string
  setTopic: (v: string) => void
  isGenerating: boolean
  error: string | null
  onBrandUpdate: (updates: Partial<BrandSettings>) => void
  onBrandClear: () => void
  onGenerate: () => void
}

export function AdStylePanel({ ad, set, brand, topic, setTopic, isGenerating, error, onBrandUpdate, onBrandClear, onGenerate }: AdStylePanelProps) {

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

        <div className="border-t border-border/30" />

        {/* Brand panel — accent color comes from brand */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Marca</Label>
          <BrandPanel brand={brand} onUpdate={onBrandUpdate} onClear={onBrandClear} />
        </div>

        <div className="border-t border-border/30" />

        {/* Topic input */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">¿Sobre qué es el anuncio?</Label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Ej: app de productividad para freelancers que ahorra 3h al día"
            rows={3}
            className="w-full resize-none rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onGenerate() }}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

      </div>

      {/* Footer: generate + export */}
      <div className="space-y-2 border-t border-border/50 p-4">
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" /> Generar con IA</>
          )}
        </Button>
        <Button disabled className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
          <Download className="mr-2 h-4 w-4" />
          Exportar anuncio
        </Button>
        <p className="text-center text-[10px] text-muted-foreground/50">Exportar próximamente</p>
      </div>
    </div>
  )
}
