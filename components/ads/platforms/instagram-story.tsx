"use client"

import { X, ChevronUp } from "lucide-react"
import { AdRenderer } from "@/components/ads/ad-renderer"
import type { AdState } from "@/components/ads/types"
import type { BrandSettings } from "@/lib/types"

const PHONE_W  = 340
const PHONE_H  = 680
// Height reserved for the Instagram chrome at top and bottom
const TOP_H    = 74   // progress bar + profile row
const BOTTOM_H = 80   // CTA swipe-up area

interface Props { ad: AdState; brand: BrandSettings | null }

function Avatar({ brand, size = 32 }: { brand: BrandSettings | null; size?: number }) {
  if (brand?.logoUrl) {
    return (
      <img src={brand.logoUrl} className="rounded-full object-cover flex-shrink-0" alt=""
        style={{ width: size, height: size, outline: "2px solid rgba(255,255,255,0.7)", outlineOffset: 1 }} />
    )
  }
  const initial = brand?.name?.charAt(0).toUpperCase() ?? "A"
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38,
        background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
        outline: "2px solid rgba(255,255,255,0.7)", outlineOffset: 1 }}>
      {initial}
    </div>
  )
}

export function InstagramStoryMockup({ ad, brand }: Props) {
  const pageName = brand?.name || "Tu Marca"
  const ctaText  = ad.cta || "Más información"
  const adH      = PHONE_H - TOP_H - BOTTOM_H

  return (
    <div className="relative overflow-hidden shadow-2xl"
      style={{ width: PHONE_W, height: PHONE_H, borderRadius: 16, backgroundColor: ad.bgColor }}>

      {/* ── Ad content: starts below the Instagram header ── */}
      <div className="absolute inset-x-0" style={{ top: TOP_H, height: adH }}>
        <AdRenderer ad={{ ...ad, format: "story" }} w={PHONE_W} h={adH} brand={null} />
      </div>

      {/* ── Thin gradient where ad meets header (seamless join) ── */}
      <div className="absolute inset-x-0 pointer-events-none"
        style={{ top: TOP_H, height: 24,
          background: `linear-gradient(to bottom, ${ad.bgColor} 0%, transparent 100%)` }} />

      {/* ── Bottom gradient over ad (for CTA readability) ── */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: BOTTOM_H + 40,
          background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />

      {/* ── Top chrome: same bg color as ad so it looks like one piece ── */}
      <div className="absolute inset-x-0 top-0 flex flex-col px-4 pointer-events-none"
        style={{ height: TOP_H, backgroundColor: ad.bgColor, paddingTop: 12 }}>
        {/* Progress bar */}
        <div className="flex gap-1 mb-2.5">
          <div className="h-[3px] flex-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.85)" }} />
        </div>
        {/* Profile row */}
        <div className="flex items-center gap-2.5">
          <Avatar brand={brand} size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white leading-none">{pageName}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>Publicidad</p>
          </div>
          <X className="h-5 w-5 text-white opacity-80" />
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pointer-events-none"
        style={{ height: BOTTOM_H, justifyContent: "center", gap: 6 }}>
        <ChevronUp className="h-4 w-4 text-white opacity-80 animate-bounce" />
        <div className="rounded-full px-7 py-2.5 text-[13px] font-semibold text-white"
          style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
            border: "1.5px solid rgba(255,255,255,0.4)" }}>
          {ctaText}
        </div>
      </div>

    </div>
  )
}
