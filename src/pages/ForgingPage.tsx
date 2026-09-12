import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, RefreshCw, Zap } from 'lucide-react'
import { Button } from '@/components/shared'
import { getProject, saveProjectOutputs, updateProjectStatus } from '@/services/firestore'
import { runFullForge } from '@/services/ai'
import { useForgeStore } from '@/store/useForgeStore'
import { cn } from '@/utils/cn'

const STAGE_LABELS = [
  'UNDERSTANDING YOUR IDEA',
  'ANALYZING THE AUDIENCE',
  'FINDING THE OPPORTUNITY',
  'BUILDING THE CREATIVE DIRECTION',
  'MAPPING THE DIGITAL EXPERIENCE',
  'PREPARING YOUR BLUEPRINT',
]

const STAGE_DESCRIPTIONS = [
  'Reading your idea and extracting its core intent...',
  'Identifying who this is for and what they care about...',
  'Finding gaps, angles, and opportunities in the space...',
  'Defining the visual, tonal, and strategic identity...',
  'Structuring the digital presence — website, content, channels...',
  'Assembling your complete blueprint across all dimensions...',
]

export function ForgingPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { setForgingStage, setForgingError, forgingError } = useForgeStore()

  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const hasStarted = useRef(false)

  const progress = ((currentStage + 1) / STAGE_LABELS.length) * 100

  async function startForging() {
    if (!projectId) return
    setError(null)
    setForgingError(null)
    hasStarted.current = true

    try {
      const project = await getProject(projectId)
      if (!project) throw new Error('Project not found.')

      await updateProjectStatus(projectId, 'forging')

      const outputs = await runFullForge(
        project.idea,
        project.context,
        ({ stageIndex, stage }) => {
          setCurrentStage(stageIndex)
          setCompletedStages(prev => {
            const next = [...prev]
            if (stageIndex > 0 && !next.includes(stageIndex - 1)) next.push(stageIndex - 1)
            return next
          })
          setForgingStage(null, stageIndex, stage)
        },
      )

      await saveProjectOutputs(projectId, outputs)
      await updateProjectStatus(projectId, 'complete')

      // Complete — navigate to workspace after short delay
      setCompletedStages(STAGE_LABELS.map((_, i) => i))
      setTimeout(() => navigate(`/forge/${projectId}`), 1200)

    } catch (err: unknown) {
      const msg = (err as Error).message || 'An unexpected error occurred.'
      setError(msg)
      setForgingError(msg)
      if (projectId) updateProjectStatus(projectId, 'error').catch(() => {})
    }
  }

  useEffect(() => {
    if (!hasStarted.current) startForging()
  }, [projectId])

  return (
    <div className="min-h-screen bg-forge-black flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 forge-glow-bg pointer-events-none" />

      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-forge-border z-50">
        <motion.div
          className="h-full bg-forge-blue"
          animate={{ width: error ? '100%' : `${progress}%` }}
          style={{ background: error ? '#EF4444' : '#2563EB' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-lg bg-forge-blue/20 border border-forge-blue/30 flex items-center justify-center">
            <Zap size={14} className="text-forge-blue" />
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-forge-muted">CREAFTIQ FORGE</span>
        </div>

        {/* Error state */}
        {error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-forge-white mb-2">Something went wrong</h2>
              <p className="text-forge-muted text-sm">{error}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              icon={<RefreshCw size={15} />}
              onClick={() => { hasStarted.current = false; startForging() }}
              loading={retrying}
            >
              Retry Forging
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Current stage */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-forge-white tracking-tight mb-3">
                  {STAGE_LABELS[currentStage]}
                </h2>
                <p className="text-forge-muted text-sm">{STAGE_DESCRIPTIONS[currentStage]}</p>
              </motion.div>
            </AnimatePresence>

            {/* Pulsing indicator */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 rounded-full bg-forge-blue"
              />
              <span className="text-xs text-forge-muted tracking-widest uppercase">Processing</span>
            </div>

            {/* Stage list */}
            <div className="space-y-2 text-left">
              {STAGE_LABELS.map((label, i) => {
                const isDone    = completedStages.includes(i)
                const isCurrent = i === currentStage && !isDone
                const isPending = i > currentStage

                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300',
                      isCurrent && 'bg-forge-blue/10 border border-forge-blue/20',
                      isDone    && 'opacity-50',
                      isPending && 'opacity-25',
                    )}
                  >
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                      {isDone ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : isCurrent ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-forge-blue border-t-transparent rounded-full"
                        />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-forge-border" />
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium tracking-wider',
                      isCurrent ? 'text-forge-white' : 'text-forge-muted',
                    )}>
                      {label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
