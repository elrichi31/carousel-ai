"use client"

import { Smartphone, Square, Monitor, Plus, Minus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { FORMATS, type AdState, type AdFormat } from "./types"

const FORMAT_ICONS = { story: Smartphone, square: Square, landscape: Monitor } as const

// ─── Shared input primitives ──────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-w-0 w-full rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
    />
  )
}

function TextArea({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="min-w-0 w-full resize-none rounded-md border border-border/50 bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
    />
  )
}

// ─── Layout-specific fields ───────────────────────────────────────────────────

function PromoFields({ ad, set }: { ad: AdState; set: (k: keyof AdState, v: unknown) => void }) {
  return (
    <>
      <Field label="Badge oferta"><TextInput value={ad.offerBadge} onChange={v => set("offerBadge", v)} placeholder="50% OFF" /></Field>
      <Field label="Titular"><TextInput value={ad.headline} onChange={v => set("headline", v)} placeholder="Transforma tu negocio" /></Field>
      <Field label="Descripción"><TextArea value={ad.body} onChange={v => set("body", v)} placeholder="Breve descripción..." /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Precio original"><TextInput value={ad.originalPrice} onChange={v => set("originalPrice", v)} placeholder="$99" /></Field>
        <Field label="Precio oferta"><TextInput value={ad.newPrice} onChange={v => set("newPrice", v)} placeholder="$49" /></Field>
      </div>
      <Field label="Urgencia"><TextInput value={ad.urgency} onChange={v => set("urgency", v)} placeholder="Oferta termina hoy" /></Field>
      <Field label="CTA"><TextInput value={ad.cta} onChange={v => set("cta", v)} placeholder="Empieza gratis" /></Field>
    </>
  )
}

