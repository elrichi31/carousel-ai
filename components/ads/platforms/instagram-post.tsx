"use client"

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react"
import { AdRenderer } from "@/components/ads/ad-renderer"
import type { AdState } from "@/components/ads/types"
import type { BrandSettings } from "@/lib/types"

const AD_W = 380
const AD_H = 475

interface Props { ad: AdState; brand: BrandSettings | null }

function Avatar({ brand }: { brand: BrandSettings | null }) {
  if (brand?.logoUrl) {
    return <img src={brand.logoUrl} className="h-8 w-8 rounded-full object-cover ring-2 ring-pink-500/60" alt="" />
  }
  const initial = brand?.name?.charAt(0).toUpperCase() ?? "A"
  return (
    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-pink-500/60"
      style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
      {initial}
    </div>
  )
}

export function InstagramPostMockup({ ad, brand }: Props) {
  const pageName = brand?.name || "Tu Marca"
  const ctaText = ad.cta || "Saber más"

  return (
    <div className="w-[400px] rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar brand={brand} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white leading-none">{pageName}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Publicidad</p>
        </div>
        <MoreHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0" />
      </div>

      {/* Ad image */}
      <div style={{ width: AD_W, height: AD_H, margin: "0 auto" }}>
        <AdRenderer ad={{ ...ad, format: "square" }} w={AD_W} h={AD_H} brand={null} />
      </div>

      {/* CTA button */}
      <div className="px-3 pt-2.5">
        <button className="w-full rounded-lg py-2 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
          style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
          {ctaText}
          <span className="opacity-60">›</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-3.5">
          <Heart className="h-[22px] w-[22px] text-white opacity-85" />
          <MessageCircle className="h-[22px] w-[22px] text-white opacity-85" />
          <Send className="h-[22px] w-[22px] text-white opacity-85" />
        </div>
        <Bookmark className="h-[22px] w-[22px] text-white opacity-85" />
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-[11px] text-gray-300 leading-relaxed">
          <span className="font-semibold text-white">{pageName} </span>
          {ad.layout === "promo" ? ad.headline :
           ad.layout === "comparison" ? ad.compHeadline :
           ad.layout === "feature" ? ad.featHeadline :
           ad.layout === "testimonial" ? ad.quote?.slice(0, 60) + "…" :
           ad.painHeadline}
        </p>
        <p className="text-[10px] text-gray-500 mt-1">Ver todos los comentarios</p>
      </div>
    </div>
  )
}
