"use client"

import { useRef, useState } from "react"
import { useBrand } from "@/hooks/use-brand"
import { mockSlides } from "@/lib/mock-data"
import type { Slide, SlideLayout, CarouselFormData, PostCaption, Platform } from "@/lib/types"
import { colorThemes, CUSTOM_COLOR_ID, type ColorThemeId, type FontThemeId, type BgStyleId } from "@/lib/themes"

export function useWorkspace() {
  const [slides, setSlides] = useState<Slide[]>(mockSlides)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState<PostCaption | null>(null)
  const [platform, setPlatform] = useState<Platform>("instagram")
  const [selectedColor, setSelectedColor] = useState<ColorThemeId | typeof CUSTOM_COLOR_ID>("green")
  const [customColor, setCustomColor] = useState("#22c55e")
  const [selectedFont, setSelectedFont] = useState<FontThemeId>("geist")
  const [selectedBgStyle, setSelectedBgStyle] = useState<BgStyleId>("gradient")
  const [formData, setFormData] = useState<CarouselFormData>({
    topic: "", audience: "General", tone: "Professional",
    slideCount: 5, visualStyle: "Minimal", withImages: false, imageSource: "unsplash",
  })

  const exportContainerRef = useRef<HTMLDivElement>(null)
  const { brand, updateBrand, clearBrand } = useBrand()

  const currentSlide = slides[activeSlide] ?? slides[0]
  const activePrimary =
    selectedColor === CUSTOM_COLOR_ID
      ? customColor
      : colorThemes[selectedColor]?.primary ?? colorThemes.green.primary

  // ─── Form & theme ────────────────────────────────────────────────────────────

  const handleFormChange = (data: Partial<CarouselFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }))

  const handleColorChange = (color: ColorThemeId | typeof CUSTOM_COLOR_ID, hex?: string) => {
    setSelectedColor(color)
    if (color === CUSTOM_COLOR_ID && hex) setCustomColor(hex)
  }

  // ─── Slide manipulation ───────────────────────────────────────────────────────

  const updateActiveSlide = (updates: Partial<Slide>) =>
    setSlides((prev) => prev.map((s, i) => i === activeSlide ? { ...s, ...updates } : s))

  const handleLayoutChange = (layout: SlideLayout) => updateActiveSlide({ layout })
  const handleVariantChange = (variant: string) => updateActiveSlide({ layoutVariant: variant })

  const handleDuplicateSlide = () => {
    const newSlide = { ...slides[activeSlide], id: Date.now().toString() }
    const next = [...slides]
    next.splice(activeSlide + 1, 0, newSlide)
    setSlides(next)
  }

  const handleDeleteSlide = () => {
    if (slides.length <= 2) return // keep at least cover + cta
    const next = slides.filter((_, i) => i !== activeSlide)
    setSlides(next)
    setActiveSlide(Math.min(activeSlide, next.length - 1))
  }

  // ─── Generation ───────────────────────────────────────────────────────────────

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, brand: brand.name || brand.logoUrl ? brand : null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to generate carousel"); return }

      const generated: Slide[] = data.slides
      setSlides(generated)
      setActiveSlide(0)
      setCaption(data.caption ?? null)

      // Auto-fetch images only when using Unsplash or DALL-E (not when user uploads their own)
      if (formData.withImages && formData.imageSource !== "upload") {
        const splitSlides = generated.map((s, i) => ({ s, i })).filter(({ s }) => s.layout === "split")
        if (splitSlides.length > 0) {
          setIsImageLoading(true)
          try {
            const fetched = await Promise.all(
              splitSlides.map(({ s }) =>
                fetch("/api/images", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ query: s.title || formData.topic, source: formData.imageSource }),
                }).then((r) => r.json())
              )
            )
            setSlides((prev) => {
              const next = [...prev]
              splitSlides.forEach(({ i }, idx) => {
                const result = fetched[idx]
                if (result?.url) {
                  next[i] = { ...next[i], imageUrl: result.url, imagePrompt: result.prompt ?? undefined, imageSource: formData.imageSource }
                }
              })
              return next
            })
          } catch { /* Images are non-critical */ } finally {
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

  const handleRegenerateSlide = async (targetLayout: SlideLayout, customPrompt: string) => {
    if (!formData.topic.trim()) { setError("Enter a topic first to regenerate a slide."); return }
    setIsRegenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/regenerate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideIndex: activeSlide, totalSlides: slides.length,
          currentLayout: targetLayout, customPrompt: customPrompt || undefined,
          formData, brand: brand.name || brand.logoUrl ? brand : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to regenerate slide"); return }
      updateActiveSlide({ ...data.slide, id: slides[activeSlide].id })
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsRegenerating(false)
    }
  }

  // ─── Export ───────────────────────────────────────────────────────────────────

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const { domToPng } = await import("modern-screenshot")
      const container = exportContainerRef.current
      if (!container) return
      const slideEls = container.querySelectorAll<HTMLElement>("[data-export-slide]")
      for (let i = 0; i < slideEls.length; i++) {
        const dataUrl = await domToPng(slideEls[i], { width: 1080, height: 1350, scale: 1, backgroundColor: "#111111" })
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = `slide-${i + 1}.png`
        a.click()
        if (i < slideEls.length - 1) await new Promise((r) => setTimeout(r, 400))
      }
    } catch (err) {
      console.error("Export error:", err)
      setError("Export failed. Try again.")
    } finally {
      setIsExporting(false)
    }
  }

  // ─── Image ────────────────────────────────────────────────────────────────────

  const fetchImage = async (source: "unsplash" | "dalle") => {
    const query = currentSlide.title || formData.topic
    if (!query.trim()) { setError("El slide necesita un título o un tema para buscar una imagen."); return }
    setIsImageLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, source }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "No se pudo obtener la imagen."); return }
      updateActiveSlide({ imageUrl: data.url, imagePrompt: data.prompt ?? undefined, imageSource: source })
    } catch {
      setError("Error de red al buscar la imagen.")
    } finally {
      setIsImageLoading(false)
    }
  }

  const handleImageSearch = () => fetchImage("unsplash")
  const handleImageGenerate = () => fetchImage("dalle")

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateActiveSlide({ imageUrl: e.target?.result as string, imagePrompt: undefined, imageSource: "upload" })
    }
    reader.readAsDataURL(file)
  }

  const handleImageRemove = () =>
    updateActiveSlide({ imageUrl: undefined, imagePrompt: undefined, imageSource: undefined })

  const handleImageRegenerateWithPrompt = async (customPrompt: string) => {
    const source = currentSlide.imageSource === "upload" ? "unsplash" : (currentSlide.imageSource ?? "unsplash")
    setIsImageLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentSlide.title || formData.topic, source, customPrompt }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "No se pudo regenerar la imagen."); return }
      updateActiveSlide({ imageUrl: data.url, imagePrompt: data.prompt ?? customPrompt, imageSource: source })
    } catch {
      setError("Error de red al regenerar la imagen.")
    } finally {
      setIsImageLoading(false)
    }
  }

  return {
    // State
    slides, activeSlide, setActiveSlide,
    isGenerating, isRegenerating, isExporting, isImageLoading,
    error, caption, setCaption,
    platform, setPlatform,
    formData, selectedColor, customColor, selectedFont, setSelectedFont, selectedBgStyle, setSelectedBgStyle,
    activePrimary, currentSlide, brand, updateBrand, clearBrand,
    exportContainerRef,
    // Handlers
    handleFormChange, handleColorChange,
    handleLayoutChange, handleVariantChange,
    handleGenerate, handleRegenerateSlide, handleExport,
    handleDuplicateSlide, handleDeleteSlide,
    handleImageSearch, handleImageGenerate, handleImageUpload, handleImageRemove, handleImageRegenerateWithPrompt,
  }
}
