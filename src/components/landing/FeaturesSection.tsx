import { motion, useReducedMotion } from 'framer-motion'
import { Dna, Palette, Layers, Globe, MessageSquare, Compass, CheckCircle2 } from 'lucide-react'

interface FeatureItem {
  number: string
  title: string
  badge: string
  icon: any
  desc: string
  highlights: string[]
  outputType: string
}

const FEATURES: FeatureItem[] = [
  {
    number: '01',
    title: 'Decode your idea',
    badge: 'STRATEGIC FOUNDATION',
    icon: Dna,
    desc: 'Break down your concept into core problem gravity, audience resonance profiles, value propositions, and a computed readiness score.',
    highlights: ['Audience persona mapping', 'Market gap & wedge identification', 'Strategic viability assessment'],
    outputType: 'Idea DNA Dossier',
  },
  {
    number: '02',
    title: 'Build your brand direction',
    badge: 'VISUAL & TONAL IDENTITY',
    icon: Palette,
    desc: 'Synthesize a high-contrast editorial brand system including color palette hex tokens, typographic hierarchy, and definitive voice rules.',
    highlights: ['Obsidian & electric palette tokens', 'Primary & secondary font pairings', 'Verbal identity & tone spectrum'],
    outputType: 'Brand Identity System',
  },
  {
    number: '03',
    title: 'Plan your digital product',
    badge: 'PRODUCT SPECIFICATION',
    icon: Layers,
    desc: 'Define your product architecture with 5-stage user journey ribbons, competitive moats, and a phased 3-tier MVP scoping framework.',
    highlights: ['Core vs nice-to-have scoping', 'Friction-free onboarding flow', 'Defensible competitive advantage'],
    outputType: 'Product Spec & MVP Scope',
  },
  {
    number: '04',
    title: 'Create your website blueprint',
    badge: 'DIGITAL ARCHITECTURE',
    icon: Globe,
    desc: 'Generate a high-converting website blueprint complete with narrative section stacks, interactive wireframe preview, and CTA placements.',
    highlights: ['Narrative section hierarchy', 'Hero manifesto framing', 'Component & conversion blueprint'],
    outputType: 'Interactive Wireframe Layout',
  },
  {
    number: '05',
    title: 'Generate content and marketing ideas',
    badge: 'GROWTH & DISTRIBUTION',
    icon: MessageSquare,
    desc: 'Produce multi-channel launch campaign angles, format-native content hooks for carousels, vertical video, and social threads.',
    highlights: ['High-retention social hooks', '3-day weekly distribution cadence', 'Launch announcement angles'],
    outputType: 'Multi-Format Content Matrix',
  },
  {
    number: '06',
    title: 'Organize your launch roadmap',
    badge: 'TACTICAL EXECUTION',
    icon: Compass,
    desc: 'Sequence your go-to-market execution into prioritized sprint phases, actionable task checklists, and live milestone readiness metrics.',
    highlights: ['Phased Foundation -> Launch sequence', 'Interactive milestone tracking', 'Go-to-market launch readiness'],
    outputType: '3-Phase Action Roadmap',
  },
]

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="features" className="py-24 bg-forge-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <p className="section-label mb-2.5">CORE CAPABILITIES</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-forge-white uppercase leading-[1.1]">
            ONE UNIFIED WORKSPACE. <br />
            <span className="text-gradient">SIX SPECIALIZED SYSTEMS.</span>
          </h2>
          <p className="text-forge-muted text-sm sm:text-base mt-4 font-light leading-relaxed">
            Everything your idea needs to evolve from an abstract thought into an actionable, launch-ready digital blueprint.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                className="rounded-2xl border border-forge-border bg-forge-surface/85 p-6 sm:p-7 hover:border-forge-blue/40 hover:shadow-blue-glow-sm hover:bg-forge-surface transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-forge-navy border border-forge-border flex items-center justify-center group-hover:border-forge-blue/40 group-hover:bg-forge-blue/10 transition-colors">
                      <Icon size={18} className="text-forge-muted group-hover:text-forge-blue transition-colors" />
                    </div>
                    <span className="text-2xs font-mono font-bold tracking-widest text-forge-blue">
                      {feat.number}
                    </span>
                  </div>

                  <span className="text-2xs font-mono uppercase tracking-wider text-forge-muted block mb-1.5">
                    {feat.badge}
                  </span>

                  <h3 className="text-lg sm:text-xl font-bold text-forge-white tracking-tight mb-3">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-forge-muted leading-relaxed font-light mb-5">
                    {feat.desc}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-6 pt-4 border-t border-forge-border/40">
                    {feat.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-2xs font-mono text-forge-muted/90">
                        <CheckCircle2 size={12} className="text-forge-blue flex-shrink-0" />
                        <span className="truncate">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-forge-border/60 flex items-center justify-between text-2xs font-mono">
                  <span className="text-forge-muted uppercase tracking-wider">DELIVERABLE</span>
                  <span className="text-forge-blue font-medium">{feat.outputType}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
