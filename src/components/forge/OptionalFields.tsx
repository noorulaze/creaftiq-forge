// ============================================================
// CREAFTIQ FORGE — OptionalFields Component
// ============================================================
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ProjectContext } from '@/types'

// ─── Props ───────────────────────────────────────────────────
interface OptionalFieldsProps {
  value: ProjectContext
  onChange: (context: ProjectContext) => void
  disabled?: boolean
}

// ─── Single Input Field ──────────────────────────────────────
interface FieldInputProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  hint?: string
}

function FieldInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  hint,
}: FieldInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-widest text-forge-muted"
      >
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1.5px rgba(37,99,235,0.4)'
            : '0 0 0 1px rgba(31,41,55,1)',
        }}
        transition={{ duration: 0.15 }}
        className="rounded-xl overflow-hidden"
      >
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'w-full bg-forge-surface px-4 py-3',
            'text-sm text-forge-white placeholder:text-forge-muted/50',
            'focus:outline-none transition-colors duration-150',
            disabled && 'opacity-60 cursor-not-allowed',
          )}
        />
      </motion.div>
      {hint && (
        <p className="text-forge-muted/50 text-[11px] pl-0.5">{hint}</p>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export function OptionalFields({ value, onChange, disabled = false }: OptionalFieldsProps) {
  const [open, setOpen] = useState(false)

  const update = (key: keyof ProjectContext) => (val: string) => {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'group flex items-center gap-2 text-xs uppercase tracking-widest',
          'font-semibold text-forge-muted hover:text-forge-muted2',
          'transition-colors duration-200 focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
        aria-expanded={open}
        aria-controls="optional-fields-panel"
      >
        {/* Horizontal line left */}
        <span
          className={cn(
            'h-px w-6 transition-all duration-300',
            open ? 'bg-forge-blue/60' : 'bg-forge-border group-hover:bg-forge-border2',
          )}
          aria-hidden
        />

        <span className={cn('transition-colors duration-200', open && 'text-forge-blue/80')}>
          {open ? 'HIDE DETAILS' : 'ADD DETAILS'}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <ChevronDown
            size={14}
            className={cn(
              'transition-colors duration-200',
              open ? 'text-forge-blue/80' : 'text-forge-muted',
            )}
          />
        </motion.span>

        {/* Horizontal line right */}
        <span
          className={cn(
            'h-px flex-1 max-w-[80px] transition-all duration-300',
            open ? 'bg-forge-blue/60' : 'bg-forge-border group-hover:bg-forge-border2',
          )}
          aria-hidden
        />
      </motion.button>

      {/* Collapsible Panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="optional-fields-panel"
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25, ease: 'easeInOut' },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pt-5"
            >
              {/* Panel inner card */}
              <div
                className={cn(
                  'rounded-2xl border border-forge-border bg-forge-surface/50',
                  'p-5 space-y-5',
                )}
              >
                <p className="text-forge-muted/60 text-[11px] uppercase tracking-widest font-medium">
                  Optional — the more you share, the sharper the output
                </p>

                {/* 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FieldInput
                    id="field-name"
                    label="Project Name"
                    placeholder="e.g. Threadline, Apex Cafe"
                    value={value.name ?? ''}
                    onChange={update('name')}
                    disabled={disabled}
                    hint="Leave blank to auto-generate"
                  />
                  <FieldInput
                    id="field-industry"
                    label="Industry"
                    placeholder="e.g. Fashion, F&B, SaaS"
                    value={value.industry ?? ''}
                    onChange={update('industry')}
                    disabled={disabled}
                  />
                  <FieldInput
                    id="field-audience"
                    label="Target Audience"
                    placeholder="e.g. College students aged 18–24"
                    value={value.targetAudience ?? ''}
                    onChange={update('targetAudience')}
                    disabled={disabled}
                  />
                  <FieldInput
                    id="field-location"
                    label="Location"
                    placeholder="e.g. Kerala, India / Remote / Global"
                    value={value.location ?? ''}
                    onChange={update('location')}
                    disabled={disabled}
                  />
                </div>

                {/* Full-width goal */}
                <FieldInput
                  id="field-goal"
                  label="Main Goal"
                  placeholder="e.g. Launch within 3 months, attract investors, build community"
                  value={value.mainGoal ?? ''}
                  onChange={update('mainGoal')}
                  disabled={disabled}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OptionalFields
