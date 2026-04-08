"use client"

import { useRef } from "react"
import { Palette, Type, Wallpaper, Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  colorThemes, fontThemes, bgStyles, buildBgStyle, CUSTOM_COLOR_ID,
  type ColorThemeId, type FontThemeId, type BgStyleId,
} from "@/lib/themes"

const PINNED: ColorThemeId[] = ["green", "blue", "purple", "orange"]

interface ThemePickerProps {
  selectedColor: ColorThemeId | typeof CUSTOM_COLOR_ID
  customColor: string
  selectedFont: FontThemeId
  selectedBgStyle: BgStyleId
  activePrimary: string
  brandColors?: string[]
  onColorChange: (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => void
  onFontChange: (font: FontThemeId) => void
  onBgStyleChange: (style: BgStyleId) => void
}

export function ThemePicker({
  selectedColor, customColor, selectedFont, selectedBgStyle,
  activePrimary, brandColors = [],
  onColorChange, onFontChange, onBgStyleChange,
}: ThemePickerProps) {
  const colorInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
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
                className={`h-7 w-7 rounded-full transition-all ${isActive ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                style={{ backgroundColor: theme.primary }}
              >
                <span className="sr-only">{theme.label}</span>
              </button>
            )
          })}

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
                    className={`h-7 w-7 rounded-full transition-all border border-border/30 ${isActive ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}
                    style={{ backgroundColor: hex }}
                  >
                    <span className="sr-only">Brand color {hex}</span>
                  </button>
                )
              })}
            </>
          )}

          {/* Custom color swatch or picker button */}
          {(() => {
            const isBrandColor = selectedColor === CUSTOM_COLOR_ID && brandColors.includes(customColor)
            if (selectedColor === CUSTOM_COLOR_ID && !isBrandColor) {
              return (
                <div className="group relative">
                  <button
                    onClick={() => colorInputRef.current?.click()}
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
    </>
  )
}
