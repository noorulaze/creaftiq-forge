import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Palette,
  Layers,
  Globe,
  Film,
  Megaphone,
  Milestone,
  Sparkles,
  Info,
  Compass,
  Target,
  Zap,
} from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import type { IdeaDNA } from '@/types'

const JOURNEY_STAGES = [
  { id: 'idea',     num: '01', label: 'IDEA DNA',  status: 'complete', tab: 'overview'          },
  { id: 'brand',    num: '02', label: 'BRAND',     status: 'complete', tab: 'brand'             },
  { id: 'product',  num: '03', label: 'PRODUCT',   status: 'current',  tab: 'product'           },
  { id: 'website',  num: '04', label: 'WEBSITE',   status: 'upcoming', tab: 'website'           },
  { id: 'content',  num: '05', label: 'CONTENT',   status: 'upcoming', tab: 'content'           },
  { id: 'marketing',num: '06', label: 'MARKETING', status: 'upcoming', tab: 'marketing'         },
  { id: 'roadmap',  num: '07', label: 'ROADMAP',   status: 'upcoming', tab: 'roadmap'           },
] as const

const EXPLORE_AREAS = [
  {
    tab: 'brand',
    title: 'Brand Identity',
    desc: 'Visual vocabulary, color tokens, and tonal posture.',
    icon: Palette,
    accent: 'border-forge-blue/30 hover:border-forge-blue',
  },
  {
    tab: 'product',
    title: 'Product Scope',
    desc: 'MVP architecture, user journeys, and core differentiators.',
    icon: Layers,
    accent: 'border-emerald-500/30 hover:border-emerald-500',
  },
  {
    tab: 'website',
    title: 'Digital Experience',
    desc: 'Page wireframes, narrative flow, and responsive specs.',
    icon: Globe,
    accent: 'border-cyan-500/30 hover:border-cyan-500',
  },
  {
    tab: 'content',
    title: 'Content System',
    desc: 'Editorial pillars, short video scripts, and cadence.',
    icon: Film,
    accent: 'border-purple-500/30 hover:border-purple-500',
  },
  {
    tab: 'marketing',
    title: 'Launch Vector',
    desc: 'Acquisition strategy, early access drops, and 7-day plan.',
    icon: Megaphone,
    accent: 'border-amber-500/30 hover:border-amber-500',
  },
  {
    tab: 'creativeDirection',
    title: 'Creative World',
    desc: 'Atmospheric mood, tactile aesthetics, and palette.',
    icon: Sparkles,
    accent: 'border-indigo-500/30 hover:border-indigo-500',
  },
]

