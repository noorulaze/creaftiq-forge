import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface InsightCardProps {
  label?: string
  title: string
  children: ReactNode
  action?: ReactNode
  className?: string
  highlight?: boolean
}

export function InsightCard({
  label,
  title,
  children,
  action,
  className,
  highlight = false,
}: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border bg-forge-surface/90 backdrop-blur-sm p-6 flex flex-col justify-between transition-all duration-200',
        highlight
          ? 'border-forge-blue/50 bg-forge-navy/90 shadow-blue-glow-sm'
          : 'border-forge-border hover:border-forge-border2',
        className,
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {label && <p className="section-label mb-1">{label}</p>}
            <h3 className="text-base font-bold text-forge-white tracking-tight">{title}</h3>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
        <div className="text-sm text-forge-muted font-light leading-relaxed">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
