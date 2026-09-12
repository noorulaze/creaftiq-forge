import { motion } from 'framer-motion'
import { SkeletonCard } from '@/components/shared'
import type { IdeaDNA } from '@/types'

const DNA_FIELDS: { key: keyof IdeaDNA; label: string }[] = [
  { key: 'purpose',     label: 'PURPOSE'     },
  { key: 'audience',    label: 'AUDIENCE'    },
  { key: 'problem',     label: 'PROBLEM'     },
  { key: 'opportunity', label: 'OPPORTUNITY' },
  { key: 'personality', label: 'PERSONALITY' },
  { key: 'direction',   label: 'DIRECTION'   },
]

interface IdeaDNAProps {
  ideaDna: IdeaDNA | null
  loading?: boolean
}

export function IdeaDNASection({ ideaDna, loading = false }: IdeaDNAProps) {
  if (loading || !ideaDna) {
    return (
      <div className="mb-12">
        <div className="mb-6">
          <p className="section-label mb-2">IDEA DNA</p>
          <h2 className="text-2xl font-bold text-forge-white">Your Idea DNA</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <p className="section-label mb-2">IDEA DNA</p>
        <h2 className="text-2xl font-bold text-forge-white tracking-tight">Your Idea DNA</h2>
        <p className="text-forge-muted text-sm mt-1">The six dimensions of your idea, understood by FORGE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DNA_FIELDS.map(({ key, label }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-5 border-l-2 border-l-forge-blue"
          >
            <p className="section-label mb-2">{label}</p>
            <p className="text-forge-white text-sm leading-relaxed">{ideaDna[key]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
