import { motion, useReducedMotion } from 'framer-motion'
import { Dna, Palette, Layout, Calendar } from 'lucide-react'

const FEATURES = [
  {
    title: 'Idea DNA',
    icon: Dna,
    desc: 'Deep deconstruction of your core vision across audience resonance, problem space, market gap, and strategic readiness score.',
    meta: '6 Strategic Dimensions',
  },
  {
    title: 'Brand Direction',
    icon: Palette,
    desc: 'Editorial identity synthesis including naming vectors, memorable taglines, core positioning, color palettes, and typographic scales.',
    meta: 'Visual & Tonal Identity',
  },
  {
    title: 'Digital Blueprint',
    icon: Layout,
    desc: 'Complete digital architecture detailing website section hierarchy, UX direction, content strategy, hooks, and channel plans.',
    meta: 'Website & Content Engine',
  },
  {
    title: 'Launch Roadmap',
    icon: Calendar,
    desc: 'Actionable NOW, NEXT, and LATER execution kanban organizing tactical milestones across brand, technology, marketing, and operations.',
    meta: 'Phased Launch Plan',
  },
]

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="features" className="py-24 bg-forge-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14 text-left">
          <p className="section-label mb-2">SYSTEM CAPABILITIES</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-forge-white uppercase leading-tight">
            FROM A RAW IDEA <br />
            <span className="text-gradient">TO A CLEAR DIRECTION.</span>
          </h2>
          <p className="text-forge-muted text-sm sm:text-base mt-3 font-light leading-relaxed">
            Four interconnected systems working together inside one unified workspace.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="rounded-2xl border border-forge-border bg-forge-surface/90 p-7 hover:border-forge-blue/40 hover:shadow-blue-glow-sm transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-forge-navy border border-forge-border flex items-center justify-center group-hover:border-forge-blue/30 group-hover:bg-forge-blue/10 transition-colors">
                      <Icon size={18} className="text-forge-muted group-hover:text-forge-blue transition-colors" />
                    </div>
                    <span className="text-2xs font-mono tracking-wider uppercase text-forge-muted/70">
                      {feat.meta}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-forge-white tracking-tight mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-forge-muted leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-forge-border/60 flex items-center justify-between">
                  <span className="text-2xs font-mono uppercase text-forge-muted">STRUCTURED OUTPUT</span>
                  <span className="text-xs text-forge-blue font-mono font-medium">JSON NATIVE</span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
