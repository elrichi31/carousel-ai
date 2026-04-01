"use client"

import { useRef } from "react"
import {
  LayoutGrid, Palette, Type, RefreshCw, Copy, Download,
  AlignCenter, AlignLeft, Columns2, Hash, Quote,
  MousePointerClick, ListChecks, Plus,
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
import type { SlideLayout } from "@/lib/types"
import {
  colorThemes, fontThemes, CUSTOM_COLOR_ID,
  type ColorThemeId, type FontThemeId,
} from "@/lib/themes"

const layoutOptions: { id: SlideLayout; label: string; icon: typeof AlignCenter }[] = [
  { id: "cover",     label: "Cover",   icon: AlignCenter     },
  { id: "content",   label: "Content", icon: AlignLeft       },
  { id: "list",      label: "List",    icon: ListChecks      },
  { id: "bigNumber", label: "Number",  icon: Hash            },
  { id: "quote",     label: "Quote",   icon: Quote           },
  { id: "split",     label: "Split",   icon: Columns2        },
  { id: "cta",       label: "CTA",     icon: MousePointerClick },
]

// The 4 pinned presets shown as swatches
const PINNED: ColorThemeId[] = ["green", "blue", "purple", "orange"]

interface EditorPanelProps {
  selectedLayout: SlideLayout
  selectedColor: ColorThemeId | typeof CUSTOM_COLOR_ID
  customColor: string            // hex value when custom is active
  selectedFont: FontThemeId
  onLayoutChange: (layout: SlideLayout) => void
  onColorChange: (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => void
  onFontChange: (font: FontThemeId) => void
  onRegenerateSlide: () => void
  onDuplicateSlide: () => void
}

export function EditorPanel({
  selectedLayout,
  selectedColor,
  customColor,
  selectedFont,
  onLayoutChange,
  onColorChange,
  onFontChange,
  onRegenerateSlide,
  onDuplicateSlide,
}: EditorPanelProps) {
  const colorInputRef = useRef<HTMLInputElement>(null)

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
          <div className="grid grid-cols-2 gap-2">
            {layoutOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => onLayoutChange(option.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                    selectedLayout === option.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              )
            })}
          </div>
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
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ backgroundColor: theme.primary }}
                >
                  <span className="sr-only">{theme.label}</span>
                </button>
              )
            })}

            {/* Custom color swatch (shown when active) */}
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

            {/* + button to open native color picker */}
            <button
              onClick={() => colorInputRef.current?.click()}
              title="Pick a custom color"
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed transition-all ${
                selectedColor === CUSTOM_COLOR_ID
                  ? "border-muted-foreground/40"
                  : "border-muted-foreground/40 hover:border-muted-foreground/80 hover:scale-105"
              }`}
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="sr-only">Custom color</span>
            </button>

            {/* Hidden native color input */}
            <input
              ref={colorInputRef}
              type="color"
              className="sr-only"
              value={selectedColor === CUSTOM_COLOR_ID ? customColor : "#22c55e"}
              onChange={(e) => onColorChange(CUSTOM_COLOR_ID, e.target.value)}
            />
          </div>

          {/* Show all 8 presets in a secondary row */}
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
                        ? "ring-2 ring-foreground ring-offset-1 ring-offset-background scale-110"
                        : "opacity-50 hover:opacity-100 hover:scale-105"
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
