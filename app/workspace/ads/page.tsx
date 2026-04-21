"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { AdEditorPanel } from "@/components/ads/ad-editor-panel"
import { AdStylePanel } from "@/components/ads/ad-style-panel"
import { AdRenderer }   from "@/components/ads/ad-renderer"
import { AdPreviewStage } from "@/components/ads/preview-stage"
import { InstagramPostMockup } from "@/components/ads/platforms/instagram-post"
import { TikTokMockup }        from "@/components/ads/platforms/tiktok"
import { defaultAd, type AdState, type AdLayout } from "@/components/ads/types"
import { useBrand } from "@/hooks/use-brand"
import { cn } from "@/lib/utils"

type PlatformView = "instagram" | "tiktok"

const PLATFORM_TABS: { id: PlatformView; label: string; icon: React.ReactNode }[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 48 48" className="h-4 w-4" fill="currentColor">
        <path d="M38.4 21.68V16c-3.4 0-5.98-1.2-7.8-3.58a11.6 11.6 0 01-2.2-5.02h-5.8v25.4a5.2 5.2 0 01-5.2 5.2 5.2 5.2 0 01-5.2-5.2 5.2 5.2 0 015.2-5.2c.56 0 1.1.08 1.6.24v-5.88c-.52-.06-1.06-.1-1.6-.1A11.08 11.08 0 006.32 33.74 11.08 11.08 0 0017.4 44.82a11.08 11.08 0 0011.08-11.08V21.08A17.2 17.2 0 0038.4 25v-3.32z" />
      </svg>
    ),
  },
]

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

export default function AdsPage() {
  const [ad, setAd] = useState<AdState>(defaultAd)
  const [platform, setPlatform] = useState<PlatformView>("instagram")
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { brand, updateBrand, clearBrand, loaded } = useBrand()

  // Sync accent color from brand once it loads from localStorage
  useEffect(() => {
    if (loaded && brand.colors.length > 0) {
      setAd(prev => ({ ...prev, accentColor: brand.colors[0] }))
    }
  }, [loaded])

  const handleBrandUpdate = (updates: Partial<typeof brand>) => {
    updateBrand(updates)
    const newColors = updates.colors ?? brand.colors
    if (newColors.length > 0) setAd(prev => ({ ...prev, accentColor: newColors[0] }))
  }

  const set = (key: keyof AdState, value: unknown) =>
    setAd(prev => ({ ...prev, [key]: value }))

  const callGenerateApi = async (layout: AdLayout, customInstructions?: string, regenerate = false) => {
    if (!topic.trim()) return
    const setter = regenerate ? setIsRegenerating : setIsGenerating
    setter(true)
    setError(null)
    try {
      const res = await fetch("/api/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout, topic, brand, customInstructions }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error generando")
      setAd(prev => ({ ...prev, ...data, layout }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally {
      setter(false)
    }
  }

  const handleGenerate = () => callGenerateApi(ad.layout)
  const handleRegenerate = (layout: AdLayout, customInstructions: string) =>
    callGenerateApi(layout, customInstructions, true)

  const isTallPreview = true
  const stageScale = 1.16

  const renderPreview = () =>
    platform === "instagram"
      ? <InstagramPostMockup ad={ad} brand={brand} />
      : <TikTokMockup        ad={ad} brand={brand} />

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 overflow-hidden pt-16">
        <div className="mx-auto h-[calc(100vh-4rem)] w-full max-w-[1800px] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
          <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_340px] 2xl:grid-cols-[340px_minmax(720px,1fr)_360px]">

          {/* ── Left ── */}
          <WorkspacePanel>
            <AdStylePanel
              ad={ad} set={set} brand={brand}
              topic={topic} setTopic={setTopic}
              isGenerating={isGenerating} error={error}
              onBrandUpdate={handleBrandUpdate} onBrandClear={clearBrand}
              onGenerate={handleGenerate}
            />
          </WorkspacePanel>

          {/* ── Center ── */}
          <section className="min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-muted/20">
            <div className="flex h-full flex-col">
              <div className="border-b border-border/50 px-4 py-3 sm:px-5 xl:px-6">
                <div className="flex justify-center">
                  <div className="inline-flex w-full flex-wrap items-center justify-center gap-1 xl:w-auto xl:flex-nowrap">
                    {PLATFORM_TABS.map(({ id, label, icon }) => (
                      <button
                        key={id}
                        onClick={() => setPlatform(id)}
                        className={cn(
                          "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-all sm:flex-none",
                          platform === id
                            ? "border border-primary/40 bg-primary/15 text-foreground"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        {icon}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative flex-1 overflow-y-auto">
                <div className="mx-auto flex min-h-full w-full max-w-[860px] items-center justify-center p-4 sm:p-6 xl:p-8">
                  <div className="w-full">
                    <AdPreviewStage
                      maxScale={stageScale}
                      minScale={isTallPreview ? 0.66 : 0.58}
                      className={cn(isTallPreview ? "min-h-[620px] xl:min-h-[740px]" : "min-h-[520px] xl:min-h-[660px]")}
                    >
                      {renderPreview()}
                    </AdPreviewStage>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Right ── */}
          <WorkspacePanel className="hidden xl:block">
            <AdEditorPanel
              ad={ad}
              isRegenerating={isRegenerating}
              onRegenerate={handleRegenerate}
            />
          </WorkspacePanel>

        </div>
        </div>
      </main>
    </div>
  )
}
