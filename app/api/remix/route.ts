import { NextResponse } from "next/server"
import OpenAI from "openai"
import { buildRemixSystemPrompt, buildRemixUserPrompt, type ExtractedContent } from "@/lib/prompts/remix-prompt"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function extractContent(html: string): ExtractedContent {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")

  const ogTitle =
    html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i)?.[1]

  const ogDesc =
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1]

  const title = ogTitle || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim()

  const headings = [...clean.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
    .filter((h) => h.length > 3 && h.length < 200)
    .slice(0, 12)

  const paragraphs = [...clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
    .filter((p) => p.length > 60)
    .slice(0, 10)

  return {
    title: title || undefined,
    description: ogDesc || undefined,
    headings,
    paragraphs,
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const { url, slideCount = 6 } = await request.json() as { url: string; slideCount?: number }

    if (!url?.trim()) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    let html: string
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CarouselAI/1.0; +https://carousel-ai.app)" },
        signal: AbortSignal.timeout(10_000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      html = await res.text()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "fetch failed"
      return NextResponse.json(
        { error: `No se pudo acceder a la URL: ${msg}. Verifica que sea válida y pública.` },
        { status: 400 },
      )
    }

    const content = extractContent(html)

    if (!content.title && content.headings.length === 0 && content.paragraphs.length === 0) {
      return NextResponse.json(
        { error: "No se pudo extraer contenido de la URL. Prueba con otro artículo." },
        { status: 400 },
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildRemixSystemPrompt() },
        { role: "user", content: buildRemixUserPrompt(content, slideCount) },
      ],
      temperature: 0.4,
      max_completion_tokens: 4500,
      response_format: { type: "json_object" },
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) return NextResponse.json({ error: "No response from AI" }, { status: 500 })

    const parsed = JSON.parse(raw) as { slides: Record<string, unknown>[]; caption?: unknown }

    if (!Array.isArray(parsed?.slides)) {
      return NextResponse.json({ error: "AI returned invalid format" }, { status: 500 })
    }

    const slides = parsed.slides.map((slide, i) => ({ ...slide, id: `${Date.now()}-${i}` }))
    const caption = parsed.caption ?? { text: `${content.title ?? "Carousel"} 🚀`, hashtags: [] }

    return NextResponse.json({ slides, caption, topic: content.title ?? url })
  } catch (error) {
    console.error("Remix error:", error)
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "AI returned malformed JSON. Try again." }, { status: 500 })
    }
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
