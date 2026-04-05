"use client"

import { Sparkles, ChevronDown, ImageIcon, Search } from "lucide-react"
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
import type { CarouselFormData, BrandSettings } from "@/lib/types"
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

export function InputPanel({
  formData = defaultFormData,
  onFormChange,
  onGenerate,
  isGenerating,
  error,
  brand,
  onBrandUpdate,
  onBrandClear,
}: InputPanelProps) {
  const [brandOpen, setBrandOpen] = useState(true)

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
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onFormChange({ imageSource: "unsplash" })}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs transition-all ${
                    formData.imageSource === "unsplash"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Unsplash</span>
                  <span className="ml-auto rounded px-1 py-0.5 text-[9px] font-medium bg-green-500/15 text-green-600">Gratis</span>
                </button>
                <button
                  onClick={() => onFormChange({ imageSource: "dalle" })}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs transition-all ${
                    formData.imageSource === "dalle"
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>DALL-E 3</span>
                  <span className="ml-auto rounded px-1 py-0.5 text-[9px] font-medium bg-yellow-500/15 text-yellow-600">IA</span>
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
                {formData.imageSource === "unsplash"
                  ? "Fotos reales de Unsplash, gratis y sin atribución requerida."
                  : "Imágenes únicas generadas por IA (~$0.04 por imagen)."}
              </p>
            </div>
          )}
        </div>
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
