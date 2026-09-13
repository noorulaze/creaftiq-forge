import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Dna, Palette, Globe, MessageSquare, Compass, CheckCircle2, ArrowRight, ExternalLink, Layers, Copy, Check } from 'lucide-react'
import { Button } from '@/components/shared'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

type PreviewTabId = 'dna' | 'brand' | 'website' | 'content' | 'roadmap'

interface PreviewTab {
  id: PreviewTabId
  title: string
  label: string
  icon: any
  description: string
}

const PREVIEW_TABS: PreviewTab[] = [
  {
    id: 'dna',
    title: 'Idea DNA',
    label: 'STRATEGY DOSSIER',
    icon: Dna,
    description: 'Deconstruct raw intuition into core market gaps, audience friction, and calculated viability.',
  },
  {
    id: 'brand',
    title: 'Brand Direction',
    label: 'IDENTITY SPECIMEN',
    icon: Palette,
    description: 'Establish high-contrast visual tokens, typography pairing, and definitive brand voice guidelines.',
  },
  {
    id: 'website',
    title: 'Website Blueprint',
    label: 'DIGITAL ARCHITECTURE',
    icon: Globe,
    description: 'Architect a full single-scroll landing structure with responsive wireframe section stacks.',
  },
  {
    id: 'content',
    title: 'Content Ideas',
    label: 'CAMPAIGN MATRIX',
    icon: MessageSquare,
    description: 'Generate platform-ready hook scripts, carousel sequences, and launch announcement threads.',
  },
  {
    id: 'roadmap',
    title: 'Launch Roadmap',
    label: 'GO-TO-MARKET KANBAN',
    icon: Compass,
    description: 'Actionable time-sequenced milestones across brand, engineering, and distribution.',
  },
]

