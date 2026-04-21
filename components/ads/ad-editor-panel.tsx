"use client"

import { useState } from "react"
import { RefreshCw, ChevronDown, Loader2 } from "lucide-react"
import { LAYOUTS, type AdState, type AdLayout } from "./types"

interface AdEditorPanelProps {
  ad: AdState
  isRegenerating: boolean
  onRegenerate: (layout: AdLayout, customInstructions: string) => void
}

export function AdEditorPanel({ ad, isRegenerating, onRegenerate }: AdEditorPanelProps) {
  const [regenerateOpen, setRegenerateOpen] = useState(false)
  const [targetLayout, setTargetLayout] = useState<AdLayout>(ad.layout)
  const [instructions, setInstructions] = useState("")

  const handleRegenerate = () => {
    onRegenerate(targetLayout, instructions)
    setRegenerateOpen(false)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Editor</h3>
        <p className="mt-1 text-xs text-muted-foreground">Ajustes del anuncio</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">

        {/* Regenerate section */}
        <div className="space-y-2">
          <button
            onClick={() => setRegenerateOpen(v => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-muted/50 px-3 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all"
          >
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerar anuncio
            </span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${regenerateOpen ? "rotate-180" : ""}`} />
          </button>

          {regenerateOpen && (
            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Tipo de anuncio
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {LAYOUTS.map(({ id, label, emoji }) => (
                  <button
                    key={id}
                    onClick={() => setTargetLayout(id)}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-all ${
                      targetLayout === id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    <span>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Instrucciones (opcional)
                </p>
                <textarea
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={2}
                  placeholder="Ej: tono más urgente, enfócate en el precio, usa palabras en inglés..."
                  className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-[10px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isRegenerating ? (
                  <><Loader2 className="h-3 w-3 animate-spin" /> Regenerando...</>
                ) : (
                  <><RefreshCw className="h-3 w-3" /> Regenerar</>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
