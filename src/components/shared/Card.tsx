import { motion, type HTMLMotionProps } from 'framer-motion'
import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean
  noPadding?: boolean
  glow?: boolean
}

export function Card({ hoverable = false, noPadding = false, glow = false, children, className, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border border-forge-border bg-forge-surface shadow-card',
        !noPadding && 'p-6',
        hoverable && 'cursor-pointer transition-all duration-200 hover:border-forge-border2 hover:shadow-card-hover',
        glow && 'border-forge-blue/20 shadow-blue-glow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props}>{children}</div>
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xs font-semibold tracking-widest uppercase text-forge-muted', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-forge-white', className)} {...props}>{children}</div>
}
