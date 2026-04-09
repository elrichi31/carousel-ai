"use client"

import { Heart, MessageCircle, Bookmark, Share2, Music2, Plus, Search } from "lucide-react"
import { AdRenderer } from "@/components/ads/ad-renderer"
import type { AdState } from "@/components/ads/types"
import type { BrandSettings } from "@/lib/types"

const PHONE_W = 340
const PHONE_H = 700
const TOP_H = 82
const CTA_H = 46

interface Props { ad: AdState; brand: BrandSettings | null }

function ProfileAvatar({ brand, size = 40 }: { brand: BrandSettings | null; size?: number }) {
  if (brand?.logoUrl) {
    return <img src={brand.logoUrl} alt="" className="rounded-full object-cover"
      style={{ width: size, height: size, border: "2px solid #fff" }} />
  }
  const initial = brand?.name?.charAt(0).toUpperCase() ?? "A"
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.38,
        background: "linear-gradient(135deg,#ff0050,#00f2ea)", border: "2px solid #fff" }}>
      {initial}
    </div>
  )
}

function SideBtn({ icon: Icon, count }: { icon: React.ElementType; count?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon style={{ width: 24, height: 24, color: "white", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))" }} strokeWidth={1.8} />
      {count && <span className="text-[10px] font-semibold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{count}</span>}
    </div>
  )
}

export function TikTokMockup({ ad, brand }: Props) {
  const pageName  = brand?.name || "Tu Marca"
  const ctaText   = ad.cta || "Más información"
  const adH       = PHONE_H - TOP_H

  const caption =
    ad.layout === "promo"       ? ad.headline :
    ad.layout === "comparison"  ? ad.compHeadline :
    ad.layout === "feature"     ? ad.featHeadline :
    ad.layout === "testimonial" ? `"${ad.quote?.slice(0, 55)}…"` :
    ad.painHeadline

  const subCaption =
    ad.layout === "promo"       ? (ad.urgency || ad.body) :
    ad.layout === "comparison"  ? `${ad.leftLabel} vs ${ad.rightLabel}` :
    ad.layout === "feature"     ? ad.featBody :
    ad.layout === "testimonial" ? ad.authorRole :
    ad.painDesc

  return (
    <div className="relative overflow-hidden shadow-2xl"
      style={{ width: PHONE_W, height: PHONE_H, borderRadius: 16, backgroundColor: "#000" }}>

      {/* Ad background: starts below TikTok top chrome */}
      <div className="absolute inset-x-0" style={{ top: TOP_H, height: adH }}>
        <AdRenderer ad={{ ...ad, format: "story" }} w={PHONE_W} h={adH} brand={null} />
      </div>

      {/* Seamless join between header and ad */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: TOP_H,
          height: 28,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)",
        }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "55%",
          background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.55) 35%, transparent 100%)" }} />

      {/* Top chrome */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: TOP_H,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.36) 60%, transparent 100%)",
        }}
      >
        <div className="flex items-center justify-center gap-4 px-4" style={{ paddingTop: 18 }}>
          <span className="text-[11px] text-white/50 font-medium">Explorar</span>
          <span className="text-[11px] text-white/50 font-medium">Siguiendo</span>
          <div className="flex flex-col items-center">
            <span className="text-[13px] font-bold text-white">Para ti</span>
            <div className="mt-0.5 h-[2px] w-full rounded-full bg-white" />
          </div>
          <Search style={{ width: 16, height: 16, color: "rgba(255,255,255,0.8)" }} />
        </div>
      </div>

      {/* Right sidebar */}
      <div className="absolute right-3 flex flex-col items-center gap-4 pointer-events-none"
        style={{ top: "36%", transform: "translateY(-10%)" }}>
        <div className="relative mb-1">
          <ProfileAvatar brand={brand} size={40} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
            style={{ width: 18, height: 18, backgroundColor: "#ff0050", border: "1.5px solid #fff" }}>
            <Plus style={{ width: 10, height: 10, color: "#fff" }} strokeWidth={3} />
          </div>
        </div>
        <div style={{ height: 4 }} />
        <SideBtn icon={Heart}         count="2686" />
        <SideBtn icon={MessageCircle} count="284"  />
        <SideBtn icon={Bookmark}      count="254"  />
        <SideBtn icon={Share2}        count="16"   />
        <div className="rounded-full flex items-center justify-center mt-1"
          style={{ width: 32, height: 32, background: "linear-gradient(135deg,#111 30%,#444)",
            border: "2.5px solid rgba(255,255,255,0.3)" }}>
          <Music2 style={{ width: 13, height: 13, color: "white" }} />
        </div>
      </div>

      {/* Bottom-left: brand + caption + badge */}
      <div className="absolute left-0 pointer-events-none"
        style={{ bottom: CTA_H + 16, right: 64, paddingLeft: 14 }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[13px] font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            {pageName}
          </span>
          <div className="rounded-full flex items-center justify-center"
            style={{ width: 13, height: 13, backgroundColor: "#20d5ec" }}>
            <span style={{ fontSize: 7, color: "#fff", fontWeight: 800 }}>✓</span>
          </div>
        </div>
        {caption && (
          <p className="text-[11px] text-white mb-1 line-clamp-1"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>{caption}</p>
        )}
        {subCaption && (
          <p className="text-[10px] mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
            🔥 {subCaption}
          </p>
        )}
        <div className="inline-flex rounded px-2 py-0.5"
          style={{ backgroundColor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span className="text-[10px] font-medium text-white">Publicidad</span>
        </div>
      </div>

      {/* Full-width CTA */}
      <div className="absolute inset-x-0 pointer-events-none" style={{ bottom: 16, paddingInline: 12 }}>
        <div className="w-full rounded-lg flex items-center justify-center"
          style={{ height: CTA_H, backgroundColor: "#ff0050", boxShadow: "0 2px 16px rgba(255,0,80,0.4)" }}>
          <span className="text-[13px] font-bold text-white">{ctaText} ›</span>
        </div>
      </div>

    </div>
  )
}
