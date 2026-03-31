import type { Slide, Template } from "./types"

export const mockSlides: Slide[] = [
  {
    id: "1",
    layout: "cover",
    title: "5 Ataques de Ciberseguridad que Debes Conocer",
    subtitle: "Protege tu información antes de que sea tarde",
    emoji: "🛡️",
    backgroundColor: "bg-gradient-to-br from-primary/20 to-primary/5",
    textColor: "text-foreground",
    accentColor: "text-primary",
  },
  {
    id: "2",
    layout: "content",
    title: "🎣 Phishing",
    content: "Los atacantes se hacen pasar por entidades confiables para robar tus credenciales. Un email falso de tu banco puede costarte todo.",
    emoji: "🎣",
    backgroundColor: "bg-card",
    textColor: "text-foreground",
  },
  {
    id: "3",
    layout: "bigNumber",
    bigNumber: "95%",
    bigNumberLabel: "de los ciberataques exitosos empiezan con un email de phishing",
    emoji: "📊",
    backgroundColor: "bg-card",
    textColor: "text-foreground",
    accentColor: "text-primary",
  },
  {
    id: "4",
    layout: "list",
    title: "🔐 Cómo Protegerte",
    listItems: [
      { emoji: "✅", text: "Activa la autenticación de 2 factores" },
      { emoji: "🔑", text: "Usa contraseñas únicas y fuertes" },
      { emoji: "🚫", text: "No hagas clic en links sospechosos" },
      { emoji: "🔄", text: "Actualiza tu software regularmente" },
    ],
    backgroundColor: "bg-card",
    textColor: "text-foreground",
  },
  {
    id: "5",
    layout: "quote",
    quote: "La seguridad no es un producto, es un proceso.",
    quoteAuthor: "Bruce Schneier",
    emoji: "💬",
    backgroundColor: "bg-gradient-to-br from-primary/15 to-primary/5",
    textColor: "text-foreground",
    accentColor: "text-primary",
  },
  {
    id: "6",
    layout: "cta",
    ctaText: "¿Quieres más tips de seguridad? 🔒",
    ctaSubtext: "Sígueme para proteger tu vida digital",
    emoji: "👉",
    backgroundColor: "bg-gradient-to-br from-primary/20 to-primary/5",
    textColor: "text-foreground",
    accentColor: "text-primary",
  },
]

export const templates: Template[] = [
  {
    id: "cover",
    name: "Cover",
    description: "Eye-catching first slide",
    icon: "Layers",
    gradient: "from-primary/30 to-primary/10",
  },
  {
    id: "tips",
    name: "Tips",
    description: "Numbered tips format",
    icon: "Lightbulb",
    gradient: "from-accent/30 to-accent/10",
  },
  {
    id: "storytelling",
    name: "Storytelling",
    description: "Narrative-driven content",
    icon: "BookOpen",
    gradient: "from-chart-2/30 to-chart-2/10",
  },
  {
    id: "cta",
    name: "CTA",
    description: "Call-to-action slides",
    icon: "MousePointer",
    gradient: "from-chart-3/30 to-chart-3/10",
  },
  {
    id: "list",
    name: "List",
    description: "Bullet point format",
    icon: "List",
    gradient: "from-chart-4/30 to-chart-4/10",
  },
  {
    id: "quote",
    name: "Quote",
    description: "Impactful quotes",
    icon: "Quote",
    gradient: "from-chart-5/30 to-chart-5/10",
  },
]

export const audienceOptions = [
  "Entrepreneurs",
  "Marketers",
  "Developers",
  "Students",
  "General Audience",
]

export const toneOptions = [
  "Professional",
  "Casual",
  "Inspirational",
  "Educational",
  "Humorous",
]

export const visualStyles = [
  "Minimal",
  "Bold",
  "Elegant",
  "Modern",
  "Creative",
]
