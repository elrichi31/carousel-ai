"use client"

import type { PostCaption } from "@/lib/types"

interface CaptionEditorProps {
  caption?: PostCaption | null
  onCaptionChange?: (caption: PostCaption) => void
}

export function CaptionEditor({ caption, onCaptionChange }: CaptionEditorProps) {
  if (caption === undefined) return null

  return (
    <div className="px-3 pb-3 space-y-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide pt-1">
        Caption
      </p>
      <textarea
        value={caption?.text ?? ""}
        onChange={(e) => onCaptionChange?.({ text: e.target.value, hashtags: caption?.hashtags ?? [] })}
        placeholder="Tu descripción aparecerá aquí después de generar el carrusel..."
        rows={3}
        className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
      {(caption?.hashtags?.length ?? 0) > 0 && (
        <>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Hashtags
          </p>
          <textarea
            value={caption?.hashtags.map((h) => `#${h}`).join(" ") ?? ""}
            onChange={(e) => {
              const tags = e.target.value
                .split(/[\s,]+/)
                .map((t) => t.replace(/^#/, "").trim())
                .filter(Boolean)
              onCaptionChange?.({ text: caption?.text ?? "", hashtags: tags })
            }}
            rows={3}
            className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2.5 py-2 text-xs text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </>
      )}
    </div>
  )
}
