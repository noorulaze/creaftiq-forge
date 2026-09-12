import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'DROP YOUR IDEA',
    description: 'Tell FORGE what you\'re building. A brand, a product, a service — anything. No format required.',
  },
  {
    number: '02',
    title: 'LET IT THINK',
    description: 'FORGE analyzes your audience, purpose, positioning and creative direction. Every insight is structured.',
  },
  {
    number: '03',
    title: 'GET YOUR BLUEPRINT',
    description: 'Receive a structured plan for brand, product, website, content and launch — ready to act on.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-4 sm:px-6 bg-forge-navy">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-20"
        >
          <p className="section-label mb-3">PROCESS</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forge-white tracking-tight">
            How it works.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              {/* Top line */}
              <div className="w-8 h-px bg-forge-blue mb-6" />

              {/* Number */}
              <div className="text-5xl font-black tracking-tight text-forge-blue/20 mb-4 leading-none">
                {step.number}
              </div>

              {/* Content */}
              <h3 className="text-sm font-semibold tracking-widest uppercase text-forge-white mb-3">
                {step.title}
              </h3>
              <p className="text-forge-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
