import { NextResponse } from "next/server"
import OpenAI from "openai"
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts/carousel-prompt"
import type { CarouselFormData, BrandSettings } from "@/lib/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Add your key to .env.local" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { formData, brand } = body as {
      formData: CarouselFormData
      brand: BrandSettings | null
    }

    if (!formData?.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt(formData, brand)

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]

    let parsed: { slides: Record<string, unknown>[]; caption?: unknown } | null = null

    // Up to 2 attempts — if slide count is wrong, ask the model to fix it
    for (let attempt = 1; attempt <= 2; attempt++) {
      const completion = await openai.chat.completions.create({
        model: "gpt-5.4-nano",
        messages,
        temperature: 0.4,
        max_tokens: 4500,
        response_format: { type: "json_object" },
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        return NextResponse.json({ error: "No response from AI" }, { status: 500 })
      }

      parsed = JSON.parse(content)

      if (!Array.isArray(parsed?.slides)) {
        return NextResponse.json(
          { error: "AI returned invalid format — missing slides array" },
          { status: 500 }
        )
      }

      const got = parsed.slides.length
      const want = formData.slideCount

      if (got === want) break

      if (attempt === 1) {
        // Ask the model to correct itself
        messages.push({ role: "assistant", content })
        messages.push({
          role: "user",
          content: `You returned ${got} slides but I asked for EXACTLY ${want}. Please return the full JSON again with exactly ${want} slides — add or remove slides as needed to reach that number. Keep the same "cover" first and "cta" last.`,
        })
      }
    }

    const slidesWithIds = parsed!.slides.map(
      (slide: Record<string, unknown>, index: number) => ({
        ...slide,
        id: `${Date.now()}-${index}`,
      })
    )

    const caption = parsed!.caption ?? {
      text: `${formData.topic} 🚀`,
      hashtags: [],
    }

    return NextResponse.json({ slides: slidesWithIds, caption })
  } catch (error) {
    console.error("Generate error:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AI returned malformed JSON. Try again." },
        { status: 500 }
      )
    }

    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
