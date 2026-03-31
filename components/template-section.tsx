"use client"

import {
  Layers,
  Lightbulb,
  BookOpen,
  MousePointer,
  List,
  Quote,
} from "lucide-react"
import { templates } from "@/lib/mock-data"

const iconMap = {
  Layers,
  Lightbulb,
  BookOpen,
  MousePointer,
  List,
  Quote,
}

export function TemplateSection() {
  return (
    <section id="templates" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Start with a template
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Choose from professionally designed templates to kickstart your
            carousel creation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = iconMap[template.icon as keyof typeof iconMap]
            return (
              <button
                key={template.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
