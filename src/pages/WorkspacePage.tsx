import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Dna, BookmarkCheck, CheckCircle2, Loader2, AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'


import { useAuthStore } from '@/store/useAuthStore'
import { useForgeStore } from '@/store/useForgeStore'
import { getProject, subscribeToProjectOutputs, saveProjectOutputs } from '@/services/firestore'
import { isFirebaseConfigured } from '@/services/firebase'
import { getClientMockResponse } from '@/services/mockClient'

import { WorkspaceNav, type ExtendedWorkspaceTab } from '@/components/workspace/WorkspaceNav'
import { AISpecialists } from '@/components/workspace/AISpecialists'
import { RefineModal } from '@/components/workspace/RefineModal'

import { OverviewTab } from '@/components/workspace/tabs/OverviewTab'
import { BrandTab } from '@/components/workspace/tabs/BrandTab'
import { ProductTab } from '@/components/workspace/tabs/ProductTab'
import { WebsiteTab } from '@/components/workspace/tabs/WebsiteTab'
import { ContentTab } from '@/components/workspace/tabs/ContentTab'
import { MarketingTab } from '@/components/workspace/tabs/MarketingTab'
import { RoadmapTab } from '@/components/workspace/tabs/RoadmapTab'
import { CreativeBoard } from '@/components/workspace/CreativeBoard'

import { ErrorState, Spinner, Badge, Button } from '@/components/shared'
import type { BlueprintSection, Project, ProjectOutputs } from '@/types'
import toast from 'react-hot-toast'

