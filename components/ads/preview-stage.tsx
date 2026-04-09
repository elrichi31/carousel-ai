"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AdPreviewStageProps {
  children: React.ReactNode
  className?: string
  maxScale?: number
  minScale?: number
  padding?: number
}

export function AdPreviewStage({
  children,
  className,
  maxScale = 1.2,
  minScale = 0.58,
  padding = 48,
}: AdPreviewStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current

    if (!container || !content || typeof ResizeObserver === "undefined") {
      setIsReady(true)
      return
    }

    let frame = 0

    const measure = () => {
      cancelAnimationFrame(frame)

      frame = window.requestAnimationFrame(() => {
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const contentWidth = content.offsetWidth
        const contentHeight = content.offsetHeight

        if (!containerWidth || !containerHeight || !contentWidth || !contentHeight) {
          return
        }

        const widthScale = (containerWidth - padding) / contentWidth
        const heightScale = (containerHeight - padding) / contentHeight
        const nextScale = Math.max(minScale, Math.min(maxScale, widthScale, heightScale))

        setScale((current) => (Math.abs(current - nextScale) < 0.01 ? current : nextScale))
        setIsReady(true)
      })
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)
    resizeObserver.observe(content)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [maxScale, minScale, padding])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full min-h-[520px] w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div
        className="relative flex items-center justify-center transition-[transform,opacity] duration-300 ease-out will-change-transform"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          opacity: isReady ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="w-max max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}
