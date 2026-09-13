import { HeroSection } from '@/components/landing/HeroSection'
import { ProcessSection } from '@/components/landing/ProcessSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { WorkspacePreviewSection } from '@/components/landing/WorkspacePreviewSection'
import { FinalCTASection } from '@/components/landing/FinalCTASection'
import { Footer } from '@/components/landing/Footer'

export function LandingPage() {
  return (
    <div className="bg-forge-black min-h-screen">
      <HeroSection />
      <ProcessSection />
      <FeaturesSection />
      <WorkspacePreviewSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
