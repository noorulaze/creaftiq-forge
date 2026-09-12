import { motion } from 'framer-motion'
import { Dna, Layers, Package, Globe, FileText, Map } from 'lucide-react'

const FEATURES = [
  {
    icon: Dna,
    title: 'IDEA DNA',
    description: 'Purpose, audience, opportunity, personality — your idea, fully understood.',
  },
  {
    icon: Layers,
    title: 'BRAND BLUEPRINT',
    description: 'Names, taglines, personality, visual direction, positioning.',
  },
  {
    icon: Package,
    title: 'PRODUCT STRATEGY',
    description: 'Core features, user journey, value proposition, target users.',
  },
  {
    icon: Globe,
    title: 'WEBSITE ARCHITECTURE',
    description: 'Pages, sections, navigation, CTAs, UX direction.',
  },
  {
    icon: FileText,
    title: 'CONTENT PLAN',
    description: 'Content pillars, post ideas, reel concepts, campaign ideas.',
  },
  {
    icon: Map,
    title: 'LAUNCH ROADMAP',
    description: 'NOW / NEXT / LATER — an actionable sequence to take your idea to market.',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-forge-black">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="section-label mb-3">WHAT YOU GET</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-forge-white tracking-tight max-w-lg">
            Everything your idea needs.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -2 }}
                className="group rounded-xl border border-forge-border bg-forge-surface p-6 hover:border-forge-border2 hover:shadow-card-hover transition-all duration-200 cursor-default"
              >
                <div className="w-9 h-9 rounded-lg bg-forge-blue/10 border border-forge-blue/20 flex items-center justify-center mb-5 group-hover:bg-forge-blue/15 transition-colors">
                  <Icon size={16} className="text-forge-blue" />
                </div>
                <h3 className="text-xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-forge-muted text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
