"use client"

import { useState } from "react"
import { RefreshCw, ChevronDown, AlignLeft, ListChecks, Hash, Quote, Columns2 } from "lucide-react"
import type { SlideLayout } from "@/lib/types"

const LAYOUTS: { id: SlideLayout; label: string; icon: typeof AlignLeft }[] = [
  { id: "content",   label: "Content", icon: AlignLeft  },
  { id: "list",      label: "List",    icon: ListChecks  },
  { id: "bigNumber", label: "Number",  icon: Hash        },
  { id: "quote",     label: "Quote",   icon: Quote       },
  { id: "split",     label: "Split",   icon: Columns2    },
]

interface RegeneratePanelProps {
  currentLayout: SlideLayout
  isRegenerating: boolean
  onRegenerate: (layout: SlideLayout, prompt: string) => void
}

export function RegeneratePanel({ currentLayout, isRegenerating, onRegenerate }: RegeneratePanelProps) {
  const [open, setOpen] = useState(false)
  const [targetLayout, setTargetLayout] = useState<SlideLayout>(currentLayout)
  const [prompt, setPrompt] = useState("")

  const handleRegenerate = () => {
    onRegenerate(targetLayout, prompt)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-muted/50 px-3 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all"
      >
        <span className="flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Regenerar slide
        </span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-3">
          {/* Layout selector */}
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Tipo de slide
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {LAYOUTS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTargetLayout(id)}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-all ${
                  targetLayout === id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Custom prompt */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Instrucciones (opcional)
            </p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="Ej: enfócate en estadísticas de 2024, usa un tono más informal..."
              className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-[10px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isRegenerating ? (
              <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {isRegenerating ? "Regenerando..." : "Regenerar"}
          </button>
        </div>
      )}
    </div>
  )
}
