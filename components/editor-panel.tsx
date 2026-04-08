"use client"

import { Copy, Download, ImageIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { LayoutPicker } from "@/components/editor/layout-picker"
import { ThemePicker } from "@/components/editor/theme-picker"
import { ImageEditor, useImagePaste } from "@/components/editor/image-editor"
import { RegeneratePanel } from "@/components/editor/regenerate-panel"
import type { Slide, SlideLayout } from "@/lib/types"
import { CUSTOM_COLOR_ID, type ColorThemeId, type FontThemeId, type BgStyleId } from "@/lib/themes"

interface EditorPanelProps {
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
  onImageSearch: () => void
  onImageGenerate: () => void
  onImageRemove: () => void
  onImageRegenerateWithPrompt: (prompt: string) => void
  onImageUpload: (file: File) => void
  isRegenerating?: boolean
  isExporting?: boolean
  isImageLoading?: boolean
}

export function EditorPanel({
  currentSlide, slideIndex, totalSlides,
  selectedColor, customColor, selectedFont, selectedBgStyle, activePrimary,
  brandColors = [],
  onVariantChange, onColorChange, onFontChange, onBgStyleChange,
  onRegenerateSlide, onDuplicateSlide, onDeleteSlide, onExport,
  onImageSearch, onImageGenerate, onImageRemove, onImageRegenerateWithPrompt, onImageUpload,
  isRegenerating = false, isExporting = false, isImageLoading = false,
}: EditorPanelProps) {
  const selectedLayout = currentSlide.layout
  const currentVariant = currentSlide.layoutVariant ?? 'default'

  const supportsImage =
    selectedLayout === "imageOverlay" ||
    selectedLayout === "split" ||
    (selectedLayout === "content" && (currentVariant === "image-right" || currentVariant === "image-left"))

  useImagePaste(supportsImage, onImageUpload)

  const isCoverOrCta = slideIndex === 0 || slideIndex === totalSlides - 1

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Edit Slide</h3>
        <p className="mt-1 text-xs text-muted-foreground">Customize your content</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <LayoutPicker
          slide={currentSlide}
          slideIndex={slideIndex}
          totalSlides={totalSlides}
          activePrimary={activePrimary}
          selectedBgStyle={selectedBgStyle}
          onVariantChange={onVariantChange}
        />

        <ThemePicker
          selectedColor={selectedColor}
          customColor={customColor}
          selectedFont={selectedFont}
          selectedBgStyle={selectedBgStyle}
          activePrimary={activePrimary}
          brandColors={brandColors}
          onColorChange={onColorChange}
          onFontChange={onFontChange}
          onBgStyleChange={onBgStyleChange}
        />

        {supportsImage && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3.5 w-3.5" />
              Image
            </Label>
            <ImageEditor
              slide={currentSlide}
              isLoading={isImageLoading}
              onSearch={onImageSearch}
              onGenerate={onImageGenerate}
              onRemove={onImageRemove}
              onUpload={onImageUpload}
              onRegenerateWithPrompt={onImageRegenerateWithPrompt}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Slide Actions</Label>

          {/* Regenerate — only for middle slides */}
          {!isCoverOrCta && (
            <RegeneratePanel
              currentLayout={currentSlide.layout}
              isRegenerating={isRegenerating}
              onRegenerate={onRegenerateSlide}
            />
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline" size="sm"
              onClick={onDuplicateSlide}
              className="border-border/50 bg-transparent text-foreground hover:bg-muted"
            >
              <Copy className="mr-2 h-3.5 w-3.5" />
              Duplicate
            </Button>
            {!isCoverOrCta && (
              <Button
                variant="outline" size="sm"
                onClick={onDeleteSlide}
                className="border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 p-4">
        <Button
          onClick={onExport}
          disabled={isExporting}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Carousel
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
