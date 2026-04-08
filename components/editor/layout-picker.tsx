"use client"

import { useState } from "react"
import {
  LayoutGrid, AlignCenter, AlignLeft, Columns2, Hash, Quote,
  MousePointerClick, ListChecks, GalleryThumbnails, ChevronDown,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { SlideVariantPreview } from "@/components/slide-renderer"
import {
  coverVariants, ctaVariants, contentVariants, listVariants,
  bigNumberVariants, quoteVariants, splitVariants, imageOverlayVariants,
} from "@/components/slide-renderer"
import type { Slide, SlideLayout } from "@/lib/types"
import type { BgStyleId } from "@/lib/themes"

const LAYOUT_LABELS: Partial<Record<SlideLayout, { label: string; icon: typeof AlignCenter }>> = {
  cover:        { label: "Cover",   icon: AlignCenter       },
  content:      { label: "Content", icon: AlignLeft         },
  list:         { label: "List",    icon: ListChecks        },
  bigNumber:    { label: "Number",  icon: Hash              },
  quote:        { label: "Quote",   icon: Quote             },
  split:        { label: "Split",   icon: Columns2          },
  imageOverlay: { label: "Overlay", icon: GalleryThumbnails },
  cta:          { label: "CTA",     icon: MousePointerClick },
}

function getVariants(layout: SlideLayout) {
  switch (layout) {
    case 'cover':        return coverVariants
    case 'cta':          return ctaVariants
    case 'content':      return contentVariants
    case 'list':         return listVariants
    case 'bigNumber':    return bigNumberVariants
    case 'quote':        return quoteVariants
    case 'split':        return splitVariants
    case 'imageOverlay': return imageOverlayVariants
    default:             return []
  }
}

interface LayoutPickerProps {
  slide: Slide
  slideIndex: number
  totalSlides: number
  activePrimary: string
  selectedBgStyle: BgStyleId
  onVariantChange: (variant: string) => void
}

export function LayoutPicker({
  slide, slideIndex, totalSlides, activePrimary, selectedBgStyle, onVariantChange,
}: LayoutPickerProps) {
  const [variantOpen, setVariantOpen] = useState(false)

  const selectedLayout = slide.layout
  const currentVariant = slide.layoutVariant ?? 'default'
  const isCoverSlide = slideIndex === 0
  const isCtaSlide = slideIndex === totalSlides - 1
  const variants = getVariants(selectedLayout)
  const variantLabel = variants.find(v => v.id === currentVariant)?.label ?? currentVariant

  const meta = LAYOUT_LABELS[selectedLayout]
  const Icon = meta?.icon ?? AlignCenter
  const label = meta?.label ?? selectedLayout
  const isLocked = isCoverSlide || isCtaSlide

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-xs text-muted-foreground">
        <LayoutGrid className="h-3.5 w-3.5" />
        Layout
      </Label>

      {/* Current layout — display only (not clickable for middle slides) */}
      <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-3 py-2 text-xs text-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="flex-1 font-medium">{label}</span>
        {isLocked && (
          <span className="text-[10px] text-muted-foreground">locked</span>
        )}
      </div>

      {/* Variant picker */}
      {variants.length > 0 && (
        <VariantPicker
          variants={variants}
          currentVariant={currentVariant}
          variantLabel={variantLabel}
          open={variantOpen}
          onToggle={() => setVariantOpen((v) => !v)}
          onSelect={(id) => { onVariantChange(id); setVariantOpen(false) }}
          slide={slide}
          primary={activePrimary}
          bgStyle={selectedBgStyle}
        />
      )}
    </div>
  )
}

function VariantPicker({
  variants, currentVariant, variantLabel, open, onToggle, onSelect, slide, primary, bgStyle,
}: {
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
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`flex flex-col gap-1.5 rounded-lg border p-1.5 transition-all ${
                currentVariant === v.id
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-muted/30 hover:border-border"
              }`}
            >
              <div className="aspect-[4/5] w-full overflow-hidden rounded-md">
                <SlideVariantPreview slide={{ ...slide, layoutVariant: v.id }} primary={primary} bgStyle={bgStyle} />
              </div>
              <span className={`text-center text-[10px] ${currentVariant === v.id ? "text-primary" : "text-muted-foreground"}`}>
                {v.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