export type SaveButtonStatus = 'idle' | 'saving' | 'saved' | 'error'

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentOutputs, setCurrentOutputs, updateOutputs } = useForgeStore()

  const [activeTab, setActiveTab] = useState<ExtendedWorkspaceTab>('overview')
  const [project, setProject] = useState<Project | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)
  const [outputsLoading, setOutputsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Save Project State Machine: 'idle' | 'saving' | 'saved' | 'error'
  const [saveStatus, setSaveStatus] = useState<SaveButtonStatus>('idle')

  // Refine modal state
  const [refineOpen, setRefineOpen] = useState(false)
  const [refineTargetSection, setRefineTargetSection] = useState<BlueprintSection>('brand')
  const [refining, setRefining] = useState(false)

  const unsubRef = useRef<(() => void) | null>(null)


  // Load project metadata
  useEffect(() => {
    if (!projectId) return

    getProject(projectId, user?.uid)
      .then(p => {
        if (p) {
          setProject(p)
        } else {
          // Check local stored submission if newly created
          try {
            const raw = localStorage.getItem('forge_pending_submission')
            if (raw) {
              const parsed = JSON.parse(raw)
              setProject({
                id: projectId,
                uid: user?.uid || 'user_demo_1',
                name: parsed.projectName || 'My Project',
                idea: parsed.ideaDescription || '',
                context: {
                  name: parsed.projectName,
                  industry: parsed.industry,
                  targetAudience: parsed.targetAudience,
                  mainGoal: parsed.mainGoal,
                },
                status: 'complete',
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            }
          } catch {
            // Ignored
          }
        }
        setProjectLoading(false)
      })
      .catch(() => {
        setError('Failed to load workspace.')
        setProjectLoading(false)
      })
  }, [projectId, user?.uid])

  // Real-time subscribe / fallback to client mock
  useEffect(() => {
    if (!projectId) return

    unsubRef.current = subscribeToProjectOutputs(projectId, outputs => {
      if (outputs) {
        setCurrentOutputs(outputs)
        setOutputsLoading(false)
      } else {
        // Hydrate local mock data immediately so all tabs display content
        const idea = project?.idea || 'Creative launch project'
        const mockData: ProjectOutputs = {
          ideaDna: (getClientMockResponse('analyzeIdea', { idea }) as any).ideaDna,
          readiness: (getClientMockResponse('analyzeIdea', { idea }) as any).readiness,
          brand: getClientMockResponse('generateBrand', { idea }) as any,
          product: getClientMockResponse('generateProduct', { idea }) as any,
          website: getClientMockResponse('generateWebsite', { idea }) as any,
          content: getClientMockResponse('generateContent', { idea }) as any,
          marketing: getClientMockResponse('generateMarketing', { idea }) as any,
          roadmap: getClientMockResponse('generateRoadmap', { idea }) as any,
          creativeDirection: getClientMockResponse('generateCreativeDirection', { idea }) as any,
        }
        setCurrentOutputs(mockData)
        saveProjectOutputs(projectId, mockData, user?.uid, {
          projectName: project?.name,
          originalIdea: project?.idea,
          industry: project?.context?.industry,
          targetAudience: project?.context?.targetAudience,
          mainGoal: project?.context?.mainGoal,
        }).catch(() => {})
        setOutputsLoading(false)
      }
    }, user?.uid)

    return () => unsubRef.current?.()
  }, [projectId, project, setCurrentOutputs, user?.uid])


  // Open refinement panel for a given section
  function handleOpenRefine(section: BlueprintSection) {
    setRefineTargetSection(section)
    setRefineOpen(true)
  }

  // Refine handler (updates section locally with user instruction)
  async function handleApplyRefinement(instruction: string) {
    if (!projectId || !currentOutputs) return
    setRefining(true)

    try {
      await new Promise(r => setTimeout(r, 600)) // smooth thinking feedback
      // Local refinement adaptation
      const section = refineTargetSection
      const current = (currentOutputs as any)[section] || {}
      
      let updatedData = { ...current }
      if (section === 'brand') {
        updatedData.brandPersonality = `${current.brandPersonality || ''} Refined direction: ${instruction}`
      } else if (section === 'product') {
        updatedData.valueProposition = `${current.valueProposition || ''} [Adjusted: ${instruction}]`
      } else if (section === 'marketing') {
        updatedData.launchStrategy = `${current.launchStrategy || ''} [Focus: ${instruction}]`
      } else if (section === 'creativeDirection') {
        updatedData.mood = `${current.mood || ''} [Refined: ${instruction}]`
        const cleanTag = instruction.replace(/^More\s+/i, '').trim()
        if (cleanTag && Array.isArray(updatedData.visualKeywords)) {
          if (!updatedData.visualKeywords.includes(cleanTag)) {
            updatedData.visualKeywords = [cleanTag, ...updatedData.visualKeywords]
          }
        }
      }

      const update = { [section]: updatedData } as Partial<ProjectOutputs>
      updateOutputs(update)
      await saveProjectOutputs(projectId, update, user?.uid, {
        projectName: project?.name,
        originalIdea: project?.idea,
        industry: project?.context?.industry,
        targetAudience: project?.context?.targetAudience,
        mainGoal: project?.context?.mainGoal,
      })
      toast.success(`${section === 'creativeDirection' ? 'Creative Direction' : section.toUpperCase()} refined.`)
      setRefineOpen(false)
    } catch {
      toast.error('Refinement failed.')
    } finally {
      setRefining(false)
    }
  }

  // Regenerate handler (functional local refresh)
  async function handleRegenerateSection(section: BlueprintSection) {
    if (!projectId || !currentOutputs) return
    setRefining(true)

    try {
      await new Promise(r => setTimeout(r, 500))
      const idea = project?.idea || 'Creative Project'
      let freshData: any

      if (section === 'brand') freshData = getClientMockResponse('generateBrand', { idea })
      else if (section === 'product') freshData = getClientMockResponse('generateProduct', { idea })
      else if (section === 'website') freshData = getClientMockResponse('generateWebsite', { idea })
      else if (section === 'content') freshData = getClientMockResponse('generateContent', { idea })
      else if (section === 'marketing') freshData = getClientMockResponse('generateMarketing', { idea })
      else if (section === 'roadmap') freshData = getClientMockResponse('generateRoadmap', { idea })
      else if (section === 'creativeDirection') freshData = getClientMockResponse('generateCreativeDirection', { idea })

      const update = { [section]: freshData } as Partial<ProjectOutputs>
      updateOutputs(update)
      await saveProjectOutputs(projectId, update, user?.uid, {
        projectName: project?.name,
        originalIdea: project?.idea,
        industry: project?.context?.industry,
        targetAudience: project?.context?.targetAudience,
        mainGoal: project?.context?.mainGoal,
      })
      toast.success(`${section.toUpperCase()} regenerated.`)
    } catch {
      toast.error('Regeneration failed.')
    } finally {
      setRefining(false)
    }
  }

  // Save project button handler with 4 states: idle | saving | saved | error (with Retry)
  async function handleSaveProject() {
    if (!projectId || !currentOutputs) return
    setSaveStatus('saving')
    try {
      await saveProjectOutputs(projectId, currentOutputs, user?.uid, {
        projectName: project?.name,
        originalIdea: project?.idea,
        industry: project?.context?.industry,
        targetAudience: project?.context?.targetAudience,
        mainGoal: project?.context?.mainGoal,
      })
      setSaveStatus('saved')
      toast.success('Saved successfully.')
      setTimeout(() => {
        setSaveStatus(prev => (prev === 'saved' ? 'idle' : prev))
      }, 2500)
    } catch {
      setSaveStatus('error')
      toast.error('Save failed. Click Retry to attempt again.')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-forge-black pt-20 flex items-center justify-center">
        <ErrorState message={error} onRetry={() => { setError(null); setProjectLoading(true) }} />
      </div>
    )
  }

  const outputs = currentOutputs

  return (
    <div className="min-h-screen bg-forge-black pb-28 text-left">
      
      {/* ============================================================ */}
      {/* Top Header: Project Name, Label, Status, Back & Save Buttons */}
      {/* ============================================================ */}
      <div className="pt-16 sm:pt-20 border-b border-forge-border bg-forge-black/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Back to Idea DNA + Project Title & Badge */}
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to={`/forge/${projectId}/dna`}
                className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-forge-muted hover:text-forge-white bg-forge-surface hover:bg-forge-surface2 border border-forge-border px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                title="Back to Idea DNA"
              >
                <ArrowLeft size={12} />
                <span>IDEA DNA</span>
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                    FORGE BLUEPRINT
                  </span>
                  <span className="text-forge-border">•</span>
                  <span className="inline-flex items-center gap-1 text-3xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span>READY</span>
                  </span>
                  <span className="text-forge-border hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-navy text-forge-muted border border-forge-border">
                    {isFirebaseConfigured ? (
                      <span className="text-emerald-400 font-semibold">FIREBASE SYNC ACTIVE</span>
                    ) : (
                      <span>LOCAL PROTOTYPE MODE</span>
                    )}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-forge-white truncate tracking-tight mt-0.5">

                  {project?.name || 'Untitled Forge'}
                </h1>
              </div>
            </div>

            {/* Right: My Forges Navigation + 4-State Save Project Button */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <Link
                to="/my-forges"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-muted hover:text-forge-white bg-forge-surface hover:bg-forge-surface2 border border-forge-border transition-colors"
                title="View All Forges"
              >
                <LayoutDashboard size={12} className="text-forge-blue" />
                <span>MY FORGES</span>
              </Link>

              {saveStatus === 'idle' && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<BookmarkCheck size={13} />}
                  onClick={handleSaveProject}
                  className="text-2xs font-semibold tracking-wider uppercase px-4 cursor-pointer"
                >
                  SAVE PROJECT
                </Button>
              )}


              {saveStatus === 'saving' && (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase bg-forge-surface border border-forge-border text-forge-muted cursor-not-allowed"
                >
                  <Loader2 size={13} className="animate-spin text-forge-blue" />
                  <span>Saving...</span>
                </button>
              )}

              {saveStatus === 'saved' && (
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-pointer transition-all"
                >
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>Saved successfully</span>
                </button>
              )}

              {saveStatus === 'error' && (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-2xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg">
                    <AlertCircle size={12} />
                    <span>Save failed</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveProject}
                    className="inline-flex items-center gap-1 text-2xs font-semibold tracking-wider uppercase text-forge-white bg-forge-blue hover:bg-forge-blue-light px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-blue-glow-sm"
                  >
                    <RefreshCw size={11} />
                    <span>Retry</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>


        {/* ============================================================ */}
        {/* Main Tab Navigation: Horizontal desktop, scrollable mobile   */}
        {/* ============================================================ */}
        <WorkspaceNav
          currentTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Page Title & Supporting Text Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <p className="section-label mb-2">FORGE WORKSPACE</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-forge-white uppercase leading-tight mb-2">
          YOUR FORGE <span className="text-gradient-blue">BLUEPRINT.</span>
        </h1>
        <p className="text-sm sm:text-base text-forge-muted font-light leading-relaxed max-w-2xl">
          Your idea now has direction. Explore the creative, digital, and launch plan.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Tab Content Display Matrix with AnimatePresence Transitions  */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {outputsLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="md" />
            <span className="text-2xs font-mono text-forge-muted uppercase tracking-widest">
              ASSEMBLING WORKSPACE BLUEPRINT...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'overview' && (
                <OverviewTab
                  projectName={project?.name || ''}
                  idea={project?.idea || ''}
                  ideaDna={outputs?.ideaDna || null}
                  onNavigateTab={(t) => setActiveTab(t as ExtendedWorkspaceTab)}
                  onRefine={() => handleOpenRefine('brand')}
                  onRegenerate={() => handleRegenerateSection('brand')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'brand' && (
                <BrandTab
                  brand={outputs?.brand || null}
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('brand')}
                  onRegenerate={() => handleRegenerateSection('brand')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'product' && (
                <ProductTab
                  product={outputs?.product || null}
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('product')}
                  onRegenerate={() => handleRegenerateSection('product')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'website' && (
                <WebsiteTab
                  website={outputs?.website || null}
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('website')}
                  onRegenerate={() => handleRegenerateSection('website')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'content' && (
                <ContentTab
                  content={outputs?.content || null}
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('content')}
                  onRegenerate={() => handleRegenerateSection('content')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'marketing' && (
                <MarketingTab
                  marketing={outputs?.marketing || null}
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('marketing')}
                  onRegenerate={() => handleRegenerateSection('marketing')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'roadmap' && (
                <RoadmapTab
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('roadmap')}
                  onRegenerate={() => handleRegenerateSection('roadmap')}
                  onSave={handleSaveProject}
                />
              )}

              {activeTab === 'creativeDirection' && (
                <CreativeBoard
                  creativeDirection={outputs?.creativeDirection || null}
                  projectContext={{
                    name: project?.name,
                    idea: project?.idea,
                    industry: project?.context?.industry,
                    targetAudience: project?.context?.targetAudience,
                    mainGoal: project?.context?.mainGoal,
                    ideaDna: outputs?.ideaDna,
                    brand: outputs?.brand,
                  }}
                  loading={outputsLoading}
                  onRefine={() => handleOpenRefine('creativeDirection')}
                  onRegenerate={() => handleRegenerateSection('creativeDirection')}
                  onSave={handleSaveProject}
                  onUpdateCreativeDirection={async (updatedCd) => {
                    if (!projectId || !currentOutputs) return
                    const update: Partial<ProjectOutputs> = { creativeDirection: updatedCd }
                    updateOutputs(update)
                    await saveProjectOutputs(projectId, update, user?.uid, {
                      projectName: project?.name,
                      originalIdea: project?.idea,
                      industry: project?.context?.industry,
                      targetAudience: project?.context?.targetAudience,
                      mainGoal: project?.context?.mainGoal,
                    })
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Shared Refinement Panel Modal */}
      <RefineModal
        open={refineOpen}
        onClose={() => setRefineOpen(false)}
        section={refineTargetSection}
        onRefine={handleApplyRefinement}
        loading={refining}
      />

    </div>
  )
}
