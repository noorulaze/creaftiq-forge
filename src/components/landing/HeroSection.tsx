import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Globe, Compass, ArrowUpRight, Sparkles, MessageSquare, Check, Terminal } from 'lucide-react'
import { Button } from '@/components/shared'
import { MountainBackdrop } from './MountainBackdrop'

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
          {/* Left Column: Refined Editorial Typography & Action Hierarchy  */}
          {/* ============================================================ */}
          <motion.div
            variants={CONTAINER}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 flex flex-col text-left"
          >
            {/* Small Label Pill */}
            <motion.div variants={ITEM} className="mb-5">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
                <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-muted">
                  AI CREATIVE WORKSPACE
                </span>
                <span className="text-forge-border">/</span>
                <span className="text-2xs font-mono text-forge-white/70">STUDIO V1</span>
              </div>
            </motion.div>

            {/* Main Headline — Improved spacing and hierarchy */}
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
              Turn a raw idea into a clear creative, brand, website, content, and marketing direction.
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div variants={ITEM} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to="/forge/new" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="xl"
                  icon={<ArrowRight size={15} />}
                  iconPosition="right"
                  className="w-full sm:w-auto text-2xs font-semibold tracking-widest uppercase px-8 py-4 rounded-xl shadow-blue-glow-sm"
                >
                  START FORGING
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="xl"
                  className="w-full sm:w-auto text-2xs font-medium tracking-widest uppercase text-forge-muted hover:text-forge-white"
                >
                  EXPLORE HOW IT WORKS
                </Button>
              </a>
            </motion.div>

            {/* Studio Badges Strip: eliminates emptiness on mobile & desktop */}
            <motion.div variants={ITEM} className="mt-10 pt-8 border-t border-forge-border/50 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xs font-mono uppercase text-forge-muted tracking-wider">STRUCTURE</p>
                <p className="text-xs sm:text-sm font-semibold text-forge-white mt-0.5">Structured Blueprints</p>
              </div>
              <div>
                <p className="text-2xs font-mono uppercase text-forge-muted tracking-wider">PERSONAS</p>
                <p className="text-xs sm:text-sm font-semibold text-forge-white mt-0.5">6 AI Specialists</p>
              </div>
              <div>
                <p className="text-2xs font-mono uppercase text-forge-muted tracking-wider">DEPLOYMENT</p>
                <p className="text-xs sm:text-sm font-semibold text-forge-white mt-0.5">Instant Action Plan</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ============================================================ */}
          {/* Right Column: Layered Creative UI Fragments & Interface Board */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative w-full"
          >
            {/* Ambient luminous aura behind cards */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-forge-blue/20 via-forge-blue/5 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Main Creative Interface Board */}
            <div className="relative rounded-2xl border border-forge-border/90 bg-forge-surface/90 backdrop-blur-xl p-5 sm:p-7 shadow-card overflow-hidden">
              
              {/* Studio Window Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-forge-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <span className="ml-2 text-2xs font-mono text-forge-muted tracking-wider">forge.studio / live-blueprint</span>
                </div>
                <div className="flex items-center gap-1.5 text-2xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SYNTHESIZED</span>
                </div>
              </div>

              {/* Composition of Layered Creative Fragments */}
              <div className="space-y-3.5">
                
                {/* Fragment 1: Brand & Direction with Palette Swatches */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="rounded-xl border border-forge-border bg-forge-navy/90 p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-label text-2xs">01 / BRAND SYSTEM</span>
                    <Layers size={13} className="text-forge-blue" />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold text-forge-white">VELO STUDIO</h4>
                    <span className="text-2xs font-mono text-forge-muted">POSITIONING: EDITORIAL</span>
                  </div>
                  <p className="text-xs text-forge-muted mt-1 font-light leading-relaxed">
                    "Where culture meets craft." High-contrast typography with deep obsidian and electric blue highlights.
                  </p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-forge-border/40">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0A0A0F] border border-forge-border" title="Obsidian #0A0A0F" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB]" title="Signal Blue #2563EB" />
                        <span className="w-3.5 h-3.5 rounded-full bg-[#F8F9FA]" title="Chalk White #F8F9FA" />
                      </div>
                      <span className="text-2xs font-mono text-forge-muted">3 Hex Tokens</span>
                    </div>
                    <span className="text-2xs font-mono text-forge-blue">REFINED</span>
                  </div>
                </motion.div>

                {/* Fragment 2: Digital Architecture Wireframe Layout */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="rounded-xl border border-forge-border bg-forge-navy/90 p-4 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-label text-2xs">02 / DIGITAL ARCHITECTURE</span>
                    <Globe size={13} className="text-forge-blue" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-forge-white">SINGLE-SCROLL COMMERCE</h4>
                    <span className="text-2xs font-mono text-forge-muted">5 SECTIONS</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-2xs font-mono text-forge-muted">
                    <div className="p-2 rounded bg-forge-surface border border-forge-border/70 hover:border-forge-blue/30 transition-colors">
                      HERO MANIFESTO
                    </div>
                    <div className="p-2 rounded bg-forge-surface border border-forge-border/70 hover:border-forge-blue/30 transition-colors">
                      DROP SPOTLIGHT
                    </div>
                    <div className="p-2 rounded bg-forge-surface border border-forge-border/70 hover:border-forge-blue/30 transition-colors">
                      INNER CIRCLE
                    </div>
                  </div>
                </motion.div>

                {/* Fragment 3: Content Engine & Launch Vector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Content Hook Pill */}
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { y: -2 }}
                    className="rounded-xl border border-forge-border bg-forge-navy/90 p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="section-label text-2xs">03 / CONTENT HOOK</span>
                        <MessageSquare size={12} className="text-forge-blue" />
                      </div>
                      <p className="text-xs text-forge-white font-medium italic">
                        "Built different. Born authentic."
                      </p>
                    </div>
                    <span className="text-2xs font-mono text-forge-muted mt-2">Format: Reel / Carousel</span>
                  </motion.div>

                  {/* Launch Roadmap Metric */}
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { y: -2 }}
                    className="rounded-xl border border-forge-border bg-forge-navy/90 p-3.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="section-label text-2xs">04 / ROADMAP</span>
                        <Compass size={12} className="text-forge-blue" />
                      </div>
                      <p className="text-xs font-semibold text-forge-white">
                        PHASE 1: FOUNDING DROP
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-forge-border/40 text-2xs font-mono text-forge-blue">
                      <span>READINESS: 86%</span>
                      <ArrowUpRight size={12} />
                    </div>
                  </motion.div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
