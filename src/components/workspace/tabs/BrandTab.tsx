import { useState } from 'react'
import { SectionCard } from '@/components/workspace/SectionCard'
import { RefineModal } from '@/components/workspace/RefineModal'
import { Badge, SkeletonCard } from '@/components/shared'
import type { BrandOutput, BlueprintSection } from '@/types'

interface BrandTabProps {
  brand: BrandOutput | null
  loading?: boolean
  onRefine: (section: BlueprintSection, instruction: string) => Promise<void>
  refining?: boolean
}

export function BrandTab({ brand, loading = false, onRefine, refining = false }: BrandTabProps) {
  const [refineOpen, setRefineOpen] = useState(false)
  const [refineTarget, setRefineTarget] = useState<BlueprintSection>('brand')

  if (loading || !brand) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
      </div>
    )
  }

  function openRefine(section: BlueprintSection) {
    setRefineTarget(section)
    setRefineOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Name Direction */}
      <SectionCard
        label="BRAND"
        title="Name Direction"
        onRefine={() => openRefine('brand')}
        copyContent={brand.nameDirection.join(', ')}
      >
        <div className="flex flex-wrap gap-2 pt-2">
          {brand.nameDirection.map((name) => (
            <span key={name} className="px-4 py-2 rounded-full border border-forge-border bg-forge-navy text-forge-white text-sm font-medium hover:border-forge-blue/40 transition-colors cursor-default">
              {name}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Tagline Ideas */}
      <SectionCard label="BRAND" title="Tagline Ideas" onRefine={() => openRefine('brand')} copyContent={brand.taglineIdeas.join('\n')}>
        <div className="space-y-3 pt-2">
          {brand.taglineIdeas.map((tagline) => (
            <div key={tagline} className="flex items-center gap-3 p-3 rounded-lg bg-forge-navy border border-forge-border group">
              <span className="text-forge-blue/60 text-sm font-mono">"</span>
              <p className="text-forge-white text-sm flex-1 italic">{tagline}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Brand Personality */}
      <SectionCard label="BRAND" title="Brand Personality" onRefine={() => openRefine('brand')} copyContent={brand.brandPersonality}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{brand.brandPersonality}</p>
      </SectionCard>

      {/* Positioning */}
      <SectionCard label="BRAND" title="Positioning" onRefine={() => openRefine('brand')} copyContent={brand.positioning}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{brand.positioning}</p>
      </SectionCard>

      {/* Visual Direction */}
      <SectionCard label="BRAND" title="Visual Direction" onRefine={() => openRefine('brand')} copyContent={brand.visualDirection}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{brand.visualDirection}</p>
      </SectionCard>

      {/* Color Direction */}
      <SectionCard label="BRAND" title="Color Direction" onRefine={() => openRefine('brand')}>
        <div className="pt-2 space-y-3">
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Primary', color: brand.colorDirection.primary },
              { label: 'Secondary', color: brand.colorDirection.secondary },
              { label: 'Accent', color: brand.colorDirection.accent },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-forge-navy border border-forge-border">
                <div className="w-4 h-4 rounded-full border border-forge-border" style={{ background: color }} />
                <span className="text-xs text-forge-muted">{label}:</span>
                <span className="text-xs text-forge-white font-mono">{color}</span>
              </div>
            ))}
          </div>
          <p className="text-forge-muted text-sm leading-relaxed">{brand.colorDirection.rationale}</p>
        </div>
      </SectionCard>

      {/* Typography */}
      <SectionCard label="BRAND" title="Typography Direction" onRefine={() => openRefine('brand')} copyContent={brand.typographyDirection}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{brand.typographyDirection}</p>
      </SectionCard>

      <RefineModal
        open={refineOpen}
        onClose={() => setRefineOpen(false)}
        section={refineTarget}
        onRefine={async (instruction) => { await onRefine(refineTarget, instruction); setRefineOpen(false) }}
        loading={refining}
      />
    </div>
  )
}
