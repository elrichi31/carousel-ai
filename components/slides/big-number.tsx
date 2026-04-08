"use client"

import { type LayoutProps } from "./shared"

export const bigNumberVariants = [
  { id: 'default',    label: 'Centrado'   },
  { id: 'horizontal', label: 'Horizontal' },
]

export function BigNumberLayout({ slide, primary, bgStyle, bgBuilder }: LayoutProps) {
  const variant = slide.layoutVariant ?? 'default'
  const bg = bgBuilder(primary, bgStyle, 15, 5)

  if (variant === 'horizontal') {
    return (
      <div className={`flex h-full flex-col justify-center p-8 ${slide.textColor}`} style={bg}>
        <div className="flex items-center gap-4">
          {slide.emoji && <span className="text-4xl">{slide.emoji}</span>}
          <span className="text-5xl font-extrabold tracking-tight" style={{ color: primary }}>
            {slide.bigNumber}
          </span>
        </div>
        {slide.bigNumberLabel && (
          <p className="mt-4 text-sm opacity-70 max-w-[80%]">{slide.bigNumberLabel}</p>
        )}
      </div>
    )
  }

  return (
    <div className={`flex h-full flex-col items-center justify-center p-8 text-center ${slide.textColor}`} style={bg}>
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
