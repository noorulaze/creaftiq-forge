import { HeroSection }       from '@/components/landing/HeroSection'
import { HowItWorksSection }  from '@/components/landing/HowItWorksSection'
import { FeaturesSection }    from '@/components/landing/FeaturesSection'
import { FinalCTASection }    from '@/components/landing/FinalCTASection'
import { Footer }             from '@/components/landing/Footer'

export function LandingPage() {
  return (
    <div className="bg-forge-black min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}
