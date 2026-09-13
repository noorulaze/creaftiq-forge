import { BlueprintSection } from '../BlueprintSection'
import { InsightCard } from '../InsightCard'
import type { BrandOutput } from '@/types'

interface BrandTabProps {
  brand: BrandOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function BrandTab({
  brand,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: BrandTabProps) {
  const brandCopy = `BRAND BLUEPRINT:
Positioning: ${brand?.positioning || ''}
Personality: ${brand?.brandPersonality || ''}
Voice: Confident, culturally rooted, and editorial. Speaks directly with craft authority.
Colors: Primary ${brand?.colorDirection.primary || '#0A0A0F'}, Secondary ${brand?.colorDirection.secondary || '#F8F9FA'}, Accent ${brand?.colorDirection.accent || '#2563EB'}
Typography: ${brand?.typographyDirection || ''}`

  return (
    <BlueprintSection
      badge="IDENTITY & TONAL PRESENCE"
      heading="BUILD THE BRAND."
      subheading="Establish the memorable essence, visual vocabulary, and verbal identity of your project."
      copyContent={brandCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">
        
        {/* Visual Brand Direction Board */}
        <div className="rounded-2xl border border-forge-border/80 bg-forge-navy/90 p-6 sm:p-8">
          <p className="section-label mb-4">VISUAL BRAND DIRECTION BOARD</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Color Swatches */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase text-forge-muted tracking-wider">
                COLOR PALETTE
              </span>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl border border-forge-border bg-[#0A0A0F]" />
                  <span className="text-3xs font-mono text-forge-muted">#0A0A0F</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl border border-forge-border bg-[#2563EB]" />
                  <span className="text-3xs font-mono text-forge-muted">#2563EB</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl border border-forge-border bg-[#F8F9FA]" />
                  <span className="text-3xs font-mono text-forge-muted">#F8F9FA</span>
                </div>
              </div>
            </div>

            {/* Typography Samples */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase text-forge-muted tracking-wider">
                TYPOGRAPHY SAMPLES
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold tracking-tight text-forge-white">
                  EDITORIAL HEADLINE
                </p>
                <p className="text-xs text-forge-muted font-light">
                  Inter Display / Geometric Mono Accents
                </p>
              </div>
            </div>

            {/* Abstract Placeholder & Mood */}
            <div className="space-y-3">
              <span className="text-2xs font-mono uppercase text-forge-muted tracking-wider">
                ABSTRACT VISUAL MOOD
              </span>
              <div className="h-14 rounded-xl border border-forge-border/80 bg-gradient-to-r from-forge-navy via-forge-surface to-forge-navy flex items-center justify-center text-2xs font-mono text-forge-muted">
                MINIMAL • OBSIDIAN • TEXTURAL GRAIN
              </div>
            </div>

          </div>
        </div>

        {/* Structured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <InsightCard label="01 / POSITIONING" title="Brand Positioning" highlight>
            <p className="text-forge-white text-xs leading-relaxed">
              {brand?.positioning || 'The premier contemporary standard designed for forward-thinking audiences.'}
            </p>
          </InsightCard>

          <InsightCard label="02 / PERSONALITY" title="Brand Personality">
            <p className="text-forge-white text-xs leading-relaxed">
              {brand?.brandPersonality || 'Confident, refined, and culturally grounded with editorial precision.'}
            </p>
          </InsightCard>

          <InsightCard label="03 / VOICE" title="Brand Voice">
            <p className="text-forge-white text-xs leading-relaxed">
              Direct, articulate, and honest. Avoids corporate puffery; speaks as a peer with craft authority.
            </p>
          </InsightCard>

          <InsightCard label="04 / COLOR DIRECTION" title="Suggested Color Direction">
            <p className="text-forge-white text-xs leading-relaxed">
              {brand?.colorDirection.rationale || 'Deep obsidian foundation creates gravitas; off-white balances legibility; electric blue punctuates key moments.'}
            </p>
          </InsightCard>

          <InsightCard label="05 / TYPOGRAPHY DIRECTION" title="Typography Direction">
            <p className="text-forge-white text-xs leading-relaxed">
              {brand?.typographyDirection || 'Condensed sans-serif for high-impact headlines paired with legible geometric body weights.'}
            </p>
          </InsightCard>

          <InsightCard label="06 / LOGO & KEYWORDS" title="Logo Direction & Keywords">
            <div className="space-y-3">
              <p className="text-xs text-forge-muted leading-relaxed">
                Monolithic lettermark geometry with high-contrast negative space.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Craft', 'Identity', 'Precision', 'Atmospheric', 'Modern'].map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-forge-navy border border-forge-border text-2xs font-mono text-forge-white">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </InsightCard>

        </div>

      </div>
    </BlueprintSection>
  )
}
