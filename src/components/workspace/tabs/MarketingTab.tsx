import { Megaphone, Target, Compass, Calendar } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import { InsightCard } from '../InsightCard'
import type { MarketingOutput } from '@/types'

interface MarketingTabProps {
  marketing: MarketingOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function MarketingTab({
  marketing,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: MarketingTabProps) {
  const marketingCopy = `MARKETING LAUNCH PLAN:
Main Message: Turn a raw idea into a clear creative and digital launch plan.
Suggested Channels: Visual Storytelling (Instagram/X), Direct VIP Email, Long-form Case Studies.
Launch Campaign: "Blueprint Zero" free audit and cohort sprint.
First 7-Day Plan: Day 1 Announcement, Day 3 Early Access Keys, Day 7 Public Drop.`

  return (
    <BlueprintSection
      badge="GO-TO-MARKET VECTOR"
      heading="PLAN THE LAUNCH."
      subheading="Suggested acquisition directions, organic narratives, and tactical launch sequences. Clearly labeled as recommendations without fake conversion metrics."
      copyContent={marketingCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-6">
        
        {/* Core Message & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="01 / CORE MESSAGE" title="Main Message & Narrative" highlight>
            <p className="text-forge-white text-xs leading-relaxed italic">
              "{marketing?.positioning || 'An intelligent creative workspace transforming chaotic thoughts into bankable launch blueprints.'}"
            </p>
          </InsightCard>

          <InsightCard label="02 / ACQUISITION CHANNELS" title="Suggested Channels">
            <div className="space-y-2 text-xs text-forge-white">
              <p>• <span className="font-semibold">Instagram & X:</span> High-contrast visual case studies & carousel breakdowns.</p>
              <p>• <span className="font-semibold">Owned Email VIP:</span> Direct invitations delivering consistent conversion.</p>
              <p>• <span className="font-semibold">YouTube:</span> Long-form teardowns demonstrating creative workflow depth.</p>
            </div>
          </InsightCard>
        </div>

        {/* Organic vs Paid Directions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="03 / ORGANIC DIRECTION" title="Organic Marketing Strategy">
            <p className="text-forge-muted text-xs leading-relaxed font-light">
              Focus on <span className="text-forge-white font-medium">proof-of-work marketing</span>: show real project blueprints, publish teardowns of famous brands, and empower early ambassadors to share their results.
            </p>
          </InsightCard>

          <InsightCard label="04 / PAID DIRECTION" title="Paid Marketing Strategy">
            <p className="text-forge-muted text-xs leading-relaxed font-light">
              Targeted creative director & founder lookalikes. Drive traffic to a high-converting interactive audit rather than cold product homepages.
            </p>
          </InsightCard>
        </div>

        {/* First 7-Day Action Plan */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label mb-1">EXECUTION PLAYBOOK</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                First 7-Day Launch Action Plan
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue uppercase">SUGGESTED SEQUENCE</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {[
              { day: 'DAY 01', title: 'Publish Founding Manifesto & Concept Teaser', note: 'Establish vision and open waitlist registration.' },
              { day: 'DAY 02', title: 'Distribute Private Beta Access to 25 Target Creators', note: 'Gather direct quotes and immediate feedback.' },
              { day: 'DAY 04', title: 'Release Video Case Study Showing Blueprint Generation', note: 'Demonstrate real workflow capabilities.' },
              { day: 'DAY 06', title: 'Send Exclusive 24h Early Access Email to Waitlist', note: 'Reward early supporters before general release.' },
              { day: 'DAY 07', title: 'Open Public Onboarding with Limited Daily Capacity', note: 'Maintain server headroom and high craft standards.' },
            ].map(step => (
              <div key={step.day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-forge-border bg-forge-navy/80 gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xs font-mono font-bold text-forge-blue bg-forge-blue/10 px-2 py-1 rounded">
                    {step.day}
                  </span>
                  <span className="text-xs font-semibold text-forge-white">{step.title}</span>
                </div>
                <span className="text-2xs text-forge-muted font-light">{step.note}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}
