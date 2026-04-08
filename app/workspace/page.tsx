"use client"

import Link from "next/link"
import { GalleryHorizontal, Megaphone, ArrowRight, Sparkles } from "lucide-react"
import { Header } from "@/components/header"

const MODES = [
  {
    href: "/workspace/carousel",
    icon: GalleryHorizontal,
    label: "Carrusel",
    description: "Crea carruseles de múltiples slides para Instagram o TikTok. Genera contenido con IA, personaliza el diseño y exporta en alta resolución.",
    badge: "Disponible",
    badgeClass: "bg-primary/15 text-primary",
    gradient: "from-primary/10 to-primary/5",
    cta: "Crear carrusel",
  },
  {
    href: "/workspace/ads",
    icon: Megaphone,
    label: "Anuncio",
    description: "Diseña anuncios para redes sociales en diferentes formatos: Story, cuadrado o landscape. Perfecto para campañas pagadas.",
    badge: "Beta",
    badgeClass: "bg-orange-500/15 text-orange-500",
    gradient: "from-orange-500/10 to-orange-500/5",
    cta: "Crear anuncio",
  },
]

export default function WorkspaceLanding() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              ¿Qué quieres crear hoy?
            </h1>
            <p className="text-sm text-muted-foreground">
              Elige el tipo de contenido y empieza en segundos.
            </p>
          </div>

          {/* Mode cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODES.map(({ href, icon: Icon, label, description, badge, badgeClass, gradient, cta }) => (
              <Link
                key={href}
                href={href}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-border hover:shadow-lg hover:shadow-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />

                <div className="relative space-y-4">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted group-hover:bg-background/80 transition-colors">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeClass}`}>
                      {badge}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="space-y-1.5">
                    <h2 className="text-base font-semibold text-foreground">{label}</h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                    {cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
