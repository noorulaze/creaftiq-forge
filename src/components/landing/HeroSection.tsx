import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Globe, Compass, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/shared'
import { MountainBackdrop } from './MountainBackdrop'

const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const ITEM = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-forge-black pt-28 pb-20 sm:pb-24">
      {/* Abstract mountain and ambient glow background */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Supporting Text, and Action Matrix */}
          <motion.div
            variants={CONTAINER}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 flex flex-col text-left"
          >
            {/* Small Label */}
            <motion.div variants={ITEM} className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
                <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-muted">
                  AI CREATIVE WORKSPACE
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={ITEM}>
              <h1 className="text-4xl sm:text-6xl lg:text-6.5xl font-black tracking-tight text-forge-white uppercase leading-[1.06] mb-5">
                ONE IDEA. <br />
                <span className="text-gradient font-light">ONE INTELLIGENT</span> <br />
                <span className="text-gradient-blue font-bold">WORKSPACE.</span>
              </h1>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              variants={ITEM}
              className="text-sm sm:text-base md:text-lg text-forge-muted max-w-lg leading-relaxed font-light mb-8"
            >
              Turn a raw idea into a clear creative, brand, website, content, and marketing direction.
            </motion.p>

            {/* Button Hierarchy */}
            <motion.div variants={ITEM} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/forge/new">
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
              <a href="#how-it-works">
                <Button
                  variant="ghost"
                  size="xl"
                  className="w-full sm:w-auto text-2xs font-medium tracking-widest uppercase text-forge-muted hover:text-forge-white"
                >
                  EXPLORE HOW IT WORKS
                </Button>
              </a>
            </motion.div>

            {/* Minimal Subtext Indicator */}
            <motion.div variants={ITEM} className="mt-8 flex items-center gap-2 text-2xs font-mono text-forge-muted/60">
              <span>✦</span>
              <span>NO GENERIC CHATBOTS. PURPOSE-BUILT FOR CREATIVE LAUNCHES.</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Creative Interface Visuals & Abstract Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative w-full"
          >
            {/* Ambient blue back-illumination */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-forge-blue/15 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Main Creative Fragment Container */}
            <div className="relative rounded-2xl border border-forge-border/80 bg-forge-surface/85 backdrop-blur-xl p-5 sm:p-7 shadow-card overflow-hidden">
              
              {/* Container Top Meta */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-forge-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <span className="ml-2 text-2xs font-mono text-forge-muted tracking-wider">forge.studio / active-blueprint</span>
                </div>
                <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-forge-blue/10 text-forge-blue border border-forge-blue/20">
                  LIVE WORKSPACE
                </span>
              </div>

              {/* Composition of Layered Creative Cards */}
              <div className="space-y-3.5">
                
                {/* 1. Abstract Brand Card */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="rounded-xl border border-forge-border bg-forge-navy/90 p-4 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-label text-2xs">01 / BRAND IDENTITY</span>
                    <Layers size={13} className="text-forge-blue" />
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold text-forge-white">VELO STUDIO</h4>
                    <span className="text-2xs font-mono text-forge-muted">POSITIONING: EDITORIAL</span>
                  </div>
                  <p className="text-xs text-forge-muted mt-1 font-light leading-relaxed">
                    "Where culture meets craft." High-contrast typography with deep obsidian and electric blue highlights.
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#0A0A0F] border border-forge-border" title="Obsidian" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#2563EB]" title="Signal Blue" />
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F8F9FA]" title="Chalk White" />
                    </div>
                    <span className="text-2xs font-mono text-forge-blue/80">3 Primary Tokens</span>
                  </div>
                </motion.div>

                {/* 2. Floating Website UI Fragment */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="rounded-xl border border-forge-border bg-forge-navy/90 p-4 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-label text-2xs">02 / WEBSITE ARCHITECTURE</span>
                    <Globe size={13} className="text-forge-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-forge-white">NARRATIVE COMMERCE</h4>
                  <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-2xs font-mono text-forge-muted">
                    <div className="p-2 rounded bg-forge-surface border border-forge-border/60">HERO MANIFESTO</div>
                    <div className="p-2 rounded bg-forge-surface border border-forge-border/60">PRODUCT GRID</div>
                    <div className="p-2 rounded bg-forge-surface border border-forge-border/60">VIP ACCESS</div>
                  </div>
                </motion.div>

                {/* 3. Launch Roadmap Card */}
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="rounded-xl border border-forge-border bg-forge-navy/90 p-4 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-label text-2xs">03 / LAUNCH VECTOR</span>
                    <Compass size={13} className="text-forge-blue" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-forge-white">PHASE 1: FOUNDING DROP</p>
                      <p className="text-2xs text-forge-muted font-light">Targeted waitlist + 5 micro-ambassadors</p>
                    </div>
                    <span className="flex items-center gap-1 text-2xs font-mono text-forge-blue">
                      <span>READY</span>
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                </motion.div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
