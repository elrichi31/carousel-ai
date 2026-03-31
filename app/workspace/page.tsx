"use client"

import { useState } from "react"

import { Header } from "@/components/header"
import { InputPanel } from "@/components/input-panel"
import { CarouselPreview } from "@/components/carousel-preview"
import { EditorPanel } from "@/components/editor-panel"
import { useBrand } from "@/hooks/use-brand"
import { mockSlides } from "@/lib/mock-data"
import type { Slide, SlideLayout, CarouselFormData } from "@/lib/types"

export default function WorkspacePage() {
  const [slides, setSlides] = useState<Slide[]>(mockSlides)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { brand, updateBrand, clearBrand } = useBrand()

  // Form state
  const [formData, setFormData] = useState<CarouselFormData>({
    topic: "",
    audience: "General",
    tone: "Professional",
    slideCount: 5,
    visualStyle: "Minimal",
  })

  // Editor state
  const [selectedColor, setSelectedColor] = useState("default")
  const [selectedFont, setSelectedFont] = useState("sans")

  // Current slide's layout
  const currentLayout = slides[activeSlide]?.layout || "content"

  const handleFormChange = (data: Partial<CarouselFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
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

      setSlides(data.slides)
      setActiveSlide(0)
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLayoutChange = (layout: SlideLayout) => {
    setSlides((prev) =>
      prev.map((slide, i) =>
        i === activeSlide ? { ...slide, layout } : slide
      )
    )
  }

  const handleRegenerateSlide = () => {
    console.log("Regenerating slide", activeSlide)
  }

  const handleDuplicateSlide = () => {
    const newSlide = { ...slides[activeSlide], id: Date.now().toString() }
    const newSlides = [...slides]
    newSlides.splice(activeSlide + 1, 0, newSlide)
    setSlides(newSlides)
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
          <div className="bg-muted/30 overflow-y-auto flex items-center justify-center p-8">
            <CarouselPreview
              slides={slides}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
              brand={brand}
            />
          </div>

          {/* Editor Panel */}
          <div className="border-l border-border overflow-y-auto hidden lg:block">
            <EditorPanel
              selectedLayout={currentLayout}
              selectedColor={selectedColor}
              selectedFont={selectedFont}
              onLayoutChange={handleLayoutChange}
              onColorChange={setSelectedColor}
              onFontChange={setSelectedFont}
              onRegenerateSlide={handleRegenerateSlide}
              onDuplicateSlide={handleDuplicateSlide}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
