"use client"

import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SlideRenderer } from "@/components/slide-renderer"
import type { Slide, BrandSettings, PostCaption } from "@/lib/types"
import type { FontThemeId, BgStyleId } from "@/lib/themes"

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
}

export function CarouselPreview({
  slides,
  activeSlide,
  onSlideChange,
  brand,
  caption,
  onCaptionChange,
  activePrimary,
  fontTheme,
  bgStyle,
}: CarouselPreviewProps) {
  const goToPrevious = () => {
    onSlideChange(activeSlide > 0 ? activeSlide - 1 : slides.length - 1)
  }

  const goToNext = () => {
    onSlideChange(activeSlide < slides.length - 1 ? activeSlide + 1 : 0)
  }

  const profileName = brand?.name || "your.account"

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* Instagram Post Frame */}
      <div className="w-full rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden">
        {/* Instagram Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex-shrink-0">
              <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                {brand?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand.logoUrl} alt={profileName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] font-semibold text-foreground">
                    {profileName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            {/* Username + location */}
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-foreground">{profileName}</span>
            </div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Slide Area with navigation */}
        <div className="relative">
          {/* Slide counter badge */}
          <div className="absolute top-2 right-2 z-10 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {activeSlide + 1}/{slides.length}
          </div>

          {/* Nav left */}
          {activeSlide > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-white" />
            </button>
          )}

          {/* Slide */}
          <div className="aspect-[4/5] w-full overflow-hidden">
            <SlideRenderer
              slide={slides[activeSlide]}
              brand={brand}
              activePrimary={activePrimary}
              fontTheme={fontTheme}
              bgStyle={bgStyle}
            />
          </div>

          {/* Nav right */}
          {activeSlide < slides.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5 text-white" />
            </button>
          )}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1 pt-2 pb-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className={`rounded-full transition-all ${
                index === activeSlide
                  ? "h-1.5 w-4 bg-blue-500"
                  : "h-1.5 w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <button className="text-foreground hover:text-red-500 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <button className="text-foreground hover:text-foreground/70 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="text-foreground hover:text-foreground/70 transition-colors">
              <Send className="h-5 w-5" />
            </button>
          </div>
          <button className="text-foreground hover:text-foreground/70 transition-colors">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>

        {/* Caption + Hashtags editor */}
        {caption !== undefined && (
          <div className="px-3 pb-3 space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Caption
            </p>
            <textarea
              value={caption?.text ?? ""}
              onChange={(e) =>
                onCaptionChange?.({ text: e.target.value, hashtags: caption?.hashtags ?? [] })
              }
              placeholder="Tu descripción aparecerá aquí después de generar el carrusel..."
              rows={3}
              className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            {(caption?.hashtags?.length ?? 0) > 0 && (
              <>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Hashtags
                </p>
                <textarea
                  value={caption?.hashtags.map((h) => `#${h}`).join(" ") ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value
                    const tags = raw
                      .split(/[\s,]+/)
                      .map((t) => t.replace(/^#/, "").trim())
                      .filter(Boolean)
                    onCaptionChange?.({ text: caption?.text ?? "", hashtags: tags })
                  }}
                  rows={3}
                  className="w-full resize-none rounded-md border border-border/50 bg-background/50 px-2.5 py-2 text-xs text-primary placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* External navigation (for accessibility / alternative nav) */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-[60px] text-center">
          {activeSlide + 1} / {slides.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
