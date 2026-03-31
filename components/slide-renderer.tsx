"use client"

import type { Slide, BrandSettings } from "@/lib/types"
import { ImageIcon } from "lucide-react"

interface SlideRendererProps {
  slide: Slide
  brand?: BrandSettings | null
}

export function SlideRenderer({ slide, brand }: SlideRendererProps) {
  const hasBrand = brand && (brand.logoUrl || brand.name)

  return (
    <div className="relative flex h-full flex-col">
      {/* Slide content */}
      <div className="flex-1">
        {renderLayout(slide)}
      </div>

      {/* Brand watermark at bottom */}
      {hasBrand && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 py-3">
          {brand.logoUrl && (
            <img
              src={brand.logoUrl}
              alt=""
              className="h-5 w-5 rounded-sm object-contain"
            />
          )}
          {brand.name && (
            <span className="text-[10px] font-medium opacity-50">
              {brand.name}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function renderLayout(slide: Slide) {
  switch (slide.layout) {
    case "cover":
      return <CoverLayout slide={slide} />
    case "content":
      return <ContentLayout slide={slide} />
    case "list":
      return <ListLayout slide={slide} />
    case "bigNumber":
      return <BigNumberLayout slide={slide} />
    case "quote":
      return <QuoteLayout slide={slide} />
    case "split":
      return <SplitLayout slide={slide} />
    case "cta":
      return <CtaLayout slide={slide} />
    default:
      return <ContentLayout slide={slide} />
  }
}

// ─── Cover Layout ────────────────────────────────────────
function CoverLayout({ slide }: { slide: Slide }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.backgroundColor} ${slide.textColor}`}>
      {slide.emoji && (
        <span className="mb-4 text-5xl">{slide.emoji}</span>
      )}
      <h1 className="text-balance text-2xl font-bold leading-tight">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="mt-3 text-balance text-sm opacity-70">
          {slide.subtitle}
        </p>
      )}
    </div>
  )
}

// ─── Content Layout ──────────────────────────────────────
function ContentLayout({ slide }: { slide: Slide }) {
  return (
    <div className={`flex h-full flex-col justify-center p-8 ${slide.backgroundColor} ${slide.textColor}`}>
      {slide.title && (
        <h2 className="text-balance text-xl font-bold leading-tight">
          {slide.title}
        </h2>
      )}
      {slide.content && (
        <p className="mt-4 text-pretty text-sm leading-relaxed opacity-80">
          {slide.content}
        </p>
      )}
    </div>
  )
}

// ─── List Layout ─────────────────────────────────────────
function ListLayout({ slide }: { slide: Slide }) {
  return (
    <div className={`flex h-full flex-col justify-center p-8 ${slide.backgroundColor} ${slide.textColor}`}>
      {slide.title && (
        <h2 className="mb-5 text-balance text-xl font-bold leading-tight">
          {slide.title}
        </h2>
      )}
      {slide.listItems && (
        <ul className="space-y-3">
          {slide.listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="opacity-90">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Big Number Layout ───────────────────────────────────
function BigNumberLayout({ slide }: { slide: Slide }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.backgroundColor} ${slide.textColor}`}>
      {slide.emoji && (
        <span className="mb-2 text-3xl">{slide.emoji}</span>
      )}
      <span className={`text-5xl font-extrabold tracking-tight ${slide.accentColor || ""}`}>
        {slide.bigNumber}
      </span>
      {slide.bigNumberLabel && (
        <p className="mt-4 max-w-[80%] text-balance text-sm opacity-70">
          {slide.bigNumberLabel}
        </p>
      )}
    </div>
  )
}

// ─── Quote Layout ────────────────────────────────────────
function QuoteLayout({ slide }: { slide: Slide }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.backgroundColor} ${slide.textColor}`}>
      <span className={`mb-4 text-4xl ${slide.accentColor || "opacity-30"}`}>&ldquo;</span>
      <blockquote className="text-balance text-lg font-medium italic leading-relaxed">
        {slide.quote}
      </blockquote>
      {slide.quoteAuthor && (
        <cite className={`mt-4 text-sm not-italic ${slide.accentColor || "opacity-60"}`}>
          &mdash; {slide.quoteAuthor}
        </cite>
      )}
    </div>
  )
}

// ─── Split Layout ────────────────────────────────────────
function SplitLayout({ slide }: { slide: Slide }) {
  const imageOnLeft = slide.imagePosition === "left"

  return (
    <div className={`flex h-full ${imageOnLeft ? "flex-row" : "flex-row-reverse"} ${slide.backgroundColor} ${slide.textColor}`}>
      {/* Image side */}
      <div className="flex w-1/2 items-center justify-center bg-muted/20">
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Image</span>
          </div>
        )}
      </div>
      {/* Text side */}
      <div className="flex w-1/2 flex-col justify-center p-6">
        {slide.title && (
          <h2 className="text-balance text-lg font-bold leading-tight">
            {slide.title}
          </h2>
        )}
        {slide.content && (
          <p className="mt-3 text-pretty text-xs leading-relaxed opacity-80">
            {slide.content}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── CTA Layout ──────────────────────────────────────────
function CtaLayout({ slide }: { slide: Slide }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.backgroundColor} ${slide.textColor}`}>
      {slide.emoji && (
        <span className="mb-4 text-4xl">{slide.emoji}</span>
      )}
      {slide.ctaText && (
        <h2 className="text-balance text-xl font-bold leading-tight">
          {slide.ctaText}
        </h2>
      )}
      {slide.ctaSubtext && (
        <p className="mt-3 text-balance text-sm opacity-70">
          {slide.ctaSubtext}
        </p>
      )}
      <div className={`mt-6 rounded-full border px-6 py-2 text-sm font-medium ${slide.accentColor || ""} border-current opacity-80`}>
        Seguir →
      </div>
    </div>
  )
}
