import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ActionBar } from './ActionBar'
import { cn } from '@/utils/cn'

interface BlueprintSectionProps {
  id?: string
  badge?: string
  heading: string
  subheading?: string
  children: ReactNode
  copyContent?: string
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => void
  className?: string
}

export function BlueprintSection({
  badge,
  heading,
  subheading,
  children,
  copyContent,
  onRefine,
  onRegenerate,
  onSave,
  className,
}: BlueprintSectionProps) {
  return (
    <section className={cn('space-y-6', className)}>
      {/* Header bar with title, badge, and shared actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-forge-border/80 gap-4">
        <div>
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-forge-blue/10 border border-forge-blue/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-blue" />
              <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue">
                {badge}
              </span>
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-forge-white uppercase">
            {heading}
          </h2>
          {subheading && (
            <p className="text-xs sm:text-sm text-forge-muted font-light mt-1 max-w-2xl leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Action Bar with Copy, Refine, Regenerate, Save */}
        <ActionBar
          sectionTitle={heading}
          copyContent={copyContent}
          onRefine={onRefine}
          onRegenerate={onRegenerate}
          onSave={onSave}
          className="flex-shrink-0"
        />
      </div>

      {/* Content Canvas */}
      <div className="pt-2">
        {children}
      </div>
    </section>
  )
}
