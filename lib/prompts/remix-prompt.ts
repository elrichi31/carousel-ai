export interface ExtractedContent {
  title?: string
  description?: string
  headings: string[]
  paragraphs: string[]
}

export function buildRemixSystemPrompt(): string {
  return `You are an expert Instagram carousel content creator. You convert article content into engaging carousels.

Your ONLY job is to output structured JSON — nothing else.

You MUST return a JSON object with EXACTLY this top-level structure:
{
  "slides": [...],
  "caption": { "text": "...", "hashtags": [...] }
}

Each slide in "slides" MUST have EXACTLY these fields:
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

LAYOUT RULES:
- Slide 1: always "cover" — hook title + subtitle + emoji
- Middle slides: mix of "content", "list", "bigNumber", "quote"
- Last slide: always "cta"

STYLING:
- backgroundColor: "bg-card" for most slides, "bg-gradient-to-br from-primary/20 to-primary/5" for cover and cta
- textColor: always "text-foreground"
- accentColor: "text-primary" or null

CONTENT RULES:
- Write in the SAME LANGUAGE as the article
- Extract the most valuable insights, stats, and key points from the article
- Keep each slide focused on ONE idea
- The cover hook must be compelling and specific to the article's main insight
- Caption: AIDA structure (Attention → Interest → Desire → Action), 3-4 sentences
- Hashtags: 20-25 items without the # symbol`
}

export function buildRemixUserPrompt(content: ExtractedContent, slideCount: number): string {
  const parts: string[] = []

  if (content.title) parts.push(`Article title: "${content.title}"`)
  if (content.description) parts.push(`Description: "${content.description}"`)
  if (content.headings.length > 0) parts.push(`Main headings:\n${content.headings.map((h) => `- ${h}`).join("\n")}`)
  if (content.paragraphs.length > 0) parts.push(`Key content:\n${content.paragraphs.join("\n\n")}`)

  return `Convert the following article into an Instagram carousel with EXACTLY ${slideCount} slides.

${parts.join("\n\n")}

Extract the most engaging insights, data points, and actionable tips from this article.
Slide 1 must be "cover", last slide must be "cta".
Return ONLY the JSON object with "slides" (exactly ${slideCount} items) and "caption".`
}
