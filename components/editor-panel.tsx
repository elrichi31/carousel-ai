"use client"

import {
  LayoutGrid,
  Palette,
  Type,
  RefreshCw,
  Copy,
  Download,
  AlignCenter,
  AlignLeft,
  Columns2,
  Hash,
  Quote,
  MousePointerClick,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { SlideLayout } from "@/lib/types"

const layoutOptions: { id: SlideLayout; label: string; icon: typeof AlignCenter }[] = [
  { id: "cover", label: "Cover", icon: AlignCenter },
  { id: "content", label: "Content", icon: AlignLeft },
  { id: "list", label: "List", icon: ListChecks },
  { id: "bigNumber", label: "Number", icon: Hash },
  { id: "quote", label: "Quote", icon: Quote },
  { id: "split", label: "Split", icon: Columns2 },
  { id: "cta", label: "CTA", icon: MousePointerClick },
]

const colorOptions = [
  { id: "default", color: "bg-primary", label: "Green" },
  { id: "blue", color: "bg-chart-2", label: "Blue" },
  { id: "purple", color: "bg-chart-4", label: "Purple" },
  { id: "orange", color: "bg-chart-5", label: "Orange" },
]

const fontOptions = [
  { id: "sans", label: "Sans Serif" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Monospace" },
]

interface EditorPanelProps {
  selectedLayout: SlideLayout
  selectedColor: string
  selectedFont: string
  onLayoutChange: (layout: SlideLayout) => void
  onColorChange: (color: string) => void
  onFontChange: (font: string) => void
  onRegenerateSlide: () => void
  onDuplicateSlide: () => void
}

export function EditorPanel({
  selectedLayout,
  selectedColor,
  selectedFont,
  onLayoutChange,
  onColorChange,
  onFontChange,
  onRegenerateSlide,
  onDuplicateSlide,
}: EditorPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Edit Slide</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Customize your content
        </p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Layout options */}
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

        {/* Color options */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            Color Theme
          </Label>
          <div className="flex gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onColorChange(option.id)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${option.color} ${
                  selectedColor === option.id
                    ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "opacity-60 hover:opacity-100"
                }`}
                title={option.label}
              >
                <span className="sr-only">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font options */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Type className="h-3.5 w-3.5" />
            Typography
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {fontOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onFontChange(option.id)}
                className={`rounded-lg border px-3 py-2 text-xs transition-all ${
                  selectedFont === option.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {option.label}
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
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Carousel
        </Button>
      </div>
    </div>
  )
}
