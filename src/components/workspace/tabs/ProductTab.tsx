import { useState } from 'react'
import { SectionCard } from '@/components/workspace/SectionCard'
import { RefineModal } from '@/components/workspace/RefineModal'
import { Badge, SkeletonCard } from '@/components/shared'
import type { ProductOutput, BlueprintSection } from '@/types'
import { cn } from '@/utils/cn'

interface ProductTabProps {
  product: ProductOutput | null
  loading?: boolean
  onRefine: (section: BlueprintSection, instruction: string) => Promise<void>
  refining?: boolean
}

const priorityVariant = { high: 'red', medium: 'amber', low: 'green' } as const

export function ProductTab({ product, loading = false, onRefine, refining = false }: ProductTabProps) {
  const [refineOpen, setRefineOpen] = useState(false)

  if (loading || !product) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>
  }

  return (
    <div className="space-y-4">
      {/* Core Product */}
      <SectionCard label="PRODUCT" title="Core Product" onRefine={() => setRefineOpen(true)} copyContent={product.coreProduct}>
        <p className="text-forge-white text-base leading-relaxed font-medium pt-2">{product.coreProduct}</p>
      </SectionCard>

      {/* Target Users */}
      <SectionCard label="PRODUCT" title="Target Users" onRefine={() => setRefineOpen(true)}>
        <div className="flex flex-wrap gap-2 pt-2">
          {product.targetUsers.map(user => (
            <span key={user} className="px-3 py-1.5 rounded-full bg-forge-navy border border-forge-border text-forge-white text-xs font-medium">
              {user}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Value Proposition */}
      <SectionCard label="PRODUCT" title="Value Proposition" onRefine={() => setRefineOpen(true)} copyContent={product.valueProposition}>
        <div className="mt-2 p-4 rounded-lg bg-forge-blue/10 border border-forge-blue/20">
          <p className="text-forge-white text-sm leading-relaxed">{product.valueProposition}</p>
        </div>
      </SectionCard>

      {/* Core Features */}
      <SectionCard label="PRODUCT" title="Core Features" onRefine={() => setRefineOpen(true)}>
        <div className="space-y-3 pt-2">
          {product.coreFeatures.map((feature) => (
            <div key={feature.name} className="flex items-start gap-3 p-4 rounded-lg bg-forge-navy border border-forge-border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-forge-white text-sm font-semibold">{feature.name}</span>
                  <Badge variant={priorityVariant[feature.priority]}>{feature.priority}</Badge>
                </div>
                <p className="text-forge-muted text-xs leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* User Journey */}
      <SectionCard label="PRODUCT" title="User Journey" onRefine={() => setRefineOpen(true)}>
        <div className="space-y-3 pt-2">
          {product.userJourney.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-forge-blue/20 border border-forge-blue/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-forge-blue text-xs font-bold">{i + 1}</span>
                </div>
                {i < product.userJourney.length - 1 && <div className="w-px h-full bg-forge-border mt-1" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-forge-white text-sm font-semibold">{step.stage}</span>
                  <span className="text-forge-muted text-xs">{step.emotion}</span>
                </div>
                <p className="text-forge-muted text-xs leading-relaxed">{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <RefineModal open={refineOpen} onClose={() => setRefineOpen(false)} section="product"
        onRefine={async (ins) => { await onRefine('product', ins); setRefineOpen(false) }} loading={refining} />
    </div>
  )
}
