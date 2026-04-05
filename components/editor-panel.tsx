"use client"

import { useRef, useState, useEffect } from "react"
import {
  LayoutGrid, Palette, Type, RefreshCw, Copy, Download,
  AlignCenter, AlignLeft, Columns2, Hash, Quote,
  MousePointerClick, ListChecks, Plus, Wallpaper, ChevronDown, X,
  ImageIcon, Sparkles, Search, Trash2, GalleryThumbnails,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Slide, SlideLayout } from "@/lib/types"
import {
  colorThemes, fontThemes, bgStyles, buildBgStyle, CUSTOM_COLOR_ID,
  type ColorThemeId, type FontThemeId, type BgStyleId,
} from "@/lib/themes"
import { coverVariants, ctaVariants, contentVariants, listVariants, bigNumberVariants, quoteVariants, splitVariants, imageOverlayVariants, SlideVariantPreview } from "@/components/slide-renderer"

const layoutOptions: { id: SlideLayout; label: string; icon: typeof AlignCenter }[] = [
  { id: "cover",        label: "Cover",   icon: AlignCenter        },
  { id: "content",      label: "Content", icon: AlignLeft          },
  { id: "list",         label: "List",    icon: ListChecks         },
  { id: "bigNumber",    label: "Number",  icon: Hash               },
  { id: "quote",        label: "Quote",   icon: Quote              },
  { id: "split",        label: "Split",   icon: Columns2           },
  { id: "imageOverlay", label: "Overlay", icon: GalleryThumbnails  },
  { id: "cta",          label: "CTA",     icon: MousePointerClick  },
]

const PINNED: ColorThemeId[] = ["green", "blue", "purple", "orange"]

interface EditorPanelProps {
  currentSlide: Slide
  slideIndex: number
  totalSlides: number
  selectedColor: ColorThemeId | typeof CUSTOM_COLOR_ID
  customColor: string
  selectedFont: FontThemeId
  selectedBgStyle: BgStyleId
  activePrimary: string
  brandColors?: string[]
  onLayoutChange: (layout: SlideLayout) => void
  onVariantChange: (variant: string) => void
  onColorChange: (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => void
  onFontChange: (font: FontThemeId) => void
  onBgStyleChange: (style: BgStyleId) => void
  onRegenerateSlide: () => void
  onDuplicateSlide: () => void
  onExport: () => void
  onImageSearch: () => void
  onImageGenerate: () => void
  onImageRemove: () => void
  onImageRegenerateWithPrompt: (prompt: string) => void
  isRegenerating?: boolean
  isExporting?: boolean
  isImageLoading?: boolean
}

export function EditorPanel({
  currentSlide,
  slideIndex,
  totalSlides,
  selectedColor,
  customColor,
  selectedFont,
  selectedBgStyle,
  activePrimary,
  brandColors = [],
  onLayoutChange,
  onVariantChange,
  onColorChange,
  onFontChange,
  onBgStyleChange,
  onRegenerateSlide,
  onDuplicateSlide,
  onExport,
  onImageSearch,
  onImageGenerate,
  onImageRemove,
  onImageRegenerateWithPrompt,
  isRegenerating = false,
  isExporting = false,
  isImageLoading = false,
}: EditorPanelProps) {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [variantPickerOpen, setVariantPickerOpen] = useState<string | null>(null)
  const [editedPrompt, setEditedPrompt] = useState(currentSlide.imagePrompt ?? "")

  // Sync local prompt state when the active slide changes
  useEffect(() => {
    setEditedPrompt(currentSlide.imagePrompt ?? "")
  }, [currentSlide.id, currentSlide.imagePrompt])

  const selectedLayout = currentSlide.layout
  const currentVariant = currentSlide.layoutVariant ?? 'default'

  // Cover is locked to first slide, CTA to last slide
  const isCoverSlide = slideIndex === 0
  const isCtaSlide = slideIndex === totalSlides - 1
  const isLockedLayout = isCoverSlide || isCtaSlide

  // Show image section for layouts/variants that render an image
  const supportsImage =
    selectedLayout === "imageOverlay" ||
    selectedLayout === "split" ||
    (selectedLayout === "content" &&
      (currentVariant === "image-right" || currentVariant === "image-left"))

  function getLayoutVariants(layout: typeof selectedLayout) {
    switch (layout) {
      case 'cover':      return coverVariants
      case 'cta':        return ctaVariants
      case 'content':    return contentVariants
      case 'list':       return listVariants
      case 'bigNumber':  return bigNumberVariants
      case 'quote':      return quoteVariants
      case 'split':        return splitVariants
      case 'imageOverlay': return imageOverlayVariants
      default:             return []
    }
  }

  const variants = getLayoutVariants(selectedLayout)
  const variantLabel = variants.find(v => v.id === currentVariant)?.label ?? currentVariant

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Edit Slide</h3>
        <p className="mt-1 text-xs text-muted-foreground">Customize your content</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">

        {/* Layout */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <LayoutGrid className="h-3.5 w-3.5" />
            Layout
          </Label>

          {isLockedLayout ? (
            /* Locked layout: show active layout + variant picker */
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-xs text-foreground">
                {isCoverSlide ? <AlignCenter className="h-3.5 w-3.5" /> : <MousePointerClick className="h-3.5 w-3.5" />}
                <span className="flex-1">{isCoverSlide ? 'Cover' : 'CTA'}</span>
                <span className="text-[10px] text-muted-foreground">locked</span>
              </div>
              <VariantPicker
                layout={selectedLayout}
                variants={variants}
                currentVariant={currentVariant}
                variantLabel={variantLabel}
                open={variantPickerOpen === selectedLayout}
                onToggle={() => setVariantPickerOpen(v => v === selectedLayout ? null : selectedLayout)}
                onSelect={(id) => { onVariantChange(id); setVariantPickerOpen(null) }}
                slide={currentSlide}
                primary={activePrimary}
                bgStyle={selectedBgStyle}
              />
            </div>
          ) : (
            /* Normal layout grid + variant picker */
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions
                  .filter(o => o.id !== 'cover' && o.id !== 'cta' && o.id !== 'imageOverlay')
                  .map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.id}
                        onClick={() => { onLayoutChange(option.id); setVariantPickerOpen(null) }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                          selectedLayout === option.id
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {option.label}
                      </button>
                    )
                  })}
              </div>
              {/* Image Overlay — special layout, only shown when slide has an image */}
              {currentSlide.imageUrl && (
                <button
                  onClick={() => { onLayoutChange("imageOverlay"); setVariantPickerOpen(null) }}
                  className={`col-span-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                    selectedLayout === "imageOverlay"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <GalleryThumbnails className="h-3.5 w-3.5" />
                  Imagen con texto encima
                </button>
              )}

              {variants.length > 0 && (
                <VariantPicker
                  layout={selectedLayout}
                  variants={variants}
                  currentVariant={currentVariant}
                  variantLabel={variantLabel}
                  open={variantPickerOpen === selectedLayout}
                  onToggle={() => setVariantPickerOpen(v => v === selectedLayout ? null : selectedLayout)}
                  onSelect={(id) => { onVariantChange(id); setVariantPickerOpen(null) }}
                  slide={currentSlide}
                  primary={activePrimary}
                  bgStyle={selectedBgStyle}
                />
              )}
            </div>
          )}
        </div>

        {/* Color theme */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            Color Theme
          </Label>
          <div className="flex items-center gap-2 flex-wrap">
            {PINNED.map((id) => {
              const theme = colorThemes[id]
              const isActive = selectedColor === id
              return (
                <button
                  key={id}
                  onClick={() => onColorChange(id)}
                  title={theme.label}
                  className={`h-7 w-7 rounded-full transition-all ${
                    isActive
                      ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                >
                  <span className="sr-only">{theme.label}</span>
                </button>
              )
            })}

