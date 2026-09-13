import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, Sparkles, Layers, Globe, Compass, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/shared'
import { MountainBackdrop } from './MountainBackdrop'

const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
}

const ITEM = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-forge-black pt-20 pb-16">
      {/* Mountain Landscape Background */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div variants={CONTAINER} initial="hidden" animate="show" className="flex flex-col items-center">

          {/* Product pill indicator */}
          <motion.div variants={ITEM} className="mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-forge-border bg-forge-surface/60 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
              <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-muted">
                CREAFTIQ FORGE
              </span>
              <span className="text-forge-border">/</span>
              <span className="text-2xs font-medium tracking-wider text-forge-white">
                V1 STUDIO
              </span>
            </div>
          </motion.div>

          {/* Core Headline */}
          <motion.div variants={ITEM} className="max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-forge-white uppercase leading-[1.08]">
              ONE IDEA. <br />
              <span className="text-gradient font-light">ONE INTELLIGENT</span>{' '}
              <span className="text-gradient-blue font-semibold">WORKSPACE.</span>
            </h1>
          </motion.div>

          {/* Supporting Text */}
          <motion.p
            variants={ITEM}
            className="mt-6 text-base sm:text-lg text-forge-muted max-w-xl mx-auto leading-relaxed font-light"
          >
            Turn a raw idea into a clear creative and digital launch plan.
            Not a generic chatbot — a structured space for your brand, product, website, and roadmap.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div variants={ITEM} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link to="/forge/new" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="xl"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                className="w-full sm:w-auto text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-xl shadow-blue-glow-sm"
              >
                START FORGING
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="xl"
                className="w-full sm:w-auto text-xs font-medium tracking-widest uppercase text-forge-muted hover:text-forge-white"
              >
                EXPLORE HOW IT WORKS
              </Button>
            </a>
          </motion.div>

          {/* Floating Abstract Creative Fragments */}
          <motion.div
            variants={ITEM}
            className="mt-14 w-full max-w-4xl relative"
          >
            {/* Ambient blur backdrop under card */}
            <div className="absolute inset-0 bg-gradient-to-b from-forge-blue/10 to-transparent blur-2xl -z-10" />

            {/* Central preview mock container */}
            <div className="relative rounded-2xl border border-forge-border/80 bg-forge-surface/80 backdrop-blur-xl p-5 sm:p-7 shadow-card text-left overflow-hidden">
              
              {/* Top window bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-forge-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border" />
                  <span className="ml-2 text-2xs font-mono text-forge-muted tracking-wider">forge.studio / kerala-streetwear</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-forge-blue/10 text-forge-blue border border-forge-blue/20">
                    STATUS: READY
                  </span>
                </div>
              </div>

              {/* Fragment Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* Fragment 1: Brand & Direction */}
                <div className="rounded-xl border border-forge-border bg-forge-navy/80 p-4 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="section-label text-2xs">01 / BRAND</span>
                    <Layers size={13} className="text-forge-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-forge-white mb-1">VELO STREETWEAR</h4>
                  <p className="text-xs text-forge-muted line-clamp-2">
                    "Made for the ones who move." Raw textures, Malayalam editorial typography, drop model.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#0A0A0F] border border-forge-border" />
                    <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                    <span className="w-3 h-3 rounded-full bg-[#F8F9FA]" />
                  </div>
                </div>

                {/* Fragment 2: Digital Experience */}
                <div className="rounded-xl border border-forge-border bg-forge-navy/80 p-4 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="section-label text-2xs">02 / ARCHITECTURE</span>
                    <Globe size={13} className="text-forge-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-forge-white mb-1">EDITORIAL COMMERCE</h4>
                  <p className="text-xs text-forge-muted line-clamp-2">
                    Single-scroll drop experience. Storytelling countdown, lookbook grid, member early-access.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-2xs text-forge-muted font-mono">
                    <span>5 Pages</span>
                    <span>•</span>
                    <span>Mobile-first</span>
                  </div>
                </div>

                {/* Fragment 3: Launch Plan */}
                <div className="rounded-xl border border-forge-border bg-forge-navy/80 p-4 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="section-label text-2xs">03 / LAUNCH</span>
                    <Compass size={13} className="text-forge-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-forge-white mb-1">NOW / NEXT / LATER</h4>
                  <p className="text-xs text-forge-muted line-clamp-2">
                    Phase 1: 100-unit Founding Drop + UGC College Pop-up. Phase 2: Web MVP.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-2xs text-forge-blue">
                    <span>Readiness: 86%</span>
                    <ArrowUpRight size={12} />
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Down indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <ChevronDown size={18} className="text-forge-muted animate-bounce" />
      </motion.div>
    </section>
  )
}
