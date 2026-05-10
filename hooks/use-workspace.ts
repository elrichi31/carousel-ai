"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useBrand } from "@/hooks/use-brand"
import { useSessionHistory } from "@/hooks/use-session-history"
import { useAutosave, loadAutosave } from "@/hooks/use-autosave"
import { mockSlides } from "@/lib/mock-data"
import type { Slide, SlideLayout, CarouselFormData, PostCaption, Platform } from "@/lib/types"
import { colorThemes, CUSTOM_COLOR_ID, type ColorThemeId, type FontThemeId, type BgStyleId } from "@/lib/themes"

type AutosaveData = {
  slides: Slide[]
  caption: PostCaption | null
  platform: Platform
  selectedColor: ColorThemeId | typeof CUSTOM_COLOR_ID
  customColor: string
  selectedFont: FontThemeId
  selectedBgStyle: BgStyleId
  formData: CarouselFormData
}

// ─── Undo/redo history ────────────────────────────────────────────────────────

type SlidesHistory = { items: Slide[][]; cursor: number }

function pushHistory(h: SlidesHistory, slides: Slide[], max = 30): SlidesHistory {
  const items = [...h.items.slice(0, h.cursor + 1), slides]
  const trimmed = items.length > max ? items.slice(-max) : items
  return { items: trimmed, cursor: trimmed.length - 1 }
}

// ─────────────────────────────────────────────────────────────────────────────

