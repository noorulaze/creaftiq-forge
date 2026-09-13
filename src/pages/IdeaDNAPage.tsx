import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Dna, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  Tag, 
  Compass, 
  Edit3 
} from 'lucide-react'
import { Button, SkeletonCard, Modal, EmptyState } from '@/components/shared'
import { MountainBackdrop } from '@/components/landing/MountainBackdrop'
import { getProject, getProjectOutputs, saveProjectOutputs } from '@/services/firestore'
import type { Project, ProjectOutputs, IdeaDNA } from '@/types'
import toast from 'react-hot-toast'

interface DecodedIdeaState {
  coreIdea: string
  targetAudience: string
  problem: string
  opportunity: string
  uniqueAngle: string
  personalityTags: string[]
  personalitySummary: string
  mockClarityScore: number
}

const DEFAULT_PERSONALITY_TAGS = ['Bold', 'Youthful', 'Trustworthy', 'Minimal', 'Creative']

export function IdeaDNAPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [outputs, setOutputs] = useState<ProjectOutputs | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [refineOpen, setRefineOpen] = useState(false)

  // Refinement states
  const [refineTones, setRefineTones] = useState<string[]>([])
  const [customRefinePrompt, setCustomRefinePrompt] = useState('')
  const [isApplyingRefine, setIsApplyingRefine] = useState(false)

  // Active decoded data state
  const [decodedData, setDecodedData] = useState<DecodedIdeaState | null>(null)

  useEffect(() => {
    let isMounted = true
    const activeId = projectId || 'proj_demo_1'

    async function loadData() {
      try {
        let currentProject = await getProject(activeId)
        let currentOutputs = await getProjectOutputs(activeId)

        // Fallback: check localStorage if firestore record is empty
        if (!currentProject) {
          try {
            const pendingRaw = localStorage.getItem('forge_pending_submission') || localStorage.getItem('forge_last_project')
            if (pendingRaw) {
              const parsed = JSON.parse(pendingRaw)
              currentProject = {
                id: activeId,
                uid: 'user_demo_1',
                name: parsed.projectName || parsed.name || 'Kerala Streetwear Brand',
                idea: parsed.ideaDescription || parsed.idea || 'A premium localized streetwear apparel label rooted in Kerala subculture.',
                context: {
                  name: parsed.projectName || 'Kerala Streetwear Brand',
                  industry: parsed.industry || 'Fashion',
                  targetAudience: parsed.targetAudience || 'College students in Kerala',
                  mainGoal: parsed.mainGoal || 'Launch a brand',
                },
                status: 'complete',
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            }
          } catch {
            // Ignored
          }
        }

        // Generate or synthesize structured analysis
        const ideaText = currentProject?.idea || 'A modern digital creative venture'
        const projectName = currentProject?.name || 'Creative Venture'
        const industry = currentProject?.context?.industry || 'Creative Services'
        const audienceContext = currentProject?.context?.targetAudience || 'Modern digitally-native creators and consumers'

        const synthesizedData: DecodedIdeaState = {
          coreIdea: currentOutputs?.ideaDna?.purpose || 
            `A specialized ${industry.toLowerCase()} venture engineered to deliver high-craft, culture-first experiences around "${projectName}".`,
          targetAudience: currentProject?.context?.targetAudience || currentOutputs?.ideaDna?.audience || 
            `${audienceContext}. Culture-forward individuals seeking authenticity, high design standards, and localized identity.`,
          problem: currentOutputs?.ideaDna?.problem || 
            `Existing options in the market are generic, overpriced, and disconnected from genuine regional creative expression and community pride.`,
          opportunity: currentOutputs?.ideaDna?.opportunity || 
            `A clear market gap exists for an uncompromising, design-driven brand that combines localized authenticity with contemporary digital execution.`,
          uniqueAngle: currentOutputs?.ideaDna?.direction || 
            `Blending authentic localized grassroots cultural narratives with premium editorial aesthetics and limited, hype-driven drop architecture.`,
          personalityTags: DEFAULT_PERSONALITY_TAGS,
          personalitySummary: currentOutputs?.ideaDna?.personality || 
            `Bold, youthful, trustworthy, minimal, and creative. Speaks with clarity, authentic pride, and uncompromising creative integrity.`,
          mockClarityScore: 92,
        }

        if (isMounted) {
          setProject(currentProject)
          setOutputs(currentOutputs)
          setDecodedData(synthesizedData)
          setLoading(false)
        }
      } catch {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [projectId])

  function handleCopyDNA() {
    if (!decodedData) return

    const copyText = `====================================================
CREAFTIQ FORGE — IDEA DNA ANALYSIS
Project: ${project?.name || 'Project'}
Status: Decoded
Mock Clarity Rating: ${decodedData.mockClarityScore}% (Local Estimate)
====================================================

1. CORE IDEA:
${decodedData.coreIdea}

2. TARGET AUDIENCE:
${decodedData.targetAudience}

3. PROBLEM:
${decodedData.problem}

4. OPPORTUNITY:
${decodedData.opportunity}

5. UNIQUE ANGLE:
${decodedData.uniqueAngle}

6. BRAND PERSONALITY:
Tags: ${decodedData.personalityTags.join(', ')}
Voice: ${decodedData.personalitySummary}

7. IDEA CLARITY:
${decodedData.mockClarityScore}% — Concept definition and market direction are clearly articulated.
(Note: Visual clarity rating is a mock heuristic estimate, not a real AI calculation).
`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyText).then(() => {
        setCopied(true)
        toast.success('Idea DNA copied to clipboard.')
        setTimeout(() => setCopied(false), 2400)
      }).catch(() => {
        toast.error('Failed to copy to clipboard.')
      })
    } else {
      toast.error('Clipboard not accessible in this environment.')
    }
  }

  function handleApplyRefinement() {
    if (!decodedData) return
    setIsApplyingRefine(true)

    setTimeout(() => {
      let updatedTags = [...decodedData.personalityTags]
      if (refineTones.length > 0) {
        updatedTags = Array.from(new Set([...refineTones, ...updatedTags])).slice(0, 5)
      }

      setDecodedData(prev => prev ? ({
        ...prev,
        personalityTags: updatedTags,
        uniqueAngle: customRefinePrompt.trim() 
          ? `${prev.uniqueAngle} Refined focus: ${customRefinePrompt.trim()}`
          : prev.uniqueAngle,
        mockClarityScore: Math.min(98, prev.mockClarityScore + 3),
      }) : null)

      setIsApplyingRefine(false)
      setRefineOpen(false)
      toast.success('Idea DNA updated with your local refinement.')
    }, 600)
  }

  function toggleRefineTone(tone: string) {
    setRefineTones(prev => 
      prev.includes(tone) ? prev.filter(t => t !== tone) : [...prev, tone]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-forge-black pt-28 pb-20 px-4 max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-forge-surface rounded animate-pulse" />
        <div className="h-14 w-full bg-forge-surface rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} lines={4} />
          ))}
        </div>
      </div>
    )
  }

  if (!project && !decodedData) {
    return (
      <div className="min-h-screen bg-forge-black pt-28 pb-20 px-4 flex items-center justify-center">
        <EmptyState
          icon={Dna}
          title="No Idea DNA Found"
          description="Could not locate project parameters. Start fresh with an idea to synthesize a new blueprint."
          action={
            <Link to="/forge/new">
              <Button variant="primary" size="md">
                START WITH AN IDEA
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const activeId = projectId || project?.id || 'demo_project'

  return (
    <div className="relative min-h-screen bg-forge-black pt-24 sm:pt-28 pb-24 overflow-hidden">
      {/* Background atmosphere */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* Top Breadcrumb & Action Row                                   */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-forge-border/60">
          
          {/* Back to Edit Idea Action */}
          <Link
            to="/forge/new"
            className="inline-flex items-center gap-2 text-2xs font-semibold tracking-widest uppercase text-forge-muted hover:text-forge-white transition-colors group"
          >
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO EDIT IDEA</span>
          </Link>

          {/* Action Buttons: Copy, Refine, Continue */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Copy Idea DNA */}
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              onClick={handleCopyDNA}
              className="text-2xs font-semibold tracking-wider uppercase px-3.5 py-2"
            >
              {copied ? 'COPIED!' : 'COPY IDEA DNA'}
            </Button>

            {/* Refine Idea */}
            <Button
              variant="ghost"
              size="sm"
              icon={<Sliders size={13} />}
              onClick={() => setRefineOpen(true)}
              className="text-2xs font-semibold tracking-wider uppercase border border-forge-border/70 hover:border-forge-border px-3.5 py-2 text-forge-muted hover:text-forge-white"
            >
              REFINE IDEA
            </Button>

            {/* Continue to Blueprint */}
            <Link to={`/forge/${activeId}`}>
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={13} />}
                iconPosition="right"
                className="text-2xs font-bold tracking-widest uppercase px-4 py-2 shadow-blue-glow-sm cursor-pointer"
              >
                CONTINUE TO BLUEPRINT
              </Button>
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Header: YOUR IDEA, DECODED.                                   */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
            <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-white">
              CREAFTIQ FORGE
            </span>
            <span className="text-forge-border">/</span>
            <span className="text-2xs font-mono text-forge-muted">STRATEGIC DOSSIER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-forge-white uppercase leading-none mb-4">
            YOUR IDEA, <span className="text-gradient-blue font-bold">DECODED.</span>
          </h1>

          {/* Project Summary Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-2xs font-mono text-forge-muted pt-1">
            <span className="text-sm font-bold text-forge-white">
              {project?.name || 'Untitled Idea'}
            </span>
            {project?.context?.industry && (
              <>
                <span className="text-forge-border">•</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border text-forge-muted">
                  INDUSTRY: <span className="text-forge-white">{project.context.industry}</span>
                </span>
              </>
            )}
            {project?.context?.targetAudience && (
              <>
                <span className="text-forge-border hidden sm:inline">•</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border text-forge-muted">
                  TARGET: <span className="text-forge-white">{project.context.targetAudience}</span>
                </span>
              </>
            )}
            {project?.context?.mainGoal && (
              <>
                <span className="text-forge-border hidden sm:inline">•</span>
                <span className="px-2 py-0.5 rounded bg-forge-surface border border-forge-border text-forge-muted">
                  GOAL: <span className="text-forge-white">{project.context.mainGoal}</span>
                </span>
              </>
            )}
            <span className="text-forge-border">•</span>
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              SYNTHESIZED
            </span>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* Section 7 Spotlight: Visual Idea Clarity Indicator           */}
        {/* (Clearly labeled mock value, not presented as real AI)       */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-8 rounded-2xl border border-forge-blue/35 bg-forge-surface/90 backdrop-blur-xl p-6 sm:p-7 shadow-card relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-xl text-left">
              <div className="flex items-center gap-2">
                <span className="section-label text-2xs">07 / IDEA CLARITY</span>
                <span className="text-2xs font-mono text-forge-muted uppercase px-2 py-0.5 rounded bg-forge-navy border border-forge-border">
                  MOCK HEURISTIC ESTIMATE
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-forge-white">
                Strong Conceptual Foundation & Directional Viability
              </h3>
              <p className="text-2xs sm:text-xs text-forge-muted leading-relaxed font-light">
                {/* Explicit mock disclosure per user requirement */}
                <span className="text-forge-blue font-mono font-medium">DISCLAIMER:</span> This indicator is a clearly labeled mock heuristic value generated for preview purposes and is not a real AI calculation.
              </p>
            </div>

            {/* Visual Clarity Gauge */}
            <div className="flex items-center gap-6 lg:border-l lg:border-forge-border/60 lg:pl-8">
              <div className="text-left">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-forge-white">
                    {decodedData?.mockClarityScore || 92}
                  </span>
                  <span className="text-xs font-mono text-forge-muted">/ 100</span>
                </div>
                <span className="text-2xs font-mono text-emerald-400 font-bold block mt-0.5">
                  HIGH CLARITY TIER
                </span>
              </div>

              <div className="w-36 sm:w-44 space-y-1.5 text-left">
                <div className="w-full bg-forge-navy rounded-full h-2 overflow-hidden border border-forge-border">
                  <div 
                    className="h-full bg-gradient-to-r from-forge-blue to-forge-blue-light rounded-full"
                    style={{ width: `${decodedData?.mockClarityScore || 92}%` }}
                  />
                </div>
                <div className="flex justify-between text-2xs font-mono text-forge-muted">
                  <span>UNFORMED</span>
                  <span className="text-forge-white font-medium">LAUNCH-READY</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* The Core 6 Idea DNA Dimension Sections                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* 1. Core Idea */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="md:col-span-2 lg:col-span-2 rounded-2xl border border-forge-border bg-forge-surface/90 p-6 sm:p-7 flex flex-col justify-between hover:border-forge-border2 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label text-2xs">01 / CORE IDEA</span>
                <Sparkles size={14} className="text-forge-blue" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-forge-white mb-2 leading-snug">
                The Core Value Proposition
              </h3>
              <p className="text-xs sm:text-sm text-forge-white/90 leading-relaxed font-light mb-4">
                {decodedData?.coreIdea}
              </p>

              {/* Raw Submitted Context Quote */}
              <div className="p-3.5 rounded-xl border border-forge-border/60 bg-forge-navy/60 text-left">
                <span className="text-2xs font-mono text-forge-muted uppercase block mb-1">
                  SUBMITTED RAW PROMPT:
                </span>
                <p className="text-2xs font-mono text-forge-muted/90 italic leading-relaxed">
                  &quot;{project?.idea}&quot;
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-forge-border/50 flex items-center justify-between text-2xs font-mono text-forge-muted">
              <span>STATUS: CLARIFIED</span>
              <span className="text-forge-blue">1-2 SENTENCE SYNTHESIS</span>
            </div>
          </motion.div>

          {/* 2. Target Audience */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-2xl border border-forge-border bg-forge-surface/90 p-6 sm:p-7 flex flex-col justify-between hover:border-forge-border2 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label text-2xs">02 / TARGET AUDIENCE</span>
                <Target size={14} className="text-forge-blue" />
              </div>
              <h3 className="text-base font-bold text-forge-white mb-2">
                Who It Is Intended For
              </h3>
              <p className="text-xs text-forge-muted leading-relaxed font-light mb-4">
                {decodedData?.targetAudience}
              </p>
            </div>

            <div className="pt-4 border-t border-forge-border/50 text-2xs font-mono text-forge-muted flex items-center justify-between">
              <span>AUDIENCE PROFILE</span>
              <span className="text-forge-blue font-medium">HIGH INTENT</span>
            </div>
          </motion.div>

          {/* 3. Problem */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-2xl border border-forge-border bg-forge-surface/90 p-6 sm:p-7 flex flex-col justify-between hover:border-forge-border2 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label text-2xs">03 / PROBLEM</span>
                <AlertTriangle size={14} className="text-forge-blue" />
              </div>
              <h3 className="text-base font-bold text-forge-white mb-2">
                Friction & Unmet Need
              </h3>
              <p className="text-xs text-forge-muted leading-relaxed font-light mb-4">
                {decodedData?.problem}
              </p>
            </div>

            <div className="pt-4 border-t border-forge-border/50 text-2xs font-mono text-forge-muted flex items-center justify-between">
              <span>GRAVITY RATING</span>
              <span className="text-red-400 font-medium">SEVERE MARKET PAIN</span>
            </div>
          </motion.div>

          {/* 4. Opportunity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="rounded-2xl border border-forge-border bg-forge-surface/90 p-6 sm:p-7 flex flex-col justify-between hover:border-forge-border2 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label text-2xs">04 / OPPORTUNITY</span>
                <TrendingUp size={14} className="text-forge-blue" />
              </div>
              <h3 className="text-base font-bold text-forge-white mb-2">
                Why This Matters Now
              </h3>
              <p className="text-xs text-forge-muted leading-relaxed font-light mb-4">
                {decodedData?.opportunity}
              </p>
            </div>

            <div className="pt-4 border-t border-forge-border/50 text-2xs font-mono text-forge-muted flex items-center justify-between">
              <span>MARKET TIMING</span>
              <span className="text-emerald-400 font-medium">HIGH UPSIDE</span>
            </div>
          </motion.div>

          {/* 5. Unique Angle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="rounded-2xl border border-forge-border bg-forge-surface/90 p-6 sm:p-7 flex flex-col justify-between hover:border-forge-border2 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label text-2xs">05 / UNIQUE ANGLE</span>
                <Zap size={14} className="text-forge-blue" />
              </div>
              <h3 className="text-base font-bold text-forge-white mb-2">
                What Makes It Different
              </h3>
              <p className="text-xs text-forge-muted leading-relaxed font-light mb-4">
                {decodedData?.uniqueAngle}
              </p>
            </div>

            <div className="pt-4 border-t border-forge-border/50 text-2xs font-mono text-forge-muted flex items-center justify-between">
              <span>DEFENSIBLE MOAT</span>
              <span className="text-forge-blue font-medium">MEMORABLE EDGE</span>
            </div>
          </motion.div>

          {/* 6. Brand Personality */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="md:col-span-2 lg:col-span-3 rounded-2xl border border-forge-border bg-forge-surface/90 p-6 sm:p-7 flex flex-col justify-between hover:border-forge-border2 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label text-2xs">06 / BRAND PERSONALITY</span>
                <Tag size={14} className="text-forge-blue" />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-forge-white mb-1">
                    Voice, Demeanor & Tonal Attributes
                  </h3>
                  <p className="text-xs text-forge-muted font-light leading-relaxed max-w-xl">
                    {decodedData?.personalitySummary}
                  </p>
                </div>

                {/* 3 to 5 Personality Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {decodedData?.personalityTags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-forge-blue/30 bg-forge-blue/10 text-xs font-mono font-semibold text-forge-white shadow-blue-glow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-forge-border/50 text-2xs font-mono text-forge-muted flex items-center justify-between">
              <span>VERBAL ARCHETYPE</span>
              <span className="text-forge-blue font-medium">AUTHENTIC & DIRECT</span>
            </div>
          </motion.div>

        </div>

        {/* ============================================================ */}
        {/* Forward Callout to Full Blueprint Workspace                  */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 rounded-2xl border border-forge-border/80 bg-forge-navy/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card"
        >
          <div className="space-y-1.5 text-left">
            <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
              READY FOR FULL EXECUTION
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-forge-white">
              Continue to the Forge Blueprint Workspace
            </h4>
            <p className="text-forge-muted text-xs sm:text-sm font-light leading-relaxed max-w-2xl">
              Your Idea DNA serves as the foundational core. Explore the complete digital launch plan covering Brand Direction, Product Specs, Website Wireframes, Content Engine, Marketing Strategy, and Launch Roadmap.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to={`/forge/${activeId}`} className="w-full md:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight size={15} />}
                iconPosition="right"
                className="w-full md:w-auto text-xs font-bold tracking-widest uppercase px-8 py-3.5 rounded-xl shadow-blue-glow-sm cursor-pointer"
              >
                CONTINUE TO BLUEPRINT
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>

      {/* ============================================================ */}
      {/* Local Refinement Modal Dialog (`REFINE IDEA`)                */}
      {/* ============================================================ */}
      <Modal
        open={refineOpen}
        onClose={() => setRefineOpen(false)}
        title="REFINE IDEA DNA"
        size="lg"
      >
        <div className="space-y-6 text-left">
          <div>
            <p className="text-xs text-forge-muted leading-relaxed font-light">
              Adjust tonal levers or inject specific instructions to sharpen your Idea DNA analysis before exploring the Blueprint.
            </p>
          </div>

          {/* Tone Levers */}
          <div>
            <label className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2.5">
              ADJUST TONAL TRAITS
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Bold',
                'Minimal',
                'Youthful',
                'Trustworthy',
                'Creative',
                'Authoritative',
                'Cult-Driven',
                'Luxury',
              ].map(tone => {
                const isSelected = refineTones.includes(tone)
                return (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => toggleRefineTone(tone)}
                    className={`px-3 py-1.5 rounded-lg border text-2xs font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'border-forge-blue bg-forge-blue/20 text-white font-bold'
                        : 'border-forge-border bg-forge-navy text-forge-muted hover:border-forge-border2 hover:text-forge-white'
                    }`}
                  >
                    {tone}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Prompt Note */}
          <div>
            <label className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
              ADDITIONAL INSTRUCTIONS
            </label>
            <textarea
              value={customRefinePrompt}
              onChange={e => setCustomRefinePrompt(e.target.value)}
              placeholder="e.g. Emphasize organic sustainability, local community pride, and premium limited drop packaging..."
              className="w-full min-h-[100px] bg-forge-navy border border-forge-border hover:border-forge-border2 focus:border-forge-blue rounded-xl p-3.5 text-xs text-forge-white placeholder:text-forge-muted/40 outline-none transition-all resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRefineOpen(false)}
              className="text-xs font-semibold uppercase text-forge-muted hover:text-forge-white"
            >
              CANCEL
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isApplyingRefine}
              onClick={handleApplyRefinement}
              className="text-xs font-bold tracking-wider uppercase px-5"
            >
              APPLY REFINEMENT
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}
