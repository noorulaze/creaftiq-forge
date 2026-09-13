import { Video, FileText, Share2, Compass } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import { InsightCard } from '../InsightCard'
import type { ContentOutput } from '@/types'

interface ContentTabProps {
  content: ContentOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function ContentTab({
  content,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: ContentTabProps) {
  const contentCopy = `CONTENT SYSTEM BLUEPRINT:
Pillars: The Craft & Process, Cultural Commentary, Community Triumphs
Short Video Ideas: 3s sound bite, studio sprint vlogs, before/after transformations
Posting Direction: 3 weekly high-signal releases focusing on taste and depth over spam volume.`

  return (
    <BlueprintSection
      badge="EDITORIAL & MEDIA ENGINE"
      heading="CREATE THE CONTENT SYSTEM."
      subheading="Organize content pillars, short video scripts, announcement formats, and posting cadences."
      copyContent={contentCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-6">
        
        {/* Content Pillars */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
          <p className="section-label mb-3">01 / FOUNDATIONAL PILLARS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'The Craft & Process', desc: 'Raw, behind-the-scenes glimpses into decisions, prototypes, and failures.' },
              { name: 'Cultural Perspective', desc: 'Editorial takes on industry trends, creative philosophy, and future directions.' },
              { name: 'Community Triumphs', desc: 'Spotlights on early members and real-world creations built with the product.' },
            ].map(p => (
              <div key={p.name} className="p-4 rounded-xl border border-forge-border bg-forge-navy/80">
                <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider mb-1">{p.name}</h4>
                <p className="text-2xs text-forge-muted font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Short Video Ideas & Launch Announcements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="02 / SHORT VIDEO CONCEPTS" title="Reels & TikTok Scripts" highlight>
            <div className="space-y-3 pt-1">
              {[
                { title: 'The Hook Test', format: 'Reel / 15s', purpose: 'Stop-the-scroll', desc: '"Stop asking ChatGPT for generic plans. Here is what real strategy looks like."' },
                { title: 'Behind the Build', format: 'Short / 30s', purpose: 'Authority', desc: 'Late-night sprint time-lapse deconstructing the first launch blueprint.' },
              ].map(vid => (
                <div key={vid.title} className="p-3 rounded-lg bg-forge-navy border border-forge-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-forge-white">{vid.title}</span>
                    <span className="text-3xs font-mono text-forge-blue uppercase">{vid.format}</span>
                  </div>
                  <p className="text-2xs text-forge-muted font-light leading-relaxed">{vid.desc}</p>
                </div>
              ))}
            </div>
          </InsightCard>

          <InsightCard label="03 / LAUNCH ANNOUNCEMENTS" title="Launch & Educational Ideas">
            <div className="space-y-3 pt-1">
              {[
                { title: 'Genesis 100 Reveal', format: 'Carousel', purpose: 'Exclusivity', desc: 'Numbered onboarding cards spotlighting the first 100 cohort members.' },
                { title: 'The Launch Breakdown', format: 'Long-form Post', purpose: 'Education', desc: 'Deep dive analyzing the anatomy of a modern multi-disciplinary product rollout.' },
              ].map(item => (
                <div key={item.title} className="p-3 rounded-lg bg-forge-navy border border-forge-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-forge-white">{item.title}</span>
                    <span className="text-3xs font-mono text-forge-blue uppercase">{item.format}</span>
                  </div>
                  <p className="text-2xs text-forge-muted font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </InsightCard>
        </div>

        {/* Suggested Posting Direction */}
        <div className="rounded-xl border border-forge-border bg-forge-navy/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">RECOMMENDED CADENCE</p>
            <h4 className="text-sm font-semibold text-forge-white">Suggested Posting Direction</h4>
            <p className="text-xs text-forge-muted font-light mt-0.5">
              3 high-production weekly drops prioritizing taste, depth, and engagement over low-quality volume.
            </p>
          </div>
          <span className="px-3 py-1 rounded bg-forge-blue/10 border border-forge-blue/20 text-2xs font-mono text-forge-blue uppercase flex-shrink-0">
            QUALITY &gt; QUANTITY
          </span>
        </div>

      </div>
    </BlueprintSection>
  )
}
