import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Dna } from 'lucide-react'
import { motion } from 'framer-motion'

import { useForgeStore } from '@/store/useForgeStore'
import { getProject, subscribeToProjectOutputs, saveProjectOutputs } from '@/services/firestore'
import { refineSection, analyzeIdea, generateBrand, generateProduct, generateWebsite, generateContent, generateMarketing, generateRoadmap, generateCreativeDirection } from '@/services/ai'

import { WorkspaceNav, type ExtendedWorkspaceTab } from '@/components/workspace/WorkspaceNav'
import { AISpecialists } from '@/components/workspace/AISpecialists'
import { IdeaDNASection } from '@/components/workspace/IdeaDNA'
import { IdeaReadinessSection } from '@/components/workspace/IdeaReadiness'
import { CreativeBoard } from '@/components/workspace/CreativeBoard'
import { OverviewTab } from '@/components/workspace/tabs/OverviewTab'
import { BrandTab } from '@/components/workspace/tabs/BrandTab'
import { ProductTab } from '@/components/workspace/tabs/ProductTab'
import { WebsiteTab } from '@/components/workspace/tabs/WebsiteTab'
import { ContentTab } from '@/components/workspace/tabs/ContentTab'
import { MarketingTab } from '@/components/workspace/tabs/MarketingTab'
import { RoadmapTab } from '@/components/workspace/tabs/RoadmapTab'
import { ErrorState, Spinner, Badge, Button } from '@/components/shared'

import type { BlueprintSection, Project, ProjectOutputs } from '@/types'
import toast from 'react-hot-toast'

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const {
    currentOutputs,
    setCurrentOutputs,
    updateOutputs,
    activeSpecialist,
  } = useForgeStore()

  const [activeTab, setActiveTab] = useState<ExtendedWorkspaceTab>('overview')
  const [project, setProject] = useState<Project | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)
  const [outputsLoading, setOutputsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refining, setRefining] = useState(false)

  const unsubRef = useRef<(() => void) | null>(null)

  // Load project meta
  useEffect(() => {
    if (!projectId) return
    getProject(projectId)
      .then(p => { setProject(p); setProjectLoading(false) })
      .catch(() => { setError('Failed to load project.'); setProjectLoading(false) })
  }, [projectId])

  // Subscribe to real-time outputs
  useEffect(() => {
    if (!projectId) return
    unsubRef.current = subscribeToProjectOutputs(projectId, (outputs) => {
      setCurrentOutputs(outputs)
      setOutputsLoading(false)
    })
    return () => unsubRef.current?.()
  }, [projectId, setCurrentOutputs])

  async function handleRefine(section: BlueprintSection, instruction: string) {
    if (!currentOutputs || !projectId) return
    setRefining(true)
    try {
      const currentContent = (currentOutputs as unknown as Record<string, unknown>)[section]
      const refined = await refineSection(
        { section, currentContent, instruction },
        activeSpecialist,
      )
      const update = { [section]: refined } as Partial<ProjectOutputs>
      updateOutputs(update)
      await saveProjectOutputs(projectId, update)
      toast.success(`${section.toUpperCase()} refined.`)
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to refine. Please try again.')
    } finally {
      setRefining(false)
    }
  }

  async function handleRegenerate(section: BlueprintSection) {
    if (!currentOutputs || !projectId) return
    setRefining(true)
    try {
      const dna = currentOutputs.ideaDna
      if (!dna) throw new Error('Idea DNA is required.')
      
      let regeneratedData: unknown
      if (section === 'brand') regeneratedData = await generateBrand(dna)
      else if (section === 'product') regeneratedData = await generateProduct(dna)
      else if (section === 'website') regeneratedData = await generateWebsite(dna)
      else if (section === 'content') regeneratedData = await generateContent(dna, ['instagram', 'website'])
      else if (section === 'marketing') regeneratedData = await generateMarketing(dna)
      else if (section === 'roadmap') regeneratedData = await generateRoadmap(dna)
      else if (section === 'creativeDirection') regeneratedData = await generateCreativeDirection(dna)

      const update = { [section]: regeneratedData } as Partial<ProjectOutputs>
      updateOutputs(update)
      await saveProjectOutputs(projectId, update)
      toast.success(`${section.toUpperCase()} regenerated.`)
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to regenerate section.')
    } finally {
      setRefining(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-forge-black pt-14 flex items-center justify-center">
        <ErrorState message={error} onRetry={() => { setError(null); setProjectLoading(true) }} />
      </div>
    )
  }

  const outputs = currentOutputs

  function renderMainContent() {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10">
            <OverviewTab projectName={project?.name || ''} idea={project?.idea || ''} />
            <IdeaDNASection ideaDna={outputs?.ideaDna ?? null} loading={outputsLoading} />
            <IdeaReadinessSection readiness={outputs?.readiness ?? null} loading={outputsLoading} />
          </div>
        )
      case 'brand':
        return (
          <BrandTab
            brand={outputs?.brand ?? null}
            loading={outputsLoading}
            onRefine={handleRefine}
            refining={refining}
          />
        )
      case 'product':
        return (
          <ProductTab
            product={outputs?.product ?? null}
            loading={outputsLoading}
            onRefine={handleRefine}
            refining={refining}
          />
        )
      case 'website':
        return (
          <WebsiteTab
            website={outputs?.website ?? null}
            loading={outputsLoading}
            onRefine={handleRefine}
            refining={refining}
          />
        )
      case 'content':
        return (
          <ContentTab
            content={outputs?.content ?? null}
            loading={outputsLoading}
            onRefine={handleRefine}
            refining={refining}
          />
        )
      case 'marketing':
        return (
          <MarketingTab
            marketing={outputs?.marketing ?? null}
            loading={outputsLoading}
            onRefine={handleRefine}
            refining={refining}
          />
        )
      case 'roadmap':
        return (
          <RoadmapTab
            roadmap={outputs?.roadmap ?? null}
            loading={outputsLoading}
            onRefine={handleRefine}
            refining={refining}
          />
        )
      case 'creativeDirection':
        return (
          <CreativeBoard
            creativeDirection={outputs?.creativeDirection ?? null}
            loading={outputsLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-forge-black pb-20">

      {/* ── Workspace Top Header ── */}
      <div className="pt-14 border-b border-forge-border bg-forge-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-forge-muted hover:text-forge-white transition-colors p-1.5 rounded-lg hover:bg-forge-surface flex-shrink-0"
                title="Back to Dashboard"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                {projectLoading ? (
                  <div className="h-6 w-48 bg-forge-surface rounded animate-pulse" />
                ) : (
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-lg font-bold text-forge-white truncate tracking-tight">
                      {project?.name || 'Untitled Forge'}
                    </h1>
                    <Badge variant="green" dot>Active Blueprint</Badge>
                  </div>
                )}
                {project?.idea && (
                  <p className="text-forge-muted text-xs mt-0.5 truncate max-w-lg font-light">
                    {project.idea}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Direct Link to Idea DNA Detail */}
              <Link to={`/forge/${projectId}/dna`}>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Dna size={13} />}
                  className="text-2xs uppercase tracking-wider"
                >
                  View Idea DNA
                </Button>
              </Link>

              {refining && (
                <div className="flex items-center gap-2 text-2xs text-forge-blue">
                  <Spinner size="sm" />
                  <span>SYNTHESIZING...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Specialists Selector Bar ── */}
      <AISpecialists />

      {/* ── 7 Workspace Tabs + Overview ── */}
      <WorkspaceNav
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ── Workspace Active Tab View ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {renderMainContent()}
        </motion.div>
      </div>
    </div>
  )
}
