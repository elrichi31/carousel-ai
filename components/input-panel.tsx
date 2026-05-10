"use client"

import { Sparkles, ChevronDown, ImageIcon, Search, Upload, Link, Clock, Trash2, RotateCcw } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { BrandPanel } from "@/components/brand-panel"
import type { CarouselFormData, BrandSettings, Slide, PostCaption } from "@/lib/types"
import type { HistoryEntry } from "@/hooks/use-session-history"
import { audienceOptions, toneOptions, visualStyles } from "@/lib/mock-data"

interface InputPanelProps {
  formData: CarouselFormData
  onFormChange: (data: Partial<CarouselFormData>) => void
  onGenerate: () => void
  isGenerating: boolean
  error?: string | null
  brand: BrandSettings
  onBrandUpdate: (updates: Partial<BrandSettings>) => void
  onBrandClear: () => void
  // Remix
  onRemix: (url: string) => void
  isRemixing: boolean
  // Session history
  historyEntries: HistoryEntry[]
  onLoadHistory: (entry: { slides: Slide[]; caption: PostCaption | null; formData: CarouselFormData }) => void
  onClearHistory: () => void
}

const defaultFormData: CarouselFormData = {
  topic: "",
  audience: "General",
  tone: "Professional",
  slideCount: 5,
  visualStyle: "Minimal",
  withImages: false,
  imageSource: "unsplash",
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "hace un momento"
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

export function InputPanel({
  formData = defaultFormData,
  onFormChange,
  onGenerate,
  isGenerating,
  error,
  brand,
  onBrandUpdate,
  onBrandClear,
  onRemix,
  isRemixing,
  historyEntries,
  onLoadHistory,
  onClearHistory,
}: InputPanelProps) {
  const [brandOpen, setBrandOpen] = useState(true)
  const [remixOpen, setRemixOpen] = useState(false)
  const [remixUrl, setRemixUrl] = useState("")
  const [historyOpen, setHistoryOpen] = useState(false)

  const handleRemixSubmit = () => {
    const url = remixUrl.trim()
    if (!url) return
    onRemix(url)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Create Carousel</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Define your content parameters
        </p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {/* Brand Section */}
        <div className="rounded-lg border border-border/50 bg-muted/20">
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2">
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt="" className="h-5 w-5 rounded-sm object-contain" />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary/20 text-[10px]">
                  ✨
                </div>
              )}
              <span className="text-xs font-medium text-foreground">
                {brand.name || "Brand Settings"}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${brandOpen ? "rotate-180" : ""}`} />
          </button>
          {brandOpen && (
            <div className="border-t border-border/50 px-4 py-4">
              <BrandPanel
                brand={brand}
                onUpdate={onBrandUpdate}
                onClear={onBrandClear}
              />
            </div>
          )}
        </div>

        {/* Remix desde URL */}
        <div className="rounded-lg border border-border/50 bg-muted/20">
          <button
            onClick={() => setRemixOpen(!remixOpen)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Remix desde URL</span>
              <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold bg-primary/15 text-primary">Nuevo</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${remixOpen ? "rotate-180" : ""}`} />
          </button>
          {remixOpen && (
            <div className="border-t border-border/50 px-4 py-4 space-y-3">
              <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                Pega la URL de un artículo, blog post o página web y la IA lo convertirá en un carousel.
              </p>
              <input
                type="url"
                placeholder="https://ejemplo.com/articulo"
                value={remixUrl}
                onChange={(e) => setRemixUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRemixSubmit()}
                className="w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <Button
                onClick={handleRemixSubmit}
                disabled={isRemixing || !remixUrl.trim()}
                size="sm"
                className="w-full bg-primary/90 text-primary-foreground hover:bg-primary disabled:opacity-50"
              >
                {isRemixing ? (
                  <>
                    <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Extrayendo contenido...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-3.5 w-3.5" />
                    Convertir en carousel
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-xs text-muted-foreground">
            Topic
          </Label>
          <textarea
            id="topic"
            placeholder="e.g., 5 ataques de ciberseguridad más comunes y cómo protegerte de ellos en 2025..."
            value={formData.topic}
            onChange={(e) => onFormChange({ topic: e.target.value })}
            rows={3}
            className="w-full resize-none rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 overflow-y-auto"
            style={{ maxHeight: "9rem" }}
          />
        </div>

        {/* Audience */}
        <div className="space-y-2">
          <Label htmlFor="audience" className="text-xs text-muted-foreground">
            Target Audience
          </Label>
          <Select
            value={formData.audience}
            onValueChange={(value) => onFormChange({ audience: value })}
          >
            <SelectTrigger className="border-border/50 bg-muted/50 text-foreground">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {audienceOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <Label htmlFor="tone" className="text-xs text-muted-foreground">
            Tone
          </Label>
          <Select
            value={formData.tone}
            onValueChange={(value) => onFormChange({ tone: value })}
          >
            <SelectTrigger className="border-border/50 bg-muted/50 text-foreground">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {toneOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Slide count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Number of Slides
            </Label>
            <span className="text-sm font-medium text-foreground">
              {formData.slideCount}
            </span>
          </div>
          <Slider
            value={[formData.slideCount]}
            onValueChange={([value]) => onFormChange({ slideCount: value })}
            min={3}
            max={10}
            step={1}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
          />
        </div>

        {/* Visual Style */}
        <div className="space-y-2">
          <Label htmlFor="style" className="text-xs text-muted-foreground">
            Visual Style
          </Label>
          <Select
            value={formData.visualStyle}
            onValueChange={(value) => onFormChange({ visualStyle: value })}
          >
            <SelectTrigger className="border-border/50 bg-muted/50 text-foreground">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {visualStyles.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Images */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="h-3.5 w-3.5" />
            Images
          </Label>
          <div className="flex rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
            <button
              onClick={() => onFormChange({ withImages: false })}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                !formData.withImages
                  ? "bg-primary/10 text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sin imágenes
            </button>
            <button
              onClick={() => onFormChange({ withImages: true })}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                formData.withImages
                  ? "bg-primary/10 text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Con imágenes
            </button>
          </div>

          {formData.withImages && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide font-medium">Fuente de imágenes</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "unsplash" as const, icon: <Search className="h-3.5 w-3.5" />, label: "Unsplash", badge: "Gratis", badgeClass: "bg-green-500/15 text-green-600" },
                  { id: "dalle"   as const, icon: <Sparkles className="h-3.5 w-3.5" />, label: "GPT Image",  badge: "IA",    badgeClass: "bg-yellow-500/15 text-yellow-600" },
                  { id: "upload"  as const, icon: <Upload className="h-3.5 w-3.5" />,   label: "Mis fotos", badge: "Tuyas", badgeClass: "bg-blue-500/15 text-blue-600" },
                ].map(({ id, icon, label, badge, badgeClass }) => (
                  <button
                    key={id}
                    onClick={() => onFormChange({ imageSource: id })}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs transition-all ${
                      formData.imageSource === id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {icon}
                    <span className="font-medium">{label}</span>
                    <span className={`rounded px-1 py-0.5 text-[9px] font-medium ${badgeClass}`}>{badge}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                {formData.imageSource === "unsplash"
                  ? "Fotos reales de Unsplash, gratis y sin atribución requerida."
                  : formData.imageSource === "dalle"
                  ? "Imágenes únicas generadas por IA (~$0.07 por imagen, calidad media)."
                  : "Sube tus propias fotos directamente en el editor de cada slide."}
              </p>
            </div>
          )}
        </div>

        {/* Session History */}
        {historyEntries.length > 0 && (
          <div className="rounded-lg border border-border/50 bg-muted/20">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Historial</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                  {historyEntries.length}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${historyOpen ? "rotate-180" : ""}`} />
            </button>
            {historyOpen && (
              <div className="border-t border-border/50 px-3 py-3 space-y-2">
                {historyEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2 rounded-md border border-border/40 bg-card/50 p-2.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate leading-tight">{entry.topic}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {entry.slides.length} slides · {timeAgo(entry.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={() => onLoadHistory(entry)}
                      className="flex-shrink-0 rounded px-2 py-1 text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      Cargar
                    </button>
                  </div>
                ))}
                <button
                  onClick={onClearHistory}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-[10px] text-muted-foreground/60 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Limpiar historial
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border/50 p-4 space-y-2">
        {error && (
          <p className="text-xs text-destructive text-center">{error}</p>
        )}
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !formData.topic}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
