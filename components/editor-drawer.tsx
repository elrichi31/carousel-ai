"use client"

import { Drawer } from "vaul"
import { SlidersHorizontal } from "lucide-react"
import { EditorPanel } from "@/components/editor-panel"
import { cn } from "@/lib/utils"
import type { Slide, SlideLayout } from "@/lib/types"
import { CUSTOM_COLOR_ID, type ColorThemeId, type FontThemeId, type BgStyleId } from "@/lib/themes"

interface EditorDrawerProps {
  currentSlide: Slide
  slideIndex: number
  totalSlides: number
  selectedColor: ColorThemeId | typeof CUSTOM_COLOR_ID
  customColor: string
  selectedFont: FontThemeId
  selectedBgStyle: BgStyleId
  activePrimary: string
  brandColors?: string[]
  onVariantChange: (variant: string) => void
  onColorChange: (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => void
  onFontChange: (font: FontThemeId) => void
  onBgStyleChange: (style: BgStyleId) => void
  onRegenerateSlide: (layout: SlideLayout, prompt: string) => void
  onDuplicateSlide: () => void
  onDeleteSlide: () => void
  onExport: () => void
  onExportZip: () => void
  onImageSearch: () => void
  onImageGenerate: () => void
  onImageRemove: () => void
  onImageRegenerateWithPrompt: (prompt: string) => void
  onImageUpload: (file: File) => void
  isRegenerating?: boolean
  isExporting?: boolean
  isExportingZip?: boolean
  isImageLoading?: boolean
  className?: string
}

export function EditorDrawer(props: EditorDrawerProps) {
  const { className, ...panelProps } = props

  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all text-muted-foreground hover:bg-white/5 hover:text-foreground xl:hidden",
            className,
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Editor</span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[20px] border border-border/60 bg-card shadow-2xl focus:outline-none" style={{ maxHeight: "85dvh" }}>
          <div className="mx-auto mt-3 mb-1 h-1 w-10 flex-shrink-0 rounded-full bg-border" />
          <Drawer.Title className="sr-only">Editor de slide</Drawer.Title>
          <div className="flex-1 overflow-hidden">
            <EditorPanel {...panelProps} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
