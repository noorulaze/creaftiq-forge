import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles, Layers, Globe, Dna, Compass, MessageSquare, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react'

interface BlueprintPillar {
  id: string
  num: string
  title: string
  category: string
  icon: any
  tag: string
  highlight: string
  detail: string
  subItems: string[]
}

const BLUEPRINT_PILLARS: BlueprintPillar[] = [
  {
    id: 'dna',
    num: '01',
    title: 'Idea DNA',
    category: 'STRATEGY',
    icon: Dna,
    tag: 'READINESS: 94%',
    highlight: 'Creator Economy & Independent Studios',
    detail: 'Deconstructed from raw notes into a validated value proposition and market wedge.',
    subItems: ['High-intent solo operators', 'Fragmented tooling gap', 'Direct monetization path'],
  },
  {
    id: 'brand',
    num: '02',
    title: 'Brand Direction',
    category: 'IDENTITY',
    icon: Layers,
    tag: 'EDITORIAL OBSIDIAN',
    highlight: 'Syne Bold + Space Grotesk',
    detail: 'High-contrast editorial voice with an atmospheric dark palette and electric blue signals.',
    subItems: ['#0A0A0F Void', '#2563EB Signal Blue', 'Restrained minimalism'],
  },
  {
    id: 'website',
    num: '03',
    title: 'Website Blueprint',
    category: 'DIGITAL UX',
    icon: Globe,
    tag: '5 CORE SECTIONS',
    highlight: 'Hero Manifesto -> Interactive Showcase',
    detail: 'Complete responsive section hierarchy engineered for high creative authority.',
    subItems: ['Atmospheric hero viewport', 'Interactive capability grid', 'Zero-friction onboarding'],
  },
  {
    id: 'content',
    num: '04',
    title: 'Content Ideas',
    category: 'CAMPAIGN',
    icon: MessageSquare,
    tag: '3 FORMAT ENGINES',
    highlight: '"From Blank Canvas to Digital Launch"',
    detail: 'Multi-channel launch angles spanning carousels, short-form video hooks, and launch threads.',
    subItems: ['Instagram carousel series', 'X launch thread matrix', 'Behind-the-forge video scripts'],
  },
  {
    id: 'roadmap',
    num: '05',
    title: 'Launch Roadmap',
    category: 'EXECUTION',
    icon: Compass,
    tag: '3 PHASES / 12 MILESTONES',
    highlight: 'Foundation -> Beta Drop -> Public Scale',
    detail: 'Time-sequenced action roadmap prioritizing high-leverage milestones.',
    subItems: ['Brand asset lock', 'MVP landing release', 'First 100 studio invites'],
  },
]

export function IdeaToBlueprintAnimation() {
  const shouldReduceMotion = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-advance through blueprint pillars if not hovered
  useEffect(() => {
    if (isHovered || shouldReduceMotion) return
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % BLUEPRINT_PILLARS.length)
    }, 3800)
    return () => clearInterval(interval)
  }, [isHovered, shouldReduceMotion])

  const activePillar = BLUEPRINT_PILLARS[activeIdx]
  const ActiveIcon = activePillar.icon

  return (
    <div 
      className="relative rounded-2xl border border-forge-border/80 bg-forge-surface/90 backdrop-blur-xl p-5 sm:p-7 shadow-card overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle ambient light pool behind the preview */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-forge-blue/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-forge-blue/10 blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-forge-border/60">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]/60" />
          <span className="ml-2 text-2xs font-mono text-forge-muted tracking-wider">
            forge.blueprint / transformation-matrix
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forge-blue/10 border border-forge-blue/25 text-2xs font-mono text-forge-blue">
          <Sparkles size={11} className="animate-pulse" />
          <span>BLUEPRINT ACTIVE</span>
        </div>
      </div>

      {/* Step 1: Raw Idea Input Stream */}
      <div className="mb-5 p-3.5 rounded-xl border border-forge-border bg-forge-black/60 relative">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-ping" />
            <span className="text-2xs font-mono uppercase tracking-wider text-forge-muted">
              RAW IDEA INPUT
            </span>
          </div>
          <span className="text-2xs font-mono text-forge-muted/70">SOURCE: USER PROMPT</span>
        </div>
        <p className="text-xs sm:text-sm font-mono text-forge-white leading-relaxed">
          &quot;A modern creative workspace that turns raw concepts into digital launch blueprints.&quot;
        </p>
      </div>

      {/* Transformation Flow Ribbon: Interactive Blueprint Pills */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {BLUEPRINT_PILLARS.map((pillar, idx) => {
          const isActive = idx === activeIdx
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`flex-1 min-w-[68px] sm:min-w-0 py-2 px-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-forge-blue/60 bg-forge-blue/15 shadow-blue-glow-sm'
                  : 'border-forge-border bg-forge-navy/60 hover:border-forge-border2 hover:bg-forge-navy'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-2xs font-mono font-bold ${isActive ? 'text-forge-blue' : 'text-forge-muted/60'}`}>
                  {pillar.num}
                </span>
                {isActive && <span className="w-1 h-1 rounded-full bg-forge-blue" />}
              </div>
              <p className={`text-2xs font-semibold truncate mt-0.5 ${isActive ? 'text-forge-white' : 'text-forge-muted'}`}>
                {pillar.title}
              </p>
            </button>
          )
        })}
      </div>

      {/* Structured Blueprint Output Viewport */}
      <div className="relative min-h-[220px] rounded-xl border border-forge-border bg-forge-navy/90 p-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between h-full"
          >
            <div>
              {/* Pillar meta header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-forge-blue/15 border border-forge-blue/30 flex items-center justify-center text-forge-blue">
                    <ActiveIcon size={14} />
                  </div>
                  <div>
                    <span className="text-2xs font-mono uppercase tracking-widest text-forge-muted">
                      {activePillar.category} ARCHITECTURE
                    </span>
                    <h3 className="text-sm font-bold text-forge-white uppercase tracking-wide">
                      {activePillar.title}
                    </h3>
                  </div>
                </div>
                <span className="text-2xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                  {activePillar.tag}
                </span>
              </div>

              {/* Pillar focus line */}
              <div className="p-3 rounded-lg bg-forge-black/40 border border-forge-border/60 mb-3">
                <p className="text-xs font-semibold text-forge-white">
                  {activePillar.highlight}
                </p>
                <p className="text-2xs text-forge-muted mt-1 leading-relaxed font-light">
                  {activePillar.detail}
                </p>
              </div>

              {/* Sub-item vector tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                {activePillar.subItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 p-2 rounded bg-forge-surface border border-forge-border/70 text-2xs text-forge-muted font-mono truncate"
                  >
                    <CheckCircle2 size={11} className="text-forge-blue flex-shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between pt-3 mt-4 border-t border-forge-border/40 text-2xs font-mono">
              <span className="text-forge-muted">
                TRANSFORMED IN 1.8s
              </span>
              <div className="flex items-center gap-1 text-forge-blue hover:text-forge-blue-light transition-colors">
                <span>VIEW COMPLETE BLUEPRINT</span>
                <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom prompt cue */}
      <div className="mt-4 flex items-center justify-between text-2xs font-mono text-forge-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-forge-blue" />
          <span>Interactive Blueprint Simulator</span>
        </span>
        <span className="hidden sm:inline">Click any step to inspect structure</span>
      </div>
    </div>
  )
}
