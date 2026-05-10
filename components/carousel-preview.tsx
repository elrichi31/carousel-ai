"use client"

import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InstagramFrame } from "@/components/preview/instagram-frame"
import { TikTokFrame } from "@/components/preview/tiktok-frame"
import type { Slide, BrandSettings, PostCaption, Platform } from "@/lib/types"
import type { FontThemeId, BgStyleId } from "@/lib/themes"
import { cn } from "@/lib/utils"

interface CarouselPreviewProps {
  slides: Slide[]
  activeSlide: number
  onSlideChange: (index: number) => void
  brand?: BrandSettings | null
  caption?: PostCaption | null
  onCaptionChange?: (caption: PostCaption) => void
  activePrimary?: string
  fontTheme?: FontThemeId
  bgStyle?: BgStyleId
  platform: Platform
  onPlatformChange: (platform: Platform) => void
  isLoading?: boolean
  onUpdateField?: (field: keyof Slide, value: string) => void
  onUpdateListItem?: (index: number, text: string) => void
  editMode?: boolean
  onEditModeChange?: (editMode: boolean) => void
  onReorderSlides?: (from: number, to: number) => void
  onAddSlides?: () => void
  isAddingSlides?: boolean
}

interface ThumbnailStripProps {
  slides: Slide[]
  activeSlide: number
  onSlideChange: (index: number) => void
  onReorderSlides?: (from: number, to: number) => void
  onAddSlides?: () => void
  isAddingSlides?: boolean
}

function ThumbnailStrip({
  slides, activeSlide, onSlideChange, onReorderSlides, onAddSlides, isAddingSlides,
}: ThumbnailStripProps) {
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDragFrom(i)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOver(i)
  }

  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragFrom !== null && dragFrom !== i) {
      onReorderSlides?.(dragFrom, i)
    }
    setDragFrom(null)
    setDragOver(null)
  }

  const handleDragEnd = () => {
    setDragFrom(null)
    setDragOver(null)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 w-full scrollbar-hide">
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          draggable={!!onReorderSlides}
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          onClick={() => onSlideChange(i)}
          title={slide.title ?? `Slide ${i + 1}`}
          className={cn(
            "relative flex-shrink-0 h-[52px] w-10 rounded-md border-2 transition-all overflow-hidden",
            onReorderSlides ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
            i === activeSlide ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]" : "border-transparent hover:border-border/60",
            dragOver === i && dragFrom !== i ? "border-primary/60 scale-[1.08]" : "",
            dragFrom === i ? "opacity-40 scale-95" : "",
          )}
          style={{ backgroundColor: slide.backgroundColor || "#1a1a1a" }}
        >
          <span
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            style={{ color: slide.textColor || "#ffffff", opacity: 0.7 }}
          >
            {i + 1}
          </span>
        </button>
      ))}

      {onAddSlides && (
        <button
          onClick={onAddSlides}
          disabled={isAddingSlides}
          title="Agregar 2 slides con IA"
          className="flex-shrink-0 h-[52px] w-10 rounded-md border-2 border-dashed border-border/40 flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-all disabled:pointer-events-none disabled:opacity-40"
        >
          {isAddingSlides ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  )
}

export function CarouselPreview(props: CarouselPreviewProps) {
  const {
    slides, activeSlide, onSlideChange, platform, onPlatformChange,
    isLoading, onUpdateField, onUpdateListItem,
    onReorderSlides, onAddSlides, isAddingSlides,
  } = props
  const [internalEditMode, setInternalEditMode] = useState(false)
  const editMode = props.editMode ?? internalEditMode
  const setEditMode = props.onEditModeChange ?? setInternalEditMode

  const goToPrevious = () => onSlideChange(activeSlide > 0 ? activeSlide - 1 : slides.length - 1)
  const goToNext = () => onSlideChange(activeSlide < slides.length - 1 ? activeSlide + 1 : 0)

  const frameProps = {
    slides: props.slides,
    activeSlide: props.activeSlide,
    onSlideChange: props.onSlideChange,
    brand: props.brand,
    caption: props.caption,
    onCaptionChange: props.onCaptionChange,
    activePrimary: props.activePrimary,
    fontTheme: props.fontTheme,
    bgStyle: props.bgStyle,
    isLoading,
    editable: editMode,
    onUpdateField,
    onUpdateListItem,
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">
      {editMode && (
        <p className="text-[10px] text-muted-foreground/70 text-center">
          Haz clic en cualquier texto del slide para editarlo
        </p>
      )}

      <div className="relative flex items-center w-full justify-center gap-2">
        <Button
          variant="outline" size="icon"
          onClick={goToPrevious}
          className="shrink-0 h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1 min-w-0">
          {platform === "instagram"
            ? <InstagramFrame {...frameProps} />
            : <TikTokFrame {...frameProps} />}
        </div>

        <Button
          variant="outline" size="icon"
          onClick={goToNext}
          className="shrink-0 h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <ThumbnailStrip
        slides={slides}
        activeSlide={activeSlide}
        onSlideChange={onSlideChange}
        onReorderSlides={onReorderSlides}
        onAddSlides={onAddSlides}
        isAddingSlides={isAddingSlides}
      />
    </div>
  )
}
