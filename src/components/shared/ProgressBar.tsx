import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface ProgressBarProps {
  value: number
  className?: string
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const colorClasses = {
  blue:   'bg-forge-blue',
  green:  'bg-emerald-500',
  amber:  'bg-amber-500',
  purple: 'bg-purple-500',
  red:    'bg-red-500',
}

const sizeClasses = { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' }

function getColorByScore(score: number): 'green' | 'amber' | 'red' {
  if (score >= 80) return 'green'
  if (score >= 60) return 'amber'
  return 'red'
}

export function ProgressBar({ value, className, color = 'blue', showLabel = false, size = 'md', animated = true }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-forge-border rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn('h-full rounded-full', colorClasses[color])}
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      {showLabel && <span className="text-xs text-forge-muted mt-1 block">{clamped}%</span>}
    </div>
  )
}

export function ScoreBar({ score, className }: { score: number; className?: string }) {
  return <ProgressBar value={score} color={getColorByScore(score)} size="md" className={className} />
}
