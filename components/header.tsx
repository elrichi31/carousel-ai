import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Carousel AI
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/workspace"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Workspace
          </Link>
          <Link
            href="/#templates"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Templates
          </Link>
          <Link
            href="/#benefits"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Benefits
          </Link>
        </nav>

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/workspace">
            <Sparkles className="mr-2 h-4 w-4" />
            Start Creating
          </Link>
        </Button>
      </div>
    </header>
  )
}