export function useWorkspace() {
  const saved = useMemo(() => loadAutosave<AutosaveData>(), [])

  // Slides stored via history state so undo/redo is free
  const [slidesHistory, setSlidesHistory] = useState<SlidesHistory>({
    items: [saved?.slides ?? mockSlides],
    cursor: 0,
  })

  const slides = slidesHistory.items[slidesHistory.cursor]

  // History-tracked setter — every call creates a new undo point
  const setSlides = useCallback((newSlides: Slide[]) => {
    setSlidesHistory((h) => pushHistory(h, newSlides))
  }, [])

  // Silent setter — replaces current position without creating undo point
  // Used for image loading where intermediate states shouldn't pollute history
  const setSlidesInPlace = useCallback((updater: (prev: Slide[]) => Slide[]) => {
    setSlidesHistory((h) => {
      const items = [...h.items]
      items[h.cursor] = updater(items[h.cursor])
      return { ...h, items }
    })
  }, [])

  const undo = useCallback(() => {
    setSlidesHistory((h) => h.cursor > 0 ? { ...h, cursor: h.cursor - 1 } : h)
    setActiveSlide((a) => 0) // reset to first slide on undo to avoid out-of-bounds
  }, [])

  const redo = useCallback(() => {
    setSlidesHistory((h) =>
      h.cursor < h.items.length - 1 ? { ...h, cursor: h.cursor + 1 } : h
    )
  }, [])

  const canUndo = slidesHistory.cursor > 0
  const canRedo = slidesHistory.cursor < slidesHistory.items.length - 1

  const [activeSlide, setActiveSlide] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isAddingSlides, setIsAddingSlides] = useState(false)
  const [isRemixing, setIsRemixing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState<PostCaption | null>(saved?.caption ?? null)
  const [platform, setPlatform] = useState<Platform>(saved?.platform ?? "instagram")
  const [selectedColor, setSelectedColor] = useState<ColorThemeId | typeof CUSTOM_COLOR_ID>(saved?.selectedColor ?? "green")
  const [customColor, setCustomColor] = useState(saved?.customColor ?? "#22c55e")
  const [selectedFont, setSelectedFont] = useState<FontThemeId>(saved?.selectedFont ?? "geist")
  const [selectedBgStyle, setSelectedBgStyle] = useState<BgStyleId>(saved?.selectedBgStyle ?? "gradient")
  const [formData, setFormData] = useState<CarouselFormData>(saved?.formData ?? {
    topic: "", audience: "General", tone: "Professional",
    slideCount: 5, visualStyle: "Minimal", withImages: false, imageSource: "unsplash",
  })

  const exportContainerRef = useRef<HTMLDivElement>(null)
  const { brand, updateBrand, clearBrand } = useBrand()
  const { entries: historyEntries, addEntry: addHistoryEntry, clearHistory } = useSessionHistory()

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

  const updateActiveSlide = useCallback((updates: Partial<Slide>) => {
    setSlidesHistory((h) => {
      const current = h.items[h.cursor]
      const updated = current.map((s, i) => i === activeSlide ? { ...s, ...updates } : s)
      return pushHistory(h, updated)
    })
  }, [activeSlide])

  const handleUpdateField = useCallback((field: keyof Slide, value: string) => {
    updateActiveSlide({ [field]: value } as Partial<Slide>)
  }, [updateActiveSlide])

  const handleUpdateListItem = useCallback((index: number, text: string) => {
    setSlidesHistory((h) => {
      const current = h.items[h.cursor]
      const updated = current.map((s, i) => {
        if (i !== activeSlide || !s.listItems) return s
        const listItems = s.listItems.map((item, j) => j === index ? { ...item, text } : item)
        return { ...s, listItems }
      })
      return pushHistory(h, updated)
    })
  }, [activeSlide])

  const handleLayoutChange = (layout: SlideLayout) => updateActiveSlide({ layout })
  const handleVariantChange = (variant: string) => {
    if (variant === 'bg-image') {
      updateActiveSlide({ imagePosition: 'background' })
    } else {
      updateActiveSlide({ layoutVariant: variant, imagePosition: undefined })
    }
  }
  const handleImagePositionChange = (position: "background" | undefined) =>
    updateActiveSlide({ imagePosition: position })

  const handleReorderSlides = useCallback((from: number, to: number) => {
    const next = [...slides]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setSlides(next)
    setActiveSlide(to)
  }, [slides, setSlides])

  const handleDuplicateSlide = () => {
    const newSlide = { ...slides[activeSlide], id: Date.now().toString() }
    const next = [...slides]
    next.splice(activeSlide + 1, 0, newSlide)
    setSlides(next)
  }

  const handleDeleteSlide = () => {
    if (slides.length <= 2) return
    const next = slides.filter((_, i) => i !== activeSlide)
    setSlides(next)
    setActiveSlide(Math.min(activeSlide, next.length - 1))
  }

  // ─── Add slides ──────────────────────────────────────────────────────────────

  const handleAddSlides = async () => {
    if (!formData.topic.trim()) { setError("Escribe un tema primero para agregar slides."); return }
    setIsAddingSlides(true)
    setError(null)
    try {
      const res = await fetch("/api/add-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ existingSlides: slides, formData, brand: brand.name || brand.logoUrl ? brand : null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "No se pudieron agregar slides"); return }
      const newSlides = data.slides as Slide[]
      // Insert before last slide (CTA)
      const next = [...slides.slice(0, -1), ...newSlides, slides[slides.length - 1]]
      setSlides(next)
      setActiveSlide(slides.length - 1)
    } catch {
      setError("Error de red al agregar slides.")
    } finally {
      setIsAddingSlides(false)
    }
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

      // Save to session history
      addHistoryEntry({
        topic: formData.topic,
        slides: generated,
        caption: data.caption ?? null,
        formData,
      })

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
                  body: JSON.stringify({ query: s.title || formData.topic, topic: formData.topic, source: formData.imageSource }),
                }).then((r) => r.json())
              )
            )
            setSlidesInPlace((prev) => {
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

  // ─── URL Remix ────────────────────────────────────────────────────────────────

  const handleRemix = async (url: string) => {
    setIsRemixing(true)
    setError(null)
    try {
      const res = await fetch("/api/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, slideCount: formData.slideCount }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to remix URL"); return }

      const generated: Slide[] = data.slides
      setSlides(generated)
      setActiveSlide(0)
      setCaption(data.caption ?? null)

      // Pre-fill the topic field with the article title
      if (data.topic) handleFormChange({ topic: data.topic })

      addHistoryEntry({
        topic: data.topic || url,
        slides: generated,
        caption: data.caption ?? null,
        formData: { ...formData, topic: data.topic || url },
      })
    } catch {
      setError("Network error. Check your connection and try again.")
    } finally {
      setIsRemixing(false)
    }
  }

  // ─── Load from session history ────────────────────────────────────────────────

  const handleLoadHistory = useCallback((entry: { slides: Slide[]; caption: PostCaption | null; formData: CarouselFormData }) => {
    setSlides(entry.slides)
    setActiveSlide(0)
    setCaption(entry.caption)
    setFormData(entry.formData)
  }, [setSlides])

  // ─── Regenerate slide ─────────────────────────────────────────────────────────

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

  const [isExportingZip, setIsExportingZip] = useState(false)

  const handleExportZip = async () => {
    setIsExportingZip(true)
    try {
      const { domToPng } = await import("modern-screenshot")
      const JSZip = (await import("jszip")).default
      const container = exportContainerRef.current
      if (!container) return
      const slideEls = container.querySelectorAll<HTMLElement>("[data-export-slide]")
      const zip = new JSZip()
      for (let i = 0; i < slideEls.length; i++) {
        const dataUrl = await domToPng(slideEls[i], { width: 1080, height: 1350, scale: 1, backgroundColor: "#111111" })
        const base64 = dataUrl.split(",")[1]
        zip.file(`slide-${i + 1}.png`, base64, { base64: true })
      }
      const blob = await zip.generateAsync({ type: "blob" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = `carousel-${formData.topic.slice(0, 30).replace(/[^a-z0-9]/gi, "-") || "export"}.zip`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch (err) {
      console.error("ZIP export error:", err)
      setError("ZIP export failed. Try again.")
    } finally {
      setIsExportingZip(false)
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
        body: JSON.stringify({ query, topic: formData.topic, source }),
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
        body: JSON.stringify({ query: currentSlide.title || formData.topic, topic: formData.topic, source, customPrompt }),
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

  // ─── Auto-save ────────────────────────────────────────────────────────────────

  const autosaveData = useMemo<AutosaveData>(() => ({
    slides,
    caption,
    platform,
    selectedColor,
    customColor,
    selectedFont,
    selectedBgStyle,
    formData,
  }), [slides, caption, platform, selectedColor, customColor, selectedFont, selectedBgStyle, formData])

  const { lastSaved } = useAutosave(autosaveData)

  return {
    // State
    slides, activeSlide, setActiveSlide,
    isGenerating, isRegenerating, isRemixing, isExporting, isExportingZip, isImageLoading,
    error, caption, setCaption,
    platform, setPlatform,
    formData, selectedColor, customColor, selectedFont, setSelectedFont, selectedBgStyle, setSelectedBgStyle,
    activePrimary, currentSlide, brand, updateBrand, clearBrand,
    exportContainerRef,
    lastSaved,
    // Undo/redo
    undo, redo, canUndo, canRedo,
    // Session history
    historyEntries, clearHistory, handleLoadHistory,
    isAddingSlides,
    // Handlers
    handleFormChange, handleColorChange,
    handleLayoutChange, handleVariantChange, handleImagePositionChange,
    handleGenerate, handleRegenerateSlide, handleExport, handleExportZip,
    handleRemix,
    handleReorderSlides, handleAddSlides,
    handleDuplicateSlide, handleDeleteSlide,
    handleUpdateField, handleUpdateListItem,
    handleImageSearch, handleImageGenerate, handleImageUpload, handleImageRemove, handleImageRegenerateWithPrompt,
  }
}
