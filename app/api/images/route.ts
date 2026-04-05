import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Unsplash: extract 1-3 English keywords for the search query ───────────────
async function extractSearchKeywords(query: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Extract 1-3 English keywords to search a stock photo about: "${query}". Return ONLY the keywords separated by spaces. No punctuation, no explanation.`,
      },
    ],
    max_tokens: 15,
    temperature: 0.2,
  })
  return completion.choices[0]?.message?.content?.trim() ?? query
}

// ── DALL-E: generate a rich visual prompt from the slide topic ────────────────
async function generateImagePrompt(query: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert visual art director who writes precise, evocative prompts for DALL-E 3.
Your prompts produce professional images for social media carousels (Instagram/TikTok).
Rules:
- Describe a single clear scene — no text, no typography, no watermarks
- Specify lighting, mood, color palette, and composition
- Use photography or illustration style language
- Output ONLY the prompt, under 180 characters`,
      },
      {
        role: "user",
        content: `Write a DALL-E 3 image prompt for a carousel slide about: "${query}"`,
      },
    ],
    max_tokens: 150,
    temperature: 0.8,
  })
  return completion.choices[0]?.message?.content?.trim() ?? query
}

export async function POST(request: Request) {
  try {
    const { query, source = "unsplash", customPrompt } = await request.json() as {
      query: string
      source?: "unsplash" | "dalle"
      customPrompt?: string   // if provided, skip GPT step and use directly
    }

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // ── DALL-E 3 ────────────────────────────────────────────────────────────
    if (source === "dalle") {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
        return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
      }

      // Use the custom prompt directly if provided (user edited it), otherwise generate
      const imagePrompt = customPrompt?.trim() || await generateImagePrompt(query)

      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        size: "1024x1792",
        quality: "standard",
        response_format: "b64_json",
        n: 1,
      })

      const b64 = result.data[0]?.b64_json
      if (!b64) {
        return NextResponse.json({ error: "No image generated" }, { status: 500 })
      }

      return NextResponse.json({
        url: `data:image/png;base64,${b64}`,
        source: "dalle",
        prompt: imagePrompt,
      })
    }

    // ── Unsplash ─────────────────────────────────────────────────────────────
    const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim()
    if (!accessKey) {
      return NextResponse.json(
        { error: "Unsplash no configurado. Agrega UNSPLASH_ACCESS_KEY a .env.local" },
        { status: 500 }
      )
    }

    // Use custom keywords directly if provided, otherwise extract from the raw query
    const searchQuery = customPrompt?.trim() || await extractSearchKeywords(query)

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&orientation=portrait&per_page=10&content_filter=high`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          "Accept-Version": "v1",
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Unsplash ${res.status}: ${text}` }, { status: res.status })
    }

    const data = await res.json()
    const results: {
      urls: { regular: string }
      user: { name: string; links: { html: string } }
    }[] = data.results ?? []

    if (results.length === 0) {
      return NextResponse.json(
        { error: `No se encontraron imágenes para "${searchQuery}" en Unsplash` },
        { status: 404 }
      )
    }

    const photo = results[Math.floor(Math.random() * results.length)]

    return NextResponse.json({
      url: photo.urls.regular,
      source: "unsplash",
      prompt: searchQuery,   // the English keywords used for the search
      credit: {
        name: photo.user?.name ?? null,
        link: photo.user?.links?.html ?? null,
      },
    })
  } catch (error) {
    console.error("Image API error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
