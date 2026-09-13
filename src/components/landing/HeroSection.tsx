import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/shared'
import { MountainBackdrop } from './MountainBackdrop'
import { IdeaToBlueprintAnimation } from './IdeaToBlueprintAnimation'

const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
}

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden bg-forge-black pt-28 sm:pt-32 pb-20 sm:pb-28">
      {/* Mountain & atmospheric light backdrop */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* ============================================================ */}
          {/* Left Column: Editorial Typography & Exact Positioning        */}
          {/* ============================================================ */}
          <motion.div
            variants={CONTAINER}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 flex flex-col text-left"
          >
            {/* Small Label Pill: CREAFTIQ FORGE */}
            <motion.div variants={ITEM} className="mb-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
                <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-white">
                  CREAFTIQ FORGE
                </span>
                <span className="text-forge-border">/</span>
                <span className="text-2xs font-mono text-forge-muted">AI CREATIVE WORKSPACE</span>
              </div>
            </motion.div>

            {/* Main Headline: ONE IDEA. ONE INTELLIGENT WORKSPACE. */}
            <motion.div variants={ITEM}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-forge-white uppercase leading-[1.05] mb-6">
                ONE IDEA. <br />
                <span className="text-gradient font-light">ONE INTELLIGENT</span> <br />
                <span className="text-gradient-blue font-bold">WORKSPACE.</span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              variants={ITEM}
              className="text-base sm:text-lg text-forge-muted max-w-lg leading-relaxed font-light mb-8"
            >
              CREAFTIQ FORGE transforms a raw idea into a structured digital launch plan covering strategy, branding, product, website, content, marketing, and roadmap.
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div variants={ITEM} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to="/forge/new" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="xl"
                  icon={<ArrowRight size={15} />}
                  iconPosition="right"
                  className="w-full sm:w-auto text-2xs font-semibold tracking-widest uppercase px-8 py-4 rounded-xl shadow-blue-glow-sm cursor-pointer"
                >
                  START FORGING
                </Button>
              </Link>
              <a href="#process" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="xl"
                  icon={<Compass size={14} />}
                  className="w-full sm:w-auto text-2xs font-medium tracking-widest uppercase text-forge-muted hover:text-forge-white border border-forge-border/60 hover:border-forge-border hover:bg-forge-surface/50"
                >
                  EXPLORE THE PROCESS
                </Button>
              </a>
            </motion.div>

            {/* Studio Vitals Strip */}
            <motion.div variants={ITEM} className="mt-10 pt-8 border-t border-forge-border/50 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xs font-mono uppercase text-forge-muted tracking-wider">STRATEGY</p>
                <p className="text-xs sm:text-sm font-semibold text-forge-white mt-0.5">Idea DNA Engine</p>
              </div>
              <div>
                <p className="text-2xs font-mono uppercase text-forge-muted tracking-wider">DESIGN & PRODUCT</p>
                <p className="text-xs sm:text-sm font-semibold text-forge-white mt-0.5">Brand & Wireframes</p>
              </div>
              <div>
                <p className="text-2xs font-mono uppercase text-forge-muted tracking-wider">EXECUTION</p>
                <p className="text-xs sm:text-sm font-semibold text-forge-white mt-0.5">7-Day Launch Plan</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ============================================================ */}
          {/* Right Column: Idea Becoming Structured Blueprint Visual      */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative w-full"
          >
            <div className="absolute -inset-3 bg-gradient-to-tr from-forge-blue/20 via-forge-blue/5 to-transparent rounded-3xl blur-2xl -z-10" />
            <IdeaToBlueprintAnimation />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
