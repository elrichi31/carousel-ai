"use client"

import { Zap, Palette, Edit3, Clock } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Create content faster",
    description:
      "Generate complete carousels in seconds instead of hours. AI handles the heavy lifting while you focus on your message.",
  },
  {
    icon: Palette,
    title: "Maintain visual consistency",
    description:
      "Every slide follows your brand guidelines automatically. No more mismatched fonts or colors.",
  },
  {
    icon: Edit3,
    title: "Edit before exporting",
    description:
      "Full control over every element. Tweak layouts, colors, and content until everything is perfect.",
  },
  {
    icon: Clock,
    title: "Save valuable time",
    description:
      "What used to take hours now takes minutes. Spend more time on strategy, less on design.",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Why choose Carousel AI?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Everything you need to create stunning social media carousels in
            record time.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-medium text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
