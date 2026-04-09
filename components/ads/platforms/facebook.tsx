"use client"

import { ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe } from "lucide-react"
import { AdRenderer } from "@/components/ads/ad-renderer"
import type { AdState } from "@/components/ads/types"
import type { BrandSettings } from "@/lib/types"

// Card is 500px wide; image fills 100% of inner card
const CARD_W = 500
const IMG_W  = 500
const IMG_H  = 281  // 16:9

interface Props { ad: AdState; brand: BrandSettings | null }

function Avatar({ brand }: { brand: BrandSettings | null }) {
  if (brand?.logoUrl) {
    return <img src={brand.logoUrl} className="rounded-full object-cover flex-shrink-0" alt="" style={{ width: 40, height: 40 }} />
  }
  const initial = brand?.name?.charAt(0).toUpperCase() ?? "A"
  return (
    <div className="rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
      style={{ width: 40, height: 40, background: "linear-gradient(135deg,#1877f2,#42a5f5)" }}>
      {initial}
    </div>
  )
}

function ReactionBtn({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="flex flex-1 items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-colors hover:bg-white/5"
      style={{ color: "rgba(255,255,255,0.6)" }}>
      <Icon style={{ width: 18, height: 18 }} />
      {label}
    </button>
  )
}

export function FacebookMockup({ ad, brand }: Props) {
  const pageName = brand?.name || "Tu Página"
  const ctaText  = ad.cta || "Más información"

  const adHeadline =
    ad.layout === "promo"        ? ad.headline :
    ad.layout === "comparison"   ? ad.compHeadline :
    ad.layout === "feature"      ? ad.featHeadline :
    ad.layout === "testimonial"  ? (ad.authorRole || pageName) :
    ad.painHeadline

  const adBody =
    ad.layout === "promo"        ? ad.body :
    ad.layout === "comparison"   ? `${ad.leftLabel} vs ${ad.rightLabel}` :
    ad.layout === "feature"      ? ad.featBody :
    ad.layout === "testimonial"  ? `"${ad.quote?.slice(0, 100)}…"` :
    ad.painDesc

  return (
    <div className="overflow-hidden rounded-2xl shadow-2xl"
      style={{ width: CARD_W, backgroundColor: "#18191a", border: "1px solid rgba(255,255,255,0.07)" }}>

      {/* ── Facebook navbar ── */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "#242526", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="h-9 w-9 rounded-full flex items-center justify-center font-black text-lg"
          style={{ backgroundColor: "#1877f2", color: "#fff" }}>f</div>
        <div className="flex items-center gap-1">
          {[
            { emoji: "🏠", active: true },
            { emoji: "👥", active: false },
            { emoji: "▶️", active: false },
            { emoji: "🛒", active: false },
          ].map(({ emoji, active }, i) => (
            <div key={i} className={`relative flex items-center justify-center rounded-lg px-3 py-1 ${active ? "" : "opacity-40"}`}
              style={{ backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent" }}>
              <span className="text-lg">{emoji}</span>
              {active && <div className="absolute -bottom-3 left-0 right-0 h-[3px] rounded-full"
                style={{ backgroundColor: "#1877f2" }} />}
            </div>
          ))}
        </div>
        <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>☰</div>
      </div>

      {/* ── Post card ── */}
      <div style={{ margin: "10px 10px 10px", borderRadius: 12, overflow: "hidden", backgroundColor: "#242526" }}>

        {/* Post header */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <Avatar brand={brand} />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-white leading-tight">{pageName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>Publicidad</span>
              <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
              <Globe style={{ width: 12, height: 12, color: "rgba(255,255,255,0.4)" }} />
            </div>
          </div>
          <MoreHorizontal style={{ width: 20, height: 20, color: "rgba(255,255,255,0.45)" }} />
        </div>

        {/* Caption */}
        {adBody && (
          <p className="px-4 pb-3 text-[14px] leading-snug" style={{ color: "rgba(255,255,255,0.88)" }}>
            {adBody}
          </p>
        )}

        {/* Ad image — full width, 16:9 */}
        <div style={{ width: IMG_W, height: IMG_H }}>
          <AdRenderer ad={{ ...ad, format: "landscape" }} w={IMG_W} h={IMG_H} brand={null} />
        </div>

        {/* Headline + CTA strip */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "#3a3b3c" }}>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white truncate">{adHeadline}</p>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
              {(brand?.name ?? "tumarca").toLowerCase().replace(/\s+/g, "")}.com
            </p>
          </div>
          <button className="flex-shrink-0 rounded-lg px-4 py-2 text-[13px] font-semibold text-white whitespace-nowrap"
            style={{ backgroundColor: "#4e4f50", border: "1px solid rgba(255,255,255,0.1)" }}>
            {ctaText}
          </button>
        </div>

        {/* Reaction counts */}
        <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">👍❤️😮</span>
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>1.2K</span>
          </div>
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>234 comentarios</span>
        </div>

        {/* Action buttons */}
        <div className="flex px-2 pb-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <ReactionBtn icon={ThumbsUp}      label="Me gusta" />
          <ReactionBtn icon={MessageSquare} label="Comentar" />
          <ReactionBtn icon={Share2}        label="Compartir" />
        </div>
      </div>
    </div>
  )
}
