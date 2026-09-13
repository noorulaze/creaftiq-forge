import { useState } from 'react'
import { Copy, Sparkles, RefreshCw, BookmarkCheck, Check } from 'lucide-react'
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
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  function handleCopy() {
    if (copyContent) {
      navigator.clipboard.writeText(copyContent)
      setCopied(true)
      toast.success(`${sectionTitle} copied to clipboard.`)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleRegenerateClick() {
    if (onRegenerate) {
      setRefreshing(true)
      onRegenerate()
      setTimeout(() => setRefreshing(false), 800)
    }
  }

  function handleSave() {
    setSaved(true)
    if (onSave) onSave()
    toast.success(`${sectionTitle} saved.`)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)}>
      {copyContent && (
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider transition-colors border cursor-pointer',
            copied
              ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
              : 'text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border-forge-border'
          )}
          title="Copy Section"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'COPIED' : 'COPY SECTION'}</span>
        </button>
      )}

      {onRefine && (
        <button
          type="button"
          onClick={onRefine}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider text-forge-blue hover:text-forge-blue-light bg-forge-blue/10 hover:bg-forge-blue/20 border border-forge-blue/30 transition-colors cursor-pointer"
          title="Refine Section"
        >
          <Sparkles size={12} />
          <span>REFINE SECTION</span>
        </button>
      )}

      {onRegenerate && (
        <button
          type="button"
          onClick={handleRegenerateClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border border-forge-border transition-colors group cursor-pointer"
          title="Regenerate Section"
        >
          <RefreshCw size={12} className={cn('transition-transform', refreshing && 'animate-spin text-forge-blue')} />
          <span>REGENERATE SECTION</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleSave}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider transition-colors border cursor-pointer',
          saved
            ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
            : 'text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border-forge-border'
        )}
        title="Save Project"
      >
        <BookmarkCheck size={12} className={saved ? 'text-emerald-400' : 'text-forge-muted'} />
        <span>{saved ? 'SAVED' : 'SAVE PROJECT'}</span>
      </button>
    </div>
  )
}