            {/* Brand colors extracted from logo */}
            {brandColors.length > 0 && (
              <>
                <div className="h-5 w-px bg-border/60 mx-0.5" />
                {brandColors.map((hex, i) => {
                  const isActive = selectedColor === CUSTOM_COLOR_ID && customColor === hex
                  return (
                    <button
                      key={`brand-${i}`}
                      onClick={() => onColorChange(CUSTOM_COLOR_ID, hex)}
                      title={`Brand: ${hex}`}
                      className={`h-7 w-7 rounded-full transition-all border border-border/30 ${
                        isActive
                          ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110'
                          : 'opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      <span className="sr-only">Brand color {hex}</span>
                    </button>
                  )
                })}
              </>
            )}

            {/* Custom color picker — hide the active swatch when a brand color is selected */}
            {(() => {
              const isBrandColor = selectedColor === CUSTOM_COLOR_ID && brandColors.includes(customColor)
              if (selectedColor === CUSTOM_COLOR_ID && !isBrandColor) {
                return (
                  <div className="group relative">
                    <button
                      onClick={() => colorInputRef.current?.click()}
                      title="Edit custom color"
                      className="h-7 w-7 rounded-full ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110 transition-all"
                      style={{ backgroundColor: customColor }}
                    >
                      <span className="sr-only">Custom</span>
                    </button>
                    <button
                      onClick={() => onColorChange('green')}
                      title="Remove custom color"
                      className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )
              }
              return (
                <button
                  onClick={() => colorInputRef.current?.click()}
                  title="Pick a custom color"
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 hover:border-muted-foreground/80 hover:scale-105 transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )
            })()}

            <input
              ref={colorInputRef}
              type="color"
              className="sr-only"
              value={selectedColor === CUSTOM_COLOR_ID ? customColor : '#22c55e'}
              onChange={(e) => onColorChange(CUSTOM_COLOR_ID, e.target.value)}
            />
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Type className="h-3.5 w-3.5" />
            Typography
          </Label>
          <Select value={selectedFont} onValueChange={(v) => onFontChange(v as FontThemeId)}>
            <SelectTrigger className="border-border/50 bg-muted/50 text-foreground text-xs h-9">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              {(Object.entries(fontThemes) as [FontThemeId, typeof fontThemes[FontThemeId]][]).map(([id, theme]) => (
                <SelectItem key={id} value={id}>
                  <span style={{ fontFamily: theme.family }}>{theme.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background Style */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Wallpaper className="h-3.5 w-3.5" />
            Background Style
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(bgStyles) as [BgStyleId, typeof bgStyles[BgStyleId]][]).map(([id, style]) => (
              <button
                key={id}
                onClick={() => onBgStyleChange(id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all ${
                  selectedBgStyle === id
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <div className="h-8 w-full rounded" style={buildBgStyle(activePrimary, id, 30, 8)} />
                <span className="text-[10px]">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image */}
        {supportsImage && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5" />
              Image
            </Label>

            {currentSlide.imageUrl ? (
              /* Preview + actions when an image exists */
              <div className="space-y-2">
                <div className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/30" style={{ aspectRatio: "3/4" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide.imageUrl}
                    alt="Slide image"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={onImageRemove}
                    title="Remove image"
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                {/* Editable prompt / keywords box */}
                {currentSlide.imagePrompt !== undefined && (
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5 space-y-2">
                    <div className="flex items-center gap-1.5">
                      {currentSlide.imageSource === "dalle" ? (
                        <Sparkles className="h-2.5 w-2.5 text-muted-foreground/50 flex-shrink-0" />
                      ) : (
                        <Search className="h-2.5 w-2.5 text-muted-foreground/50 flex-shrink-0" />
                      )}
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                        {currentSlide.imageSource === "dalle" ? "Prompt generado" : "Keywords de búsqueda"}
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
                      onClick={() => onImageRegenerateWithPrompt(editedPrompt)}
                      disabled={isImageLoading || !editedPrompt.trim()}
                      className="flex w-full items-center justify-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                    >
                      {isImageLoading ? (
                        <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      {isImageLoading ? "Generando..." : "Regenerar con este prompt"}
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onImageSearch}
                    disabled={isImageLoading}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border/50 bg-muted/50 px-2 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
                  >
                    {isImageLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    ) : (
                      <Search className="h-3 w-3" />
                    )}
                    Unsplash
                  </button>
                  <button
                    onClick={onImageGenerate}
                    disabled={isImageLoading}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border/50 bg-muted/50 px-2 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
                  >
                    {isImageLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    AI
                  </button>
                </div>
              </div>
            ) : (
              /* Empty state — no image yet */
              <div className="space-y-2">
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 py-6">
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground/50">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px]">Sin imagen</span>
                  </div>
                </div>
                <button
                  onClick={onImageSearch}
                  disabled={isImageLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/50 py-2.5 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
                >
                  {isImageLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                  {isImageLoading ? "Buscando..." : "Buscar en Unsplash"}
                </button>
                <button
                  onClick={onImageGenerate}
                  disabled={isImageLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-border/50 bg-muted/50 py-2.5 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all disabled:opacity-50"
                >
                  {isImageLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {isImageLoading ? "Generando..." : "Generar con IA"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Slide Actions</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateSlide}
              disabled={isRegenerating}
              className="border-border/50 bg-transparent text-foreground hover:bg-muted disabled:opacity-50"
            >
              {isRegenerating ? (
                <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
              ) : (
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
              )}
              {isRegenerating ? "..." : "Regenerate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicateSlide}
              title="Insert a copy of this slide after it"
              className="border-border/50 bg-transparent text-foreground hover:bg-muted"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Duplicate
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 p-4">
        <Button
          onClick={onExport}
          disabled={isExporting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Carousel
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Shared variant picker sub-component ─────────────────────────────────────

function VariantPicker({
  variants, currentVariant, variantLabel, open, onToggle, onSelect, slide, primary, bgStyle,
}: {
  layout: SlideLayout
  variants: { id: string; label: string }[]
  currentVariant: string
  variantLabel: string
  open: boolean
  onToggle: () => void
  onSelect: (id: string) => void
  slide: Slide
  primary: string
  bgStyle: BgStyleId
}) {
  if (variants.length === 0) return null
  return (
    <>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-muted/50 px-3 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all"
      >
        <span>Estilo: <span className="text-foreground font-medium capitalize">{variantLabel}</span></span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {variants.map((v) => {
            const previewSlide: Slide = { ...slide, layoutVariant: v.id }
            return (
              <button
                key={v.id}
                onClick={() => onSelect(v.id)}
                className={`flex flex-col gap-1.5 rounded-lg border p-1.5 transition-all ${
                  currentVariant === v.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 bg-muted/30 hover:border-border'
                }`}
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-md">
                  <SlideVariantPreview slide={previewSlide} primary={primary} bgStyle={bgStyle} />
                </div>
                <span className={`text-center text-[10px] ${currentVariant === v.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {v.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