interface OverviewTabProps {
  projectName: string
  idea: string
  ideaDna: IdeaDNA | null
  onNavigateTab: (tab: string) => void
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function OverviewTab({
  projectName,
  idea,
  ideaDna,
  onNavigateTab,
  onRefine,
  onRegenerate,
  onSave,
}: OverviewTabProps) {
  const summaryCopy = `PROJECT EXECUTIVE OVERVIEW: ${projectName}
Core Concept: ${idea}
Target Audience: ${ideaDna?.audience || 'Digital-first creators and lifestyle consumers'}
Market Whitespace: ${ideaDna?.opportunity || 'Underserved whitespace for a design-led, premium launch experience'}
Strategic Direction: ${ideaDna?.direction || 'Single-scroll editorial web presence, curated launch drops, and high-signal community engagement'}
Mode: Local Prototype Synthesis`

  return (
    <div className="space-y-10">
      <BlueprintSection
        badge="STUDIO EXECUTIVE SYNTHESIS"
        heading="YOUR IDEA, READY TO TAKE SHAPE."
        subheading="An overarching executive summary synthesizing your concept, strategic position, and tactical launch pathways."
        copyContent={summaryCopy}
        onRefine={onRefine}
        onRegenerate={onRegenerate}
        onSave={onSave}
      >
        {/* ============================================================ */}
        {/* Local Mock Notice Banner                                      */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-xl border border-forge-blue/20 bg-forge-navy/60 backdrop-blur-md mb-8">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-forge-blue flex-shrink-0" />
            <span className="text-2xs font-mono uppercase tracking-wider text-forge-muted">
              <span className="text-forge-white font-semibold">LOCAL PROTOTYPE MODE</span> • Generative strategy synthesised locally for exploration before live AI model link.
            </span>
          </div>
          <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-blue/10 text-forge-blue border border-forge-blue/20">
            OFFLINE READY
          </span>
        </div>

        {/* ============================================================ */}
        {/* Executive Hero Banner                                        */}
        {/* ============================================================ */}
        <div className="relative rounded-2xl border border-forge-border bg-gradient-to-br from-forge-navy via-forge-surface to-forge-black p-6 sm:p-8 overflow-hidden mb-8 shadow-2xl">
          {/* Subtle atmospheric glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-forge-blue/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                CONCEPT STATEMENT
              </span>
              <span className="text-2xs font-mono text-forge-muted">
                PROJECT ID: #{projectName ? projectName.toLowerCase().replace(/\s+/g, '-') : 'forge-alpha'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-forge-white tracking-tight uppercase leading-snug">
              {projectName || 'The Next Frontier'}
            </h2>

            <p className="text-sm sm:text-base text-forge-offwhite/90 font-light leading-relaxed max-w-3xl border-l-2 border-forge-blue pl-4">
              "{idea || 'A transformative digital product engineered to replace fragmented workflows with unified creative intelligence.'}"
            </p>

            {/* Quick Vitals Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-forge-border/60">
              <div>
                <p className="text-3xs font-mono uppercase text-forge-muted tracking-wider">ESTIMATED MVP</p>
                <p className="text-xs sm:text-sm font-bold text-forge-white mt-0.5">4-6 SPRINT WEEKS</p>
              </div>
              <div>
                <p className="text-3xs font-mono uppercase text-forge-muted tracking-wider">STRATEGIC FOCUS</p>
                <p className="text-xs sm:text-sm font-bold text-forge-white mt-0.5">HIGH CRAFT & DESIGN</p>
              </div>
              <div>
                <p className="text-3xs font-mono uppercase text-forge-muted tracking-wider">BLUEPRINT DISCIPLINES</p>
                <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">7 DOMAINS LOCKED</p>
              </div>
              <div>
                <p className="text-3xs font-mono uppercase text-forge-muted tracking-wider">READINESS AUDIT</p>
                <p className="text-xs sm:text-sm font-bold text-forge-blue mt-0.5">STRONG LAUNCH VIABILITY</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Progression Journey Flow (No Fake Percentages)              */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface/90 backdrop-blur-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-0.5">FORGE PROGRESSION PIPELINE</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                Current Execution Phase
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
              PHASE 03: PRODUCT & DIGITAL ARCHITECTURE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {JOURNEY_STAGES.map((s) => {
              const isDone = s.status === 'complete'
              const isCurrent = s.status === 'current'
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onNavigateTab(s.tab)}
                  className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all hover:scale-[1.02] ${
                    isCurrent
                      ? 'border-forge-blue/80 bg-forge-blue/15 shadow-blue-glow-sm'
                      : isDone
                      ? 'border-forge-border bg-forge-navy/80 hover:bg-forge-navy'
                      : 'border-forge-border/40 bg-forge-navy/30 hover:bg-forge-navy/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xs font-mono font-bold text-forge-muted">{s.num}</span>
                    {isDone && <CheckCircle2 size={13} className="text-emerald-400" />}
                    {isCurrent && <Clock size={13} className="text-forge-blue animate-pulse" />}
                    {s.status === 'upcoming' && <Circle size={9} className="text-forge-muted" />}
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-forge-white truncate">
                    {s.label}
                  </span>
                  <span className="text-3xs font-mono text-forge-muted uppercase mt-1">
                    {isDone ? 'COMPLETED' : isCurrent ? 'ACTIVE' : 'UPCOMING'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Core Strategic Blueprint Cards (All 7 Fields Covered)        */}
        {/* ============================================================ */}
        <div className="space-y-5 mb-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* 1. Core Idea (7-col) */}
            <div className="lg:col-span-7 rounded-2xl border border-forge-blue/40 bg-forge-navy/90 p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-blue-glow-sm">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-forge-blue" />
                  <p className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                    01 / CORE IDEA
                  </p>
                </div>
                <h3 className="text-lg font-bold text-forge-white tracking-tight mb-2">
                  What You Are Building
                </h3>
                <p className="text-xs sm:text-sm text-forge-offwhite/90 font-light leading-relaxed mb-4">
                  {idea || 'A distinctive multi-faceted digital launch experience designed for ambitious creators.'}
                </p>
              </div>

              <div className="pt-4 border-t border-forge-border/60 flex items-center justify-between flex-wrap gap-2 text-2xs font-mono text-forge-muted">
                <span>CATEGORY: DIGITAL PLATFORM</span>
                <button
                  onClick={() => onNavigateTab('product')}
                  className="inline-flex items-center gap-1 text-forge-blue hover:text-forge-blue-light transition-colors"
                >
                  <span>Explore Product Scope</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

            {/* 2. Target Audience (5-col) */}
            <div className="lg:col-span-5 rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <p className="text-2xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    02 / TARGET AUDIENCE
                  </p>
                </div>
                <h3 className="text-base font-bold text-forge-white tracking-tight mb-2">
                  Who It Is For
                </h3>
                <p className="text-xs text-forge-muted font-light leading-relaxed mb-4">
                  {ideaDna?.audience || 'Digital founders, creative technologists, independent designers, and forward-looking studios.'}
                </p>
              </div>

              <div className="pt-4 border-t border-forge-border/60 flex flex-wrap gap-1.5">
                {['Primary Adopters', 'Design Community', 'Early Enthusiasts'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-forge-navy border border-forge-border text-3xs font-mono text-forge-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 3. Problem */}
            <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <p className="text-2xs font-mono uppercase tracking-widest text-red-400 font-bold">
                    03 / THE PROBLEM
                  </p>
                </div>
                <h3 className="text-base font-bold text-forge-white tracking-tight mb-2">
                  Need & Friction Point
                </h3>
                <p className="text-xs sm:text-sm text-forge-muted font-light leading-relaxed mb-4">
                  {ideaDna?.problem || 'Most creators and founders face fragmented workflows, relying on disconnected tools for design, copywriting, strategy, and engineering with no coherent single source of truth.'}
                </p>
              </div>

              <div className="pt-4 border-t border-forge-border/60 text-2xs font-mono text-forge-muted">
                IMPACT: REDUCES TIME-TO-MARKET FRICTION AND CREATIVE SCATTER
              </div>
            </div>

            {/* 4. Opportunity */}
            <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-2xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                    04 / THE OPPORTUNITY
                  </p>
                </div>
                <h3 className="text-base font-bold text-forge-white tracking-tight mb-2">
                  Market Whitespace & Value
                </h3>
                <p className="text-xs sm:text-sm text-forge-muted font-light leading-relaxed mb-4">
                  {ideaDna?.opportunity || 'Enormous demand exists for a design-forward workspace that synthesizes high-taste aesthetics with concrete digital launch assets, moving beyond generic AI chatbot responses.'}
                </p>
              </div>

              <div className="pt-4 border-t border-forge-border/60 text-2xs font-mono text-emerald-400">
                TIMING: FIRST-MOVER ADVANTAGE IN CRAFT-LED CREATIVE AI
              </div>
            </div>
          </div>

          {/* 5. Unique Angle (Full Width) */}
          <div className="rounded-2xl border border-forge-blue/30 bg-gradient-to-r from-forge-navy via-forge-surface to-forge-navy p-6 sm:p-7 flex flex-col justify-between shadow-blue-glow-sm">
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
                  <p className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                    05 / UNIQUE ANGLE & UNFAIR ADVANTAGE
                  </p>
                </div>
                <span className="text-3xs font-mono text-forge-muted uppercase">
                  DEVIATION FROM THE HERD
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-forge-white tracking-tight mb-2">
                What Makes This Idea Uniquely Defensible
              </h3>
              <p className="text-xs sm:text-sm text-forge-offwhite/90 font-light leading-relaxed mb-4 max-w-4xl">
                {ideaDna?.direction || 'A cohesive editorial design posture paired with turnkey execution tokens across 7 disciplines. Rather than giving vague conversational recommendations, it produces actionable blueprints and production-ready digital specs.'}
              </p>
            </div>

            <div className="pt-4 border-t border-forge-border/60 flex items-center justify-between flex-wrap gap-2 text-2xs font-mono text-forge-muted">
              <span>DIFFERENTIATOR: CRAFT OVER COMMODITIZED TEXT</span>
              <button
                onClick={() => onNavigateTab('brand')}
                className="inline-flex items-center gap-1 text-forge-blue hover:text-forge-blue-light transition-colors"
              >
                <span>Review Brand Positioning</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* 6. Short Project Summary */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface/80 p-6 sm:p-7">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-forge-muted font-bold">
                06 / SHORT PROJECT SUMMARY
              </span>
              <span className="text-3xs font-mono text-forge-blue uppercase">
                EXECUTIVE SYNTHESIS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-forge-white/90 font-light leading-relaxed">
              <strong className="text-forge-white font-semibold">{projectName || 'The Project'}</strong> is conceived to solve the challenge of turning fragmented thoughts into a high-caliber digital reality. By addressing the needs of {ideaDna?.audience || 'ambitious creators'} with a disciplined craft-first methodology, this blueprint unites brand, product scope, web presence, and staged go-to-market execution into one single workspace.
            </p>
          </div>

        </div>

        {/* ============================================================ */}
        {/* Explore Blueprint Disciplines Grid (Interactive Jump Cards)  */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/60 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-label mb-1">DEEP-DIVE DIRECTORY</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Explore Blueprint Domains
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">SELECT TO JUMP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {EXPLORE_AREAS.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => onNavigateTab(item.tab)}
                  className={`p-4 rounded-xl border bg-forge-surface/90 hover:bg-forge-surface transition-all text-left group flex items-start justify-between gap-3 ${item.accent}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className="text-forge-blue group-hover:scale-110 transition-transform" />
                      <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider group-hover:text-forge-blue transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-2xs text-forge-muted font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight size={13} className="text-forge-muted group-hover:text-forge-white group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                </button>
              )
            })}
          </div>
        </div>

      </BlueprintSection>
    </div>
  )
}
