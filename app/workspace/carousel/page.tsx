"use client"

import { useEffect, useState } from "react"
import { Undo2, Redo2, Pencil, PencilOff, Check } from "lucide-react"
import { Header } from "@/components/header"
import { InputPanel } from "@/components/input-panel"
import { CarouselPreview } from "@/components/carousel-preview"
import { EditorPanel } from "@/components/editor-panel"
import { EditorDrawer } from "@/components/editor-drawer"
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

const PLATFORM_TABS = [
  {
    id: "instagram" as const,
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: "tiktok" as const,
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 48 48" className="h-4 w-4" fill="currentColor">
        <path d="M38.4 21.68V16c-3.4 0-5.98-1.2-7.8-3.58a11.6 11.6 0 01-2.2-5.02h-5.8v25.4a5.2 5.2 0 01-5.2 5.2 5.2 5.2 0 01-5.2-5.2 5.2 5.2 0 015.2-5.2c.56 0 1.1.08 1.6.24v-5.88c-.52-.06-1.06-.1-1.6-.1A11.08 11.08 0 006.32 33.74 11.08 11.08 0 0017.4 44.82a11.08 11.08 0 0011.08-11.08V21.08A17.2 17.2 0 0038.4 25v-3.32z" />
      </svg>
    ),
  },
]

export default function CarouselPage() {
  const w = useWorkspace()
  const [editMode, setEditMode] = useState(false)

  // Keyboard shortcuts: Ctrl+Z undo, Ctrl+Y / Ctrl+Shift+Z redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (!ctrl) return
      // Ignore when inside a contenteditable or text input
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      const isEditing = (e.target as HTMLElement)?.isContentEditable || tag === "input" || tag === "textarea"
      if (isEditing) return

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        if (w.canUndo) w.undo()
      } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
        e.preventDefault()
        if (w.canRedo) w.redo()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [w.undo, w.redo, w.canUndo, w.canRedo])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden pt-16">
        <div className="mx-auto h-[calc(100vh-4rem)] w-full max-w-[1800px] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_300px] 2xl:grid-cols-[340px_minmax(720px,1fr)_320px]">

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
              onRemix={w.handleRemix}
              isRemixing={w.isRemixing}
              historyEntries={w.historyEntries}
              onLoadHistory={w.handleLoadHistory}
              onClearHistory={w.clearHistory}
            />
          </WorkspacePanel>

          <section className="min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-muted/20">
            <div className="flex h-full flex-col">
              {/* Toolbar: platform tabs + edit toggle + undo/redo */}
              <div className="flex items-center gap-1 border-b border-border/30 px-3 py-2">
                {/* Platform tabs */}
                <div className="flex items-center gap-0.5">
                  {PLATFORM_TABS.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => w.setPlatform(id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                        w.platform === id
                          ? "border border-primary/40 bg-primary/15 text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      {icon}
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mx-2 h-4 w-px bg-border/40" />

                {/* Edit toggle */}
                <button
                  onClick={() => setEditMode((e) => !e)}
                  title={editMode ? "Salir del modo edición" : "Editar texto directamente"}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                    editMode
                      ? "border border-primary/40 bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {editMode ? <PencilOff className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{editMode ? "Salir" : "Editar"}</span>
                </button>

                <div className="ml-auto flex items-center gap-1">
                  {/* Auto-save badge */}
                  {w.lastSaved && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/50 mr-1">
                      <Check className="h-3 w-3 text-green-500/70" />
                      Guardado
                    </span>
                  )}

                  {/* Editor drawer trigger — visible below xl */}
                  <EditorDrawer
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
                    onExportZip={w.handleExportZip}
                    onImageSearch={w.handleImageSearch}
                    onImageGenerate={w.handleImageGenerate}
                    onImageRemove={w.handleImageRemove}
                    onImageRegenerateWithPrompt={w.handleImageRegenerateWithPrompt}
                    onImageUpload={w.handleImageUpload}
                    isRegenerating={w.isRegenerating}
                    isExporting={w.isExporting}
                    isExportingZip={w.isExportingZip}
                    isImageLoading={w.isImageLoading}
                  />

                  <div className="h-4 w-px bg-border/40 xl:hidden" />

                  <button
                    onClick={w.undo}
                    disabled={!w.canUndo}
                    title="Deshacer (Ctrl+Z)"
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={w.redo}
                    disabled={!w.canRedo}
                    title="Rehacer (Ctrl+Y)"
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Redo2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
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
                    onUpdateField={w.handleUpdateField}
                    onUpdateListItem={w.handleUpdateListItem}
                    editMode={editMode}
                    onEditModeChange={setEditMode}
                    onReorderSlides={w.handleReorderSlides}
                    onAddSlides={w.handleAddSlides}
                    isAddingSlides={w.isAddingSlides}
                  />
                </div>
              </div>
            </div>
          </section>

          <WorkspacePanel className="hidden xl:block">
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
              onExportZip={w.handleExportZip}
              onImageSearch={w.handleImageSearch}
              onImageGenerate={w.handleImageGenerate}
              onImageRemove={w.handleImageRemove}
              onImageRegenerateWithPrompt={w.handleImageRegenerateWithPrompt}
              onImageUpload={w.handleImageUpload}
              isRegenerating={w.isRegenerating}
              isExporting={w.isExporting}
              isExportingZip={w.isExportingZip}
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
