"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstagramFrame } from "@/components/preview/instagram-frame"
import { TikTokFrame } from "@/components/preview/tiktok-frame"
import type { Slide, BrandSettings, PostCaption, Platform } from "@/lib/types"
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
  platform: Platform
  onPlatformChange: (platform: Platform) => void
  isLoading?: boolean
}

const PLATFORM_TABS: { id: Platform; label: string; icon: React.ReactNode }[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 48 48" className="h-4 w-4" fill="currentColor">
        <path d="M38.4 21.68V16c-3.4 0-5.98-1.2-7.8-3.58a11.6 11.6 0 01-2.2-5.02h-5.8v25.4a5.2 5.2 0 01-5.2 5.2 5.2 5.2 0 01-5.2-5.2 5.2 5.2 0 015.2-5.2c.56 0 1.1.08 1.6.24v-5.88c-.52-.06-1.06-.1-1.6-.1A11.08 11.08 0 006.32 33.74 11.08 11.08 0 0017.4 44.82a11.08 11.08 0 0011.08-11.08V21.08A17.2 17.2 0 0038.4 25v-3.32z" />
      </svg>
    ),
  },
]

const sharedProps = (props: CarouselPreviewProps) => ({
  slides: props.slides,
  activeSlide: props.activeSlide,
  onSlideChange: props.onSlideChange,
  brand: props.brand,
  caption: props.caption,
  onCaptionChange: props.onCaptionChange,
  activePrimary: props.activePrimary,
  fontTheme: props.fontTheme,
  bgStyle: props.bgStyle,
})

export function CarouselPreview(props: CarouselPreviewProps) {
  const { slides, activeSlide, onSlideChange, platform, onPlatformChange, isLoading } = props

  const goToPrevious = () => onSlideChange(activeSlide > 0 ? activeSlide - 1 : slides.length - 1)
  const goToNext = () => onSlideChange(activeSlide < slides.length - 1 ? activeSlide + 1 : 0)

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Platform tabs */}
      <div className="flex w-full rounded-lg border border-border/60 bg-card overflow-hidden">
        {PLATFORM_TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onPlatformChange(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
              platform === id
                ? "bg-primary/10 text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {platform === "instagram"
        ? <InstagramFrame {...sharedProps(props)} isLoading={isLoading} />
        : <TikTokFrame {...sharedProps(props)} isLoading={isLoading} />}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline" size="icon"
          onClick={goToPrevious}
          className="h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground min-w-[60px] text-center">
          {activeSlide + 1} / {slides.length}
        </span>
        <Button
          variant="outline" size="icon"
          onClick={goToNext}
          className="h-8 w-8 rounded-full border-border/50 bg-card/80 text-foreground hover:bg-card"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
