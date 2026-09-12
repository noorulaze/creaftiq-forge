import { useState } from 'react'
import { SectionCard } from '@/components/workspace/SectionCard'
import { RefineModal } from '@/components/workspace/RefineModal'
import { SkeletonCard } from '@/components/shared'
import type { ContentOutput, ContentPlatform, BlueprintSection } from '@/types'
import { useForgeStore } from '@/store/useForgeStore'
import { cn } from '@/utils/cn'
import { Instagram, Youtube, Linkedin, Globe, Megaphone } from 'lucide-react'

const PLATFORM_META: Record<ContentPlatform, { label: string; Icon: React.ElementType; color: string }> = {
  instagram: { label: 'Instagram', Icon: Instagram, color: '#E1306C' },
  youtube:   { label: 'YouTube',   Icon: Youtube,   color: '#FF0000' },
  linkedin:  { label: 'LinkedIn',  Icon: Linkedin,  color: '#0077B5' },
  website:   { label: 'Website',   Icon: Globe,     color: '#2563EB' },
  ads:       { label: 'Ads',       Icon: Megaphone, color: '#F59E0B' },
}

const ALL_PLATFORMS: ContentPlatform[] = ['instagram', 'youtube', 'linkedin', 'website', 'ads']

interface ContentTabProps {
  content: ContentOutput | null
  loading?: boolean
  onRefine: (section: BlueprintSection, instruction: string) => Promise<void>
  refining?: boolean
}

export function ContentTab({ content, loading = false, onRefine, refining = false }: ContentTabProps) {
  const { selectedPlatforms, setSelectedPlatforms } = useForgeStore()
  const [refineOpen, setRefineOpen] = useState(false)

  function togglePlatform(p: ContentPlatform) {
    setSelectedPlatforms(
      selectedPlatforms.includes(p)
        ? selectedPlatforms.filter(x => x !== p)
        : [...selectedPlatforms, p],
    )
  }

  if (loading || !content) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>
  }

  const filteredPosts = content.postIdeas.filter(p => selectedPlatforms.includes(p.platform))

  return (
    <div className="space-y-4">
      {/* Platform selector */}
      <div className="rounded-xl border border-forge-border bg-forge-surface p-5">
        <p className="section-label mb-3">SELECT PLATFORMS</p>
        <div className="flex flex-wrap gap-2">
          {ALL_PLATFORMS.map(platform => {
            const { label, Icon, color } = PLATFORM_META[platform]
            const active = selectedPlatforms.includes(platform)
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150',
                  active
                    ? 'border-transparent text-white'
                    : 'border-forge-border bg-forge-navy text-forge-muted hover:text-forge-white hover:border-forge-border2',
                )}
                style={active ? { background: color + '22', borderColor: color + '44', color: color } : {}}
              >
                <Icon size={13} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Pillars */}
      <SectionCard label="CONTENT" title="Content Pillars" onRefine={() => setRefineOpen(true)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {content.contentPillars.map(pillar => (
            <div key={pillar.name} className="p-4 rounded-lg bg-forge-navy border border-forge-border">
              <h4 className="text-forge-white text-sm font-semibold mb-1">{pillar.name}</h4>
              <p className="text-forge-muted text-xs mb-3 leading-relaxed">{pillar.description}</p>
              <div className="space-y-1">
                {pillar.examples.map(ex => (
                  <p key={ex} className="text-forge-muted/70 text-xs">• {ex}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Post Ideas */}
      {filteredPosts.length > 0 && (
        <SectionCard label="CONTENT" title="Post Ideas" onRefine={() => setRefineOpen(true)}>
          <div className="space-y-3 pt-2">
            {filteredPosts.map((post, i) => {
              const meta = PLATFORM_META[post.platform]
              const Icon = meta.Icon
              return (
                <div key={i} className="p-4 rounded-lg bg-forge-navy border border-forge-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={12} style={{ color: meta.color }} />
                    <span className="text-xs font-medium" style={{ color: meta.color }}>{meta.label}</span>
                    <span className="text-forge-muted text-xs">· {post.format}</span>
                  </div>
                  <p className="text-forge-white text-sm font-semibold mb-1">{post.headline}</p>
                  <p className="text-forge-muted text-xs leading-relaxed">{post.concept}</p>
                  {post.hook && <p className="text-forge-blue/80 text-xs mt-2 italic">Hook: {post.hook}</p>}
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* Reel Concepts */}
      <SectionCard label="CONTENT" title="Reel Concepts" onRefine={() => setRefineOpen(true)}>
        <ol className="space-y-2 pt-2">
          {content.reelConcepts.map((concept, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-forge-blue/60 text-xs font-mono w-5 flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-forge-white text-sm">{concept}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Campaign Ideas */}
      <SectionCard label="CONTENT" title="Campaign Ideas" onRefine={() => setRefineOpen(true)}>
        <div className="space-y-2 pt-2">
          {content.campaignIdeas.map((idea, i) => (
            <div key={i} className="p-3 rounded-lg bg-forge-navy border border-forge-border">
              <p className="text-forge-white text-sm">{idea}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Launch Ideas */}
      <SectionCard label="CONTENT" title="Launch Content Ideas" onRefine={() => setRefineOpen(true)}>
        <ul className="space-y-2 pt-2">
          {content.launchIdeas.map((idea, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-forge-blue mt-0.5 text-xs">→</span>
              <span className="text-forge-white text-sm">{idea}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <RefineModal open={refineOpen} onClose={() => setRefineOpen(false)} section="content"
        onRefine={async (ins) => { await onRefine('content', ins); setRefineOpen(false) }} loading={refining} />
    </div>
  )
}
