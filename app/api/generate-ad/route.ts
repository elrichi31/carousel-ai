import { NextResponse } from "next/server"
import OpenAI from "openai"
import { buildAdSystemPrompt, buildAdUserPrompt } from "@/lib/prompts/ad-prompt"
import type { AdLayout } from "@/components/ads/types"
import type { BrandSettings } from "@/lib/types"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-api-key-here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured." },
        { status: 500 }
      )
    }

    const { layout, topic, brand, customInstructions } = await request.json() as {
      layout: AdLayout
      topic: string
      brand: BrandSettings | null
      customInstructions?: string
    }

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4-nano",
      messages: [
        { role: "system", content: buildAdSystemPrompt() },
        { role: "user",   content: buildAdUserPrompt(layout, topic, brand, customInstructions) },
      ],
      temperature: 0.7,
      max_completion_tokens: 800,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) return NextResponse.json({ error: "No response from AI" }, { status: 500 })

    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
