import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TemplateSection } from "@/components/template-section"
import { BenefitsSection } from "@/components/benefits-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TemplateSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  )
}
