import { useState } from 'react'
import { SectionCard } from '@/components/workspace/SectionCard'
import { RefineModal } from '@/components/workspace/RefineModal'
import { Badge, SkeletonCard } from '@/components/shared'
import type { MarketingOutput, BlueprintSection } from '@/types'

interface MarketingTabProps {
  marketing: MarketingOutput | null
  loading?: boolean
  onRefine: (section: BlueprintSection, instruction: string) => Promise<void>
  refining?: boolean
}

export function MarketingTab({ marketing, loading = false, onRefine, refining = false }: MarketingTabProps) {
  const [refineOpen, setRefineOpen] = useState(false)

  if (loading || !marketing) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>
  }

  return (
    <div className="space-y-4">
      {/* Target Audience */}
      <SectionCard label="MARKETING" title="Target Audience" onRefine={() => setRefineOpen(true)} copyContent={marketing.targetAudience}>
        <div className="mt-2 p-4 rounded-lg bg-forge-navy border border-forge-border">
          <p className="text-forge-white text-sm leading-relaxed">{marketing.targetAudience}</p>
        </div>
      </SectionCard>

      {/* Positioning */}
      <SectionCard label="MARKETING" title="Positioning Statement" onRefine={() => setRefineOpen(true)} copyContent={marketing.positioning}>
        <div className="mt-2 p-4 rounded-lg bg-forge-blue/10 border border-forge-blue/20">
          <p className="text-forge-white text-sm leading-relaxed italic">"{marketing.positioning}"</p>
        </div>
      </SectionCard>

      {/* Launch Strategy */}
      <SectionCard label="MARKETING" title="Launch Strategy" onRefine={() => setRefineOpen(true)} copyContent={marketing.launchStrategy}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{marketing.launchStrategy}</p>
      </SectionCard>

      {/* Marketing Channels */}
      <SectionCard label="MARKETING" title="Marketing Channels" onRefine={() => setRefineOpen(true)}>
        <div className="space-y-3 pt-2">
          {marketing.channels.map(channel => (
            <div key={channel.name} className="flex items-start gap-3 p-4 rounded-lg bg-forge-navy border border-forge-border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-forge-white text-sm font-semibold">{channel.name}</span>
                  <Badge variant={channel.priority === 'primary' ? 'blue' : 'neutral'}>
                    {channel.priority}
                  </Badge>
                </div>
                <p className="text-forge-muted text-xs leading-relaxed">{channel.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Campaign Concepts */}
      <SectionCard label="MARKETING" title="Campaign Concepts" onRefine={() => setRefineOpen(true)}>
        <div className="space-y-4 pt-2">
          {marketing.campaignConcepts.map(campaign => (
            <div key={campaign.name} className="p-4 rounded-lg bg-forge-navy border border-forge-border">
              <h4 className="text-forge-white text-sm font-semibold mb-1">{campaign.name}</h4>
              <p className="text-forge-blue/80 text-xs font-medium mb-2 italic">"{campaign.hook}"</p>
              <p className="text-forge-muted text-xs leading-relaxed mb-3">{campaign.concept}</p>
              <div className="flex flex-wrap gap-1.5">
                {campaign.channels.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border text-forge-muted text-xs">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Action Plan */}
      <SectionCard label="MARKETING" title="Initial Action Plan" onRefine={() => setRefineOpen(true)}>
        <ol className="space-y-3 pt-2">
          {marketing.initialActionPlan.map((action, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-forge-blue/20 border border-forge-blue/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-forge-blue text-xs font-bold">{i + 1}</span>
              </div>
              <span className="text-forge-white text-sm pt-0.5">{action}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      <RefineModal open={refineOpen} onClose={() => setRefineOpen(false)} section="marketing"
        onRefine={async (ins) => { await onRefine('marketing', ins); setRefineOpen(false) }} loading={refining} />
    </div>
  )
}
