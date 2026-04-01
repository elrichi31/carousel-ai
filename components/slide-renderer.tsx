"use client"

import type { Slide, BrandSettings } from "@/lib/types"
import { colorThemes, fontThemes, type FontThemeId } from "@/lib/themes"
import { ImageIcon } from "lucide-react"

interface SlideRendererProps {
  slide: Slide
  brand?: BrandSettings | null
  activePrimary?: string
  fontTheme?: FontThemeId
}

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','is','are',
  'was','were','be','been','have','has','had','do','does','did','will','would',
  'could','should','may','might','can','not','this','that','these','those',
  'i','you','he','she','it','we','they','my','your','our','its','their',
  'el','la','los','las','un','una','y','o','de','en','con','por','para',
  'que','se','lo','le','es','su','del','al','nos','te','me','mi','tu',
  'si','no','como','más','pero','hay','muy','cada','este','esta','estos',
])

function HighlightedTitle({ text, primary }: { text: string; primary: string }) {
  const tokens = text.split(/(\s+)/)
  let found = false
  const nodes = tokens.map((token, i) => {
    if (/^\s+$/.test(token)) return token
    if (!found) {
      const clean = token.toLowerCase().replace(/[^a-záéíóúñü0-9]/g, '')
      if (clean.length > 3 && !STOP_WORDS.has(clean)) {
        found = true
        return <span key={i} style={{ color: primary }}>{token}</span>
      }
    }
    return token
  })
  return <>{nodes}</>
}

export function SlideRenderer({ slide, brand, activePrimary, fontTheme = 'geist' }: SlideRendererProps) {
  const hasBrand = brand && (brand.logoUrl || brand.name)
  const primary = activePrimary ?? colorThemes.green.primary
  const fontFamily = fontThemes[fontTheme]?.family ?? fontThemes.geist.family

  return (
    <div className="relative flex h-full flex-col" style={{ fontFamily }}>
      <div className="flex-1">
        {renderLayout(slide, primary)}
      </div>

      {hasBrand && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 py-3">
          {brand.logoUrl && (
            <img src={brand.logoUrl} alt="" className="h-5 w-5 rounded-sm object-contain" />
          )}
          {brand.name && (
            <span className="text-[10px] font-medium opacity-50">{brand.name}</span>
          )}
        </div>
      )}
    </div>
  )
}

function renderLayout(slide: Slide, primary: string) {
  switch (slide.layout) {
    case "cover":     return <CoverLayout     slide={slide} primary={primary} />
    case "content":   return <ContentLayout   slide={slide} primary={primary} />
    case "list":      return <ListLayout      slide={slide} primary={primary} />
    case "bigNumber": return <BigNumberLayout slide={slide} primary={primary} />
    case "quote":     return <QuoteLayout     slide={slide} primary={primary} />
    case "split":     return <SplitLayout     slide={slide} primary={primary} />
    case "cta":       return <CtaLayout       slide={slide} primary={primary} />
    default:          return <ContentLayout   slide={slide} primary={primary} />
  }
}

type LayoutProps = { slide: Slide; primary: string }

/** Build a gradient background using color-mix so it works with oklch AND hex */
function gradientBg(primary: string, startPct: number, endPct: number) {
  return {
    background: `linear-gradient(to bottom right, color-mix(in srgb, ${primary} ${startPct}%, transparent), color-mix(in srgb, ${primary} ${endPct}%, transparent))`,
  }
}

