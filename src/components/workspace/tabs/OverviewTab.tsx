import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import { InsightCard } from '../InsightCard'
import type { IdeaDNA } from '@/types'

const JOURNEY_STAGES = [
  { id: 'idea',     label: 'IDEA',     status: 'complete' },
  { id: 'brand',    label: 'BRAND',    status: 'current'  },
  { id: 'product',  label: 'PRODUCT',  status: 'upcoming' },
  { id: 'website',  label: 'WEBSITE',  status: 'upcoming' },
  { id: 'content',  label: 'CONTENT',  status: 'upcoming' },
  { id: 'launch',   label: 'LAUNCH',   status: 'upcoming' },
] as const

interface OverviewTabProps {
  projectName: string
  idea: string
  ideaDna: IdeaDNA | null
  onNavigateTab: (tab: string) => void
  onRefine: () => void
  onRegenerate: () => void
}

export function OverviewTab({
  projectName,
  idea,
  ideaDna,
  onNavigateTab,
  onRefine,
  onRegenerate,
}: OverviewTabProps) {
  const summaryCopy = `PROJECT OVERVIEW: ${projectName}
Core Idea: ${idea}
Target Audience: ${ideaDna?.audience || 'Under analysis'}
Main Opportunity: ${ideaDna?.opportunity || 'Under analysis'}
Suggested Direction: ${ideaDna?.direction || 'Under analysis'}`

  return (
    <div className="space-y-10">
      <BlueprintSection
        badge="STUDIO EXECUTIVE OVERVIEW"
        heading="YOUR IDEA, READY TO TAKE SHAPE."
        subheading="A high-level synthesis of your concept and where it is heading across creative and digital dimensions."
        copyContent={summaryCopy}
        onRefine={onRefine}
        onRegenerate={onRegenerate}
      >
        {/* Progress-style journey without fake percentages */}
        <div className="rounded-2xl border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xs font-mono uppercase tracking-widest text-forge-muted">
              FORGE PROGRESSION JOURNEY
            </span>
            <span className="text-2xs font-mono text-forge-blue">
              CURRENT PHASE: BRAND & STRATEGY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {JOURNEY_STAGES.map((s, idx) => {
              const isDone = s.status === 'complete'
              const isCurrent = s.status === 'current'
              return (
                <div
                  key={s.id}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
                    isCurrent
                      ? 'border-forge-blue/60 bg-forge-blue/10 shadow-blue-glow-sm'
                      : isDone
                      ? 'border-forge-border bg-forge-navy/60 opacity-80'
                      : 'border-forge-border/40 bg-forge-navy/30 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-mono font-bold">0{idx + 1}</span>
                    {isDone && <CheckCircle2 size={13} className="text-emerald-400" />}
                    {isCurrent && <Clock size={13} className="text-forge-blue animate-pulse" />}
                    {s.status === 'upcoming' && <Circle size={10} className="text-forge-muted" />}
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-forge-white">
                    {s.label}
                  </span>
                  <span className="text-3xs font-mono text-forge-muted uppercase mt-1">
                    {isDone ? 'COMPLETED' : isCurrent ? 'ACTIVE' : 'UPCOMING'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard
            label="01 / CORE VISION"
            title="Core Idea"
            highlight
          >
            <p className="text-forge-white font-medium text-sm leading-relaxed mb-2">
              {projectName}
            </p>
            <p className="text-forge-muted text-xs leading-relaxed">
              {idea}
            </p>
          </InsightCard>

          <InsightCard
            label="02 / RESONANCE"
            title="Target Audience"
          >
            <p className="text-forge-white text-xs leading-relaxed">
              {ideaDna?.audience || 'Digitally-native consumers and community builders seeking authentic cultural touchpoints.'}
            </p>
          </InsightCard>

          <InsightCard
            label="03 / ADVANTAGE"
            title="Main Opportunity"
          >
            <p className="text-forge-white text-xs leading-relaxed">
              {ideaDna?.opportunity || 'Whitespace exists for a design-forward, narrative-driven product that speaks directly to underserved lifestyle preferences.'}
            </p>
          </InsightCard>

          <InsightCard
            label="04 / TRAJECTORY"
            title="Suggested Direction"
          >
            <p className="text-forge-white text-xs leading-relaxed">
              {ideaDna?.direction || 'Single-scroll editorial web presence, curated launch drops, and high-signal community engagement.'}
            </p>
          </InsightCard>
        </div>
      </BlueprintSection>
    </div>
  )
}
