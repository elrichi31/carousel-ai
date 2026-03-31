import { NextResponse } from "next/server"
import OpenAI from "openai"
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai-prompt"
import type { CarouselFormData, BrandSettings } from "@/lib/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Validate API key is configured
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

    // Validate required fields
    if (!formData?.topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      )
    }

    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt(formData, brand)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      )
    }

    // Parse the JSON response — handle potential markdown code fences
    let cleaned = content.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    const slides = JSON.parse(cleaned)

    // Validate it's an array
    if (!Array.isArray(slides)) {
      return NextResponse.json(
        { error: "AI returned invalid format" },
        { status: 500 }
      )
    }

    // Add IDs to each slide
    const slidesWithIds = slides.map((slide: Record<string, unknown>, index: number) => ({
      ...slide,
      id: `${Date.now()}-${index}`,
    }))

    return NextResponse.json({ slides: slidesWithIds })
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
