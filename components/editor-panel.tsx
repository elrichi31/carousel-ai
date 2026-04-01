"use client"

import { useRef, useState } from "react"
import {
  LayoutGrid, Palette, Type, RefreshCw, Copy, Download,
  AlignCenter, AlignLeft, Columns2, Hash, Quote,
  MousePointerClick, ListChecks, Plus, Wallpaper, ChevronDown,
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
import { coverVariants, ctaVariants, SlideVariantPreview } from "@/components/slide-renderer"

const layoutOptions: { id: SlideLayout; label: string; icon: typeof AlignCenter }[] = [
  { id: "cover",     label: "Cover",   icon: AlignCenter      },
  { id: "content",   label: "Content", icon: AlignLeft        },
  { id: "list",      label: "List",    icon: ListChecks       },
  { id: "bigNumber", label: "Number",  icon: Hash             },
  { id: "quote",     label: "Quote",   icon: Quote            },
  { id: "split",     label: "Split",   icon: Columns2         },
  { id: "cta",       label: "CTA",     icon: MousePointerClick },
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
  onLayoutChange: (layout: SlideLayout) => void
  onVariantChange: (variant: string) => void
  onColorChange: (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => void
  onFontChange: (font: FontThemeId) => void
  onBgStyleChange: (style: BgStyleId) => void
  onRegenerateSlide: () => void
  onDuplicateSlide: () => void
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
  onLayoutChange,
  onVariantChange,
  onColorChange,
  onFontChange,
  onBgStyleChange,
  onRegenerateSlide,
  onDuplicateSlide,
}: EditorPanelProps) {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const [variantPickerOpen, setVariantPickerOpen] = useState<'cover' | 'cta' | null>(null)

  const selectedLayout = currentSlide.layout
  const currentVariant = currentSlide.layoutVariant ?? 'centered'

  // Cover is locked to first slide, CTA to last slide
  const isCoverSlide = slideIndex === 0
  const isCtaSlide = slideIndex === totalSlides - 1
  const isLockedLayout = isCoverSlide || isCtaSlide

  const variants = isCoverSlide ? coverVariants : isCtaSlide ? ctaVariants : []
  const pickerKey = isCoverSlide ? 'cover' : 'cta'

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
            /* Locked layout: show active layout + variant picker button */
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-xs text-foreground">
                {isCoverSlide ? <AlignCenter className="h-3.5 w-3.5" /> : <MousePointerClick className="h-3.5 w-3.5" />}
                <span className="flex-1">{isCoverSlide ? 'Cover' : 'CTA'}</span>
                <span className="text-[10px] text-muted-foreground">locked</span>
              </div>

              {/* Variant picker toggle */}
              <button
                onClick={() => setVariantPickerOpen(v => v === pickerKey ? null : pickerKey)}
                className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-muted/50 px-3 py-2 text-xs text-muted-foreground hover:border-border hover:text-foreground transition-all"
              >
                <span>Estilo: <span className="text-foreground font-medium capitalize">{currentVariant}</span></span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${variantPickerOpen === pickerKey ? 'rotate-180' : ''}`} />
              </button>

              {/* Variant grid */}
              {variantPickerOpen === pickerKey && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {variants.map((v) => {
                    const previewSlide: Slide = { ...currentSlide, layoutVariant: v.id }
                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          onVariantChange(v.id)
                          setVariantPickerOpen(null)
                        }}
                        className={`flex flex-col gap-1.5 rounded-lg border p-1.5 transition-all ${
                          currentVariant === v.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 bg-muted/30 hover:border-border'
                        }`}
                      >
                        {/* Mini slide preview */}
                        <div className="aspect-[4/5] w-full overflow-hidden rounded-md">
                          <SlideVariantPreview
                            slide={previewSlide}
                            primary={activePrimary}
                            bgStyle={selectedBgStyle}
                          />
                        </div>
                        <span className={`text-center text-[10px] ${currentVariant === v.id ? 'text-primary' : 'text-muted-foreground'}`}>
                          {v.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Normal layout grid */
            <div className="grid grid-cols-2 gap-2">
              {layoutOptions
                .filter(o => o.id !== 'cover' && o.id !== 'cta')
                .map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.id}
                      onClick={() => onLayoutChange(option.id)}
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

            {selectedColor === CUSTOM_COLOR_ID && (
              <button
                onClick={() => colorInputRef.current?.click()}
                title="Custom color"
                className="h-7 w-7 rounded-full ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110 transition-all"
                style={{ backgroundColor: customColor }}
              >
                <span className="sr-only">Custom</span>
              </button>
            )}

            <button
              onClick={() => colorInputRef.current?.click()}
              title="Pick a custom color"
              className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/40 hover:border-muted-foreground/80 hover:scale-105 transition-all"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            <input
              ref={colorInputRef}
              type="color"
              className="sr-only"
              value={selectedColor === CUSTOM_COLOR_ID ? customColor : '#22c55e'}
              onChange={(e) => onColorChange(CUSTOM_COLOR_ID, e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            {(Object.keys(colorThemes) as ColorThemeId[])
              .filter((id) => !PINNED.includes(id))
              .map((id) => {
                const theme = colorThemes[id]
                const isActive = selectedColor === id
                return (
                  <button
                    key={id}
                    onClick={() => onColorChange(id)}
                    title={theme.label}
                    className={`h-5 w-5 rounded-full transition-all ${
                      isActive
                        ? 'ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110'
                        : 'opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: theme.primary }}
                  >
                    <span className="sr-only">{theme.label}</span>
                  </button>
                )
              })}
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

        {/* Actions */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Actions</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateSlide}
              className="border-border/50 bg-transparent text-foreground hover:bg-muted"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDuplicateSlide}
              className="border-border/50 bg-transparent text-foreground hover:bg-muted"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Duplicate
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 p-4">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="mr-2 h-4 w-4" />
          Export Carousel
        </Button>
      </div>
    </div>
  )
}
