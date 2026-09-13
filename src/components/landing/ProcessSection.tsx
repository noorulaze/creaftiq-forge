import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Lightbulb, Compass, Target, Palette, Rocket } from 'lucide-react'

interface ProcessStep {
  step: string
  title: string
  subtitle: string
  desc: string
  deliverable: string
  icon: any
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'IDEA',
    subtitle: 'Raw Inspiration',
    desc: 'Input your raw concept, notes, or target idea in your own natural words without worrying about structure.',
    deliverable: 'Prompt Deconstruction',
    icon: Lightbulb,
  },
  {
    step: '02',
    title: 'UNDERSTAND',
    subtitle: 'Audience & Context',
    desc: 'Analyze user motivations, existing pain points, market context, and core friction points to solve.',
    deliverable: 'Audience & Problem Space',
    icon: Target,
  },
  {
    step: '03',
    title: 'STRATEGIZE',
    subtitle: 'Positioning & Moat',
    desc: 'Uncover competitive market white space, define unique positioning, and formulate a clear value proposition.',
    deliverable: 'Strategic Idea DNA',
    icon: Compass,
  },
  {
    step: '04',
    title: 'CREATE',
    subtitle: 'Brand & Product',
    desc: 'Synthesize editorial visual identity, MVP feature architecture, website wireframe layout, and content hooks.',
    deliverable: 'Design & Product Specs',
    icon: Palette,
  },
  {
    step: '05',
    title: 'LAUNCH',
    subtitle: 'Execution Vectors',
    desc: 'Assemble a prioritized execution roadmap with concrete milestones, distribution channels, and go-to-market plan.',
    deliverable: 'Phased Launch Roadmap',
    icon: Rocket,
  },
]

export function ProcessSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="process" className="py-24 bg-forge-navy/40 border-y border-forge-border/40 relative overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-forge-blue/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label mb-2.5">THE WORKSPACE PROCESS</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-forge-white uppercase leading-tight">
            IDEA ? UNDERSTAND ? STRATEGIZE ? CREATE ? LAUNCH
          </h2>
          <p className="text-forge-muted text-xs sm:text-sm mt-3 font-light leading-relaxed">
            FORGE guides your concept through five structured transitions without the chaos of open-ended chatting.
          </p>
        </div>

        {/* 5-Stage Process Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
          {PROCESS_STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="relative rounded-xl border border-forge-border bg-forge-surface/75 p-5 flex flex-col justify-between group hover:border-forge-blue/40 hover:bg-forge-surface hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xs font-mono text-forge-blue font-bold tracking-wider">
                      PHASE {s.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-forge-navy border border-forge-border flex items-center justify-center group-hover:border-forge-blue/30 group-hover:bg-forge-blue/10 transition-colors">
                      <Icon size={14} className="text-forge-muted group-hover:text-forge-blue transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold tracking-wider uppercase text-forge-white mb-0.5">
                    {s.title}
                  </h3>
                  <p className="text-2xs font-mono text-forge-muted/80 uppercase tracking-wide mb-2.5">
                    {s.subtitle}
                  </p>

                  <p className="text-2xs sm:text-xs text-forge-muted font-light leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-forge-border/50 flex items-center justify-between">
                  <span className="text-2xs font-mono text-forge-muted/70 uppercase">OUTPUT</span>
                  <span className="text-2xs font-mono text-forge-blue font-medium">{s.deliverable}</span>
                </div>

                {/* Arrow connector between steps on desktop */}
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-forge-border2 pointer-events-none">
                    <ArrowRight size={13} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
