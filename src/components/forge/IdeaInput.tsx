// ============================================================
// CREAFTIQ FORGE — IdeaInput Component
// ============================================================
import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

// ─── Constants ───────────────────────────────────────────────
const MAX_CHARS = 500

const EXAMPLE_IDEAS: string[] = [
  'A streetwear brand for college students',
  'A modern cafe in Kerala',
  'A fitness app for beginners',
  'A creative agency',
  'A new mobile app',
]

// ─── Props ───────────────────────────────────────────────────
interface IdeaInputProps {
  value: string
  onChange: (value: string) => void
  error?: string | null
  disabled?: boolean
  autoFocus?: boolean
}

// ─── Cursor Blink ────────────────────────────────────────────
function AnimatedCursor() {
  return (
    <motion.span
      className="inline-block w-0.5 h-7 bg-forge-blue align-middle ml-0.5"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'steps(1)' }}
      aria-hidden
    />
  )
}

// ─── Example Chip ────────────────────────────────────────────
interface ExampleChipProps {
  text: string
  onClick: () => void
  disabled?: boolean
}

function ExampleChip({ text, onClick, disabled }: ExampleChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-left',
        'border-forge-border text-forge-muted text-xs font-medium tracking-wide',
        'transition-colors duration-200',
        'hover:border-forge-blue/50 hover:text-forge-muted2 hover:bg-forge-blue/5',
        'focus:outline-none focus:ring-1 focus:ring-forge-blue/40',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      )}
    >
      <span className="text-forge-blue/60 text-[10px]">↗</span>
      {text}
    </motion.button>
  )
}

// ─── Character Counter ───────────────────────────────────────
function CharCounter({ count, max }: { count: number; max: number }) {
  const pct = count / max
  const isWarning = pct > 0.8
  const isLimit   = pct >= 1

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs font-mono transition-colors duration-300',
        isLimit   ? 'text-red-400'         :
        isWarning ? 'text-amber-400/80'    :
                    'text-forge-muted',
      )}
    >
      {/* Mini radial progress ring */}
      <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0" aria-hidden>
        <circle
          cx="9" cy="9" r="7"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        <circle
          cx="9" cy="9" r="7"
          fill="none"
          stroke="currentColor"
          strokeOpacity={isLimit ? 1 : isWarning ? 0.8 : 0.5}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${Math.PI * 14 * Math.min(pct, 1)} ${Math.PI * 14}`}
          transform="rotate(-90 9 9)"
          style={{ transition: 'stroke-dasharray 0.3s ease' }}
        />
      </svg>
      <span>
        {count}
        <span className="text-forge-muted/50">/{max}</span>
      </span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────
export function IdeaInput({
  value,
  onChange,
  error,
  disabled = false,
  autoFocus = false,
}: IdeaInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [examplesVisible, setExamplesVisible] = useState(true)

  // Auto-resize textarea
  const resize = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  // Hide examples when user starts typing
  useEffect(() => {
    setExamplesVisible(value.length === 0)
  }, [value])

  // Auto focus
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value
    if (raw.length <= MAX_CHARS) {
      onChange(raw)
    }
  }

  const handleExampleClick = (example: string) => {
    onChange(example)
    textareaRef.current?.focus()
  }

  const isEmpty = value.length === 0

  return (
    <div className="w-full space-y-4">
      {/* ── Textarea wrapper ── */}
      <motion.div
        initial={false}
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(37,99,235,0.35), 0 0 40px rgba(37,99,235,0.08)'
            : error
            ? '0 0 0 1.5px rgba(239,68,68,0.5)'
            : '0 0 0 1px rgba(31,41,55,1)',
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative w-full rounded-2xl bg-forge-surface overflow-hidden',
          'transition-colors duration-200',
          disabled && 'opacity-60 cursor-not-allowed',
        )}
      >
        {/* Subtle gradient top accent when focused */}
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-px transition-opacity duration-300',
            isFocused ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(37,99,235,0.6), transparent)',
          }}
          aria-hidden
        />

        {/* Placeholder + cursor (shown when empty) */}
        <AnimatePresence>
          {isEmpty && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute top-5 left-5 right-5 pointer-events-none select-none"
            >
              <span className="text-forge-muted text-xl font-light">
                I want to create...
              </span>
              {!isFocused && <AnimatedCursor />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          rows={3}
          spellCheck
          aria-label="Describe your idea"
          aria-invalid={!!error}
          className={cn(
            'relative w-full min-h-[96px] resize-none bg-transparent',
            'px-5 py-5 text-xl text-forge-white font-light leading-relaxed',
            'focus:outline-none placeholder-transparent',
            'transition-colors duration-200',
            disabled && 'cursor-not-allowed',
          )}
          style={{ caretColor: '#2563EB' }}
        />

        {/* Footer: char count */}
        <div className="flex items-center justify-end px-5 pb-3 pt-1">
          <CharCounter count={value.length} max={MAX_CHARS} />
        </div>
      </motion.div>

      {/* ── Inline error ── */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-red-400 text-sm font-medium pl-1 flex items-center gap-1.5"
            role="alert"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M7 4v3.5M7 9.5v.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Example ideas ── */}
      <AnimatePresence>
        {examplesVisible && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-2">
              <p className="text-forge-muted/60 text-xs uppercase tracking-widest font-medium pl-0.5">
                Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_IDEAS.map((idea, i) => (
                  <motion.div
                    key={idea}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.25 }}
                  >
                    <ExampleChip
                      text={idea}
                      onClick={() => handleExampleClick(idea)}
                      disabled={disabled}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default IdeaInput