// ─── Cover ───────────────────────────────────────────────
function CoverLayout({ slide, primary }: LayoutProps) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`}
      style={gradientBg(primary, 22, 6)}
    >
      {slide.emoji && <span className="mb-4 text-5xl">{slide.emoji}</span>}
      {slide.title && (
        <h1 className="text-balance text-2xl font-bold leading-tight">
          <HighlightedTitle text={slide.title} primary={primary} />
        </h1>
      )}
      {slide.subtitle && (
        <p className="mt-3 text-balance text-sm opacity-70">{slide.subtitle}</p>
      )}
    </div>
  )
}

// ─── Content ─────────────────────────────────────────────
function ContentLayout({ slide, primary }: LayoutProps) {
  return (
    <div
      className={`flex h-full flex-col justify-center p-8 ${slide.textColor}`}
      style={gradientBg(primary, 18, 4)}
    >
      {slide.title && (
        <h2 className="text-balance text-xl font-bold leading-tight">
          <HighlightedTitle text={slide.title} primary={primary} />
        </h2>
      )}
      {slide.content && (
        <p className="mt-4 text-pretty text-sm leading-relaxed opacity-80">{slide.content}</p>
      )}
    </div>
  )
}

// ─── List ────────────────────────────────────────────────
function ListLayout({ slide, primary }: LayoutProps) {
  return (
    <div
      className={`flex h-full flex-col justify-center p-8 ${slide.textColor}`}
      style={gradientBg(primary, 18, 4)}
    >
      {slide.title && (
        <h2 className="mb-5 text-balance text-xl font-bold leading-tight">
          <HighlightedTitle text={slide.title} primary={primary} />
        </h2>
      )}
      {slide.listItems && (
        <ul className="space-y-3">
          {slide.listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-lg leading-none" style={{ color: primary }}>{item.emoji}</span>
              <span className="opacity-90">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── BigNumber ───────────────────────────────────────────
function BigNumberLayout({ slide, primary }: LayoutProps) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`}
      style={gradientBg(primary, 15, 5)}
    >
      {slide.emoji && <span className="mb-2 text-3xl">{slide.emoji}</span>}
      <span className="text-5xl font-extrabold tracking-tight" style={{ color: primary }}>
        {slide.bigNumber}
      </span>
      {slide.bigNumberLabel && (
        <p className="mt-4 max-w-[80%] text-balance text-sm opacity-70">{slide.bigNumberLabel}</p>
      )}
    </div>
  )
}

// ─── Quote ───────────────────────────────────────────────
function QuoteLayout({ slide, primary }: LayoutProps) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`}
      style={gradientBg(primary, 15, 5)}
    >
      <span className="mb-4 text-4xl" style={{ color: primary, opacity: 0.6 }}>&ldquo;</span>
      <blockquote className="text-balance text-lg font-medium italic leading-relaxed">
        {slide.quote}
      </blockquote>
      {slide.quoteAuthor && (
        <cite className="mt-4 text-sm not-italic opacity-60">&mdash; {slide.quoteAuthor}</cite>
      )}
    </div>
  )
}

// ─── Split ───────────────────────────────────────────────
function SplitLayout({ slide, primary }: LayoutProps) {
  const imageOnLeft = slide.imagePosition === "left"
  return (
    <div className={`flex h-full ${imageOnLeft ? "flex-row" : "flex-row-reverse"} ${slide.backgroundColor} ${slide.textColor}`}>
      <div className="flex w-1/2 items-center justify-center bg-muted/20">
        {slide.imageUrl ? (
          <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Image</span>
          </div>
        )}
      </div>
      <div className="flex w-1/2 flex-col justify-center p-6">
        {slide.title && (
          <h2 className="text-balance text-lg font-bold leading-tight">
            <HighlightedTitle text={slide.title} primary={primary} />
          </h2>
        )}
        {slide.content && (
          <p className="mt-3 text-pretty text-xs leading-relaxed opacity-80">{slide.content}</p>
        )}
      </div>
    </div>
  )
}

// ─── CTA ─────────────────────────────────────────────────
function CtaLayout({ slide, primary }: LayoutProps) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`}
      style={gradientBg(primary, 22, 6)}
    >
      {slide.emoji && <span className="mb-4 text-4xl">{slide.emoji}</span>}
      {slide.ctaText && (
        <h2 className="text-balance text-xl font-bold leading-tight">
          <HighlightedTitle text={slide.ctaText} primary={primary} />
        </h2>
      )}
      {slide.ctaSubtext && (
        <p className="mt-3 text-balance text-sm opacity-70">{slide.ctaSubtext}</p>
      )}
      <div
        className="mt-6 rounded-full border px-6 py-2 text-sm font-medium opacity-80"
        style={{ borderColor: primary, color: primary }}
      >
        Seguir →
      </div>
    </div>
  )
}