export function WorkspacePreviewSection() {
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState<PreviewTabId>('dna')
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast.success(`Copied ${hex}`)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  return (
    <section id="preview" className="py-24 sm:py-32 bg-forge-navy/30 border-t border-forge-border/40 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 left-1/3 w-[600px] h-[500px] bg-forge-blue/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[500px] h-[400px] bg-forge-blue/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <p className="section-label mb-2.5">INSIDE THE FORGE WORKSPACE</p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-forge-white uppercase leading-[1.1]">
            A TACTILE CREATIVE CANVAS. <br />
            <span className="text-gradient">NOT A GENERIC CHATBOT.</span>
          </h2>
          <p className="text-forge-muted text-sm sm:text-base mt-4 font-light leading-relaxed">
            Explore live blueprint cards synthesized from real project parameters. Click any section to inspect the depth of structured output.
          </p>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {PREVIEW_TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-forge-blue/60 bg-forge-blue/15 text-forge-white shadow-blue-glow-sm'
                    : 'border-forge-border bg-forge-surface/60 text-forge-muted hover:border-forge-border2 hover:text-forge-white'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-forge-blue' : 'text-forge-muted'} />
                <span>{tab.title}</span>
              </button>
            )
          })}
        </div>

        {/* Main Interactive Preview Stage */}
        <div className="relative rounded-2xl border border-forge-border/90 bg-forge-surface/90 backdrop-blur-xl p-5 sm:p-8 shadow-card">
          
          {/* Workspace Window Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-forge-border/60 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
              </div>
              <span className="text-2xs font-mono text-forge-muted">
                PROJECT: <span className="text-forge-white font-semibold">VELO AUDIO SYSTEM</span>
              </span>
              <span className="text-forge-border">/</span>
              <span className="text-2xs font-mono text-forge-blue uppercase">
                {PREVIEW_TABS.find(t => t.id === activeTab)?.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE WORKSPACE DEMO
              </span>
              <Link to="/forge/new">
                <span className="text-2xs font-mono text-forge-muted hover:text-forge-white transition-colors flex items-center gap-1">
                  <span>FORGE YOUR OWN</span>
                  <ExternalLink size={11} />
                </span>
              </Link>
            </div>
          </div>

          {/* Dynamic Content Viewport */}
          <AnimatePresence mode="wait">
            {activeTab === 'dna' && (
              <motion.div
                key="dna"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Hero Stat & Executive Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                  <div className="lg:col-span-8 p-6 rounded-xl border border-forge-border bg-forge-navy/80">
                    <span className="section-label text-2xs mb-2 block">CORE HYPOTHESIS & POSITIONING</span>
                    <h4 className="text-lg sm:text-xl font-bold text-forge-white mb-2 leading-snug">
                      High-fidelity acoustic hardware tailored for modern music producers and spatial creators.
                    </h4>
                    <p className="text-xs sm:text-sm text-forge-muted font-light leading-relaxed">
                      Bridging the gap between sterile studio reference monitors and consumer lifestyle headphones with tactile physical dials and custom spatial DSP profiles.
                    </p>
                  </div>
                  <div className="lg:col-span-4 p-6 rounded-xl border border-forge-blue/30 bg-forge-blue/10 flex flex-col justify-between">
                    <div>
                      <span className="text-2xs font-mono text-forge-blue font-bold uppercase tracking-wider block mb-1">
                        STRATEGIC READINESS
                      </span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-4xl font-black text-forge-white">94</span>
                        <span className="text-xs font-mono text-forge-muted">/ 100</span>
                      </div>
                    </div>
                    <div className="w-full bg-forge-navy rounded-full h-2 mt-4 overflow-hidden">
                      <div className="bg-forge-blue h-full rounded-full" style={{ width: '94%' }} />
                    </div>
                    <span className="text-2xs font-mono text-emerald-400 mt-2">HIGH MARKET VIABILITY</span>
                  </div>
                </div>

                {/* 3 Strategic Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
                    <span className="text-2xs font-mono text-forge-muted uppercase block mb-1">TARGET AUDIENCE</span>
                    <h5 className="text-sm font-semibold text-forge-white mb-1">Spatial Audio Creators</h5>
                    <p className="text-2xs text-forge-muted leading-relaxed font-light">
                      Independent electronic artists, game audio engineers, and boutique mixing studios.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
                    <span className="text-2xs font-mono text-forge-muted uppercase block mb-1">MARKET WHITE SPACE</span>
                    <h5 className="text-sm font-semibold text-forge-white mb-1">Tactile Reference Gap</h5>
                    <p className="text-2xs text-forge-muted leading-relaxed font-light">
                      Legacy brands offer bulky studio gear; modern brands offer over-processed consumer sound.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
                    <span className="text-2xs font-mono text-forge-muted uppercase block mb-1">CORE MOAT</span>
                    <h5 className="text-sm font-semibold text-forge-white mb-1">Proprietary DSP Curve</h5>
                    <p className="text-2xs text-forge-muted leading-relaxed font-light">
                      Zero-latency binaural calibration coupled with open architectural SDK integrations.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'brand' && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Visual Specimen Banner */}
                <div className="p-6 sm:p-8 rounded-xl border border-forge-border bg-forge-black relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <span className="section-label text-2xs mb-2 block">EDITORIAL SPECIMEN</span>
                      <h3 className="text-3xl sm:text-5xl font-black text-forge-white tracking-tight uppercase">
                        VELO ACOUSTICS
                      </h3>
                      <p className="text-sm text-forge-blue font-mono mt-1">
                        &quot;SOUND WITH TACTILE PRECISION.&quot;
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xs font-mono text-forge-muted block">TYPOGRAPHY SYSTEM</span>
                      <span className="text-sm font-semibold text-forge-white">Syne Bold + Space Grotesk</span>
                    </div>
                  </div>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Obsidian Void', hex: '#0A0A0F', text: 'white' },
                    { name: 'Signal Blue', hex: '#2563EB', text: 'white' },
                    { name: 'Sonic Frost', hex: '#60A5FA', text: 'black' },
                    { name: 'Chalk White', hex: '#F8F9FA', text: 'black' },
                  ].map(swatch => (
                    <div
                      key={swatch.hex}
                      onClick={() => copyHex(swatch.hex)}
                      className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/70 hover:border-forge-border2 cursor-pointer transition-all group"
                    >
                      <div
                        className="w-full h-14 rounded-lg mb-2.5 border border-white/10 flex items-end justify-end p-1.5"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {copiedHex === swatch.hex ? (
                          <Check size={13} className="text-emerald-400 bg-black/60 rounded p-0.5" />
                        ) : (
                          <Copy size={13} className="text-white/60 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded p-0.5" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-forge-white truncate">{swatch.name}</p>
                      <p className="text-2xs font-mono text-forge-muted">{swatch.hex}</p>
                    </div>
                  ))}
                </div>

                {/* Verbal Voice Principles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <span className="text-2xs font-mono text-emerald-400 uppercase font-bold block mb-1">
                      WHAT WE SOUND LIKE
                    </span>
                    <p className="text-xs text-forge-white font-medium mb-1">Surgical, evocative, unpretentious</p>
                    <p className="text-2xs text-forge-muted font-light leading-relaxed">
                      We celebrate real mechanical craft, low-level signal paths, and pure studio fidelity.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <span className="text-2xs font-mono text-red-400 uppercase font-bold block mb-1">
                      WHAT WE NEVER SAY
                    </span>
                    <p className="text-xs text-forge-white font-medium mb-1">No generic buzzwords, no gaming hyperbole</p>
                    <p className="text-2xs text-forge-muted font-light leading-relaxed">
                      Never use &quot;revolutionary audio experience&quot; or gimmicky bass-boost marketing cliches.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'website' && (
              <motion.div
                key="website"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Browser Simulator Shell */}
                <div className="rounded-xl border border-forge-border bg-forge-black overflow-hidden">
                  <div className="px-4 py-2.5 bg-forge-surface/80 border-b border-forge-border/60 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                    <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                    <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                    <div className="ml-4 px-3 py-1 rounded bg-forge-navy text-2xs font-mono text-forge-muted max-w-xs truncate border border-forge-border/50">
                      https://velo-acoustics.studio
                    </div>
                  </div>

                  {/* Wireframe Hero Mock */}
                  <div className="p-6 sm:p-8 text-center border-b border-forge-border/40">
                    <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue block mb-2">
                      FLAGSHIP REFERENCE SERIES
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black text-forge-white uppercase tracking-tight max-w-lg mx-auto">
                      ACOUSTIC DEPTH UNLOCKED
                    </h4>
                    <p className="text-xs text-forge-muted max-w-md mx-auto mt-2 font-light">
                      Single-scroll digital presence designed to build immediate credibility and conversion.
                    </p>
                    <div className="mt-5 inline-flex gap-2">
                      <span className="px-4 py-1.5 rounded-lg bg-forge-blue text-white text-2xs font-semibold uppercase">
                        PRE-ORDER DROP 01
                      </span>
                      <span className="px-4 py-1.5 rounded-lg border border-forge-border text-forge-muted text-2xs font-semibold uppercase">
                        TECH SPECS
                      </span>
                    </div>
                  </div>

                  {/* 4 Section Architecture Blocks */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 p-4 gap-2 bg-forge-navy/30">
                    {[
                      { num: '01', name: 'Hero Manifesto', target: 'Above Fold' },
                      { num: '02', name: 'Acoustic DSP Proof', target: 'Fidelity Grid' },
                      { num: '03', name: 'Hardware Gallery', target: '360 Dial UX' },
                      { num: '04', name: 'Waitlist Gateway', target: 'Conversion' },
                    ].map(block => (
                      <div key={block.num} className="p-3 rounded-lg border border-forge-border/60 bg-forge-surface/60 text-left">
                        <span className="text-2xs font-mono text-forge-blue font-bold">{block.num}</span>
                        <p className="text-xs font-semibold text-forge-white mt-0.5 truncate">{block.name}</p>
                        <p className="text-2xs font-mono text-forge-muted mt-0.5">{block.target}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Format 1: Carousel Script */}
                <div className="p-5 rounded-xl border border-forge-border bg-forge-navy/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="section-label text-2xs">INSTAGRAM CAROUSEL</span>
                      <span className="text-2xs font-mono text-forge-blue">7 SLIDES</span>
                    </div>
                    <h5 className="text-sm font-bold text-forge-white mb-2">
                      &quot;Why high-end headphones are lying to your ears.&quot;
                    </h5>
                    <p className="text-2xs text-forge-muted font-light leading-relaxed mb-4">
                      Slide breakdown debunking artificial frequency dips with visual EQ comparison charts.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-forge-border/50 flex items-center justify-between text-2xs font-mono text-forge-muted">
                    <span>CALL TO ACTION</span>
                    <span className="text-forge-white font-semibold">SAVE FOR STUDIO</span>
                  </div>
                </div>

                {/* Format 2: TikTok / Reel Hook Script */}
                <div className="p-5 rounded-xl border border-forge-border bg-forge-navy/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="section-label text-2xs">VERTICAL REEL HOOK</span>
                      <span className="text-2xs font-mono text-forge-blue">9:16 FORMAT</span>
                    </div>
                    <h5 className="text-sm font-bold text-forge-white mb-2">
                      &quot;Stop mastering on consumer gear.&quot;
                    </h5>
                    <p className="text-2xs text-forge-muted font-light leading-relaxed mb-4">
                      Opening 3-second camera pan zooming into tactile milled aluminum volume potentiometer.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-forge-border/50 flex items-center justify-between text-2xs font-mono text-forge-muted">
                    <span>EST. RETENTION</span>
                    <span className="text-emerald-400 font-semibold">HIGH VELOCITY</span>
                  </div>
                </div>

                {/* Format 3: X Launch Thread */}
                <div className="p-5 rounded-xl border border-forge-border bg-forge-navy/70 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="section-label text-2xs">X LAUNCH THREAD</span>
                      <span className="text-2xs font-mono text-forge-blue">5 TWEETS</span>
                    </div>
                    <h5 className="text-sm font-bold text-forge-white mb-2">
                      &quot;We spent 18 months solving audio phase cancellation...&quot;
                    </h5>
                    <p className="text-2xs text-forge-muted font-light leading-relaxed mb-4">
                      Behind-the-scenes engineering teardown targeting technical audio enthusiasts.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-forge-border/50 flex items-center justify-between text-2xs font-mono text-forge-muted">
                    <span>LAUNCH OBJECTIVE</span>
                    <span className="text-forge-white font-semibold">FOUNDER CRED</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Phased Roadmap Sequence */}
                {[
                  {
                    phase: 'PHASE 01',
                    name: 'Foundation & Identity Lock',
                    timeline: 'WEEK 1–2',
                    status: 'COMPLETED',
                    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                    items: ['Core Idea DNA validation', 'Brand token typography pairing', 'DSP architectural spec doc'],
                  },
                  {
                    phase: 'PHASE 02',
                    name: 'Private Studio Beta',
                    timeline: 'WEEK 3–5',
                    status: 'ACTIVE NOW',
                    statusColor: 'text-forge-blue bg-forge-blue/10 border-forge-blue/30',
                    items: ['Interactive landing page deployment', 'First 50 producer testing invites', 'Content teaser campaign launch'],
                  },
                  {
                    phase: 'PHASE 03',
                    name: 'Public Drop 01',
                    timeline: 'WEEK 6–8',
                    status: 'PLANNED',
                    statusColor: 'text-forge-muted bg-forge-navy border-forge-border',
                    items: ['Hardware pre-order checkout open', 'Global press & creator kit drop', 'Community discord onboarding'],
                  },
                ].map(phase => (
                  <div key={phase.phase} className="p-4 sm:p-5 rounded-xl border border-forge-border bg-forge-navy/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xs font-mono text-forge-blue font-bold">{phase.phase}</span>
                        <span className={`text-2xs font-mono px-2 py-0.5 rounded border ${phase.statusColor}`}>
                          {phase.status}
                        </span>
                        <span className="text-2xs font-mono text-forge-muted">{phase.timeline}</span>
                      </div>
                      <h5 className="text-sm sm:text-base font-bold text-forge-white">{phase.name}</h5>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {phase.items.map((item, i) => (
                          <span key={i} className="text-2xs font-mono text-forge-muted flex items-center gap-1">
                            <CheckCircle2 size={11} className="text-forge-blue" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-forge-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-forge-muted font-light">
              Ready to generate this level of detail for your own venture?
            </p>
            <Link to="/forge/new">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight size={14} />}
                iconPosition="right"
                className="text-2xs font-semibold tracking-widest uppercase px-6 py-2.5 rounded-lg"
              >
                FORGE YOUR IDEA NOW
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
