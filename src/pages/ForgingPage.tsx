import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { MountainBackdrop } from '@/components/landing/MountainBackdrop'
import { getProject, saveProjectOutputs, updateProjectStatus, createProject } from '@/services/firestore'
import { useAuthStore } from '@/store/useAuthStore'
import { runFullForge } from '@/services/ai'
import type { ProjectContext } from '@/types'


interface Stage {
  id: string
  number: string
  title: string
  subtitle: string
}

const FORGING_STAGES: Stage[] = [
  {
    id: 'reading',
    number: '01',
    title: 'Reading your idea',
    subtitle: 'Deconstructing core intent and raw input parameters...',
  },
  {
    id: 'opportunity',
    number: '02',
    title: 'Finding the core opportunity',
    subtitle: 'Analyzing market white space and strategic value propositions...',
  },
  {
    id: 'audience',
    number: '03',
    title: 'Understanding your audience',
    subtitle: 'Mapping target user motivations, friction points, and resonance...',
  },
  {
    id: 'creative',
    number: '04',
    title: 'Building your creative direction',
    subtitle: 'Synthesizing visual aesthetics, tone of voice, and brand identity...',
  },
  {
    id: 'blueprint',
    number: '05',
    title: 'Preparing your blueprint',
    subtitle: 'Assembling digital architecture, MVP spec, content hooks, and roadmap...',
  },
]

export function ForgingPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const shouldReduceMotion = useReducedMotion()

  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    const activeId = projectId || 'proj_' + Date.now()

    // Controlled stage advancement (~1.2s per stage for a total ~6s immersion)
    const stageInterval = setInterval(() => {
      setCurrentStageIndex(prev => {
        if (prev < FORGING_STAGES.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1200)

    async function executeMockAnalysis() {
      try {
        // Fallback-resilient project data retrieval
        let idea = 'A modern digital creative venture'
        let context: ProjectContext = { name: 'Creative Project' }

        try {
          const project = await getProject(activeId, user?.uid)
          if (project && project.idea) {
            idea = project.idea
            context = project.context || {}
          } else {
            // Check local temporary storage
            const pendingRaw = localStorage.getItem('forge_pending_submission') || localStorage.getItem('forge_last_project')
            if (pendingRaw) {
              const parsed = JSON.parse(pendingRaw)
              idea = parsed.ideaDescription || parsed.idea || idea
              context = {
                name: parsed.projectName || parsed.name || 'Creative Venture',
                industry: parsed.industry,
                targetAudience: parsed.targetAudience,
                mainGoal: parsed.mainGoal,
              }
            }
          }
        } catch {
          // Graceful fallback
        }

        // Execute background mock synthesis
        const outputs = await runFullForge(idea, context, () => {})

        if (!isMounted) return

        // Save outputs and update status
        await saveProjectOutputs(activeId, outputs, user?.uid, {
          projectName: context.name,
          originalIdea: idea,
          industry: context.industry,
          targetAudience: context.targetAudience,
          mainGoal: context.mainGoal,
        })
        await updateProjectStatus(activeId, 'complete', user?.uid)


        // Allow all 5 stages to display calmly before transitioning
        setTimeout(() => {
          if (isMounted && !isNavigatingRef.current) {
            isNavigatingRef.current = true
            navigate(`/forge/${activeId}/dna`, { replace: true })
          }
        }, 6200)
      } catch {
        // Graceful error fallback
        setTimeout(() => {
          if (isMounted && !isNavigatingRef.current) {
            isNavigatingRef.current = true
            navigate(`/forge/${activeId}/dna`, { replace: true })
          }
        }, 6400)
      }
    }

    executeMockAnalysis()

    return () => {
      isMounted = false
      clearInterval(stageInterval)
    }
  }, [projectId, navigate])

  const activeStage = FORGING_STAGES[currentStageIndex]
  const progressPercent = ((currentStageIndex + 1) / FORGING_STAGES.length) * 100

  return (
    <div className="relative min-h-screen bg-forge-black flex flex-col items-center justify-center px-4 overflow-hidden text-center">
      {/* Background: atmospheric blurred mountain and ambient blue light */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-xl mx-auto w-full flex flex-col items-center px-4 py-8">
        
        {/* Brand Studio Mark: CREAFTIQ FORGE */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
          <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-white">
            CREAFTIQ FORGE
          </span>
          <span className="text-forge-border">/</span>
          <span className="text-2xs font-mono text-forge-muted">ANALYSIS ENGINE</span>
        </motion.div>

        {/* Heading: DECODING YOUR IDEA. */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-forge-white uppercase leading-tight mb-3"
        >
          DECODING <span className="text-gradient-blue font-bold">YOUR IDEA.</span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-xs sm:text-sm text-forge-muted font-light max-w-sm mx-auto leading-relaxed mb-8"
        >
          We are turning your raw thought into a clearer direction.
        </motion.p>

        {/* Electric Blue Animated Progress Line */}
        <div className="w-full max-w-md mb-8">
          <div className="relative w-full h-1 rounded-full bg-forge-border/60 overflow-hidden">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-forge-blue via-forge-blue-light to-forge-blue shadow-blue-glow-sm rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-2xs font-mono text-forge-muted mt-2">
            <span>STAGE 0{currentStageIndex + 1} OF 05</span>
            <span className="text-forge-blue font-semibold">{Math.round(progressPercent)}%</span>
          </div>
        </div>

        {/* Active Stage Spotlight Card */}
        <div className="w-full max-w-md rounded-2xl border border-forge-border/90 bg-forge-surface/90 backdrop-blur-xl p-6 sm:p-7 shadow-card mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xs font-mono text-forge-blue font-bold uppercase tracking-wider">
                  PHASE {activeStage.number} ACTIVE
                </span>
                <span className="inline-flex items-center gap-1.5 text-2xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PROCESSING
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-wide uppercase text-forge-white">
                {activeStage.title}
              </h2>
              <p className="text-xs text-forge-muted font-light leading-relaxed">
                {activeStage.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5 Stages Sequence Ribbon */}
        <div className="w-full max-w-md space-y-2 text-left">
          {FORGING_STAGES.map((stage, idx) => {
            const isDone = idx < currentStageIndex
            const isCurrent = idx === currentStageIndex
            return (
              <div
                key={stage.id}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? 'border-forge-blue/50 bg-forge-navy/90 text-forge-white shadow-blue-glow-sm'
                    : isDone
                    ? 'border-forge-border/60 bg-forge-surface/40 text-forge-muted/80'
                    : 'border-transparent bg-transparent text-forge-muted/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-2xs font-mono ${isCurrent ? 'text-forge-blue font-bold' : 'text-forge-muted/60'}`}>
                    {stage.number}
                  </span>
                  <span className={`text-xs ${isCurrent ? 'font-semibold text-forge-white' : 'font-light'}`}>
                    {stage.title}
                  </span>
                </div>

                {isDone ? (
                  <CheckCircle2 size={14} className="text-forge-blue flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-forge-blue animate-pulse flex-shrink-0" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-forge-border flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
