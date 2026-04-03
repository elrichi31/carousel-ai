import { NextResponse } from "next/server"
import OpenAI from "openai"
import { buildSingleSlideSystemPrompt, buildSingleSlideUserPrompt } from "@/lib/ai-prompt"
import type { CarouselFormData, BrandSettings, SlideLayout } from "@/lib/types"

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
    const { slideIndex, totalSlides, currentLayout, formData, brand } = body as {
      slideIndex: number
      totalSlides: number
      currentLayout: SlideLayout
      formData: CarouselFormData
      brand: BrandSettings | null
    }

    if (!formData?.topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const systemPrompt = buildSingleSlideSystemPrompt()
    const userPrompt = buildSingleSlideUserPrompt(slideIndex, totalSlides, currentLayout, formData, brand)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 800,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 })
    }

    const slide = JSON.parse(content)

    return NextResponse.json({ slide: { ...slide, id: Date.now().toString() } })
  } catch (error) {
    console.error("Regenerate slide error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
