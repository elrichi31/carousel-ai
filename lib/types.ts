// Slide layout types - AI picks the best one for each slide
export type SlideLayout =
  | "cover"       // Opening slide: big title + subtitle + emoji
  | "content"     // Title + paragraph (classic explanation)
  | "list"        // Title + bullet points with emojis
  | "bigNumber"   // Large stat/number + description
  | "quote"       // Impactful quote with attribution
  | "split"       // Left text / right image (or vice versa)
  | "cta"         // Call to action (last slide)

// Individual list item for "list" layout
export interface SlideListItem {
  emoji: string
  text: string
}

// Slide definition - each slide has its own layout
export interface Slide {
  id: string
  layout: SlideLayout

  // Content fields (used depending on layout)
  title?: string
  subtitle?: string
  content?: string
  emoji?: string            // Main emoji for the slide
  listItems?: SlideListItem[]
  bigNumber?: string        // e.g. "95%", "10x", "$2.4M"
  bigNumberLabel?: string
  quote?: string
  quoteAuthor?: string
  ctaText?: string
  ctaSubtext?: string

  // Image support (ready for future use)
  imageUrl?: string
  imagePosition?: "left" | "right" | "background"

  // Styling
  backgroundColor: string   // Tailwind class
  textColor: string          // Tailwind class
  accentColor?: string       // For highlights, numbers, etc.
}

// Full carousel
export interface CarouselData {
  id: string
  topic: string
  slides: Slide[]
}

// Template definitions for the landing page
export interface Template {
  id: string
  name: string
  description: string
  icon: string
  gradient: string
}

// Brand settings (saved in localStorage)
export interface BrandSettings {
  name: string
  logoUrl: string | null   // base64 data URL
  colors: string[]         // hex colors extracted from logo or picked manually
}

// Form data for carousel generation
export interface CarouselFormData {
  topic: string
  audience: string
  tone: string
  slideCount: number
  visualStyle: string
}
