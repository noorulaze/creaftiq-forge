import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal, Button } from '@/components/shared'
import type { BlueprintSection } from '@/types'
import { cn } from '@/utils/cn'

const PRESETS = [
  { id: 'more-premium',      label: 'More premium'      },
  { id: 'more-youthful',     label: 'More youthful'     },
  { id: 'more-minimal',      label: 'More minimal'      },
  { id: 'more-bold',         label: 'More bold'         },
  { id: 'more-professional', label: 'More professional' },
  { id: 'simplify',          label: 'Simplify'          },
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
        <p className="text-forge-muted text-sm">
          Choose a direction or write your own instruction for this section.
        </p>

        {/* Preset pills */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelected(selected === preset.id ? null : preset.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                selected === preset.id
                  ? 'bg-forge-blue border-forge-blue text-white'
                  : 'bg-forge-surface border-forge-border text-forge-muted hover:text-forge-white hover:border-forge-border2',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom instruction */}
        <div>
          <label className="forge-label">Custom Instruction</label>
          <textarea
            value={custom}
            onChange={e => { setCustom(e.target.value); setSelected('custom') }}
            placeholder="Make it more conversational and direct..."
            className="forge-input resize-none h-20 text-sm"
            disabled={loading}
          />
        </div>

        {/* Actions */}
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
          >
            Refine
          </Button>
        </div>
      </div>
    </Modal>
  )
}
