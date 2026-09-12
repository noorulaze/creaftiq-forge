import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Zap } from 'lucide-react'
import { Button } from '@/components/shared'
import { AnimatedFlow } from './AnimatedFlow'

const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const ITEM = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden forge-glow-bg">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJuIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4=')] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        <motion.div variants={CONTAINER} initial="hidden" animate="show">

          {/* Brand label */}
          <motion.div variants={ITEM} className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-forge-border bg-forge-surface/50 backdrop-blur-sm">
              <Zap size={11} className="text-forge-blue" fill="currentColor" />
              <span className="text-2xs font-semibold tracking-widest2 uppercase text-forge-muted">
                BUILT BY CREAFTIQ
              </span>
            </div>
          </motion.div>

          {/* Product name */}
          <motion.div variants={ITEM}>
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-widest2 uppercase text-forge-white leading-none mb-2"
              style={{ fontVariationSettings: '"wght" 900' }}>
              FORGE
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.div variants={ITEM} className="mt-6 mb-4">
            <p className="text-3xl sm:text-4xl md:text-5xl font-light text-forge-white leading-tight tracking-tight">
              Turn an idea<br />
              into a digital<br />
              <span className="text-gradient-blue font-medium">launch plan.</span>
            </p>
          </motion.div>

          {/* Supporting text */}
          <motion.p
            variants={ITEM}
            className="mt-8 text-base sm:text-lg text-forge-muted max-w-xl mx-auto leading-relaxed"
          >
            Give FORGE the raw idea. Let intelligent creative thinking turn it into
            strategy, direction and an actionable blueprint.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={ITEM} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/forge/new">
              <Button
                variant="primary"
                size="xl"
                icon={<Zap size={16} />}
                className="text-sm font-semibold tracking-widest uppercase px-8 py-4 rounded-xl"
              >
                START FORGING
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="ghost"
                size="xl"
                iconPosition="right"
                icon={<ChevronDown size={16} />}
                className="text-sm font-medium tracking-wide"
              >
                SEE HOW IT WORKS
              </Button>
            </a>
          </motion.div>

          {/* Animated flow */}
          <motion.div variants={ITEM} className="mt-16">
            <AnimatedFlow />
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-forge-muted/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
