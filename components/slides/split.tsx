"use client"

import { HighlightedTitle, ImagePlaceholder, type LayoutProps } from "./shared"

export const splitVariants = [
  { id: 'image-right', label: 'Img Derecha'   },
  { id: 'image-left',  label: 'Img Izquierda' },
]

export function SplitLayout({ slide, primary, bgStyle, bgBuilder }: LayoutProps) {
  const variant = slide.layoutVariant ?? 'image-right'
  const imageOnLeft = variant === 'image-left' || slide.imagePosition === 'left'

  return (
    <div
      className={`flex h-full ${imageOnLeft ? 'flex-row' : 'flex-row-reverse'} ${slide.textColor}`}
      style={bgBuilder(primary, bgStyle, 15, 4)}
    >
      <div className="flex w-1/2 items-center justify-center bg-black/10">
        {slide.imageUrl
          ? <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
          : <ImagePlaceholder />}
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
