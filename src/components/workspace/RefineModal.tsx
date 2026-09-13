import { useState } from 'react'
import { Modal, Button } from '@/components/shared'
import type { BlueprintSection } from '@/types'
import { cn } from '@/utils/cn'

const PRESETS = [
  { id: 'more-premium',   label: 'More premium' },
  { id: 'more-youthful',  label: 'More youthful' },
  { id: 'more-minimal',   label: 'More minimal' },
  { id: 'more-bold',      label: 'More bold' },
  { id: 'more-editorial', label: 'More editorial' },
  { id: 'more-local',     label: 'More local and culturally connected' },
]

interface RefineModalProps {
  open: boolean
  onClose: () => void
  section: BlueprintSection
  onRefine: (instruction: string) => Promise<void>
  loading?: boolean
}

export function RefineModal({ open, onClose, section, onRefine, loading = false }: RefineModalProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [custom, setCustom]     = useState('')

  const instruction = selected === 'custom' ? custom : (selected || '')

  async function handleRefine() {
    if (!instruction.trim()) return
    await onRefine(instruction)
    setSelected(null)
    setCustom('')
  }

  return (
    <Modal open={open} onClose={onClose} title={`REFINE — ${section.toUpperCase()}`} size="md">
      <div className="space-y-5">
        <p className="text-forge-muted text-xs leading-relaxed">
          Select an aesthetic adjustment preset or specify a custom refinement prompt for the <span className="text-forge-white font-medium">{section}</span> section.
        </p>

        {/* Preset options */}
        <div className="space-y-1.5">
          <label className="forge-label text-2xs">PRESET ADJUSTMENTS</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelected(selected === preset.label ? null : preset.label)
                  setCustom('')
                }}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all duration-150',
                  selected === preset.label
                    ? 'bg-forge-blue/20 border-forge-blue text-forge-white'
                    : 'bg-forge-surface border-forge-border text-forge-muted hover:text-forge-white hover:border-forge-border2',
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom instruction */}
        <div>
          <label className="forge-label text-2xs">CUSTOM INSTRUCTION</label>
          <textarea
            value={custom}
            onChange={e => {
              setCustom(e.target.value)
              setSelected('custom')
            }}
            placeholder="e.g. Tone down corporate language, write in direct short sentences, add high-contrast visuals..."
            className="forge-input resize-none h-20 text-xs"
            disabled={loading}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button variant="secondary" size="md" fullWidth onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
            disabled={!instruction.trim()}
            onClick={handleRefine}
            className="text-xs font-semibold tracking-wider uppercase"
          >
            Apply Refinement
          </Button>
        </div>
      </div>
    </Modal>
  )
}
