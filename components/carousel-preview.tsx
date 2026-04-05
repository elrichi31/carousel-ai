"use client"

import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SlideRenderer } from "@/components/slide-renderer"
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
  platform,
  onPlatformChange,
}: CarouselPreviewProps) {
  const goToPrevious = () => {
    onSlideChange(activeSlide > 0 ? activeSlide - 1 : slides.length - 1)
  }

  const goToNext = () => {
    onSlideChange(activeSlide < slides.length - 1 ? activeSlide + 1 : 0)
  }

  const profileName = brand?.name || "your.account"

  const slideContent = (
    <SlideRenderer
      slide={slides[activeSlide]}
      brand={brand}
      activePrimary={activePrimary}
      fontTheme={fontTheme}
      bgStyle={bgStyle}
    />
  )

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      {/* Platform Tabs */}
      <div className="flex w-full rounded-lg border border-border/60 bg-card overflow-hidden">
        <button
          onClick={() => onPlatformChange("instagram")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
            platform === "instagram"
              ? "bg-primary/10 text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          Instagram
        </button>
        <button
          onClick={() => onPlatformChange("tiktok")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium transition-colors ${
            platform === "tiktok"
              ? "bg-primary/10 text-foreground border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <svg viewBox="0 0 48 48" className="h-4 w-4" fill="currentColor">
            <path d="M38.4 21.68V16c-3.4 0-5.98-1.2-7.8-3.58a11.6 11.6 0 01-2.2-5.02h-5.8v25.4a5.2 5.2 0 01-5.2 5.2 5.2 5.2 0 01-5.2-5.2 5.2 5.2 0 015.2-5.2c.56 0 1.1.08 1.6.24v-5.88c-.52-.06-1.06-.1-1.6-.1A11.08 11.08 0 006.32 33.74 11.08 11.08 0 0017.4 44.82a11.08 11.08 0 0011.08-11.08V21.08A17.2 17.2 0 0038.4 25v-3.32z" />
          </svg>
          TikTok
        </button>
      </div>

      {platform === "instagram" ? (
        /* ─── Instagram Post Frame ─────────────────────────────────── */
        <div className="w-full rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden">
          {/* Instagram Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/40">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] flex-shrink-0">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden p-[3px]">
                  {brand?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.logoUrl} alt={profileName} className="h-full w-full object-contain rounded-full" />
                  ) : (
                    <span className="text-[10px] font-semibold text-foreground">
                      {profileName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">{profileName}</span>
            </div>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Slide Area */}
          <div className="relative">
            <div className="absolute top-2 right-2 z-10 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {activeSlide + 1}/{slides.length}
            </div>
            <div className="aspect-[4/5] w-full overflow-hidden">{slideContent}</div>
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

          {/* Instagram Action bar */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <button className="text-foreground hover:text-red-500 transition-colors"><Heart className="h-5 w-5" /></button>
              <button className="text-foreground hover:text-foreground/70 transition-colors"><MessageCircle className="h-5 w-5" /></button>
              <button className="text-foreground hover:text-foreground/70 transition-colors"><Send className="h-5 w-5" /></button>
            </div>
            <button className="text-foreground hover:text-foreground/70 transition-colors"><Bookmark className="h-5 w-5" /></button>
          </div>

          {/* Caption + Hashtags */}
          <CaptionEditor caption={caption} onCaptionChange={onCaptionChange} />
        </div>
      ) : (
        /* ─── TikTok Carousel Frame ───────────────────────────────── */
        <div className="w-full rounded-xl border border-border/60 bg-black shadow-xl overflow-hidden">
          {/* TikTok top bar: Siguiendo | Para ti */}
          <div className="flex items-center justify-center gap-4 py-2 bg-black/80">
            <span className="text-[11px] text-white/50 font-medium">Siguiendo</span>
            <span className="text-[11px] text-white font-bold relative">
              Para ti
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-6 bg-white rounded-full" />
            </span>
          </div>

          <div className="relative">
            {/* Slide Area */}
            <div className="aspect-[3/5] w-full overflow-hidden relative">
              <div className="absolute inset-0">{slideContent}</div>

              {/* Dark gradient covering full bottom width */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent pt-16">
                {/* Content row: text left, actions right */}
                <div className="flex items-end px-3 pb-3">
                  {/* Left: dots + username + caption + music */}
                  <div className="flex-1 min-w-0 pr-3">
                    {/* Slide dot indicators */}
                    <div className="flex justify-center gap-1.5 mb-2.5">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => onSlideChange(index)}
                          className={`rounded-full transition-all ${
                            index === activeSlide
                              ? "h-1.5 w-1.5 bg-white"
                              : "h-1.5 w-1.5 bg-white/40"
                          }`}
                        >
                          <span className="sr-only">Slide {index + 1}</span>
                        </button>
                      ))}
                    </div>

                    {/* Username + time */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[12px] font-bold text-white">{profileName}</span>
                      <span className="text-[10px] text-white/50">· hace 10 h</span>
                    </div>

                    {/* Caption + hashtags — max 1 line with "... más" */}
                    {caption?.text && (
                      <p className="text-[11px] text-white/90 line-clamp-1 mb-1">
                        {caption.text}
                        {caption?.hashtags && caption.hashtags.length > 0 && (
                          <> {caption.hashtags.slice(0, 3).map((h) => `#${h}`).join(" ")}</>
                        )}
                        <span className="text-white/50"> … más</span>
                      </p>
                    )}

                    {/* Music bar */}
                    <div className="flex items-center gap-1.5">
                      <Music className="h-3 w-3 text-white flex-shrink-0" />
                      <p className="text-[10px] text-white/80 truncate">
                        Original sound - {profileName}
                      </p>
                    </div>
                  </div>

                  {/* Right: spinning disc (inside gradient) */}
                  <div className="flex-shrink-0 mb-0.5">
                    <div className="h-8 w-8 rounded-full border-[3px] border-zinc-800 overflow-hidden animate-spin-slow">
                      <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                        {brand?.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={brand.logoUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-zinc-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: avatar + action buttons (above gradient) */}
              <div className="absolute right-2 bottom-[100px] z-20 flex flex-col items-center gap-3.5">
                {/* Profile avatar with + badge */}
                <div className="relative mb-1">
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                    {brand?.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={brand.logoUrl} alt={profileName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{profileName.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center">
                    <Plus className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* Heart */}
                <button className="flex flex-col items-center">
                  <Heart className="h-6 w-6" fill="#ff2d55" stroke="#ff2d55" />
                  <span className="text-[10px] text-white font-medium mt-0.5">18</span>
                </button>

                {/* Comment */}
                <button className="flex flex-col items-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="white">
                    <path d="M12 2C6.477 2 2 5.813 2 10.5c0 2.614 1.38 4.96 3.543 6.547L4.25 21.5l5.07-2.538c.87.182 1.77.288 2.68.288 5.523 0 10-3.813 10-8.75S17.523 2 12 2z" />
                  </svg>
                  <span className="text-[10px] text-white font-medium mt-0.5">1.9</span>
                </button>

                {/* Bookmark */}
                <button className="flex flex-col items-center">
                  <Bookmark className="h-6 w-6" fill="white" stroke="white" />
                  <span className="text-[10px] text-white font-medium mt-0.5">5</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="white">
                    <path d="M13.5 3l6.5 7h-4.5c0 5.5-3 9.5-9.5 11 2.5-3.5 3-6.5 3-11H4.5L13.5 3z" />
                  </svg>
                  <span className="text-[10px] text-white font-medium mt-0.5">2</span>
                </button>
              </div>
            </div>
          </div>

          {/* Caption + Hashtags editor (outside frame, for editing) */}
          <div className="bg-card border-t border-border/40 rounded-b-xl">
            <CaptionEditor caption={caption} onCaptionChange={onCaptionChange} />
          </div>
        </div>
      )}

      {/* External navigation */}
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

/* ─── Caption Editor (shared between platforms) ────────────────────────── */

function CaptionEditor({
  caption,
  onCaptionChange,
}: {
  caption?: PostCaption | null
  onCaptionChange?: (caption: PostCaption) => void
}) {
  if (caption === undefined) return null

  return (
    <div className="px-3 pb-3 space-y-2">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide pt-1">
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
  )
}
