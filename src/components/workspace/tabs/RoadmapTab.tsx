import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '@/components/workspace/SectionCard'
import { RefineModal } from '@/components/workspace/RefineModal'
import { Badge, SkeletonCard } from '@/components/shared'
import type { RoadmapOutput, RoadmapItem, BlueprintSection } from '@/types'

const CATEGORY_VARIANT: Record<RoadmapItem['category'], 'blue' | 'purple' | 'amber' | 'green' | 'red' | 'neutral'> = {
  brand:     'blue',
  product:   'purple',
  marketing: 'amber',
  content:   'green',
  tech:      'red',
  ops:       'neutral',
}

function RoadmapColumn({ title, items, delay = 0 }: { title: string; items: RoadmapItem[]; delay?: number }) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-bold tracking-widest uppercase text-forge-white">{title}</h3>
        <div className="w-8 h-0.5 bg-forge-blue mt-2" />
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay + i * 0.06 }}
            className="p-4 rounded-xl border border-forge-border bg-forge-surface hover:border-forge-border2 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-forge-white text-sm font-semibold leading-snug">{item.title}</h4>
              <Badge variant={CATEGORY_VARIANT[item.category]} className="flex-shrink-0 text-2xs">{item.category}</Badge>
            </div>
            <p className="text-forge-muted text-xs leading-relaxed mb-2">{item.description}</p>
            {item.timeframe && (
              <p className="text-forge-blue/70 text-xs">{item.timeframe}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface RoadmapTabProps {
  roadmap: RoadmapOutput | null
  loading?: boolean
  onRefine: (section: BlueprintSection, instruction: string) => Promise<void>
  refining?: boolean
}

export function RoadmapTab({ roadmap, loading = false, onRefine, refining = false }: RoadmapTabProps) {
  const [refineOpen, setRefineOpen] = useState(false)

  if (loading || !roadmap) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <SkeletonCard lines={3} />
            <SkeletonCard lines={3} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-label mb-1">LAUNCH ROADMAP</p>
          <h2 className="text-xl font-bold text-forge-white tracking-tight">Your Action Plan</h2>
        </div>
        <button
          onClick={() => setRefineOpen(true)}
          className="text-xs text-forge-blue hover:text-forge-blue-light transition-colors"
        >
          Refine Roadmap
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoadmapColumn title="NOW"  items={roadmap.now}  delay={0}    />
        <RoadmapColumn title="NEXT" items={roadmap.next} delay={0.1}  />
        <RoadmapColumn title="LATER" items={roadmap.later} delay={0.2} />
      </div>

      <RefineModal open={refineOpen} onClose={() => setRefineOpen(false)} section="roadmap"
        onRefine={async (ins) => { await onRefine('roadmap', ins); setRefineOpen(false) }} loading={refining} />
    </div>
  )
}
