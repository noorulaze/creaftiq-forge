import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, ChevronDown, Sparkles, RefreshCw, BookmarkCheck } from 'lucide-react'
import { Button, Skeleton } from '@/components/shared'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

interface SectionCardProps {
  title: string
  label?: string
  children: React.ReactNode
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => void
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
  loading?: boolean
  copyContent?: string
}

export function SectionCard({
  title,
  label,
  children,
  onRefine,
  onRegenerate,
  onSave,
  collapsible = false,
  defaultOpen = true,
  className,
  loading = false,
  copyContent,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [saved, setSaved] = useState(false)

  function handleCopy() {
    const text = copyContent || (typeof children === 'string' ? children : '')
    if (text) {
      navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard.')
    }
  }

  function handleSave() {
    setSaved(true)
    if (onSave) onSave()
    toast.success('Section saved.')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={cn('rounded-xl border border-forge-border bg-forge-surface/90 backdrop-blur-sm transition-all duration-200', className)}>
      {/* Header */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3',
          collapsible && 'cursor-pointer hover:bg-forge-surface2 rounded-t-xl transition-colors',
          !open && 'rounded-xl',
        )}
        onClick={collapsible ? () => setOpen(!open) : undefined}
      >
        <div>
          {label && <p className="section-label mb-0.5">{label}</p>}
          <h3 className="text-sm font-semibold text-forge-white">{title}</h3>
        </div>

        {/* Action Button Matrix: Copy, Refine, Regenerate, Save */}
        <div className="flex items-center flex-wrap gap-1.5" onClick={e => e.stopPropagation()}>
          {copyContent && (
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs text-forge-muted hover:text-forge-white hover:bg-forge-border transition-colors"
              title="Copy text"
            >
              <Copy size={11} />
              <span>Copy</span>
            </button>
          )}

          {onRefine && (
            <button
              type="button"
              onClick={onRefine}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs text-forge-blue hover:text-forge-blue-light hover:bg-forge-blue/10 transition-colors"
              title="Refine with specific instructions"
            >
              <Sparkles size={11} />
              <span>Refine</span>
            </button>
          )}

          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs text-forge-muted hover:text-forge-white hover:bg-forge-border transition-colors"
              title="Regenerate section"
            >
              <RefreshCw size={11} />
              <span>Regenerate</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md text-2xs transition-colors',
              saved ? 'text-emerald-400 bg-emerald-500/10' : 'text-forge-muted hover:text-forge-white hover:bg-forge-border'
            )}
            title="Save changes"
          >
            <BookmarkCheck size={11} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          {collapsible && (
            <ChevronDown
              size={14}
              className={cn('text-forge-muted transition-transform duration-200 ml-1', open && 'rotate-180')}
            />
          )}
        </div>
      </div>

      {/* Content Body */}
      <AnimatePresence initial={false}>
        {(!collapsible || open) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-forge-border/80">
              {loading ? (
                <div className="space-y-2 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : (
                children
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
