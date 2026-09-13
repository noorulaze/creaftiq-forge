import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MountainBackdrop } from '@/components/landing/MountainBackdrop'
import { getProject, saveProjectOutputs, updateProjectStatus } from '@/services/firestore'
import { runFullForge } from '@/services/ai'

const STEPS = [
  { 
    id: 'understanding', 
    label: 'UNDERSTANDING THE CONCEPT', 
    desc: 'Analyzing core intent, audience resonance, and creative tension...' 
  },
  { 
    id: 'direction',     
    label: 'FINDING THE DIRECTION',      
    desc: 'Synthesizing tone, brand personality, and distinct market positioning...' 
  },
  { 
    id: 'blueprint',     
    label: 'BUILDING THE BLUEPRINT',     
    desc: 'Assembling brand, digital architecture, content engine, and roadmap...' 
  },
]

export function ForgingPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    // Controlled stage animation without fake percentages
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 2000)

    async function executeSampleForging() {
      try {
        if (!projectId) return

        const project = await getProject(projectId)
        const idea = project?.idea || 'Creative Project'
        const context = project?.context || {}

        // Execute background forge pipeline (mock / sample logic)
        const outputs = await runFullForge(
          idea,
          context,
          () => {}, // No fake progress bars
        )

        if (!isMounted) return

        await saveProjectOutputs(projectId, outputs)
        await updateProjectStatus(projectId, 'complete')

        // Seamless, calm transition into Idea DNA once finished
        setTimeout(() => {
          if (isMounted) navigate(`/forge/${projectId}/dna`)
        }, 1400)
      } catch {
        // Safe graceful fallback
        setTimeout(() => {
          if (isMounted) navigate(`/forge/${projectId}/dna`)
        }, 3200)
      }
    }

    executeSampleForging()

    return () => {
      isMounted = false
      clearInterval(stepInterval)
    }
  }, [projectId, navigate])

  return (
    <div className="relative min-h-screen bg-forge-black flex flex-col items-center justify-center px-4 overflow-hidden text-center">
      {/* Background: atmospheric blurred mountain and ambient blue light */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-lg mx-auto w-full flex flex-col items-center px-4">
        
        {/* Brand Studio Mark */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
          <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-muted">
            CREAFTIQ FORGE
          </span>
        </motion.div>

        {/* Main Heading: FORGING YOUR IDEA */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-forge-white uppercase leading-none mb-6"
        >
          FORGING YOUR IDEA
        </motion.h1>

        {/* Smooth animated glowing blue line */}
        <div className="relative w-52 h-0.5 my-4 overflow-hidden rounded-full bg-forge-border/60">
          <motion.div
            animate={shouldReduceMotion ? {} : {
              x: ['-100%', '100%']
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-full bg-gradient-to-r from-transparent via-forge-blue to-transparent"
          />
        </div>

        {/* Active Stage Label & Description */}
        <div className="h-24 flex flex-col items-center justify-center mt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h2 className="text-sm sm:text-base font-bold tracking-widest2 uppercase text-forge-blue-light">
                {STEPS[currentStepIndex].label}
              </h2>
              <p className="text-xs text-forge-muted font-light max-w-xs mx-auto leading-relaxed">
                {STEPS[currentStepIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Step Indicators */}
        <div className="flex items-center gap-3 mt-6">
          {STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex
            const isCompleted = idx < currentStepIndex
            return (
              <div key={s.id} className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-400 ${
                    isActive
                      ? 'bg-forge-blue ring-4 ring-forge-blue/20 scale-125'
                      : isCompleted
                      ? 'bg-forge-blue/60'
                      : 'bg-forge-border'
                  }`}
                />
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
