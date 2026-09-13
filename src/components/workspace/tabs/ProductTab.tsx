import { useState } from 'react'
import { Check, ArrowRight, Layers, Cpu, ShieldCheck, Zap, SplitSquareVertical } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import type { ProductOutput } from '@/types'

interface ProductTabProps {
  product: ProductOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

const USER_JOURNEY = [
  { step: '01', phase: 'INTAKE', title: 'Concept Ingestion', desc: 'Raw idea input, industry selection, target audience, and primary goal definition.' },
  { step: '02', phase: 'DNA ANALYSIS', title: 'Idea Deconstruction', desc: 'Multi-dimensional analysis uncovering market whitespace, risk parameters, and value positioning.' },
  { step: '03', phase: 'BLUEPRINT', title: 'Multimodal Synthesis', desc: 'Simultaneous generation across 7 creative and digital disciplines without fragmented prompt loops.' },
  { step: '04', phase: 'REFINE', title: 'Editorial Calibration', desc: 'Targeted section refinement with instant visual updates, custom instructions, and version persistence.' },
  { step: '05', phase: 'LAUNCH', title: 'Roadmap Execution', desc: 'Structured tactical checklist with actionable milestones from day 1 teaser to public drop.' },
]

const MVP_SCOPES = [
  {
    tier: 'TIER 01 / ESSENTIAL MVP (V1.0)',
    status: 'INCLUDED IN LAUNCH',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    features: [
      { name: 'Unified Project Workspace', desc: 'Single-dashboard management for all 7 digital launch dimensions.' },
      { name: 'Idea DNA Diagnostic Engine', desc: 'Instant 6-vector analysis identifying clarity, audience, and market angle.' },
      { name: 'Interactive Blueprint Tabs', desc: 'Independent modular editing for Brand, Product, Website, Content, Marketing, and Roadmap.' },
      { name: 'Instant Local State Persistence', desc: 'Automatic client-side saving with zero data loss during active sessions.' },
    ],
  },
  {
    tier: 'TIER 02 / ENHANCED CREATIVE (V1.5)',
    status: 'NEXT SPRINT',
    statusColor: 'text-forge-blue bg-forge-blue/10 border-forge-blue/20',
    features: [
      { name: 'Figma & GitHub Export Handshake', desc: '1-click export of brand color tokens, wireframe hierarchy, and markdown blueprints.' },
      { name: 'Multi-Variant Tone Simulation', desc: 'Preview brand voice across 3 contrasting aesthetics with live comparisons.' },
    ],
  },
  {
    tier: 'TIER 03 / STUDIO COLLABORATION (V2.0)',
    status: 'PLANNED HORIZON',
    statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    features: [
      { name: 'Team Realtime Co-Forging', desc: 'Multi-user collaborative workspace with synchronized commenting and version branching.' },
      { name: 'Custom Studio Fine-Tuned Styles', desc: 'Upload existing agency guidelines to enforce bespoke tonal constraints.' },
    ],
  },
]

export function ProductTab({
  product,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: ProductTabProps) {
  const [activeStep, setActiveStep] = useState<string>('03')

  const productCopy = `PRODUCT ARCHITECTURE BLUEPRINT:
Core Offering: ${product?.coreProduct || 'An integrated creative launch workspace synthesizing brand, product, digital, and go-to-market disciplines.'}
Value Proposition: ${product?.valueProposition || 'Replaces fragmented prompting and disjointed tools with a unified, high-taste digital launch system.'}
User Flow: 5-Stage continuum from Concept Ingestion to Roadmap Execution.
Scope: Tier 1 MVP focuses on structured modular blueprinting, rapid refinement, and persistent state.
Core Differentiator: Structured, actionable launch blueprints with design pedigree over ephemeral text chatbots.`

  return (
    <BlueprintSection
      badge="ARCHITECTURE & SCOPE MATRIX"
      heading="SHAPE THE PRODUCT."
      subheading="Define the core value proposition, technical specifications, user journey, and staged MVP deliverable boundaries."
      copyContent={productCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* 01 / Product Concept & 02 / User Needs                        */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-4 mb-6 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">01 / PRODUCT CONCEPT</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Functional Proposition & Core Scope
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue uppercase">
              SPEC ID: CF-PRD-01
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                CORE CONCEPT DEFINITION
              </span>
              <p className="text-sm font-semibold text-forge-white leading-relaxed">
                {product?.coreProduct || 'A specialized creative intelligence environment converting unstructured ideas into production-ready digital launch plans.'}
              </p>
              <p className="text-xs text-forge-muted font-light leading-relaxed pt-1">
                Built specifically for creators, agencies, and startup founders who reject generic AI chatbots in favor of rigorous, multi-disciplinary craft outputs.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-3xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                VALUE PROPOSITION & ADVANTAGE
              </span>
              <p className="text-sm font-semibold text-forge-white leading-relaxed">
                {product?.valueProposition || 'Cuts concept-to-launch blueprinting time from weeks to minutes while enforcing uncompromising visual and strategic standards.'}
              </p>
              <p className="text-xs text-forge-muted font-light leading-relaxed pt-1">
                Eliminates the friction of juggling 5 separate tools for copywriting, wireframing, moodboarding, and project roadmapping.
              </p>
            </div>
          </div>

          {/* Quick Technical Attribute Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-forge-border/60 text-2xs font-mono">
            <div>
              <span className="text-forge-muted uppercase block text-3xs">INTERACTION MODE</span>
              <span className="text-forge-white font-bold">MULTI-TAB WORKSPACE</span>
            </div>
            <div>
              <span className="text-forge-muted uppercase block text-3xs">PERSISTENCE</span>
              <span className="text-forge-white font-bold">CLIENT LOCAL & FIRESTORE</span>
            </div>
            <div>
              <span className="text-forge-muted uppercase block text-3xs">EXPORT FORMATS</span>
              <span className="text-forge-white font-bold">MARKDOWN / JSON / TOKENS</span>
            </div>
            <div>
              <span className="text-forge-muted uppercase block text-3xs">ESTIMATED LATENCY</span>
              <span className="text-emerald-400 font-bold">REAL-TIME REACTIVE</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 02 / User Needs & 03 / Main Features                         */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* User Needs (5-col) */}
          <div className="lg:col-span-5 rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <p className="section-label mb-1">02 / USER NEEDS</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-4">
                Critical Pain Points Addressed
              </h3>
              <ul className="space-y-3 text-xs text-forge-offwhite/90 font-light leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forge-blue mt-1.5 flex-shrink-0" />
                  <span><strong>Overcoming the blank canvas:</strong> Raw ideas need structured distillation without forcing users into rigid business-school spreadsheets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Multi-disciplinary alignment:</strong> Visual brand, product spec, and marketing narrative must speak the exact same language from day one.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Immediate tactical momentum:</strong> Founders require actionable, concrete steps to test and launch rather than generic AI advice.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-forge-border/60 text-2xs font-mono text-forge-muted">
              USER PROFILE: CREATORS, FOUNDERS & DIGITAL STUDIOS
            </div>
          </div>

          {/* Main Features (7-col) */}
          <div className="lg:col-span-7 rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
            <p className="section-label mb-1">03 / MAIN FEATURES</p>
            <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-4">
              Core Capabilities & Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-forge-border bg-forge-navy/60">
                <h4 className="font-mono font-bold text-forge-white mb-1">Interactive DNA Diagnostic</h4>
                <p className="text-2xs text-forge-muted font-light leading-relaxed">Deconstructs idea clarity, target audience archetype, and market opportunity in seconds.</p>
              </div>
              <div className="p-3 rounded-xl border border-forge-border bg-forge-navy/60">
                <h4 className="font-mono font-bold text-forge-white mb-1">Multimodal Blueprint Engine</h4>
                <p className="text-2xs text-forge-muted font-light leading-relaxed">Simultaneous generation across 7 creative and digital disciplines without fragmented prompt loops.</p>
              </div>
              <div className="p-3 rounded-xl border border-forge-border bg-forge-navy/60">
                <h4 className="font-mono font-bold text-forge-white mb-1">Granular Section Calibration</h4>
                <p className="text-2xs text-forge-muted font-light leading-relaxed">Refine or regenerate specific sections with custom instructions and instant preview updates.</p>
              </div>
              <div className="p-3 rounded-xl border border-forge-border bg-forge-navy/60">
                <h4 className="font-mono font-bold text-forge-white mb-1">Actionable Staged Roadmap</h4>
                <p className="text-2xs text-forge-muted font-light leading-relaxed">Interactive checklist tracking progress from clarification and design through build and launch.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 04 / User Journey                                            */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">04 / USER JOURNEY</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                End-To-End User Journey Continuum
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">
              CLICK STAGE TO INSPECT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {USER_JOURNEY.map(j => {
              const isSelected = activeStep === j.step
              return (
                <button
                  key={j.step}
                  type="button"
                  onClick={() => setActiveStep(j.step)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-forge-blue bg-forge-blue/15 shadow-blue-glow-sm'
                      : 'border-forge-border bg-forge-surface/80 hover:bg-forge-surface'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xs font-mono font-bold text-forge-blue">{j.step}</span>
                    <span className="text-3xs font-mono uppercase text-forge-muted">{j.phase}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider mb-1">
                      {j.title}
                    </h4>
                    <p className="text-3xs text-forge-muted font-light leading-relaxed">
                      {j.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 05 / MVP Feature List                                        */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">05 / MVP FEATURE LIST</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Phased Feature Allocations & MVP Scopes
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">3 HORIZONS DEFINED</span>
          </div>

          <div className="space-y-6">
            {MVP_SCOPES.map(scope => (
              <div key={scope.tier} className="border-b border-forge-border/60 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider font-mono">
                    {scope.tier}
                  </h4>
                  <span className={`text-3xs font-mono uppercase px-2 py-0.5 rounded border ${scope.statusColor}`}>
                    {scope.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {scope.features.map(f => (
                    <div
                      key={f.name}
                      className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/70 flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded bg-forge-blue/15 border border-forge-blue/30 flex items-center justify-center text-forge-blue flex-shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-forge-white">{f.name}</h5>
                        <p className="text-2xs text-forge-muted font-light leading-relaxed mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Differentiator Spotlight: Forge vs Generic Chatbots          */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-blue/30 bg-gradient-to-r from-forge-navy via-forge-surface to-forge-navy p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-forge-blue" />
            <p className="section-label mb-0">COMPETITIVE UNFAIR ADVANTAGE</p>
          </div>
          <h3 className="text-base font-bold text-forge-white uppercase tracking-wider mb-5">
            Why CREAFTIQ FORGE Outperforms Generic LLM Chatbots
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-forge-border/80 bg-forge-black/60 space-y-2">
              <span className="text-3xs font-mono uppercase text-forge-muted font-bold block">
                TYPICAL AI CHAT CONVERSATION
              </span>
              <ul className="space-y-2 text-xs text-forge-muted font-light">
                <li>• Ephemeral wall of unformatted text easily lost in chat history.</li>
                <li>• Inconsistent hallucinated claims without practical execution bounds.</li>
                <li>• Requires the user to master prompt engineering across 20 iterations.</li>
                <li>• Disconnected from wireframes, color codes, and real timelines.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-forge-blue/40 bg-forge-blue/10 space-y-2 shadow-blue-glow-sm">
              <span className="text-3xs font-mono uppercase text-forge-blue font-bold block">
                CREAFTIQ FORGE INTELLIGENT WORKSPACE
              </span>
              <ul className="space-y-2 text-xs text-forge-white font-medium">
                <li>• Structured multi-tab blueprint preserving persistent project context.</li>
                <li>• Verified design tokens with click-to-copy hex swatches & typographic specs.</li>
                <li>• One-click tailored refinement presets (e.g. "More minimal", "Youthful").</li>
                <li>• Interactive tactical roadmap with live task completion tracking.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}

