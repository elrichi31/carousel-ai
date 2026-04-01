"use client"

import type { Slide, BrandSettings } from "@/lib/types"
import { colorThemes, fontThemes, buildBgStyle, type FontThemeId, type BgStyleId } from "@/lib/themes"
import { ImageIcon } from "lucide-react"

interface SlideRendererProps {
  slide: Slide
  brand?: BrandSettings | null
  activePrimary?: string
  fontTheme?: FontThemeId
  bgStyle?: BgStyleId
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

export function SlideRenderer({ slide, brand, activePrimary, fontTheme = 'geist', bgStyle = 'gradient' }: SlideRendererProps) {
  const hasBrand = brand && (brand.logoUrl || brand.name)
  const primary = activePrimary ?? colorThemes.green.primary
  const fontFamily = fontThemes[fontTheme]?.family ?? fontThemes.geist.family

  return (
    <div className="relative flex h-full flex-col" style={{ fontFamily }}>
      <div className="flex-1 min-h-0">
        {renderLayout(slide, primary, bgStyle)}
      </div>
      {hasBrand && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 px-4 py-3 pointer-events-none">
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

function renderLayout(slide: Slide, primary: string, bgStyle: BgStyleId) {
  switch (slide.layout) {
    case "cover":     return <CoverLayout     slide={slide} primary={primary} bgStyle={bgStyle} />
    case "content":   return <ContentLayout   slide={slide} primary={primary} bgStyle={bgStyle} />
    case "list":      return <ListLayout      slide={slide} primary={primary} bgStyle={bgStyle} />
    case "bigNumber": return <BigNumberLayout slide={slide} primary={primary} bgStyle={bgStyle} />
    case "quote":     return <QuoteLayout     slide={slide} primary={primary} bgStyle={bgStyle} />
    case "split":     return <SplitLayout     slide={slide} primary={primary} bgStyle={bgStyle} />
    case "cta":       return <CtaLayout       slide={slide} primary={primary} bgStyle={bgStyle} />
    default:          return <ContentLayout   slide={slide} primary={primary} bgStyle={bgStyle} />
  }
}

type LayoutProps = { slide: Slide; primary: string; bgStyle: BgStyleId }

// ─── Cover variants ──────────────────────────────────────────────────────────

function CoverLayout({ slide, primary, bgStyle }: LayoutProps) {
  const variant = slide.layoutVariant ?? 'centered'
  const bg = buildBgStyle(primary, bgStyle, 22, 6)

  if (variant === 'bold') {
    // Large title dominates, emoji bottom-right corner
    return (
      <div className={`relative flex h-full flex-col justify-end p-8 ${slide.textColor}`} style={bg}>
        {slide.emoji && (
          <span className="absolute top-6 right-6 text-6xl opacity-20 select-none">{slide.emoji}</span>
        )}
        <div style={{ borderLeftWidth: 3, borderLeftColor: primary, paddingLeft: 12 }}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            <HighlightedTitle text={slide.title ?? ''} primary={primary} />
          </h1>
          {slide.subtitle && (
            <p className="mt-2 text-sm opacity-60">{slide.subtitle}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'minimal') {
    // No emoji, clean centered text with a thin line accent
    return (
      <div className={`flex h-full flex-col items-center justify-center p-10 text-center ${slide.textColor}`} style={bg}>
        <div className="mb-4 h-px w-12" style={{ backgroundColor: primary }} />
        <h1 className="text-2xl font-bold leading-tight tracking-wide uppercase">
          <HighlightedTitle text={slide.title ?? ''} primary={primary} />
        </h1>
        {slide.subtitle && (
          <p className="mt-4 text-xs opacity-60 max-w-[200px] leading-relaxed">{slide.subtitle}</p>
        )}
        <div className="mt-4 h-px w-12" style={{ backgroundColor: primary }} />
      </div>
    )
  }

  if (variant === 'split') {
    // Left-aligned text, big emoji as right decoration
    return (
      <div className={`flex h-full flex-row ${slide.textColor}`} style={bg}>
        <div className="flex flex-1 flex-col justify-center p-8">
          <h1 className="text-2xl font-bold leading-tight">
            <HighlightedTitle text={slide.title ?? ''} primary={primary} />
          </h1>
          {slide.subtitle && (
            <p className="mt-3 text-sm opacity-60 leading-relaxed">{slide.subtitle}</p>
          )}
          <div className="mt-5 h-0.5 w-10" style={{ backgroundColor: primary }} />
        </div>
        {slide.emoji && (
          <div className="flex w-1/3 items-center justify-center">
            <span className="text-7xl">{slide.emoji}</span>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'badge') {
    // Badge/tag label on top, then big title
    return (
      <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={bg}>
        {slide.subtitle && (
          <span
            className="mb-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
            style={{ backgroundColor: `color-mix(in srgb, ${primary} 20%, transparent)`, color: primary }}
          >
            {slide.subtitle}
          </span>
        )}
        {slide.emoji && <span className="mb-3 text-4xl">{slide.emoji}</span>}
        <h1 className="text-2xl font-extrabold leading-tight">
          <HighlightedTitle text={slide.title ?? ''} primary={primary} />
        </h1>
      </div>
    )
  }

  // default: 'centered'
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={bg}>
      {slide.emoji && <span className="mb-4 text-5xl">{slide.emoji}</span>}
      <h1 className="text-balance text-2xl font-bold leading-tight">
        <HighlightedTitle text={slide.title ?? ''} primary={primary} />
      </h1>
      {slide.subtitle && (
        <p className="mt-3 text-balance text-sm opacity-70">{slide.subtitle}</p>
      )}
    </div>
  )
}

// ─── CTA variants ─────────────────────────────────────────────────────────────

function CtaLayout({ slide, primary, bgStyle }: LayoutProps) {
  const variant = slide.layoutVariant ?? 'centered'
  const bg = buildBgStyle(primary, bgStyle, 22, 6)

  const followBtn = (
    <div
      className="mt-6 rounded-full border px-6 py-2 text-sm font-medium opacity-80"
      style={{ borderColor: primary, color: primary }}
    >
      Seguir →
    </div>
  )

  if (variant === 'card') {
    // CTA content inside a frosted card box
    return (
      <div className={`flex h-full flex-col items-center justify-center p-6 ${slide.textColor}`} style={bg}>
        <div
          className="w-full rounded-2xl p-6 text-center"
          style={{ backgroundColor: `color-mix(in srgb, ${primary} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${primary} 25%, transparent)` }}
        >
          {slide.emoji && <span className="text-4xl">{slide.emoji}</span>}
          {slide.ctaText && (
            <h2 className="mt-3 text-xl font-bold leading-tight">
              <HighlightedTitle text={slide.ctaText} primary={primary} />
            </h2>
          )}
          {slide.ctaSubtext && (
            <p className="mt-2 text-sm opacity-70">{slide.ctaSubtext}</p>
          )}
          {followBtn}
        </div>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={bg}>
        <div className="mb-5 h-px w-16" style={{ backgroundColor: primary }} />
        {slide.ctaText && (
          <h2 className="text-xl font-bold leading-tight">
            <HighlightedTitle text={slide.ctaText} primary={primary} />
          </h2>
        )}
        {slide.ctaSubtext && (
          <p className="mt-3 text-sm opacity-60">{slide.ctaSubtext}</p>
        )}
        <div className="mt-5 h-px w-16" style={{ backgroundColor: primary }} />
      </div>
    )
  }

  // default: 'centered'
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={bg}>
      {slide.emoji && <span className="mb-4 text-4xl">{slide.emoji}</span>}
      {slide.ctaText && (
        <h2 className="text-balance text-xl font-bold leading-tight">
          <HighlightedTitle text={slide.ctaText} primary={primary} />
        </h2>
      )}
      {slide.ctaSubtext && (
        <p className="mt-3 text-balance text-sm opacity-70">{slide.ctaSubtext}</p>
      )}
      {followBtn}
    </div>
  )
}

// ─── Content ─────────────────────────────────────────────
function ContentLayout({ slide, primary, bgStyle }: LayoutProps) {
  return (
    <div className={`flex h-full flex-col justify-center p-8 ${slide.textColor}`} style={buildBgStyle(primary, bgStyle, 18, 4)}>
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
function ListLayout({ slide, primary, bgStyle }: LayoutProps) {
  return (
    <div className={`flex h-full flex-col justify-center p-8 ${slide.textColor}`} style={buildBgStyle(primary, bgStyle, 18, 4)}>
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
function BigNumberLayout({ slide, primary, bgStyle }: LayoutProps) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={buildBgStyle(primary, bgStyle, 15, 5)}>
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
function QuoteLayout({ slide, primary, bgStyle }: LayoutProps) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={buildBgStyle(primary, bgStyle, 15, 5)}>
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
function SplitLayout({ slide, primary, bgStyle }: LayoutProps) {
  const imageOnLeft = slide.imagePosition === "left"
  return (
    <div className={`flex h-full ${imageOnLeft ? "flex-row" : "flex-row-reverse"} ${slide.textColor}`} style={buildBgStyle(primary, bgStyle, 15, 4)}>
      <div className="flex w-1/2 items-center justify-center bg-black/10">
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

// ─── Exported variant metadata (used by editor panel) ────────────────────────

export const coverVariants: { id: string; label: string }[] = [
  { id: 'centered', label: 'Centrado' },
  { id: 'bold',     label: 'Bold'     },
  { id: 'minimal',  label: 'Minimal'  },
  { id: 'split',    label: 'Split'    },
  { id: 'badge',    label: 'Badge'    },
]

export const ctaVariants: { id: string; label: string }[] = [
  { id: 'centered', label: 'Centrado' },
  { id: 'card',     label: 'Card'     },
  { id: 'minimal',  label: 'Minimal'  },
]

/** Renders a slide at a small fixed size for use in pickers. */
export function SlideVariantPreview({
  slide,
  primary,
  bgStyle = 'gradient',
}: {
  slide: Slide
  primary: string
  bgStyle?: BgStyleId
}) {
  return (
    <div className="h-full w-full overflow-hidden" style={{ fontSize: '40%', lineHeight: 1.2, pointerEvents: 'none' }}>
      <SlideRenderer slide={slide} activePrimary={primary} bgStyle={bgStyle} />
    </div>
  )
}
