import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

import { useForgeStore } from '@/store/useForgeStore'
import { getProject, subscribeToProjectOutputs, saveProjectOutputs } from '@/services/firestore'
import { refineSection } from '@/services/ai'

import { WorkspaceNav } from '@/components/workspace/WorkspaceNav'
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
import { ErrorState, Spinner, Badge } from '@/components/shared'

import type { BlueprintSection, Project, ProjectOutputs } from '@/types'
import toast from 'react-hot-toast'

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const {
    activeTab,
    currentOutputs,
    setCurrentOutputs,
    updateOutputs,
    activeSpecialist,
    setActiveTab,
  } = useForgeStore()

  const [project, setProject]             = useState<Project | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)
  const [outputsLoading, setOutputsLoading] = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [refining, setRefining]           = useState(false)
  const [showCreativeBoard, setShowCreativeBoard] = useState(false)

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
      toast.success('Section refined.')
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to refine. Please try again.')
    } finally {
      setRefining(false)
    }
  }

  function handleCreativeBoardToggle() {
    setShowCreativeBoard(!showCreativeBoard)
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
    if (showCreativeBoard) {
      return <CreativeBoard creativeDirection={outputs?.creativeDirection ?? null} loading={outputsLoading} />
    }
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
        return <BrandTab brand={outputs?.brand ?? null} loading={outputsLoading} onRefine={handleRefine} refining={refining} />
      case 'product':
        return <ProductTab product={outputs?.product ?? null} loading={outputsLoading} onRefine={handleRefine} refining={refining} />
      case 'website':
        return <WebsiteTab website={outputs?.website ?? null} loading={outputsLoading} onRefine={handleRefine} refining={refining} />
      case 'content':
        return <ContentTab content={outputs?.content ?? null} loading={outputsLoading} onRefine={handleRefine} refining={refining} />
      case 'marketing':
        return <MarketingTab marketing={outputs?.marketing ?? null} loading={outputsLoading} onRefine={handleRefine} refining={refining} />
      case 'roadmap':
        return <RoadmapTab roadmap={outputs?.roadmap ?? null} loading={outputsLoading} onRefine={handleRefine} refining={refining} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-forge-black">

      {/* ── Workspace Header ── */}
      <div className="pt-14 border-b border-forge-border bg-forge-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-forge-muted hover:text-forge-white transition-colors p-1 flex-shrink-0"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="min-w-0">
                {projectLoading ? (
                  <div className="h-6 w-48 bg-forge-surface rounded animate-pulse" />
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-forge-white truncate">{project?.name || 'Untitled Forge'}</h1>
                    <Badge variant="green" dot>Complete</Badge>
                  </div>
                )}
                {project?.idea && (
                  <p className="text-forge-muted text-xs mt-0.5 truncate max-w-md">{project.idea}</p>
                )}
              </div>
            </div>

            {refining && (
              <div className="flex items-center gap-2 text-xs text-forge-blue flex-shrink-0">
                <Spinner size="sm" />
                <span>Refining...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── AI Specialists bar ── */}
      <AISpecialists />

      {/* ── Tab navigation ── */}
      <WorkspaceNav
        creativeBoard={showCreativeBoard}
        onCreativeBoard={handleCreativeBoardToggle}
      />

      {/* ── Tab content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          key={showCreativeBoard ? 'creative' : activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {renderMainContent()}
        </motion.div>
      </div>
    </div>
  )
}
