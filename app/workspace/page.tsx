"use client"

import { useRef, useState } from "react"

import { Header } from "@/components/header"
import { InputPanel } from "@/components/input-panel"
import { CarouselPreview } from "@/components/carousel-preview"
import { EditorPanel } from "@/components/editor-panel"
import { SlideRenderer } from "@/components/slide-renderer"
import { useBrand } from "@/hooks/use-brand"
import { mockSlides } from "@/lib/mock-data"
import type { Slide, SlideLayout, CarouselFormData, PostCaption, Platform } from "@/lib/types"
import { colorThemes, CUSTOM_COLOR_ID, type ColorThemeId, type FontThemeId, type BgStyleId } from "@/lib/themes"

export default function WorkspacePage() {
  const [slides, setSlides] = useState<Slide[]>(mockSlides)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState<PostCaption | null>(null)
  const exportContainerRef = useRef<HTMLDivElement>(null)
  const { brand, updateBrand, clearBrand } = useBrand()

  const [formData, setFormData] = useState<CarouselFormData>({
    topic: "",
    audience: "General",
    tone: "Professional",
    slideCount: 5,
    visualStyle: "Minimal",
    withImages: false,
    imageSource: "unsplash",
  })

  const [platform, setPlatform] = useState<Platform>("instagram")
  const [selectedColor, setSelectedColor] = useState<ColorThemeId | typeof CUSTOM_COLOR_ID>("green")
  const [customColor, setCustomColor] = useState<string>("#22c55e")
  const [selectedFont, setSelectedFont] = useState<FontThemeId>("geist")
  const [selectedBgStyle, setSelectedBgStyle] = useState<BgStyleId>("gradient")

  const currentSlide = slides[activeSlide] ?? slides[0]

  // Resolve the actual primary color string to pass down to the renderer
  const activePrimary =
    selectedColor === CUSTOM_COLOR_ID
      ? customColor
      : colorThemes[selectedColor]?.primary ?? colorThemes.green.primary

  const handleFormChange = (data: Partial<CarouselFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleColorChange = (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => {
    setSelectedColor(color)
    if (color === CUSTOM_COLOR_ID && hex) setCustomColor(hex)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          brand: brand.name || brand.logoUrl ? brand : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to generate carousel")
        return
      }

      const generatedSlides: Slide[] = data.slides
      setSlides(generatedSlides)
      setActiveSlide(0)
      setCaption(data.caption ?? null)

      // Auto-fetch images for split slides when the user opted in
      if (formData.withImages) {
        const slideIndices = generatedSlides
          .map((s, i) => ({ slide: s, i }))
          .filter(({ slide }) => slide.layout === "split")

        if (slideIndices.length > 0) {
          setIsImageLoading(true)
          try {
            const fetched = await Promise.all(
              slideIndices.map(({ slide }) =>
                fetch("/api/images", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    query: slide.title || formData.topic,
                    source: formData.imageSource,
                  }),
                }).then((r) => r.json())
              )
            )
            setSlides((prev) => {
              const next = [...prev]
              slideIndices.forEach(({ i }, idx) => {
                const result = fetched[idx]
                if (result?.url) {
                  next[i] = { ...next[i], imageUrl: result.url, imagePrompt: result.prompt ?? undefined, imageSource: formData.imageSource }
                }
              })
              return next
            })
          } catch {
            // Images are non-critical — silently ignore fetch failures
          } finally {
            setIsImageLoading(false)
          }
        }
      }
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLayoutChange = (layout: SlideLayout) => {
    setSlides((prev) =>
      prev.map((slide, i) => (i === activeSlide ? { ...slide, layout } : slide))
    )
  }

  const handleVariantChange = (variant: string) => {
    setSlides((prev) =>
      prev.map((slide, i) => (i === activeSlide ? { ...slide, layoutVariant: variant } : slide))
    )
  }

  const handleRegenerateSlide = async () => {
    if (!formData.topic.trim()) {
      setError("Enter a topic first to regenerate a slide.")
      return
    }
    setIsRegenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/regenerate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideIndex: activeSlide,
          totalSlides: slides.length,
          currentLayout: currentSlide.layout,
          formData,
          brand: brand.name || brand.logoUrl ? brand : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to regenerate slide")
        return
      }
      setSlides((prev) =>
        prev.map((slide, i) =>
          i === activeSlide ? { ...data.slide, id: slide.id } : slide
        )
      )
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const { domToPng } = await import("modern-screenshot")
      const container = exportContainerRef.current
      if (!container) return

      const slideEls = container.querySelectorAll<HTMLElement>("[data-export-slide]")
      for (let i = 0; i < slideEls.length; i++) {
        const dataUrl = await domToPng(slideEls[i], {
          width: 1080,
          height: 1350,
          scale: 1,
          backgroundColor: "#111111",
        })
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `slide-${i + 1}.png`
        a.click()
        if (i < slideEls.length - 1) {
          await new Promise((r) => setTimeout(r, 400))
        }
      }
    } catch (err) {
      console.error("Export error:", err)
      setError("Export failed. Try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDuplicateSlide = () => {
    const newSlide = { ...slides[activeSlide], id: Date.now().toString() }
    const newSlides = [...slides]
    newSlides.splice(activeSlide + 1, 0, newSlide)
    setSlides(newSlides)
  }

  /** Fetch an image from Unsplash or DALL-E and assign it to the active slide. */
  const fetchImage = async (source: "unsplash" | "dalle") => {
    const query = currentSlide.title || formData.topic
    if (!query.trim()) {
      setError("El slide necesita un título o un tema para buscar una imagen.")
      return
    }
    setIsImageLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, source }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo obtener la imagen.")
        return
      }
      setSlides((prev) =>
        prev.map((slide, i) =>
          i === activeSlide
            ? { ...slide, imageUrl: data.url, imagePrompt: data.prompt ?? undefined, imageSource: source }
            : slide
        )
      )
    } catch {
      setError("Error de red al buscar la imagen.")
    } finally {
      setIsImageLoading(false)
    }
  }

  const handleImageSearch = () => fetchImage("unsplash")
  const handleImageGenerate = () => fetchImage("dalle")

  const handleImageRemove = () => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === activeSlide
          ? { ...slide, imageUrl: undefined, imagePrompt: undefined, imageSource: undefined }
          : slide
      )
    )
  }

  const handleImageRegenerateWithPrompt = async (customPrompt: string) => {
    const source = currentSlide.imageSource ?? "unsplash"
    setIsImageLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: currentSlide.title || formData.topic,
          source,
          customPrompt,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "No se pudo regenerar la imagen.")
        return
      }
      setSlides((prev) =>
        prev.map((slide, i) =>
          i === activeSlide
            ? { ...slide, imageUrl: data.url, imagePrompt: data.prompt ?? customPrompt, imageSource: source }
            : slide
        )
      )
    } catch {
      setError("Error de red al regenerar la imagen.")
    } finally {
      setIsImageLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-0">
          {/* Input Panel */}
          <div className="border-r border-border overflow-y-auto">
            <InputPanel
              formData={formData}
              onFormChange={handleFormChange}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
              brand={brand}
              onBrandUpdate={updateBrand}
              onBrandClear={clearBrand}
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-muted/30 overflow-y-auto flex items-start justify-center p-8">
            <CarouselPreview
              slides={slides}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
              brand={brand}
              caption={caption}
              onCaptionChange={setCaption}
              activePrimary={activePrimary}
              fontTheme={selectedFont}
              bgStyle={selectedBgStyle}
              platform={platform}
              onPlatformChange={setPlatform}
            />
          </div>

          {/* Editor Panel */}
          <div className="border-l border-border overflow-y-auto hidden lg:block">
            <EditorPanel
              currentSlide={currentSlide}
              slideIndex={activeSlide}
              totalSlides={slides.length}
              selectedColor={selectedColor}
              customColor={customColor}
              selectedFont={selectedFont}
              selectedBgStyle={selectedBgStyle}
              activePrimary={activePrimary}
              brandColors={brand.colors}
              onLayoutChange={handleLayoutChange}
              onVariantChange={handleVariantChange}
              onColorChange={handleColorChange}
              onFontChange={setSelectedFont}
              onBgStyleChange={setSelectedBgStyle}
              onRegenerateSlide={handleRegenerateSlide}
              onDuplicateSlide={handleDuplicateSlide}
              onExport={handleExport}
              onImageSearch={handleImageSearch}
              onImageGenerate={handleImageGenerate}
              onImageRemove={handleImageRemove}
              onImageRegenerateWithPrompt={handleImageRegenerateWithPrompt}
              isRegenerating={isRegenerating}
              isExporting={isExporting}
              isImageLoading={isImageLoading}
            />
          </div>
        </div>
      </main>

      {/* Hidden export container — slides rendered at preview size (360×450)
          then CSS-scaled 3× to produce 1080×1350 export images. This keeps
          text and spacing proportional to what the user sees in the preview. */}
      <div
        ref={exportContainerRef}
        aria-hidden
        style={{ position: "absolute", left: "-9999px", top: 0, pointerEvents: "none" }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            data-export-slide
            style={{ width: 1080, height: 1350, overflow: "hidden", flexShrink: 0 }}
          >
            <div style={{ width: 360, height: 450, transform: "scale(3)", transformOrigin: "top left" }}>
              <SlideRenderer
                slide={slide}
                brand={brand}
                activePrimary={activePrimary}
                fontTheme={selectedFont}
                bgStyle={selectedBgStyle}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
