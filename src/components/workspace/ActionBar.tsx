import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Sparkles, RefreshCw, BookmarkCheck } from 'lucide-react'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

interface ActionBarProps {
  sectionTitle: string
  copyContent?: string
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => void
  className?: string
}

export function ActionBar({
  sectionTitle,
  copyContent,
  onRefine,
  onRegenerate,
  onSave,
  className,
}: ActionBarProps) {
  const [saved, setSaved] = useState(false)

  function handleCopy() {
    if (copyContent) {
      navigator.clipboard.writeText(copyContent)
      toast.success(`${sectionTitle} copied to clipboard.`)
    }
  }

  function handleSave() {
    setSaved(true)
    if (onSave) onSave()
    toast.success(`${sectionTitle} saved.`)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={cn('flex items-center flex-wrap gap-1.5', className)}>
      {copyContent && (
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-medium uppercase tracking-wider text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border border-forge-border transition-colors"
          title="Copy Content"
        >
          <Copy size={12} />
          <span>Copy</span>
        </button>
      )}

      {onRefine && (
        <button
          type="button"
          onClick={onRefine}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-medium uppercase tracking-wider text-forge-blue hover:text-forge-blue-light bg-forge-blue/10 hover:bg-forge-blue/20 border border-forge-blue/30 transition-colors"
          title="Refine Section"
        >
          <Sparkles size={12} />
          <span>Refine</span>
        </button>
      )}

      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-medium uppercase tracking-wider text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border border-forge-border transition-colors"
          title="Regenerate"
        >
          <RefreshCw size={12} />
          <span>Regenerate</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-medium uppercase tracking-wider transition-colors border',
          saved
            ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
            : 'text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border-forge-border'
        )}
        title="Save Section"
      >
        <BookmarkCheck size={12} />
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  )
}
