import { cn } from '@/utils/cn'

type BadgeVariant = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  blue:    'bg-forge-blue/10 text-forge-blue border-forge-blue/20',
  green:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  red:     'bg-red-500/10 text-red-400 border-red-500/20',
  purple:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  neutral: 'bg-forge-surface text-forge-muted border-forge-border',
}

const dotStyles: Record<BadgeVariant, string> = {
  blue:    'bg-forge-blue',
  green:   'bg-emerald-400',
  amber:   'bg-amber-400',
  red:     'bg-red-400',
  purple:  'bg-purple-400',
  neutral: 'bg-forge-muted',
}

export function Badge({ children, variant = 'blue', className, dot = false }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variantStyles[variant],
      className,
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  )
}
