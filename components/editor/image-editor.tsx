"use client"

import { useRef, useState, useEffect } from "react"
import { Search, Sparkles, Trash2, RefreshCw, Upload, ImageIcon } from "lucide-react"
import type { Slide } from "@/lib/types"

interface ImageEditorProps {
  slide: Slide
  isLoading?: boolean
  onSearch: () => void
  onGenerate: () => void
  onRemove: () => void
  onUpload: (file: File) => void
  onRegenerateWithPrompt: (prompt: string) => void
}

export function ImageEditor({
  slide,
  isLoading = false,
  onSearch,
  onGenerate,
  onRemove,
  onUpload,
  onRegenerateWithPrompt,
}: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editedPrompt, setEditedPrompt] = useState(slide.imagePrompt ?? "")
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    setEditedPrompt(slide.imagePrompt ?? "")
  }, [slide.id, slide.imagePrompt])

  const handleFile = (file: File | null | undefined) => {
    if (file?.type.startsWith("image/")) onUpload(file)
  }

  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = "" }}
    />
  )

  const spinner = <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
  const spinnerLg = <div className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />

  if (slide.imageUrl) {
    return (
      <div className="space-y-2">
        {hiddenFileInput}

        {/* Preview */}
        <div className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/30" style={{ aspectRatio: "3/4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.imageUrl} alt="Slide image" className="h-full w-full object-cover" />
          <button
            onClick={onRemove}
            title="Remove image"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        {/* Editable prompt (hidden for uploaded images) */}
        {slide.imagePrompt !== undefined && slide.imageSource !== "upload" && (
          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5 space-y-2">
            <div className="flex items-center gap-1.5">
              {slide.imageSource === "dalle"
                ? <Sparkles className="h-2.5 w-2.5 text-muted-foreground/50 flex-shrink-0" />
                : <Search className="h-2.5 w-2.5 text-muted-foreground/50 flex-shrink-0" />}
              <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {slide.imageSource === "dalle" ? "Prompt generado" : "Keywords de búsqueda"}
              </p>
            </div>
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2 py-1.5 text-[10px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 overflow-y-auto"
              style={{ maxHeight: "7rem" }}
              placeholder="Edita el prompt y regenera..."
            />
            <button
              onClick={() => onRegenerateWithPrompt(editedPrompt)}
              disabled={isLoading || !editedPrompt.trim()}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {isLoading ? spinner : <RefreshCw className="h-3 w-3" />}
              {isLoading ? "Generando..." : "Regenerar con este prompt"}
            </button>
          </div>
        )}

        {/* Action grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Unsplash", icon: <Search className="h-3 w-3" />, onClick: onSearch },
            { label: "AI", icon: <Sparkles className="h-3 w-3" />, onClick: onGenerate },
            { label: "Subir", icon: <Upload className="h-3 w-3" />, onClick: () => fileInputRef.current?.click() },
          ].map(({ label, icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-border/50 bg-muted/50 px-2 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
            >
              {isLoading ? spinner : icon}
              {label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {hiddenFileInput}

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files[0]) }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-6 transition-colors ${
          isDragOver
            ? "border-primary/60 bg-primary/5 text-primary"
            : "border-border/50 bg-muted/20 text-muted-foreground/50 hover:border-border/80 hover:text-muted-foreground/70"
        }`}
      >
        <Upload className="h-5 w-5" />
        <span className="text-[10px] text-center leading-tight">
          Arrastra, pega (Ctrl+V)<br />o haz clic para subir
        </span>
      </div>

      <button
        onClick={onSearch}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/50 py-2.5 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
      >
        {isLoading ? spinnerLg : <Search className="h-3.5 w-3.5" />}
        {isLoading ? "Buscando..." : "Buscar en Unsplash"}
      </button>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/50 py-2.5 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
      >
        {isLoading ? spinnerLg : <Sparkles className="h-3.5 w-3.5" />}
        {isLoading ? "Generando..." : "Generar con IA"}
      </button>
    </div>
  )
}

/** Wraps ImageEditor with clipboard paste listener for the active slide. */
export function useImagePaste(supportsImage: boolean, onUpload: (file: File) => void) {
  useEffect(() => {
    if (!supportsImage) return
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return
      const item = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith("image/"))
      if (!item) return
      const file = item.getAsFile()
      if (!file) return
      e.preventDefault()
      onUpload(file)
    }
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [supportsImage, onUpload])
}
