import { NextResponse } from "next/server"
import OpenAI from "openai"
import type { CarouselFormData, BrandSettings, Slide } from "@/lib/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json({ error: "OpenAI API key not configured." }, { status: 500 })
    }

    const body = await request.json()
    const { existingSlides, formData, brand } = body as {
      existingSlides: Slide[]
      formData: CarouselFormData
      brand: BrandSettings | null
    }

    if (!formData?.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const existingSummary = existingSlides
      .slice(0, -1) // exclude CTA
      .map((s, i) => `Slide ${i + 1} (${s.layout}): ${s.title ?? s.quote ?? s.bigNumber ?? "(sin título)"}`)
      .join("\n")

    const systemPrompt = `You are an expert Instagram carousel content creator. Your ONLY job is to output structured JSON — nothing else.

Return EXACTLY this JSON structure:
{
  "slides": [...]
}

Each slide MUST have EXACTLY these fields (never add extra fields, never omit any):
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
  "textColor": string,
  "accentColor": string | null
}

Do NOT use "cover" or "cta" layouts. Use only: content, list, bigNumber, quote, split.
Do NOT include "id", "imageUrl", or "imagePosition".`

    const userPrompt = `Topic: "${formData.topic}"
Audience: ${formData.audience}
Tone: ${formData.tone}${brand?.name ? `\nBrand: ${brand.name}` : ""}

The carousel already has these slides:
${existingSummary}

Generate exactly 2 NEW slides that add value to this carousel. They must:
- Continue from where the existing slides left off
- Add more depth, new examples, or additional tips not already covered
- Match the tone and audience of the existing slides
- NOT repeat content already covered`

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_completion_tokens: 1200,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) return NextResponse.json({ error: "No response from AI" }, { status: 500 })

    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed?.slides)) {
      return NextResponse.json({ error: "AI returned invalid format" }, { status: 500 })
    }

    const slides = parsed.slides.map((s: Record<string, unknown>, i: number) => ({
      ...s,
      id: `${Date.now()}-${i}`,
    }))

    return NextResponse.json({ slides })
  } catch (error) {
    console.error("Add slides error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
