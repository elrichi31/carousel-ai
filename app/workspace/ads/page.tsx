"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AdFormPanel }  from "@/components/ads/ad-form-panel"
import { AdStylePanel } from "@/components/ads/ad-style-panel"
import { AdRenderer }   from "@/components/ads/ad-renderer"
import { AdPreviewStage } from "@/components/ads/preview-stage"
import { InstagramPostMockup }  from "@/components/ads/platforms/instagram-post"
import { InstagramStoryMockup } from "@/components/ads/platforms/instagram-story"
import { TikTokMockup }         from "@/components/ads/platforms/tiktok"
import { FacebookMockup }       from "@/components/ads/platforms/facebook"
import { defaultAd, FORMATS, type AdState } from "@/components/ads/types"
import { useBrand } from "@/hooks/use-brand"
import { cn } from "@/lib/utils"

type PlatformView = "custom" | "ig-post" | "ig-story" | "tiktok" | "facebook"

const PLATFORM_TABS: { id: PlatformView; label: string; emoji: string }[] = [
  { id: "custom",   label: "Personalizado", emoji: "🖼️" },
  { id: "ig-post",  label: "Instagram Post", emoji: "📸" },
  { id: "ig-story", label: "IG Story",       emoji: "📱" },
  { id: "tiktok",   label: "TikTok",         emoji: "🎵" },
  { id: "facebook", label: "Facebook",       emoji: "👤" },
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
  const [platform, setPlatform] = useState<PlatformView>("ig-post")
  const { brand, updateBrand, clearBrand } = useBrand()

  const set = (key: keyof AdState, value: unknown) =>
    setAd(prev => ({ ...prev, [key]: value }))

  const handleGenerated = (data: Partial<AdState>) =>
    setAd(prev => ({ ...prev, ...data }))

  const selectedFormat = FORMATS.find(f => f.id === ad.format)!
  const isTallPreview = platform === "ig-story" || platform === "tiktok"
  const stageScale =
    platform === "facebook"
      ? 1.05
      : platform === "custom" && ad.format === "landscape"
        ? 1.28
        : 1.16

  const renderPreview = () => {
    switch (platform) {
      case "custom":
        return (
          <div
            className="overflow-hidden rounded-[28px] border border-white/10 shadow-xl shadow-black/20"
            style={{ width: selectedFormat.w, height: selectedFormat.h }}
          >
            <AdRenderer ad={ad} w={selectedFormat.w} h={selectedFormat.h} brand={brand} />
          </div>
        )
      case "ig-post":  return <InstagramPostMockup  ad={ad} brand={brand} />
      case "ig-story": return <InstagramStoryMockup ad={ad} brand={brand} />
      case "tiktok":   return <TikTokMockup         ad={ad} brand={brand} />
      case "facebook": return <FacebookMockup       ad={ad} brand={brand} />
    }
  }

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
              onBrandUpdate={updateBrand} onBrandClear={clearBrand}
              onGenerated={handleGenerated}
            />
          </WorkspacePanel>

          {/* ── Center: single scroll container (same pattern as carousel) ── */}
          <section className="min-h-0 overflow-hidden rounded-[28px] border border-border/60 bg-muted/20">
            <div className="flex h-full flex-col">
              <div className="border-b border-border/50 px-4 py-3 sm:px-5 xl:px-6">
                <div className="flex justify-center">
                  <div className="inline-flex w-full flex-wrap items-center justify-center gap-1 xl:w-auto xl:flex-nowrap">
                    {PLATFORM_TABS.map(({ id, label, emoji }) => (
                      <button
                        key={id}
                        onClick={() => setPlatform(id)}
                        className={cn(
                          "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-all xl:flex-none",
                          platform === id
                            ? "border border-primary/40 bg-primary/15 text-foreground"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <span>{emoji}</span>
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
            <AdFormPanel ad={ad} set={set} />
          </WorkspacePanel>

        </div>
        </div>
      </main>
    </div>
  )
}
