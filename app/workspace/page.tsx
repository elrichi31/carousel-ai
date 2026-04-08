"use client"

import { Header } from "@/components/header"
import { InputPanel } from "@/components/input-panel"
import { CarouselPreview } from "@/components/carousel-preview"
import { EditorPanel } from "@/components/editor-panel"
import { SlideRenderer } from "@/components/slide-renderer"
import { useWorkspace } from "@/hooks/use-workspace"

export default function WorkspacePage() {
  const w = useWorkspace()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-0">

          <div className="border-r border-border overflow-y-auto">
            <InputPanel
              formData={w.formData}
              onFormChange={w.handleFormChange}
              onGenerate={w.handleGenerate}
              isGenerating={w.isGenerating}
              error={w.error}
              brand={w.brand}
              onBrandUpdate={w.updateBrand}
              onBrandClear={w.clearBrand}
            />
          </div>

          <div className="bg-muted/30 overflow-y-auto flex items-start justify-center p-8">
            <CarouselPreview
              slides={w.slides}
              activeSlide={w.activeSlide}
              onSlideChange={w.setActiveSlide}
              brand={w.brand}
              caption={w.caption}
              onCaptionChange={w.setCaption}
              activePrimary={w.activePrimary}
              fontTheme={w.selectedFont}
              bgStyle={w.selectedBgStyle}
              platform={w.platform}
              onPlatformChange={w.setPlatform}
              isLoading={w.isGenerating || w.isRegenerating}
            />
          </div>

          <div className="border-l border-border overflow-y-auto hidden lg:block">
            <EditorPanel
              currentSlide={w.currentSlide}
              slideIndex={w.activeSlide}
              totalSlides={w.slides.length}
              selectedColor={w.selectedColor}
              customColor={w.customColor}
              selectedFont={w.selectedFont}
              selectedBgStyle={w.selectedBgStyle}
              activePrimary={w.activePrimary}
              brandColors={w.brand.colors}
              onVariantChange={w.handleVariantChange}
              onColorChange={w.handleColorChange}
              onFontChange={w.setSelectedFont}
              onBgStyleChange={w.setSelectedBgStyle}
              onRegenerateSlide={w.handleRegenerateSlide}
              onDuplicateSlide={w.handleDuplicateSlide}
              onDeleteSlide={w.handleDeleteSlide}
              onExport={w.handleExport}
              onImageSearch={w.handleImageSearch}
              onImageGenerate={w.handleImageGenerate}
              onImageRemove={w.handleImageRemove}
              onImageRegenerateWithPrompt={w.handleImageRegenerateWithPrompt}
              onImageUpload={w.handleImageUpload}
              isRegenerating={w.isRegenerating}
              isExporting={w.isExporting}
              isImageLoading={w.isImageLoading}
            />
          </div>
        </div>
      </main>

      {/* Hidden export container — slides rendered at 360×450 then CSS-scaled 3× to 1080×1350 */}
      <div
        ref={w.exportContainerRef}
        aria-hidden
        style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}
      >
        {w.slides.map((slide) => (
          <div key={slide.id} data-export-slide style={{ width: 1080, height: 1350, overflow: "hidden", flexShrink: 0 }}>
            <div style={{ width: 360, height: 450, transform: "scale(3)", transformOrigin: "top left" }}>
              <SlideRenderer
                slide={slide}
                brand={w.brand}
                activePrimary={w.activePrimary}
                fontTheme={w.selectedFont}
                bgStyle={w.selectedBgStyle}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
