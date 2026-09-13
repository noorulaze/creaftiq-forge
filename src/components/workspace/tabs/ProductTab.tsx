import { Check } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import { InsightCard } from '../InsightCard'
import type { ProductOutput } from '@/types'

interface ProductTabProps {
  product: ProductOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function ProductTab({
  product,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: ProductTabProps) {
  const productCopy = `PRODUCT BLUEPRINT:
Concept: ${product?.coreProduct || ''}
Value Proposition: ${product?.valueProposition || ''}
User Experience: Minimalist, friction-free onboarding, fast execution.
Differentiator: Deep curation and community integration over bloated catalogs.`

  return (
    <BlueprintSection
      badge="ARCHITECTURE & VALUE PROPOSITION"
      heading="SHAPE THE PRODUCT."
      subheading="Define the functional scope, MVP priority stack, and core differentiator without unsupported business claims."
      copyContent={productCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-6">
        
        {/* Top Cards: Concept & Value Prop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="01 / PRODUCT CONCEPT" title="Product Concept" highlight>
            <p className="text-forge-white text-xs leading-relaxed">
              {product?.coreProduct || 'A focused product suite offering curated quality and intentional design.'}
            </p>
          </InsightCard>

          <InsightCard label="02 / VALUE PROPOSITION" title="User Problem & Solution">
            <p className="text-forge-white text-xs leading-relaxed">
              {product?.valueProposition || 'Solves fragmented, low-signal workflows by giving creators a dedicated workspace.'}
            </p>
          </InsightCard>
        </div>

        {/* UX Direction & Possible Differentiator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="03 / EXPERIENCE" title="User Experience Direction">
            <p className="text-forge-white text-xs leading-relaxed">
              Friction-free, single-screen clarity. High keyboard navigation support, calm dark aesthetic, and immediate visual confirmation.
            </p>
          </InsightCard>

          <InsightCard label="04 / EDGE" title="Possible Differentiator">
            <p className="text-forge-white text-xs leading-relaxed">
              Deep, structured multi-disciplinary output (Brand, Product, Digital, Launch) rather than conversational chat bubbles.
            </p>
          </InsightCard>
        </div>

        {/* MVP Feature Checklist */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label mb-1">MVP SCOPE CHECKLIST</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                Flagship Features for Phase 1
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue uppercase">RECOMMENDED MVP</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { name: 'Core Flagship Suite', desc: 'The signature primary offering executed to the highest standard.' },
              { name: 'Early Access & Waitlist Hub', desc: 'Direct member registration with custom invitation codes.' },
              { name: 'Craft & Process Documentation', desc: 'Behind-the-scenes transparency building organic authority.' },
              { name: 'Member Community Drops', desc: 'Time-boxed releases that cultivate genuine momentum.' },
            ].map((feat) => (
              <div
                key={feat.name}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-forge-border bg-forge-navy/80"
              >
                <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-forge-white">{feat.name}</h4>
                  <p className="text-2xs text-forge-muted font-light leading-relaxed mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}
