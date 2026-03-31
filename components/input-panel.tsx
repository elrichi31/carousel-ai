"use client"

import { Sparkles, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
          <Input
            id="topic"
            placeholder="e.g., 5 ataques de ciberseguridad"
            value={formData.topic}
            onChange={(e) => onFormChange({ topic: e.target.value })}
            className="border-border/50 bg-muted/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
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
