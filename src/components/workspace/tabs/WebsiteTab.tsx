import { useState } from 'react'
import { SectionCard } from '@/components/workspace/SectionCard'
import { RefineModal } from '@/components/workspace/RefineModal'
import { SkeletonCard } from '@/components/shared'
import type { WebsiteOutput, BlueprintSection } from '@/types'

interface WebsiteTabProps {
  website: WebsiteOutput | null
  loading?: boolean
  onRefine: (section: BlueprintSection, instruction: string) => Promise<void>
  refining?: boolean
}

export function WebsiteTab({ website, loading = false, onRefine, refining = false }: WebsiteTabProps) {
  const [refineOpen, setRefineOpen] = useState(false)

  if (loading || !website) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>
  }

  return (
    <div className="space-y-4">
      {/* Structure */}
      <SectionCard label="WEBSITE" title="Website Structure" onRefine={() => setRefineOpen(true)} copyContent={website.structure}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{website.structure}</p>
      </SectionCard>

      {/* Pages */}
      <SectionCard label="WEBSITE" title="Pages" onRefine={() => setRefineOpen(true)}>
        <div className="space-y-3 pt-2">
          {website.pages.map((page) => (
            <div key={page.name} className="p-4 rounded-lg bg-forge-navy border border-forge-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-forge-white text-sm font-semibold">{page.name}</span>
                <span className="text-forge-muted text-xs">{page.sections.length} sections</span>
              </div>
              <p className="text-forge-muted text-xs mb-2">{page.purpose}</p>
              <div className="flex flex-wrap gap-1.5">
                {page.sections.map(section => (
                  <span key={section} className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border text-forge-muted text-xs">
                    {section}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Homepage Sections */}
      <SectionCard label="WEBSITE" title="Homepage Sections" onRefine={() => setRefineOpen(true)}>
        <ol className="space-y-2 pt-2">
          {website.homepageSections.map((section, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-forge-blue/60 text-xs font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-forge-white text-sm">{section}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Navigation */}
      <SectionCard label="WEBSITE" title="Navigation" onRefine={() => setRefineOpen(true)}>
        <div className="flex flex-wrap gap-2 pt-2">
          {website.navigation.map(item => (
            <span key={item} className="px-3 py-1.5 rounded-lg bg-forge-navy border border-forge-border text-forge-white text-xs font-medium">
              {item}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* CTA Strategy */}
      <SectionCard label="WEBSITE" title="CTA Strategy" onRefine={() => setRefineOpen(true)} copyContent={website.ctaStrategy}>
        <div className="mt-2 p-4 rounded-lg bg-forge-blue/10 border border-forge-blue/20">
          <p className="text-forge-white text-sm leading-relaxed">{website.ctaStrategy}</p>
        </div>
      </SectionCard>

      {/* UX Direction */}
      <SectionCard label="WEBSITE" title="UX Direction" onRefine={() => setRefineOpen(true)} copyContent={website.uxDirection}>
        <p className="text-forge-white text-sm leading-relaxed pt-2">{website.uxDirection}</p>
      </SectionCard>

      <RefineModal open={refineOpen} onClose={() => setRefineOpen(false)} section="website"
        onRefine={async (ins) => { await onRefine('website', ins); setRefineOpen(false) }} loading={refining} />
    </div>
  )
}
