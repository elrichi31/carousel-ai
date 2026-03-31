import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI-Powered Carousel Creation
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create stunning carousels with the power of{" "}
            <span className="text-primary">AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Transform your ideas into engaging social media carousels in seconds.
            Just describe your topic and let AI do the rest.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              asChild
            >
              <Link href="/workspace">
                Generate Carousel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-border bg-transparent text-foreground hover:bg-card sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-2 backdrop-blur-sm">
            <div className="overflow-hidden rounded-xl bg-card">
              <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <div className="h-3 w-3 rounded-full bg-chart-4/50" />
                <div className="h-3 w-3 rounded-full bg-primary/50" />
              </div>
              <div className="grid grid-cols-5 gap-3 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`aspect-[4/5] rounded-lg ${
                      i === 1
                        ? "bg-gradient-to-br from-primary/30 to-primary/10"
                        : "bg-muted"
                    } flex items-center justify-center`}
                  >
                    <span className="text-xs text-muted-foreground">
                      Slide {i}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="pointer-events-none absolute -inset-x-20 -bottom-20 h-40 bg-gradient-to-t from-primary/10 to-transparent blur-3xl" />
        </div>
      </div>
    </section>
  )
}
