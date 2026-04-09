"use client"

import { Header } from "@/components/header"
import { InputPanel } from "@/components/input-panel"
import { CarouselPreview } from "@/components/carousel-preview"
import { EditorPanel } from "@/components/editor-panel"
import { SlideRenderer } from "@/components/slide-renderer"
import { useWorkspace } from "@/hooks/use-workspace"
import { cn } from "@/lib/utils"

function WorkspacePanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-card/78 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </section>
  )
}

export default function CarouselPage() {
  const w = useWorkspace()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden pt-16">
        <div className="mx-auto h-[calc(100vh-4rem)] w-full max-w-[1800px] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_300px] 2xl:grid-cols-[340px_minmax(720px,1fr)_320px]">

          <WorkspacePanel>
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
          </WorkspacePanel>

          <section className="min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-muted/20">
            <div className="flex h-full overflow-y-auto">
              <div className="mx-auto flex min-h-full w-full items-start justify-center p-4 sm:p-6 xl:p-8">
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
            </div>
          </section>

          <WorkspacePanel className="hidden lg:block">
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
          </WorkspacePanel>
        </div>
        </div>
      </main>

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
