import type { AdLayout } from "@/components/ads/types"
import type { BrandSettings } from "@/lib/types"

const SCHEMAS: Record<AdLayout, string> = {
  comparison: `{
  "compHeadline": "headline of the comparison (question or statement)",
  "leftLabel": "competitor label (e.g. 'Others', 'Before', 'Competitor')",
  "rightLabel": "your brand label (e.g. 'Us', 'After', brand name)",
  "leftItems": ["item1", "item2", "item3"],
  "rightItems": ["item1", "item2", "item3"],
  "cta": "call to action text"
}`,
  promo: `{
  "offerBadge": "offer label e.g. '50% OFF', 'FREE TRIAL', 'LIMITED'",
  "headline": "main headline",
  "body": "1-2 sentence description",
  "originalPrice": "original price e.g. '$99'",
  "newPrice": "discounted price e.g. '$49'",
  "urgency": "urgency line e.g. 'Today only', 'Only 10 spots left'",
  "cta": "call to action"
}`,
  feature: `{
  "featHeadline": "main headline",
  "featBody": "1 sentence subtitle",
  "features": [
    {"emoji": "⚡", "label": "feature name"},
    {"emoji": "🤖", "label": "feature name"},
    {"emoji": "🔒", "label": "feature name"},
    {"emoji": "📊", "label": "feature name"}
  ],
  "cta": "call to action"
}`,
  testimonial: `{
  "quote": "realistic testimonial quote (1-2 sentences)",
  "authorName": "Full Name",
  "authorRole": "Job Title, Company",
  "stars": 5,
  "cta": "call to action"
}`,
  painSolution: `{
  "painEmoji": "relevant emoji for the problem",
  "painHeadline": "short problem headline",
  "painDesc": "1-2 sentence problem description",
  "solutionEmoji": "relevant emoji for the solution",
  "solutionHeadline": "short solution headline",
  "solutionDesc": "1-2 sentence solution description",
  "cta": "call to action"
}`,
}

export function buildAdSystemPrompt(): string {
  return `You are an expert direct-response advertising copywriter. Generate high-converting ad copy using proven persuasion frameworks.

Rules:
- Ads must work in 3 seconds — lead with the biggest benefit or sharpest pain point
- Use specific numbers, outcomes, and timeframes — never vague claims ("más ventas" → "3x más ventas en 30 días")
- Apply PAS where it fits: surface the Pain, Agitate it briefly, present the Solution
- CTAs must be action-oriented and benefit-driven ("Empieza gratis" > "Click aquí")
- Urgency and scarcity must feel real, not fabricated
- Write in the same language as the topic
- Return ONLY valid JSON with no extra text`
}

export function buildAdUserPrompt(
  layout: AdLayout,
  topic: string,
  brand: BrandSettings | null,
  customInstructions?: string,
): string {
  const brandHint = brand?.name ? ` The brand name is "${brand.name}".` : ""
  const layoutName = layout.charAt(0).toUpperCase() + layout.slice(1).replace(/([A-Z])/g, " $1")
  const extra = customInstructions?.trim() ? `\nAdditional instructions: ${customInstructions.trim()}` : ""

  return `Create a "${layoutName}" ad for: ${topic}.${brandHint}${extra}

Return ONLY this JSON schema filled with compelling copy:
${SCHEMAS[layout]}`
}
