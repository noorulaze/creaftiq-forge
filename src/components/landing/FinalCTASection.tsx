import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/shared'

export function FinalCTASection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="about" className="py-24 sm:py-32 bg-forge-navy/30 border-t border-forge-border/40 relative overflow-hidden">
      {/* Soft atmospheric gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-3">BEGIN YOUR FORGE</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-forge-white uppercase mb-5 leading-tight">
            READY TO FORGE YOUR NEXT IDEA?
          </h2>
          <p className="text-sm sm:text-base text-forge-muted max-w-lg mx-auto font-light leading-relaxed mb-8">
            Experience an AI creative workspace engineered for founders, operators, and studios.
          </p>

          <div className="inline-block">
            <Link to="/forge/new">
              <Button
                variant="primary"
                size="xl"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                className="text-2xs font-semibold tracking-widest uppercase px-9 py-4 rounded-xl shadow-blue-glow-sm"
              >
                START FORGING
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
