"use client"

import { useRef, useState } from "react"
import { Upload, X, Palette, User, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { extractColorsFromImage } from "@/lib/color-extractor"
import type { BrandSettings } from "@/lib/types"

interface BrandPanelProps {
  brand: BrandSettings
  onUpdate: (updates: Partial<BrandSettings>) => void
  onClear: () => void
}

export function BrandPanel({ brand, onUpdate, onClear }: BrandPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [extracting, setExtracting] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert to base64
    const reader = new FileReader()
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string
      onUpdate({ logoUrl: dataUrl })

      // Extract colors automatically
      setExtracting(true)
      const colors = await extractColorsFromImage(dataUrl)
      if (colors.length > 0) {
        onUpdate({ colors })
      }
      setExtracting(false)
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be re-uploaded
    e.target.value = ""
  }

  const removeLogo = () => {
    onUpdate({ logoUrl: null, colors: [] })
  }

  const removeColor = (index: number) => {
    const newColors = brand.colors.filter((_, i) => i !== index)
    onUpdate({ colors: newColors })
  }

  const addColor = (color: string) => {
    if (brand.colors.length < 6) {
      onUpdate({ colors: [...brand.colors, color] })
    }
  }

  return (
    <div className="space-y-5">
      {/* Brand Name */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          Brand Name
        </Label>
        <Input
          placeholder="e.g., TechBro, Mi Marca"
          value={brand.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="border-border/50 bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Upload className="h-3.5 w-3.5" />
          Logo
        </Label>

        {brand.logoUrl ? (
          <div className="relative flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
              <img
                src={brand.logoUrl}
                alt="Brand logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs text-foreground">Logo uploaded</p>
              {extracting && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Extracting colors...
                </p>
              )}
            </div>
            <button
              onClick={removeLogo}
              className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border/50 bg-muted/20 px-4 py-6 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">Click to upload your logo</span>
            <span className="text-[10px] opacity-60">PNG, JPG, SVG</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleLogoUpload}
          className="hidden"
        />
      </div>

      {/* Brand Colors */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Palette className="h-3.5 w-3.5" />
          Brand Colors
          {brand.colors.length > 0 && (
            <span className="ml-auto text-[10px] opacity-60">
              {brand.logoUrl ? "Extracted from logo" : "Custom"}
            </span>
          )}
        </Label>

        {brand.colors.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {brand.colors.map((color, i) => (
              <div key={i} className="group relative">
                <div
                  className="h-8 w-8 rounded-full border border-border/50 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <button
                  onClick={() => removeColor(i)}
                  className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {brand.colors.length < 6 && (
              <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                <span className="text-lg leading-none">+</span>
                <input
                  type="color"
                  className="sr-only"
                  onChange={(e) => addColor(e.target.value)}
                />
              </label>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground opacity-60">
              Upload a logo to auto-extract, or
            </p>
            <label className="cursor-pointer text-xs text-primary hover:underline">
              pick manually
              <input
                type="color"
                className="sr-only"
                onChange={(e) => addColor(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>

      {/* Clear all */}
      {(brand.name || brand.logoUrl || brand.colors.length > 0) && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="w-full border-border/50 bg-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Clear Branding
        </Button>
      )}
    </div>
  )
}