function ComparisonFields({ ad, set }: { ad: AdState; set: (k: keyof AdState, v: unknown) => void }) {
  const updateLeft  = (i: number, val: string) => { const a = [...ad.leftItems];  a[i] = val; set("leftItems",  a) }
  const updateRight = (i: number, val: string) => { const a = [...ad.rightItems]; a[i] = val; set("rightItems", a) }
  const addRow    = () => { set("leftItems", [...ad.leftItems, ""]); set("rightItems", [...ad.rightItems, ""]) }
  const removeRow = () => {
    if (ad.leftItems.length > 1) { set("leftItems", ad.leftItems.slice(0, -1)); set("rightItems", ad.rightItems.slice(0, -1)) }
  }
  return (
    <>
      <Field label="Titular"><TextInput value={ad.compHeadline} onChange={v => set("compHeadline", v)} placeholder="¿Por qué elegirnos?" /></Field>
      <div className="grid gap-3">
        <Field label="Etiqueta izquierda"><TextInput value={ad.leftLabel} onChange={v => set("leftLabel", v)} placeholder="Competencia" /></Field>
        <Field label="Etiqueta derecha"><TextInput value={ad.rightLabel} onChange={v => set("rightLabel", v)} placeholder="Nosotros" /></Field>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Filas</Label>
          <div className="flex gap-1">
            <button onClick={removeRow} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
            <button onClick={addRow}    className="rounded p-0.5 text-muted-foreground hover:text-foreground"><Plus  className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        {ad.leftItems.map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-border/40 bg-muted/25 p-2.5">
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
              Fila {i + 1}
            </div>
            <div className="space-y-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground">{ad.leftLabel || "Competencia"}</Label>
                <TextInput value={ad.leftItems[i]}  onChange={v => updateLeft(i, v)}  placeholder={`❌ Item ${i + 1}`} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] text-muted-foreground">{ad.rightLabel || "Nosotros"}</Label>
                <TextInput value={ad.rightItems[i]} onChange={v => updateRight(i, v)} placeholder={`✅ Item ${i + 1}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Field label="CTA"><TextInput value={ad.cta} onChange={v => set("cta", v)} placeholder="Empieza gratis" /></Field>
    </>
  )
}

function FeatureFields({ ad, set }: { ad: AdState; set: (k: keyof AdState, v: unknown) => void }) {
  const updateFeature = (i: number, key: "emoji" | "label", val: string) => {
    const f = [...ad.features]; f[i] = { ...f[i], [key]: val }; set("features", f)
  }
  const addFeature    = () => set("features", [...ad.features, { emoji: "✨", label: "" }])
  const removeFeature = () => { if (ad.features.length > 1) set("features", ad.features.slice(0, -1)) }
  return (
    <>
      <Field label="Titular"><TextInput value={ad.featHeadline} onChange={v => set("featHeadline", v)} placeholder="Todo lo que necesitas" /></Field>
      <Field label="Subtítulo"><TextArea value={ad.featBody} onChange={v => set("featBody", v)} /></Field>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Características</Label>
          <div className="flex gap-1">
            <button onClick={removeFeature} className="rounded p-0.5 text-muted-foreground hover:text-foreground"><Minus className="h-3.5 w-3.5" /></button>
            <button onClick={addFeature}    className="rounded p-0.5 text-muted-foreground hover:text-foreground"><Plus  className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        {ad.features.map((f, i) => (
          <div key={i} className="grid grid-cols-[36px_1fr] gap-2">
            <TextInput value={f.emoji} onChange={v => updateFeature(i, "emoji", v)} placeholder="⚡" />
            <TextInput value={f.label} onChange={v => updateFeature(i, "label", v)} placeholder="Feature" />
          </div>
        ))}
      </div>
      <Field label="CTA"><TextInput value={ad.cta} onChange={v => set("cta", v)} placeholder="Empieza gratis" /></Field>
    </>
  )
}

function TestimonialFields({ ad, set }: { ad: AdState; set: (k: keyof AdState, v: unknown) => void }) {
  return (
    <>
      <Field label="Reseña"><TextArea value={ad.quote} onChange={v => set("quote", v)} rows={3} placeholder="Esta herramienta cambió nuestro negocio..." /></Field>
      <Field label="Nombre"><TextInput value={ad.authorName} onChange={v => set("authorName", v)} placeholder="María García" /></Field>
      <Field label="Cargo / Empresa"><TextInput value={ad.authorRole} onChange={v => set("authorRole", v)} placeholder="CEO, Startup XYZ" /></Field>
      <Field label="Estrellas">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => set("stars", n)} className={`text-lg transition-opacity ${n <= ad.stars ? "opacity-100" : "opacity-25"}`} style={{ color: "#fbbf24" }}>★</button>
          ))}
        </div>
      </Field>
      <Field label="CTA"><TextInput value={ad.cta} onChange={v => set("cta", v)} placeholder="Empieza gratis" /></Field>
    </>
  )
}

function PainSolutionFields({ ad, set }: { ad: AdState; set: (k: keyof AdState, v: unknown) => void }) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-xs font-medium text-red-400">Problema (Antes)</Label>
        <div className="grid grid-cols-[40px_1fr] gap-2">
          <TextInput value={ad.painEmoji}    onChange={v => set("painEmoji", v)}    placeholder="😩" />
          <TextInput value={ad.painHeadline} onChange={v => set("painHeadline", v)} placeholder="El problema" />
        </div>
        <TextArea value={ad.painDesc} onChange={v => set("painDesc", v)} placeholder="Descripción del problema..." />
      </div>
      <div className="space-y-3">
        <Label className="text-xs font-medium text-green-400">Solución (Después)</Label>
        <div className="grid grid-cols-[40px_1fr] gap-2">
          <TextInput value={ad.solutionEmoji}    onChange={v => set("solutionEmoji", v)}    placeholder="🚀" />
          <TextInput value={ad.solutionHeadline} onChange={v => set("solutionHeadline", v)} placeholder="La solución" />
        </div>
        <TextArea value={ad.solutionDesc} onChange={v => set("solutionDesc", v)} placeholder="Descripción de la solución..." />
      </div>
      <Field label="CTA"><TextInput value={ad.cta} onChange={v => set("cta", v)} placeholder="Empieza gratis" /></Field>
    </>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────

interface AdFormPanelProps {
  ad: AdState
  set: (k: keyof AdState, v: unknown) => void
}

export function AdFormPanel({ ad, set }: AdFormPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-4">
        <h3 className="text-sm font-medium text-foreground">Editar contenido</h3>
        <p className="mt-1 text-xs text-muted-foreground">Ajusta el texto generado por IA</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">

        {/* Format picker */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Formato</Label>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map(({ id, label, description }) => {
              const Icon = FORMAT_ICONS[id as AdFormat]
              return (
                <button
                  key={id}
                  onClick={() => set("format", id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-xs transition-all ${
                    ad.format === id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{label}</span>
                  <span className="text-[9px] opacity-60">{description}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic fields */}
        <div className="space-y-4 border-t border-border/30 pt-2">
          {ad.layout === "promo"        && <PromoFields        ad={ad} set={set} />}
          {ad.layout === "comparison"   && <ComparisonFields   ad={ad} set={set} />}
          {ad.layout === "feature"      && <FeatureFields      ad={ad} set={set} />}
          {ad.layout === "testimonial"  && <TestimonialFields  ad={ad} set={set} />}
          {ad.layout === "painSolution" && <PainSolutionFields ad={ad} set={set} />}
        </div>

      </div>
    </div>
  )
}
