import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/shared'

export function FinalCTASection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="cta" className="py-28 sm:py-36 bg-forge-navy/30 border-t border-forge-border/40 relative overflow-hidden">
      {/* Soft atmospheric gradient pool */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.14)_0%,_transparent_70%)] pointer-events-none" />

      {/* Subtle mountain contour in the background */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-40 opacity-15 pointer-events-none select-none"
        viewBox="0 0 1440 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 200 L0 100 Q 360 40 720 90 T 1440 60 L 1440 200 Z"
          fill="#1E293B"
        />
        <path
          d="M0 100 Q 360 40 720 90 T 1440 60"
          stroke="#2563EB"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Small pill label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
            <span className="text-2xs font-mono uppercase tracking-widest text-forge-muted">
              THE INTELLIGENT WORKSPACE
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-forge-white uppercase mb-6 leading-tight">
            YOUR NEXT BIG IDEA <br />
            <span className="text-gradient-blue">STARTS HERE.</span>
          </h2>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base text-forge-muted max-w-xl mx-auto font-light leading-relaxed mb-10">
            Stop losing momentum in blank chat prompts. Transform your raw concepts into a structured, launch-ready digital blueprint in minutes.
          </p>

          {/* Action Button */}
          <div className="inline-block">
            <Link to="/forge/new">
              <Button
                variant="primary"
                size="xl"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                className="text-2xs font-semibold tracking-widest uppercase px-10 py-4 rounded-xl shadow-blue-glow-sm hover:scale-[1.02] transition-transform cursor-pointer"
              >
                START FORGING
              </Button>
            </Link>
          </div>

          {/* Reassurance strip without fake statistics */}
          <div className="mt-10 flex items-center justify-center gap-6 text-2xs font-mono text-forge-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-forge-blue" />
              Instant blueprint generation
            </span>
            <span className="text-forge-border">•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-forge-blue" />
              Structured creative output
            </span>
            <span className="text-forge-border hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-forge-blue" />
              Complete exportable plan
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
