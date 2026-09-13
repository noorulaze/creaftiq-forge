import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/shared'
import { getProject, saveProjectOutputs, updateProjectStatus } from '@/services/firestore'
import { runFullForge } from '@/services/ai'
import { useForgeStore } from '@/store/useForgeStore'
import { cn } from '@/utils/cn'

const STAGE_LABELS = [
  'UNDERSTANDING IDEA',
  'FINDING DIRECTION',
  'BUILDING STRATEGY',
  'CRAFTING BLUEPRINT',
]

const STAGE_DESCRIPTIONS = [
  'Extracting core intent, audience resonance, and fundamental purpose...',
  'Defining aesthetic tone, brand personality, and market positioning...',
  'Mapping product architecture, feature priorities, and user journeys...',
  'Synthesizing digital launch roadmap, channels, and content vectors...',
]

export function ForgingPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { setForgingStage, setForgingError } = useForgeStore()

  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const hasStarted = useRef(false)

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
        ({ stageIndex }) => {
          // Map 6 AI steps into the 4 clean polished user stages
          const mappedStage = Math.min(3, Math.floor((stageIndex / 5) * 3.99))
          setCurrentStage(mappedStage)
          setCompletedStages(prev => {
            const next = [...prev]
            for (let i = 0; i < mappedStage; i++) {
              if (!next.includes(i)) next.push(i)
            }
            return next
          })
          setForgingStage(null, mappedStage, STAGE_LABELS[mappedStage])
        },
      )

      await saveProjectOutputs(projectId, outputs)
      await updateProjectStatus(projectId, 'complete')

      setCompletedStages([0, 1, 2, 3])
      setTimeout(() => navigate(`/forge/${projectId}/dna`), 1000)

    } catch (err: unknown) {
      const msg = (err as Error).message || 'An unexpected error occurred during forging.'
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
      
      {/* Background soft lighting and grain */}
      <div className="absolute inset-0 forge-glow-bg pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* Minimal Studio Mark */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-forge-blue/15 border border-forge-blue/30 flex items-center justify-center">
            <span className="text-forge-blue text-xs font-bold font-mono">F</span>
          </div>
          <span className="text-xs font-semibold tracking-widest3 uppercase text-forge-muted">
            CREAFTIQ FORGE
          </span>
        </div>

        {/* Error handling state */}
        {error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-forge-white mb-2">Forging Interrupted</h2>
              <p className="text-forge-muted text-xs leading-relaxed max-w-xs mx-auto">{error}</p>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={<RefreshCw size={14} />}
              onClick={() => { hasStarted.current = false; startForging() }}
              loading={retrying}
            >
              Retry
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Active Stage Label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mb-8"
              >
                <p className="section-label mb-2">STAGE {currentStage + 1} OF 4</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-forge-white uppercase mb-2">
                  {STAGE_LABELS[currentStage]}
                </h2>
                <p className="text-forge-muted text-xs max-w-sm mx-auto leading-relaxed">
                  {STAGE_DESCRIPTIONS[currentStage]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Subtle Pulsing Light Indicator */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-forge-blue"
              />
              <span className="text-2xs font-mono text-forge-muted tracking-widest uppercase">
                INTELLIGENT SYNTHESIS
              </span>
            </div>

            {/* Clean stage list (no fake technical progress percentages) */}
            <div className="space-y-2.5 text-left border border-forge-border/60 bg-forge-surface/60 backdrop-blur-md rounded-xl p-4">
              {STAGE_LABELS.map((label, i) => {
                const isDone = completedStages.includes(i)
                const isCurrent = i === currentStage && !isDone
                const isPending = i > currentStage

                return (
                  <div
                    key={label}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-300',
                      isCurrent && 'bg-forge-blue/10 border border-forge-blue/20',
                      isDone && 'opacity-60',
                      isPending && 'opacity-30',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <CheckCircle size={14} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            className="w-3.5 h-3.5 border-2 border-forge-blue border-t-transparent rounded-full"
                          />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-forge-border" />
                        )}
                      </div>
                      <span className={cn(
                        'text-xs font-medium tracking-wide uppercase',
                        isCurrent ? 'text-forge-white' : 'text-forge-muted'
                      )}>
                        {label}
                      </span>
                    </div>

                    <span className="text-2xs font-mono text-forge-muted">
                      {isDone ? 'COMPLETE' : isCurrent ? 'PROCESSING' : 'WAITING'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
