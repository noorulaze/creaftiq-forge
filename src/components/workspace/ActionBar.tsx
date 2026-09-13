import { useState } from 'react'
import { Copy, Sparkles, RefreshCw, BookmarkCheck, Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

interface ActionBarProps {
  sectionTitle: string
  copyContent?: string
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => Promise<void> | void
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
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

  async function handleSave() {
    if (!onSave) return
    setSaveStatus('saving')
    try {
      await onSave()
      setSaveStatus('saved')
      toast.success(`${sectionTitle} saved successfully.`)
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      toast.error(`Failed to save ${sectionTitle}.`)
    }
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

      {saveStatus === 'idle' && (
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider transition-colors border cursor-pointer text-forge-muted hover:text-forge-white bg-forge-navy/80 hover:bg-forge-surface border-forge-border"
          title="Save Section"
        >
          <BookmarkCheck size={12} className="text-forge-muted" />
          <span>SAVE PROJECT</span>
        </button>
      )}

      {saveStatus === 'saving' && (
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider border text-forge-muted bg-forge-surface border-forge-border cursor-not-allowed"
        >
          <Loader2 size={12} className="animate-spin text-forge-blue" />
          <span>Saving...</span>
        </button>
      )}

      {saveStatus === 'saved' && (
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider border cursor-pointer text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
          title="Saved successfully"
        >
          <Check size={12} className="text-emerald-400" />
          <span>Saved successfully</span>
        </button>
      )}

      {saveStatus === 'error' && (
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20">
            <AlertCircle size={11} />
            <span>Save failed</span>
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-2xs font-semibold uppercase tracking-wider text-forge-white bg-forge-blue hover:bg-forge-blue-light cursor-pointer transition-colors"
          >
            <RefreshCw size={11} />
            <span>Retry</span>
          </button>
        </div>
      )}
    </div>
  )
}

