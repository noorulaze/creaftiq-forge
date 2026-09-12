import { HeroSection }      from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesSection }   from '@/components/landing/FeaturesSection'
import { Footer }            from '@/components/landing/Footer'

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
