import type { CarouselFormData, BrandSettings, SlideLayout } from "@/lib/types"

export function buildSingleSlideSystemPrompt(): string {
  return `You are an expert Instagram carousel slide writer and viral content strategist. Return a SINGLE JSON object for ONE slide — not an array, not wrapped in "slides".

## SCHEMA (all fields required, use null for unused ones):
{
  "layout": string,
  "title": string | null,
  "subtitle": string | null,
  "content": string | null,
  "emoji": string | null,
  "listItems": [{ "emoji": string, "text": string }] | null,
  "bigNumber": string | null,
  "bigNumberLabel": string | null,
  "quote": string | null,
  "quoteAuthor": string | null,
  "ctaText": string | null,
  "ctaSubtext": string | null,
  "backgroundColor": string,
  "textColor": "text-foreground",
  "accentColor": string | null
}

backgroundColor options: "bg-card" | "bg-gradient-to-br from-primary/20 to-primary/5" | "bg-gradient-to-br from-primary/15 to-primary/5"
textColor: ALWAYS "text-foreground"

## COVER HOOKS — if layout is "cover", use one of these proven formulas adapted to the topic:
- "El error que comete el 90% de [audiencia] con [tema]"
- "Nadie te dice esto sobre [tema]"
- "Haz esto y [resultado específico] en [tiempo corto]"
- "[Número] cosas sobre [tema] que ojalá supiera antes"
- "Por qué [creencia común] es completamente falso"

## CTA INTENT — if layout is "cta", match the action to the content:
- Educational → "Guarda esto para cuando lo necesites"
- Controversial/opinionated → "¿Estás de acuerdo? Comenta abajo"
- Shareable insight → "Compártelo con alguien que lo necesita"
- Niche/specialized → "Síguenos para más sobre [tema]"

## CONTENT QUALITY RULES:
- One clear idea per slide — no padding
- Include specific numbers or concrete examples when possible
- Write like a knowledgeable friend, not a corporate blog
- Keep text short — Instagram readers scroll fast

Return ONLY the JSON object. No extra text.`
}

export function buildSingleSlideUserPrompt(
  slideIndex: number,
  totalSlides: number,
  currentLayout: SlideLayout,
  formData: CarouselFormData,
  brand: BrandSettings | null,
  customPrompt?: string
): string {
  const isFirst = slideIndex === 0
  const isLast = slideIndex === totalSlides - 1

  let layoutInstruction: string
  if (isFirst) {
    layoutInstruction = `This is slide 1 (the COVER). layout MUST be "cover". Required: title (max 10 words), subtitle (max 15 words), emoji. All other content fields: null.`
  } else if (isLast) {
    layoutInstruction = `This is the last slide (CTA). layout MUST be "cta". Required: ctaText, ctaSubtext, emoji. All other content fields: null.`
  } else {
    layoutInstruction = `This is a middle slide (position ${slideIndex + 1} of ${totalSlides}). Use layout "${currentLayout}" — keep the same type but generate completely new, fresh content. Choose the fields appropriate for "${currentLayout}".`
  }

  let prompt = `Generate a new Instagram carousel slide about: "${formData.topic}"
Target audience: ${formData.audience}
Tone: ${formData.tone}

${layoutInstruction}

Make the content fresh — take an unexpected angle, include a specific data point or concrete example, and avoid the obvious take on this topic.`

  if (brand?.name) prompt += `\nBrand context: "${brand.name}"`
  if (customPrompt?.trim()) prompt += `\n\nAdditional instructions from the user: ${customPrompt.trim()}`
  return prompt
}
