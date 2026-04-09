export type AdFormat = "story" | "square" | "landscape"
export type AdLayout = "comparison" | "promo" | "feature" | "testimonial" | "painSolution"

export interface AdFeature {
  emoji: string
  label: string
}

export interface AdState {
  format: AdFormat
  layout: AdLayout
  // colors
  accentColor: string
  bgColor: string
  textColor: string
  // shared
  cta: string
  // promo
  offerBadge: string
  headline: string
  body: string
  originalPrice: string
  newPrice: string
  urgency: string
  // comparison
  compHeadline: string
  leftLabel: string
  rightLabel: string
  leftItems: string[]
  rightItems: string[]
  // feature
  featHeadline: string
  featBody: string
  features: AdFeature[]
  // testimonial
  quote: string
  authorName: string
  authorRole: string
  stars: number
  // pain-solution
  painEmoji: string
  painHeadline: string
  painDesc: string
  solutionEmoji: string
  solutionHeadline: string
  solutionDesc: string
}

export const defaultAd: AdState = {
  format: "square",
  layout: "comparison",
  accentColor: "#6366f1",
  bgColor: "#0f0f0f",
  textColor: "#ffffff",
  cta: "Empieza gratis",
  offerBadge: "50% OFF",
  headline: "Transforma tu negocio con IA",
  body: "Crea contenido profesional en segundos.",
  originalPrice: "$99",
  newPrice: "$49",
  urgency: "Oferta termina hoy",
  compHeadline: "¿Por qué elegirnos?",
  leftLabel: "Competencia",
  rightLabel: "Nosotros",
  leftItems: ["Lento y complicado", "Precio elevado", "Sin soporte"],
  rightItems: ["Rápido y sencillo", "Precio justo", "Soporte 24/7"],
  featHeadline: "Todo lo que necesitas",
  featBody: "Una plataforma completa para crecer.",
  features: [
    { emoji: "⚡", label: "Ultra rápido" },
    { emoji: "🤖", label: "IA integrada" },
    { emoji: "🔒", label: "100% seguro" },
    { emoji: "📊", label: "Analytics" },
  ],
  quote: "Esta herramienta transformó completamente nuestro negocio en semanas.",
  authorName: "María García",
  authorRole: "CEO, Startup XYZ",
  stars: 5,
  painEmoji: "😩",
  painHeadline: "El problema",
  painDesc: "Pierdes horas creando contenido manualmente sin resultados.",
  solutionEmoji: "🚀",
  solutionHeadline: "La solución",
  solutionDesc: "Crea contenido profesional con IA en segundos.",
}

export const FORMATS = [
  { id: "story"     as AdFormat, label: "Story",     aspect: "9/16",  w: 260, h: 462, description: "1080×1920" },
  { id: "square"    as AdFormat, label: "Square",    aspect: "1/1",   w: 360, h: 360, description: "1080×1080" },
  { id: "landscape" as AdFormat, label: "Landscape", aspect: "16/9",  w: 480, h: 270, description: "1920×1080" },
] as const

export const LAYOUTS = [
  { id: "comparison"   as AdLayout, label: "Comparación",  emoji: "⚔️",  description: "Nosotros vs Competencia" },
  { id: "promo"        as AdLayout, label: "Promoción",    emoji: "🔥",  description: "Oferta / Descuento" },
  { id: "feature"      as AdLayout, label: "Características", emoji: "✨", description: "Grid de features" },
  { id: "testimonial"  as AdLayout, label: "Testimonio",   emoji: "⭐",  description: "Reseña con estrellas" },
  { id: "painSolution" as AdLayout, label: "Problema→Solución", emoji: "💡", description: "Antes / Después" },
] as const
