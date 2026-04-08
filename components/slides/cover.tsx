"use client"

import { HighlightedTitle, type LayoutProps } from "./shared"

export const coverVariants = [
  { id: 'centered', label: 'Centrado' },
  { id: 'bold',     label: 'Bold'     },
  { id: 'minimal',  label: 'Minimal'  },
  { id: 'split',    label: 'Split'    },
  { id: 'badge',    label: 'Badge'    },
]

export function CoverLayout({ slide, primary, bgStyle, bgBuilder }: LayoutProps) {
  const variant = slide.layoutVariant ?? 'centered'
  const bg = bgBuilder(primary, bgStyle, 22, 6)

  if (variant === 'bold') {
    return (
      <div className={`relative flex h-full flex-col justify-end p-8 ${slide.textColor}`} style={bg}>
        {slide.emoji && (
          <span className="absolute top-6 right-6 text-6xl opacity-20 select-none">{slide.emoji}</span>
        )}
        <div style={{ borderLeftWidth: 3, borderLeftColor: primary, paddingLeft: 12 }}>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            <HighlightedTitle text={slide.title ?? ''} primary={primary} />
          </h1>
          {slide.subtitle && <p className="mt-2 text-sm opacity-60">{slide.subtitle}</p>}
        </div>
      </div>
    )
  }

  if (variant === 'minimal') {
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

  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={bg}>
      {slide.emoji && <span className="mb-4 text-5xl">{slide.emoji}</span>}
      <h1 className="text-balance text-2xl font-bold leading-tight">
        <HighlightedTitle text={slide.title ?? ''} primary={primary} />
      </h1>
      {slide.subtitle && <p className="mt-3 text-balance text-sm opacity-70">{slide.subtitle}</p>}
    </div>
  )
}
