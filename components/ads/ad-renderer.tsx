"use client"

import type { BrandSettings } from "@/lib/types"
import type { AdState } from "./types"
import { ComparisonAd }   from "./comparison-ad"
import { PromoAd }        from "./promo-ad"
import { FeatureAd }      from "./feature-ad"
import { TestimonialAd }  from "./testimonial-ad"
import { PainSolutionAd } from "./pain-solution-ad"

interface AdRendererProps {
  ad: AdState
  w: number
  h: number
  brand?: BrandSettings | null
}

const BRAND_BAR_RATIO = 0.09 // 9% of height reserved for brand bar

export function AdRenderer({ ad, w, h, brand }: AdRendererProps) {
  const hasBrand = brand && (brand.logoUrl || brand.name)
  const brandBarH = hasBrand ? Math.round(h * BRAND_BAR_RATIO) : 0
  const contentH = h - brandBarH
  const s = w / 360

  const props = { ad, w, h: contentH }

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: ad.bgColor }}>
      {/* Main ad content */}
      <div style={{ height: contentH, flexShrink: 0, overflow: "hidden" }}>
        {ad.layout === "comparison"   && <ComparisonAd   {...props} />}
        {ad.layout === "promo"        && <PromoAd        {...props} />}
        {ad.layout === "feature"      && <FeatureAd      {...props} />}
        {ad.layout === "testimonial"  && <TestimonialAd  {...props} />}
        {ad.layout === "painSolution" && <PainSolutionAd {...props} />}
      </div>

      {/* Brand bar — dedicated strip, never overlaps content */}
      {hasBrand && (
        <div
          className="flex items-center justify-center gap-2 flex-shrink-0"
          style={{
            height: brandBarH,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(6px)",
          }}
        >
          {brand.logoUrl && (
            <img
              src={brand.logoUrl}
              alt=""
              className="rounded-sm object-contain opacity-85"
              style={{ height: s * 14, width: s * 14 }}
            />
          )}
          {brand.name && (
            <span
              className="font-medium tracking-wide"
              style={{ fontSize: s * 9, color: "#fff", opacity: 0.75 }}
            >
              {brand.name}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
