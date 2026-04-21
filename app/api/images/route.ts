import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ── Unsplash: extract 2-4 English keywords for the search query ───────────────
async function extractSearchKeywords(slideTitle: string, carouselTopic: string): Promise<string> {
  const context = carouselTopic && carouselTopic !== slideTitle
    ? `Carousel topic: "${carouselTopic}". Slide title: "${slideTitle}"`
    : `Topic: "${slideTitle}"`

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4-nano",
    messages: [
      {
        role: "system",
        content: `You are an expert at finding stock photos on Unsplash. Given a slide topic and carousel context, produce 2-4 English keywords that will find a visually compelling, thematically accurate stock photo.
Rules:
- Keywords must be concrete and visual (objects, scenes, actions — not abstract concepts)
- Match the domain: cybersecurity → "hacker dark screen code", finance → "stock market trading", health → "doctor hospital stethoscope"
- Prefer specific nouns and adjectives over generic terms like "business" or "technology"
- Return ONLY the keywords, space-separated, no punctuation, no explanation`,
      },
      {
        role: "user",
        content: context,
      },
    ],
    max_completion_tokens: 20,
    temperature: 0.3,
  })
  return completion.choices[0]?.message?.content?.trim() ?? slideTitle
}

// ── gpt-image-1.5: generate a rich visual prompt from the slide topic ────────
async function generateImagePrompt(slideTitle: string, carouselTopic: string): Promise<string> {
  const context = carouselTopic && carouselTopic !== slideTitle
    ? `Carousel topic: "${carouselTopic}". Slide title: "${slideTitle}"`
    : `Slide topic: "${slideTitle}"`

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4-nano",
    messages: [
      {
        role: "system",
        content: `You are an expert visual art director who writes precise, cinematic prompts for gpt-image-1.5.
Your prompts produce scroll-stopping professional images for social media carousels (Instagram/TikTok).
Rules:
- Describe ONE clear, specific scene — not a collage or abstract concept
- Include: subject, setting, lighting style, mood, color palette, and camera angle
- Lighting is critical: specify it (golden hour, studio softbox, neon glow, dramatic chiaroscuro, etc.)
- Match the domain precisely: cybersecurity → hooded figure, dark server room, blue neon glow, shallow depth of field; finance → trading floor, sharp suit, warm amber light; health → clean clinical white, soft diffused light, human touch
- Photorealistic style unless the topic clearly calls for illustration
- NO text, typography, watermarks, logos, or UI elements in the image
- Output ONLY the prompt, under 220 characters`,
      },
      {
        role: "user",
        content: `Write an image prompt for: ${context}`,
      },
    ],
    max_completion_tokens: 180,
    temperature: 0.7,
  })
  return completion.choices[0]?.message?.content?.trim() ?? slideTitle
}

export async function POST(request: Request) {
  try {
    const { query, topic, source = "unsplash", customPrompt } = await request.json() as {
      query: string
      topic?: string           // carousel-level topic for better context
      source?: "unsplash" | "dalle"
      customPrompt?: string    // if provided, skip GPT step and use directly
    }
    const carouselTopic = topic?.trim() || query

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // ── gpt-image-1.5 ────────────────────────────────────────────────────────
    if (source === "dalle") {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
        return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
      }

      // Use the custom prompt directly if provided (user edited it), otherwise generate
      const imagePrompt = customPrompt?.trim() || await generateImagePrompt(query, carouselTopic)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (openai.images.generate as any)({
        model: "gpt-image-1.5",
        prompt: imagePrompt,
        size: "1024x1536",
        quality: "medium",
        n: 1,
      }) as { data: { b64_json?: string }[] }

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

    // Use custom keywords directly if provided, otherwise extract from the slide + carousel context
    const searchQuery = customPrompt?.trim() || await extractSearchKeywords(query, carouselTopic)

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
