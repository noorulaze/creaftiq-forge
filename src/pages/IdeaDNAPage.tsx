import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Dna, ArrowLeft, Layers, Compass, CheckCircle2, Copy } from 'lucide-react'
import { Button, SkeletonCard } from '@/components/shared'
import { getProject, getProjectOutputs } from '@/services/firestore'
import type { Project, ProjectOutputs } from '@/types'
import toast from 'react-hot-toast'

export function IdeaDNAPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [outputs, setOutputs] = useState<ProjectOutputs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    Promise.all([
      getProject(projectId),
      getProjectOutputs(projectId)
    ]).then(([p, out]) => {
      setProject(p)
      setOutputs(out)
      setLoading(false)
    }).catch(() => {
      toast.error('Could not load Idea DNA.')
      setLoading(false)
    })
  }, [projectId])

  function copyAllDNA() {
    if (!outputs?.ideaDna) return
    const text = `IDEA DNA FOR: ${project?.name || 'Project'}
Core Idea: ${project?.idea}
Target Audience: ${outputs.ideaDna.audience}
Main Problem: ${outputs.ideaDna.problem}
Main Opportunity: ${outputs.ideaDna.opportunity}
Brand Personality: ${outputs.ideaDna.personality}
Suggested Direction: ${outputs.ideaDna.direction}`
    navigator.clipboard.writeText(text)
    toast.success('Idea DNA copied.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-forge-black pt-20 px-4 max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-forge-surface rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={3} />)}
        </div>
      </div>
    )
  }

  const dna = outputs?.ideaDna

  return (
    <div className="min-h-screen bg-forge-black pt-14 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Top breadcrumb & actions */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-forge-muted hover:text-forge-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>MY FORGES</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              icon={<Copy size={13} />}
              onClick={copyAllDNA}
              className="text-xs"
            >
              COPY DNA
            </Button>
            <Link to={`/forge/${projectId}`}>
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight size={14} />}
                iconPosition="right"
                className="text-xs tracking-wider uppercase font-semibold"
              >
                OPEN WORKSPACE
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Title */}
        <div className="mb-10 border-b border-forge-border pb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Dna size={14} className="text-forge-blue" />
            <span className="section-label">SYNTHESIZED FOUNDATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-forge-white mb-2">
            Idea DNA Analysis
          </h1>
          <p className="text-forge-muted text-sm max-w-2xl">
            {project?.name || 'Your Project'} — deconstructed across six foundational strategic dimensions before full blueprint generation.
          </p>
        </div>

        {/* DNA Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Core Idea */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-6 border-l-2 border-l-forge-blue"
          >
            <span className="section-label mb-2 block">01 / CORE IDEA</span>
            <h3 className="text-base font-semibold text-forge-white mb-2">The Raw Vision</h3>
            <p className="text-forge-muted text-sm leading-relaxed">{project?.idea}</p>
          </motion.div>

          {/* 2. Target Audience */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-6 border-l-2 border-l-forge-blue"
          >
            <span className="section-label mb-2 block">02 / TARGET AUDIENCE</span>
            <h3 className="text-base font-semibold text-forge-white mb-2">Who It's Built For</h3>
            <p className="text-forge-muted text-sm leading-relaxed">{dna?.audience || 'Analyzing demographic...'}</p>
          </motion.div>

          {/* 3. Main Problem */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-6 border-l-2 border-l-forge-blue"
          >
            <span className="section-label mb-2 block">03 / MAIN PROBLEM</span>
            <h3 className="text-base font-semibold text-forge-white mb-2">The Tension in the Market</h3>
            <p className="text-forge-muted text-sm leading-relaxed">{dna?.problem || 'Analyzing market gap...'}</p>
          </motion.div>

          {/* 4. Main Opportunity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-6 border-l-2 border-l-forge-blue"
          >
            <span className="section-label mb-2 block">04 / MAIN OPPORTUNITY</span>
            <h3 className="text-base font-semibold text-forge-white mb-2">The Unfair Advantage</h3>
            <p className="text-forge-muted text-sm leading-relaxed">{dna?.opportunity || 'Synthesizing opportunity...'}</p>
          </motion.div>

          {/* 5. Brand Personality */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-6 border-l-2 border-l-forge-blue"
          >
            <span className="section-label mb-2 block">05 / BRAND PERSONALITY</span>
            <h3 className="text-base font-semibold text-forge-white mb-2">Voice & Presence</h3>
            <p className="text-forge-muted text-sm leading-relaxed">{dna?.personality || 'Formulating voice...'}</p>
          </motion.div>

          {/* 6. Suggested Direction */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-xl border border-forge-border bg-forge-surface p-6 border-l-2 border-l-forge-blue"
          >
            <span className="section-label mb-2 block">06 / SUGGESTED DIRECTION</span>
            <h3 className="text-base font-semibold text-forge-white mb-2">Strategic Trajectory</h3>
            <p className="text-forge-muted text-sm leading-relaxed">{dna?.direction || 'Mapping trajectory...'}</p>
          </motion.div>

        </div>

        {/* Forward Callout to Workspace */}
        <div className="mt-10 rounded-2xl border border-forge-border/80 bg-forge-navy/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-forge-white">Ready to explore the Forge Blueprint?</h4>
            <p className="text-forge-muted text-xs leading-relaxed max-w-xl">
              The Idea DNA is fully converted into actionable tabs for Brand, Product, Website, Content, Marketing, and Launch Roadmap.
            </p>
          </div>
          <Link to={`/forge/${projectId}`} className="flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={15} />}
              iconPosition="right"
              className="w-full sm:w-auto text-xs font-semibold tracking-wider uppercase px-6"
            >
              EXPLORE BLUEPRINT
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
