import { useState } from 'react'
import { Megaphone, Target, Compass, Calendar, CheckSquare, Square, ArrowRight, ShieldCheck } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import type { MarketingOutput } from '@/types'
import toast from 'react-hot-toast'

interface MarketingTabProps {
  marketing: MarketingOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

const GTM_PHASES = [
  {
    phase: 'PHASE 01',
    title: 'Whisper & Private Seed',
    timeframe: 'DAYS 01 – 03',
    intent: 'Seed 25 high-influence design directors with private access keys.',
    tactic: '1-to-1 personal outreach with zero public advertising.',
  },
  {
    phase: 'PHASE 02',
    title: 'The Genesis Drop',
    timeframe: 'DAYS 04 – 06',
    intent: 'Release founding video manifesto and open 100-seat cohort.',
    tactic: 'X case study thread + 9:16 behind-the-scenes video.',
  },
  {
    phase: 'PHASE 03',
    title: 'The Organic Flywheel',
    timeframe: 'DAYS 07+',
    intent: 'Scale organic word-of-mouth via shareable project DNA badges.',
    tactic: 'Weekly curated drops maintaining deliberate scarcity.',
  },
]

const CHANNELS = [
  { name: 'Visual Case Studies (X & IG)', share: '45%', desc: 'Proof-of-work breakdowns showing actual blueprint outputs.' },
  { name: 'Direct VIP Outreach & Email', share: '35%', desc: 'Personal invitations yielding the highest qualified conversion.' },
  { name: 'Creator Co-Marketing & Drops', share: '20%', desc: 'Partnering with trusted designers to forge their concepts publicly.' },
]

const INITIAL_DAY_STEPS = [
  { day: 'DAY 01', task: 'Publish Founding Manifesto & Concept Teaser on X', done: true },
  { day: 'DAY 02', task: 'Distribute Private Beta Access to 25 Target Creators', done: true },
  { day: 'DAY 04', task: 'Release 30s Video Case Study Showing Blueprint Generation', done: false },
  { day: 'DAY 06', task: 'Send Exclusive 24h Early Access Email to Waitlist Members', done: false },
  { day: 'DAY 07', task: 'Open Public Onboarding with Limited Daily Capacity', done: false },
]

export function MarketingTab({
  marketing,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: MarketingTabProps) {
  const [daySteps, setDaySteps] = useState(INITIAL_DAY_STEPS)

  function toggleStep(index: number) {
    setDaySteps(prev => {
      const next = [...prev]
      next[index] = { ...next[index], done: !next[index].done }
      return next
    })
    toast.success('Launch checklist updated.')
  }

  const marketingCopy = `GO-TO-MARKET VECTOR BLUEPRINT:
Core Message: "${marketing?.positioning || 'An intelligent creative workspace transforming chaotic thoughts into bankable launch blueprints.'}"
Strategy: Phased release (Whisper Seed -> Genesis Drop -> Organic Flywheel).
Channel Allocation:
- Visual Case Studies: 45%
- Direct VIP Outreach: 35%
- Creator Co-Marketing: 20%
7-Day Sequence:
${daySteps.map(s => `${s.day}: [${s.done ? 'X' : ' '}] ${s.task}`).join('\n')}
Notice: Local strategic model. Clearly designated as planned recommendation.`

  return (
    <BlueprintSection
      badge="GO-TO-MARKET VECTOR"
      heading="PLAN THE LAUNCH."
      subheading="Suggested acquisition directions, phased campaign sequences, and tactical launch playbooks without misleading conversion claims."
      copyContent={marketingCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* Core Narrative Hero Banner                                   */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-gradient-to-r from-forge-navy via-forge-surface to-forge-navy p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
              CENTRAL LAUNCH MANIFESTO
            </span>
            <span className="text-2xs font-mono text-forge-muted">
              GOAL: HIGH-SIGNAL LAUNCH
            </span>
          </div>

          <blockquote className="text-base sm:text-lg font-medium text-forge-white italic leading-relaxed max-w-3xl mb-4">
            "{marketing?.positioning || 'An intelligent creative workspace transforming raw, chaotic thoughts into bankable launch blueprints.'}"
          </blockquote>

          <div className="flex items-center gap-2 text-2xs font-mono text-forge-muted pt-2 border-t border-forge-border/60">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>AUTHENTIC POSITIONING: FOCUSED ON PROOF-OF-WORK OVER HOLLOW HYPE</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Phased GTM Launch Sequence (3 Horizons)                       */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">STAGED ROLLOUT STRATEGY</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                3-Phase Go-To-Market Sequence
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">
              TIME-BOXED TRAJECTORY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GTM_PHASES.map((p, idx) => (
              <div
                key={p.phase}
                className="p-5 rounded-xl border border-forge-border bg-forge-navy/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-mono font-bold text-forge-blue">{p.phase}</span>
                    <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-surface text-forge-muted">
                      {p.timeframe}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-forge-offwhite/90 font-light leading-relaxed mb-3">
                    {p.intent}
                  </p>
                </div>
                <div className="pt-3 border-t border-forge-border/60 text-3xs font-mono text-forge-muted">
                  TACTIC: {p.tactic}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Channel Allocation Breakdown & Radar                          */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">ACQUISITION CHANNELS</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Effort & Channel Allocation
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue">
              ALLOCATION WEIGHTS
            </span>
          </div>

          <div className="space-y-4">
            {CHANNELS.map(ch => (
              <div key={ch.name} className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-forge-white font-bold">{ch.name}</span>
                  <span className="text-forge-blue font-bold">{ch.share} EFFORT WEIGHT</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-forge-black overflow-hidden">
                  <div className="h-full bg-forge-blue rounded-full" style={{ width: ch.share }} />
                </div>
                <p className="text-2xs text-forge-muted font-light leading-relaxed">
                  {ch.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Interactive 7-Day Launch Checklist                            */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">LAUNCH DAY SCRIPT</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                First 7-Day Tactical Checklist
              </h3>
            </div>
            <span className="text-2xs font-mono text-emerald-400">
              CLICK TO TOGGLE COMPLETION
            </span>
          </div>

          <div className="space-y-2.5">
            {daySteps.map((step, idx) => (
              <button
                key={step.day}
                type="button"
                onClick={() => toggleStep(idx)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-forge-border bg-forge-surface/90 hover:bg-forge-surface text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-forge-blue flex-shrink-0">
                    {step.done ? (
                      <CheckSquare size={16} className="text-emerald-400" />
                    ) : (
                      <Square size={16} className="text-forge-muted group-hover:text-forge-white" />
                    )}
                  </div>
                  <span className="text-2xs font-mono font-bold text-forge-blue bg-forge-navy px-2 py-1 rounded">
                    {step.day}
                  </span>
                  <span
                    className={`text-xs transition-colors ${
                      step.done ? 'text-forge-muted line-through' : 'text-forge-white font-medium'
                    }`}
                  >
                    {step.task}
                  </span>
                </div>
                <span className="text-3xs font-mono text-forge-muted uppercase hidden sm:inline-block">
                  {step.done ? 'COMPLETED' : 'PENDING'}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}

