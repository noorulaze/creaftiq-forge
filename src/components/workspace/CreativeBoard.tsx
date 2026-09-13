import { motion } from 'framer-motion'
import { BlueprintSection } from './BlueprintSection'
import { InsightCard } from './InsightCard'
import type { CreativeDirectionOutput } from '@/types'

interface CreativeBoardProps {
  creativeDirection: CreativeDirectionOutput | null
  loading?: boolean
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => void
}

export function CreativeBoard({
  creativeDirection,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: CreativeBoardProps) {
  const cd = creativeDirection

  const creativeCopy = `THE CREATIVE WORLD BLUEPRINT:
Visual Mood: An electric creative laboratory under midnight skies — precision engineering meets high-taste artistic vision.
Color Tokens: Obsidian (#0A0A0F), Carbon (#111827), Electric Signal (#2563EB), Chalk White (#F8F9FA)
Typography Direction: Condensed display headlines paired with geometric body weights.
Image Direction: High-contrast monochromatic compositions punctuated by single electric blue light lines.`

  return (
    <BlueprintSection
      badge="ATMOSPHERIC WORLD & TASTE"
      heading="THE CREATIVE WORLD OF YOUR IDEA."
      subheading="Explore the aesthetic texture, mood references, motion guidance, and visual palette of your project."
      copyContent={creativeCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">
        
        {/* Visual Mood Board Canvas */}
        <div className="rounded-2xl border border-forge-border/80 bg-forge-navy/90 p-6 sm:p-8">
          <p className="section-label mb-3">01 / ATMOSPHERIC MOOD & REFLECTION</p>
          <blockquote className="text-sm sm:text-base text-forge-white font-light italic leading-relaxed max-w-3xl mb-6">
            "{cd?.mood || 'An electric creative laboratory under midnight skies — where architectural precision meets high-taste artistic vision.'}"
          </blockquote>

          {/* Abstract Reference Placeholders (No copyrighted logos/stock images) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="h-28 rounded-xl border border-forge-border/80 bg-gradient-to-br from-[#0A0A0F] to-[#1E293B] p-4 flex flex-col justify-between">
              <span className="text-3xs font-mono uppercase text-forge-muted">STUDY 01 / FORM</span>
              <p className="text-xs font-semibold text-forge-white">Monochrome Contrast</p>
            </div>
            <div className="h-28 rounded-xl border border-forge-border/80 bg-gradient-to-br from-[#0D1117] via-[#1E1B4B] to-[#0A0A0F] p-4 flex flex-col justify-between">
              <span className="text-3xs font-mono uppercase text-forge-blue">STUDY 02 / ILLUMINATION</span>
              <p className="text-xs font-semibold text-forge-white">Electric Blue Contours</p>
            </div>
            <div className="h-28 rounded-xl border border-forge-border/80 bg-gradient-to-br from-[#111827] to-[#0F172A] p-4 flex flex-col justify-between">
              <span className="text-3xs font-mono uppercase text-forge-muted">STUDY 03 / TACTILITY</span>
              <p className="text-xs font-semibold text-forge-white">Organic Fine Grain</p>
            </div>
          </div>
        </div>

        {/* Color Direction Swatches */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label mb-1">COLOR PALETTE DIRECTORY</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                Active Hex Swatches
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">5 DESIGN TOKENS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {[
              { hex: '#0A0A0F', name: 'OBSIDIAN VOID', role: 'Primary Base' },
              { hex: '#111827', name: 'CARBON SURFACE', role: 'Containers' },
              { hex: '#2563EB', name: 'ELECTRIC SIGNAL', role: 'Action Glow' },
              { hex: '#60A5FA', name: 'ATMOSPHERE BLUE', role: 'Accent Vector' },
              { hex: '#F8F9FA', name: 'CHALK WHITE', role: 'High Contrast Text' },
            ].map(swatch => (
              <div key={swatch.hex} className="p-3 rounded-xl border border-forge-border bg-forge-navy/80 flex flex-col gap-2">
                <div
                  className="w-full h-12 rounded-lg border border-forge-border/60"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div>
                  <p className="text-xs font-semibold text-forge-white">{swatch.name}</p>
                  <p className="text-3xs font-mono text-forge-muted">{swatch.hex}</p>
                  <p className="text-3xs text-forge-blue/80 mt-0.5">{swatch.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography, Image & Motion Direction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard label="02 / TYPOGRAPHY" title="Typography Scale">
            <p className="text-forge-white text-xs leading-relaxed font-light">
              High-impact condensed display headlines with wide letter tracking paired with Inter geometric body weights and JetBrains Mono code accents.
            </p>
          </InsightCard>

          <InsightCard label="03 / IMAGERY" title="Image Direction">
            <p className="text-forge-white text-xs leading-relaxed font-light">
              Raw, candid, high-contrast imagery with subtle film grain. Real environments and real people framed with generous negative space.
            </p>
          </InsightCard>

          <InsightCard label="04 / MOTION" title="Motion Guidance">
            <p className="text-forge-white text-xs leading-relaxed font-light">
              Calm, spring-physics transitions with restrained opacity reveals. Respects user motion preferences without continuous looping distractions.
            </p>
          </InsightCard>
        </div>

        {/* Design Keywords Cloud */}
        <div className="rounded-xl border border-forge-border bg-forge-surface p-5">
          <p className="section-label mb-2">05 / DESIGN KEYWORD DIRECTORY</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Obsidian', 'Editorial', 'Precision', 'Architectural', 'Electric', 'Atmospheric', 'Refined', 'Kinetic', 'Bold', 'Minimal'].map(kw => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full border border-forge-border bg-forge-navy text-xs font-mono text-forge-white hover:border-forge-blue/40 transition-colors cursor-default"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}
