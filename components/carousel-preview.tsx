"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SlideRenderer } from "@/components/slide-renderer"
import type { Slide, BrandSettings } from "@/lib/types"

interface CarouselPreviewProps {
  slides: Slide[]
  activeSlide: number
  onSlideChange: (index: number) => void
  brand?: BrandSettings | null
}

export function CarouselPreview({
  slides,
  activeSlide,
  onSlideChange,
  brand,
}: CarouselPreviewProps) {
  const goToPrevious = () => {
    onSlideChange(activeSlide > 0 ? activeSlide - 1 : slides.length - 1)
  }

  const goToNext = () => {
    onSlideChange(activeSlide < slides.length - 1 ? activeSlide + 1 : 0)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      {/* Slide counter */}
      <p className="text-xs text-muted-foreground">
        Slide {activeSlide + 1} of {slides.length}
      </p>

      {/* Main slide preview - Instagram 4:5 aspect ratio */}
      <div className="relative flex items-center">
        {/* Nav left */}
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="absolute -left-12 z-10 h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Slide */}
        <div className="aspect-[4/5] w-72 overflow-hidden rounded-xl border border-border/50 shadow-2xl transition-all duration-300">
          <SlideRenderer slide={slides[activeSlide]} brand={brand} />
        </div>

        {/* Nav right */}
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="absolute -right-12 z-10 h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Dots navigation */}
      <div className="flex items-center justify-center gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={`rounded-full transition-all ${
              index === activeSlide
                ? "h-2 w-2 bg-primary"
                : "h-1.5 w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
