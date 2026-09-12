import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-forge-surface border border-forge-border flex items-center justify-center mb-6">
          <Icon size={28} className="text-forge-muted" />
        </div>
      )}
      <h3 className="text-forge-white font-semibold text-lg mb-2">{title}</h3>
      {description && <p className="text-forge-muted text-sm max-w-xs mb-6">{description}</p>}
      {action}
    </motion.div>
  )
}
