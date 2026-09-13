import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Lightbulb, Compass, Target, Palette, Rocket } from 'lucide-react'

const PROCESS_STEPS = [
  { step: '01', title: 'IDEA',        desc: 'Raw inspiration & context',      icon: Lightbulb },
  { step: '02', title: 'UNDERSTAND',  desc: 'Audience & problem analysis',    icon: Target    },
  { step: '03', title: 'STRATEGIZE',  desc: 'Market gap & positioning',       icon: Compass   },
  { step: '04', title: 'CREATE',      desc: 'Brand, UX, website & content',   icon: Palette   },
  { step: '05', title: 'LAUNCH',      desc: 'Roadmap & campaign vectors',     icon: Rocket    },
]

export function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="how-it-works" className="py-20 bg-forge-navy/40 border-y border-forge-border/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="section-label mb-2">THE WORKSPACE FLOW</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-forge-white uppercase">
            From Inspiration to Execution
          </h2>
          <p className="text-forge-muted text-xs sm:text-sm mt-2 font-light">
            FORGE guides your concept through five structured transitions without the chaos of open-ended chatting.
          </p>
        </div>

        {/* Process Flow Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-2">
          {PROCESS_STEPS.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="relative rounded-xl border border-forge-border bg-forge-surface/70 p-5 flex flex-col justify-between group hover:border-forge-border2 hover:bg-forge-surface transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xs font-mono text-forge-blue/80 font-bold">{s.step}</span>
                    <Icon size={14} className="text-forge-muted group-hover:text-forge-blue transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-forge-white mb-1">
                    {s.title}
                  </h3>
                  <p className="text-2xs text-forge-muted font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Flow indicator on desktop */}
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-forge-border2">
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
