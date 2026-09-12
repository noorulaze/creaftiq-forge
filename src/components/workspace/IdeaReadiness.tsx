import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { ScoreBar, SkeletonCard } from '@/components/shared'
import type { IdeaReadiness, ReadinessScore } from '@/types'
import { cn } from '@/utils/cn'

const METRICS: { key: keyof Omit<IdeaReadiness, 'overall'>; label: string }[] = [
  { key: 'clarity',        label: 'CLARITY'        },
  { key: 'audience',       label: 'AUDIENCE'       },
  { key: 'differentiation',label: 'DIFFERENTIATION'},
  { key: 'execution',      label: 'EXECUTION'      },
]

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

function MetricBlock({ metric, data }: { metric: string; data: ReadinessScore }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-forge-border bg-forge-surface p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="section-label">{metric}</p>
        <span className={cn('text-2xl font-black leading-none', getScoreColor(data.score))}>
          {data.score}
        </span>
      </div>

      <ScoreBar score={data.score} className="mb-3" />

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-forge-muted hover:text-forge-white transition-colors"
      >
        <ChevronDown size={12} className={cn('transition-transform duration-200', open && 'rotate-180')} />
        WHY?
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="mt-3 space-y-2 text-xs leading-relaxed border-t border-forge-border pt-3">
          <p className="text-forge-muted">{data.why}</p>
          <p className="text-forge-blue/80">{data.suggestion}</p>
        </div>
      </motion.div>
    </div>
  )
}

interface IdeaReadinessProps {
  readiness: IdeaReadiness | null
  loading?: boolean
}

export function IdeaReadinessSection({ readiness, loading = false }: IdeaReadinessProps) {
  if (loading || !readiness) {
    return (
      <div className="mb-12">
        <div className="mb-6">
          <p className="section-label mb-2">IDEA READINESS</p>
          <h2 className="text-2xl font-bold text-forge-white">Readiness Analysis</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="section-label mb-2">IDEA READINESS</p>
          <h2 className="text-2xl font-bold text-forge-white tracking-tight">Readiness Analysis</h2>
          <p className="text-forge-muted/60 text-xs mt-1">
            Scores reflect AI analysis, not guaranteed measurements.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-forge-muted mb-0.5">OVERALL</p>
          <span className={cn('text-3xl font-black', getScoreColor(readiness.overall))}>
            {readiness.overall}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(({ key, label }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <MetricBlock metric={label} data={readiness[key]} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
