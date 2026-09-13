import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Globe,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Sparkles,
  Check,
  AlertCircle,
  FileCode,
  Terminal,
  Info,
  Eye,
  Edit3,
  Save,
  Monitor,
  Smartphone,
  Sliders,
  Undo2,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useForgeStore } from '@/store/useForgeStore'
import { getProject, getProjectOutputs, saveWebsiteBuilderRequest } from '@/services/firestore'
import { getClientMockResponse } from '@/services/mockClient'
import { Button, Spinner } from '@/components/shared'
import type {
  Project,
  ProjectOutputs,
  WebsiteType,
  WebsitePageOption,
  WebsiteVisualStyle,
  WebsiteBuilderRequest,
  WebsiteBuilderProjectContext,
} from '@/types'
import toast from 'react-hot-toast'

// ─── Preset Constants ─────────────────────────────────────────

const WEBSITE_TYPES: { type: WebsiteType; description: string }[] = [
  { type: 'Business Website', description: 'Comprehensive commercial presence with services & credentials' },
  { type: 'Portfolio', description: 'High-craft showcase for studios, architects, and independent creatives' },
  { type: 'Agency Website', description: 'Capability matrices, case studies, and client qualification flow' },
  { type: 'Landing Page', description: 'Focused conversion funnel engineered for early access or launch drops' },
  { type: 'E-commerce Concept', description: 'Curated direct-to-consumer store flow with editorial product storytelling' },
  { type: 'Educational Website', description: 'Knowledge platform with course syllabi, curriculum, and enrollment' },
  { type: 'Event Website', description: 'Dynamic timetable, speaker announcements, and attendee registration' },
  { type: 'Personal Brand Website', description: 'Executive bio, thought leadership essays, and advisory inquiry' },
]

const PAGE_OPTIONS: WebsitePageOption[] = [
  'Home',
  'About',
  'Services',
  'Products',
  'Projects',
  'Pricing',
  'Blog',
  'Contact',
  'FAQ',
  'Custom Page',
]

const VISUAL_STYLES: { style: WebsiteVisualStyle; tag: string; desc: string }[] = [
  { style: 'Premium', tag: 'Luxury / Monospace / High Contrast', desc: 'Deep obsidian blacks, subtle gold/blue glow, refined editorial spacing' },
  { style: 'Minimal', tag: 'Architectural / Restrained', desc: 'Maximum whitespace, razor-thin lines, quiet and confident clarity' },
  { style: 'Bold', tag: 'High-Impact / Kinetic', desc: 'Oversized brutalist typography, vibrant accent blasts, raw velocity' },
  { style: 'Editorial', tag: 'Magazine / Serif Storytelling', desc: 'Rich serif headings, longform narrative pacing, bespoke grid systems' },
  { style: 'Youthful', tag: 'Vibrant / Digital-Native', desc: 'Playful micro-interactions, bright color pops, fresh tech optimism' },
  { style: 'Professional', tag: 'Corporate / Clean Trust', desc: 'Structured information architecture, reliable balance, clean modern sans' },
  { style: 'Creative', tag: 'Experimental / Avant-Garde', desc: 'Unconventional layouts, tactile textures, immersive bespoke aesthetic' },
]

export function WebsiteBuilderPage() {
  const [searchParams] = useSearchParams()
  const projectIdParam = searchParams.get('projectId')
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentOutputs } = useForgeStore()

  // Project hydration state
  const [project, setProject] = useState<Project | null>(null)
  const [outputs, setOutputs] = useState<ProjectOutputs | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [websiteType, setWebsiteType] = useState<WebsiteType>('Business Website')
  const [selectedPages, setSelectedPages] = useState<string[]>(['Home', 'About', 'Services', 'Contact'])
  const [customPageName, setCustomPageName] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [visualStyle, setVisualStyle] = useState<WebsiteVisualStyle>('Premium')
  const [primaryCTA, setPrimaryCTA] = useState('Start a project')
  const [extraInstructions, setExtraInstructions] = useState('')

  // Validation touch tracking
  const [typeTouched, setTypeTouched] = useState(false)
  const [pagesTouched, setPagesTouched] = useState(false)
  const [ctaTouched, setCtaTouched] = useState(false)
  const [submittedAttempt, setSubmittedAttempt] = useState(false)

  // Generation state & output spec
  const [generating, setGenerating] = useState(false)
  const [compiledSpec, setCompiledSpec] = useState<WebsiteBuilderRequest | null>(null)
  const [copied, setCopied] = useState(false)

  // Interactive Live Preview & Edit Mode State
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [isEditingWebsite, setIsEditingWebsite] = useState(false)
  const [activePreviewPage, setActivePreviewPage] = useState('Home')
  const [editableHeroHeadline, setEditableHeroHeadline] = useState('')
  const [editableHeroSubhead, setEditableHeroSubhead] = useState('')
  const [editableCtaLabel, setEditableCtaLabel] = useState('')
  const [isSavingWebsite, setIsSavingWebsite] = useState(false)

  // Hydrate Project & Context
  useEffect(() => {
    if (!projectIdParam) {
      toast.error('No project selected. Please choose a Forge project.')
      navigate('/my-forges')
      return
    }

    let isMounted = true

    async function loadData() {
      setLoading(true)
      try {
        const p = await getProject(projectIdParam!, user?.uid)
        if (p && isMounted) {
          setProject(p)
        } else if (isMounted) {
          // Check local storage fallback
          try {
            const raw = localStorage.getItem('forge_pending_submission')
            if (raw) {
              const parsed = JSON.parse(raw)
              setProject({
                id: projectIdParam!,
                uid: user?.uid || 'guest',
                name: parsed.projectName || 'Untitled Forge',
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

        // Hydrate outputs
        const out = await getProjectOutputs(projectIdParam!, user?.uid)
        if (out && isMounted) {
          setOutputs(out)
        } else if (currentOutputs && isMounted) {
          setOutputs(currentOutputs)
        } else if (isMounted) {
          // Hydrate baseline mock outputs if empty
          const idea = project?.idea || 'Creative launch project'
          setOutputs({
            ideaDna: (getClientMockResponse('analyzeIdea', { idea }) as any).ideaDna,
            brand: getClientMockResponse('generateBrand', { idea }) as any,
            product: getClientMockResponse('generateProduct', { idea }) as any,
            website: getClientMockResponse('generateWebsite', { idea }) as any,
            content: getClientMockResponse('generateContent', { idea }) as any,
            marketing: getClientMockResponse('generateMarketing', { idea }) as any,
            roadmap: getClientMockResponse('generateRoadmap', { idea }) as any,
            creativeDirection: getClientMockResponse('generateCreativeDirection', { idea }) as any,
          })
        }

        // Check for existing saved specification
        try {
          const savedSpec = localStorage.getItem(`forge_website_spec_${projectIdParam}`)
          if (savedSpec && isMounted) {
            const parsed = JSON.parse(savedSpec)
            setCompiledSpec(parsed)
            if (parsed.websiteType) setWebsiteType(parsed.websiteType)
            if (parsed.selectedPages) {
              setSelectedPages(parsed.selectedPages)
              if (parsed.selectedPages.length > 0) setActivePreviewPage(parsed.selectedPages[0])
            }
            if (parsed.visualStyle) setVisualStyle(parsed.visualStyle)
            if (parsed.primaryCTA) {
              setPrimaryCTA(parsed.primaryCTA)
              setEditableCtaLabel(parsed.primaryCTA)
            }
            if (parsed.extraInstructions) setExtraInstructions(parsed.extraInstructions)
          }
        } catch {
          // Ignored
        }
      } catch {
        toast.error('Failed to load project details.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [projectIdParam, user?.uid, navigate, currentOutputs])

  // Validation checks
  const isTypeValid = Boolean(websiteType.trim())
  const isPagesValid = selectedPages.length > 0
  const isCtaValid = Boolean(primaryCTA.trim())

  const showTypeError = (typeTouched || submittedAttempt) && !isTypeValid
  const showPagesError = (pagesTouched || submittedAttempt) && !isPagesValid
  const showCtaError = (ctaTouched || submittedAttempt) && !isCtaValid

  function togglePage(page: WebsitePageOption) {
    setPagesTouched(true)
    if (page === 'Custom Page') {
      setShowCustomInput(prev => !prev)
      return
    }

    if (selectedPages.includes(page)) {
      setSelectedPages(selectedPages.filter(p => p !== page))
    } else {
      setSelectedPages([...selectedPages, page])
    }
  }

  function addCustomPage() {
    const trimmed = customPageName.trim()
    if (!trimmed) return
    if (!selectedPages.includes(trimmed)) {
      setSelectedPages([...selectedPages, trimmed])
    }
    setCustomPageName('')
    setShowCustomInput(false)
  }

  function removeCustomPage(name: string) {
    setSelectedPages(selectedPages.filter(p => p !== name))
  }

  // Handle Form Submission
  async function handleGenerateWebsite(e: React.FormEvent) {
    e.preventDefault()
    setSubmittedAttempt(true)

    if (!isTypeValid || !isPagesValid || !isCtaValid) {
      toast.error('Please complete all required fields.')
      return
    }

    if (generating) return
    setGenerating(true)

    try {
      const projectContext: WebsiteBuilderProjectContext = {
        projectName: project?.name || project?.context?.name || 'Untitled Forge',
        originalIdea: project?.idea || project?.originalIdea || '',
        industry: project?.context?.industry || project?.industry || 'Technology & Design',
        targetAudience: project?.context?.targetAudience || project?.targetAudience || outputs?.ideaDna?.audience || 'General audience',
        mainGoal: project?.context?.mainGoal || project?.mainGoal || outputs?.ideaDna?.purpose || 'Launch digital presence',
        ideaDNA: outputs?.ideaDna || null,
        websiteBlueprint: outputs?.website || null,
        creativeDirection: outputs?.creativeDirection || null,
      }

      const requestPayload: WebsiteBuilderRequest = {
        projectId: projectIdParam || 'proj_active',
        websiteType,
        selectedPages,
        visualStyle,
        primaryCTA: primaryCTA.trim(),
        extraInstructions: extraInstructions.trim() || undefined,
        projectContext,
        createdAt: new Date().toISOString(),
      }

      // Persist to Firestore & Local Storage
      await saveWebsiteBuilderRequest(projectIdParam || 'proj_active', requestPayload, user?.uid)

      setCompiledSpec(requestPayload)
      setEditableHeroHeadline(project?.name ? `${project.name.toUpperCase()} — DIGITAL MANIFESTO` : 'DIGITAL ARCHITECTURE & LAUNCH MANIFESTO')
      setEditableHeroSubhead(project?.idea || outputs?.ideaDna?.purpose || 'An intelligent digital craft experience engineered for high-signal audiences.')
      setEditableCtaLabel(primaryCTA.trim())
      toast.success('Website Blueprint Specification successfully generated!')
    } catch {
      toast.error('Failed to save website specification. Please retry.')
    } finally {
      setGenerating(false)
    }
  }

  // Handle Saving Edited Website Content
  async function handleSaveEditedWebsite() {
    if (!compiledSpec || !projectIdParam) return
    setIsSavingWebsite(true)
    try {
      const updatedSpec: WebsiteBuilderRequest = {
        ...compiledSpec,
        primaryCTA: editableCtaLabel.trim() || compiledSpec.primaryCTA,
        extraInstructions: [
          compiledSpec.extraInstructions || '',
          `[Custom Edit] Hero Headline: "${editableHeroHeadline}"`,
          `[Custom Edit] Hero Subhead: "${editableHeroSubhead}"`,
        ].filter(Boolean).join('\n'),
      }

      await saveWebsiteBuilderRequest(projectIdParam, updatedSpec, user?.uid)
      setCompiledSpec(updatedSpec)
      setIsEditingWebsite(false)
      toast.success('Website customizations saved to Firestore.')
    } catch {
      toast.error('Failed to save website edits. Please try again.')
    } finally {
      setIsSavingWebsite(false)
    }
  }

  function handleCopyJSON() {
    if (!compiledSpec) return
    navigator.clipboard.writeText(JSON.stringify(compiledSpec, null, 2))
    setCopied(true)
    toast.success('Website request specification copied to clipboard.')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-forge-black pt-28 flex flex-col items-center justify-center gap-4">
        <Spinner size="md" />
        <p className="text-xs font-mono uppercase tracking-widest text-forge-muted">
          INITIALIZING WEBSITE BUILDER WORKSPACE...
        </p>
      </div>
    )
  }

  const projectName = project?.name || project?.context?.name || 'Forge Blueprint'
  const originalIdea = project?.idea || project?.originalIdea || 'High-impact digital platform concept'
  const targetAudience = project?.context?.targetAudience || outputs?.ideaDna?.audience || 'Modern digital creators'
  const industry = project?.context?.industry || 'Creative Technology'
  const mainGoal = project?.context?.mainGoal || outputs?.ideaDna?.purpose || 'Launch digital MVP'

  return (
    <div className="min-h-screen bg-forge-black text-left pt-20 pb-32">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[400px] bg-forge-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-[500px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={projectIdParam ? `/forge/${projectIdParam}` : '/my-forges'}
            className="inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-wider text-forge-muted hover:text-forge-white bg-forge-surface/80 hover:bg-forge-surface border border-forge-border px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft size={13} />
            <span>BACK TO BLUEPRINT WORKSPACE</span>
          </Link>
          <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue bg-forge-blue/10 border border-forge-blue/20 px-2.5 py-1 rounded-full">
            AI WEBSITE BUILDER • ALPHA
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold mb-2">
            <Globe size={13} />
            <span>DIGITAL EXPERIENCE ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forge-white tracking-tight uppercase">
            BUILD YOUR WEBSITE.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-forge-muted font-light max-w-2xl leading-relaxed">
            Turn your Forge blueprint into a working digital experience. Define your structural constraints, select core pages, and compile your AI production prompt.
          </p>
        </div>

        {/* ============================================================ */}
        {/* Project Context Summary Card                                 */}
        {/* ============================================================ */}
        <div className="mb-10 rounded-2xl border border-forge-border bg-forge-surface/70 backdrop-blur-md p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <Layers size={16} className="text-forge-blue" />
              <h2 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                Inherited Forge Project Context
              </h2>
            </div>
            <span className="text-3xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              PROJECT LOADED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-3xs font-mono uppercase tracking-widest text-forge-muted block">
                PROJECT NAME
              </span>
              <p className="text-sm font-semibold text-forge-white truncate">{projectName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xs font-mono uppercase tracking-widest text-forge-muted block">
                INDUSTRY & AUDIENCE
              </span>
              <p className="text-xs text-forge-white/90">
                <span className="font-semibold">{industry}</span> • {targetAudience}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-3xs font-mono uppercase tracking-widest text-forge-muted block">
                MAIN GOAL
              </span>
              <p className="text-xs text-forge-white/90 truncate">{mainGoal}</p>
            </div>

            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <span className="text-3xs font-mono uppercase tracking-widest text-forge-muted block">
                ORIGINAL IDEA CONCEPT
              </span>
              <p className="text-xs text-forge-muted font-light leading-relaxed line-clamp-2">
                {originalIdea}
              </p>
            </div>

            {outputs?.website?.structure && (
              <div className="space-y-1 md:col-span-2 lg:col-span-3 pt-2 border-t border-forge-border/40">
                <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue block">
                  BLUEPRINT ARCHITECTURE SUMMARY
                </span>
                <p className="text-xs text-forge-white/80 font-light leading-relaxed">
                  {outputs.website.structure}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Website Builder Configuration Form                           */}
        {/* ============================================================ */}
        <form onSubmit={handleGenerateWebsite} className="space-y-8">
          
          {/* 1. Website Type */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface/50 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-forge-white uppercase tracking-wider block">
                  01 / Website Type <span className="text-forge-blue">*</span>
                </label>
                <p className="text-2xs text-forge-muted font-light mt-0.5">
                  Select the primary operational model for your digital platform.
                </p>
              </div>
              {showTypeError && (
                <span className="text-2xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> Required
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {WEBSITE_TYPES.map(item => {
                const isSelected = websiteType === item.type
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setWebsiteType(item.type)
                      setTypeTouched(true)
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-forge-blue bg-forge-blue/10 shadow-sm shadow-forge-blue/20'
                        : 'border-forge-border bg-forge-navy/40 hover:bg-forge-navy hover:border-forge-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-forge-white">{item.type}</span>
                      {isSelected && <CheckCircle2 size={14} className="text-forge-blue flex-shrink-0" />}
                    </div>
                    <p className="text-3xs text-forge-muted leading-relaxed font-light">
                      {item.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Required Pages */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface/50 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-forge-white uppercase tracking-wider block">
                  02 / Required Pages <span className="text-forge-blue">*</span>
                </label>
                <p className="text-2xs text-forge-muted font-light mt-0.5">
                  Choose the essential pages to build into the site hierarchy (at least 1 required).
                </p>
              </div>
              {showPagesError && (
                <span className="text-2xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> Select at least one page
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {PAGE_OPTIONS.map(page => {
                const isSelected = page === 'Custom Page' ? showCustomInput : selectedPages.includes(page)
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => togglePage(page)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all inline-flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-forge-blue bg-forge-blue/20 text-forge-white font-semibold'
                        : 'border-forge-border bg-forge-navy/60 text-forge-muted hover:text-forge-white hover:border-forge-border/80'
                    }`}
                  >
                    {isSelected && <Check size={13} className="text-forge-blue" />}
                    <span>{page}</span>
                  </button>
                )
              })}
            </div>

            {/* Custom page input */}
            {showCustomInput && (
              <div className="flex items-center gap-2 max-w-md pt-2">
                <input
                  type="text"
                  value={customPageName}
                  onChange={e => setCustomPageName(e.target.value)}
                  placeholder="e.g. Case Studies, Documentation, Whitepaper"
                  className="flex-1 bg-forge-black border border-forge-border rounded-xl px-3.5 py-2 text-xs text-forge-white placeholder:text-forge-muted focus:outline-none focus:border-forge-blue"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomPage()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addCustomPage}
                  className="text-2xs uppercase tracking-wider"
                >
                  ADD PAGE
                </Button>
              </div>
            )}

            {/* Custom added pages chips */}
            {selectedPages.some(p => !PAGE_OPTIONS.includes(p as WebsitePageOption)) && (
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <span className="text-3xs font-mono uppercase text-forge-muted">CUSTOM:</span>
                {selectedPages
                  .filter(p => !PAGE_OPTIONS.includes(p as WebsitePageOption))
                  .map(custom => (
                    <span
                      key={custom}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-forge-blue/10 border border-forge-blue/30 text-2xs text-forge-blue font-mono"
                    >
                      <span>{custom}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomPage(custom)}
                        className="hover:text-white ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* 3. Visual Style */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface/50 p-6 sm:p-8 space-y-4">
            <div>
              <label className="text-sm font-bold text-forge-white uppercase tracking-wider block">
                03 / Visual Style Direction
              </label>
              <p className="text-2xs text-forge-muted font-light mt-0.5">
                Governs typography scale, contrast ratios, and spatial rhythm.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VISUAL_STYLES.map(item => {
                const isSelected = visualStyle === item.style
                return (
                  <button
                    key={item.style}
                    type="button"
                    onClick={() => setVisualStyle(item.style)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-forge-blue bg-forge-blue/10 shadow-sm shadow-forge-blue/20'
                        : 'border-forge-border bg-forge-navy/40 hover:bg-forge-navy hover:border-forge-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-forge-white">{item.style}</span>
                      {isSelected && <CheckCircle2 size={13} className="text-forge-blue" />}
                    </div>
                    <span className="text-3xs font-mono text-forge-blue block mb-1.5">{item.tag}</span>
                    <p className="text-3xs text-forge-muted leading-relaxed font-light">{item.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Primary Call to Action */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface/50 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-forge-white uppercase tracking-wider block">
                  04 / Primary Call to Action (CTA) <span className="text-forge-blue">*</span>
                </label>
                <p className="text-2xs text-forge-muted font-light mt-0.5">
                  The primary button label and goal anchored on the hero and footer sections.
                </p>
              </div>
              {showCtaError && (
                <span className="text-2xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> CTA cannot be empty
                </span>
              )}
            </div>

            <div className="max-w-md">
              <input
                type="text"
                value={primaryCTA}
                onChange={e => {
                  setPrimaryCTA(e.target.value)
                  setCtaTouched(true)
                }}
                placeholder="Start a project, Shop now, Contact us, Book a call"
                className="w-full bg-forge-black border border-forge-border rounded-xl px-4 py-2.5 text-xs text-forge-white placeholder:text-forge-muted focus:outline-none focus:border-forge-blue"
              />
            </div>
          </div>

          {/* 5. Extra Instructions */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface/50 p-6 sm:p-8 space-y-4">
            <div>
              <label className="text-sm font-bold text-forge-white uppercase tracking-wider block">
                05 / Extra Instructions & Constraints (Optional)
              </label>
              <p className="text-2xs text-forge-muted font-light mt-0.5">
                Add any specific layout requests, third-party integrations (e.g. Stripe, Calendly, Substack), or compliance notes.
              </p>
            </div>

            <textarea
              rows={4}
              value={extraInstructions}
              onChange={e => setExtraInstructions(e.target.value)}
              placeholder="e.g. Include an interactive pricing calculator, sticky navigation with dark mode toggle, and multi-step lead capture form..."
              className="w-full bg-forge-black border border-forge-border rounded-xl p-4 text-xs text-forge-white placeholder:text-forge-muted focus:outline-none focus:border-forge-blue resize-none"
            />
          </div>

          {/* Submit Action Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-forge-border">
            <div className="flex items-center gap-2 text-2xs text-forge-muted">
              <Info size={13} className="text-forge-blue" />
              <span>Compiles your Forge Blueprint into an executable website production schema.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={generating}
              icon={<Sparkles size={16} />}
              className="w-full sm:w-auto px-8 py-3 uppercase tracking-widest text-xs font-bold cursor-pointer"
            >
              {generating ? 'COMPILING BLUEPRINT SPECIFICATION...' : 'GENERATE WEBSITE'}
            </Button>
          </div>
        </form>

        {/* ============================================================ */}
        {/* Post-Submission Next Step State (Specification Output)       */}
        {/* ============================================================ */}
        {compiledSpec && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 rounded-2xl border border-forge-blue/40 bg-forge-navy/80 p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forge-border pb-4">
              <div>
                <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue block">
                  READY FOR EXECUTION
                </span>
                <h3 className="text-lg font-bold text-forge-white uppercase tracking-wider mt-0.5">
                  Compiled Website Builder Specification
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyJSON}
                  icon={copied ? <Check size={13} /> : <Copy size={13} />}
                  className="text-2xs font-mono uppercase cursor-pointer"
                >
                  {copied ? 'COPIED TO CLIPBOARD' : 'COPY SPEC JSON'}
                </Button>
                <Link
                  to={`/forge/${projectIdParam}?tab=website`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-muted hover:text-forge-white bg-forge-surface hover:bg-forge-surface2 border border-forge-border transition-colors"
                >
                  <span>RETURN TO BLUEPRINT</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Structured Schema Code Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted">
                <span className="flex items-center gap-1.5">
                  <FileCode size={12} className="text-forge-blue" />
                  website_request_spec.json
                </span>
                <span>STRUCT_VALIDATED</span>
              </div>
              <pre className="p-4 rounded-xl bg-forge-black/90 border border-forge-border text-forge-white/90 text-2xs font-mono overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(compiledSpec, null, 2)}
              </pre>
            </div>

            {/* ============================================================ */}
            {/* Live Interactive Website Preview & Inline Editor Mode         */}
            {/* ============================================================ */}
            <div className="rounded-2xl border border-forge-border bg-forge-black overflow-hidden shadow-2xl space-y-0">
              
              {/* Browser Window Chrome & Controls */}
              <div className="bg-forge-surface px-4 py-3 border-b border-forge-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xs font-mono text-forge-muted uppercase tracking-wider">LIVE WEBSITE PREVIEW</span>
                    <span className="text-3xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      INTERACTIVE
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Viewport Toggles: Desktop vs Mobile */}
                  <div className="flex items-center gap-1 bg-forge-navy/80 p-1 rounded-lg border border-forge-border text-2xs">
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('desktop')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                        previewViewport === 'desktop'
                          ? 'bg-forge-blue text-white font-bold'
                          : 'text-forge-muted hover:text-forge-white'
                      }`}
                      title="1440px Desktop View"
                    >
                      <Monitor size={12} />
                      <span className="hidden md:inline">DESKTOP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewViewport('mobile')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors ${
                        previewViewport === 'mobile'
                          ? 'bg-forge-blue text-white font-bold'
                          : 'text-forge-muted hover:text-forge-white'
                      }`}
                      title="390px Mobile View"
                    >
                      <Smartphone size={12} />
                      <span className="hidden md:inline">MOBILE</span>
                    </button>
                  </div>

                  {/* Edit Website Toggle & Save Action */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingWebsite(prev => !prev)}
                      className={`px-3 py-1.5 rounded-lg text-2xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        isEditingWebsite
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-forge-surface2 border-forge-border text-forge-muted hover:text-forge-white'
                      }`}
                    >
                      <Edit3 size={12} />
                      <span>{isEditingWebsite ? 'VIEWING EDIT MODE' : 'EDIT WEBSITE'}</span>
                    </button>

                    {isEditingWebsite && (
                      <button
                        type="button"
                        onClick={handleSaveEditedWebsite}
                        disabled={isSavingWebsite}
                        className="px-3 py-1.5 rounded-lg text-2xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <Save size={12} />
                        <span>{isSavingWebsite ? 'SAVING...' : 'SAVE WEBSITE'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Simulated Browser URL bar & Page Navigation Switcher */}
              <div className="bg-forge-navy/90 px-4 py-2 border-b border-forge-border/60 flex flex-wrap items-center justify-between gap-3 text-3xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">https://</span>
                  <span className="text-forge-white truncate font-medium">
                    {projectName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'forge-site'}.creaftiq.com
                  </span>
                  <span className="text-forge-muted">/{activePreviewPage.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>

                {/* Page Navigation Switcher */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-forge-muted uppercase">PAGES:</span>
                  {compiledSpec.selectedPages.map(pageName => (
                    <button
                      key={pageName}
                      type="button"
                      onClick={() => setActivePreviewPage(pageName)}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        activePreviewPage === pageName
                          ? 'bg-forge-blue text-white font-bold'
                          : 'bg-forge-surface text-forge-muted hover:text-forge-white'
                      }`}
                    >
                      {pageName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Web Canvas Frame */}
              <div className={`mx-auto transition-all p-6 sm:p-10 ${
                previewViewport === 'mobile'
                  ? 'max-w-[390px] border-x border-forge-border/80 bg-gradient-to-b from-[#0B0F19] to-black min-h-[500px]'
                  : 'w-full bg-gradient-to-b from-[#0A0D14] via-[#0B0F19] to-black min-h-[520px]'
              }`}>
                
                {/* Navbar Wireframe Component */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-forge-blue flex items-center justify-center font-mono text-white text-xs font-bold">
                      {projectName.charAt(0) || 'F'}
                    </div>
                    <span className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                      {projectName}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-3xs font-mono uppercase text-forge-muted">
                    {compiledSpec.selectedPages.slice(0, 4).map(p => (
                      <span
                        key={p}
                        onClick={() => setActivePreviewPage(p)}
                        className={`cursor-pointer hover:text-forge-white ${activePreviewPage === p ? 'text-forge-blue font-bold' : ''}`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-forge-blue text-white text-3xs font-mono font-bold uppercase tracking-wider shadow-blue-glow-sm"
                  >
                    {isEditingWebsite ? editableCtaLabel : compiledSpec.primaryCTA}
                  </button>
                </div>

                {/* Main Content Area Based on Active Page */}
                {activePreviewPage === 'Home' ? (
                  <div className="space-y-10">
                    {/* Hero Section */}
                    <div className="space-y-4 max-w-2xl text-left">
                      <div className="inline-flex items-center gap-2 text-3xs font-mono uppercase tracking-widest text-forge-blue bg-forge-blue/10 border border-forge-blue/20 px-2.5 py-0.5 rounded-full">
                        <span>{compiledSpec.visualStyle} AESTHETIC</span>
                        <span>•</span>
                        <span>{compiledSpec.websiteType}</span>
                      </div>

                      {isEditingWebsite ? (
                        <div className="space-y-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                          <label className="text-3xs font-mono uppercase text-amber-300 block">Edit Hero Headline</label>
                          <input
                            type="text"
                            value={editableHeroHeadline}
                            onChange={e => setEditableHeroHeadline(e.target.value)}
                            className="w-full bg-forge-black border border-forge-border rounded-lg p-2 text-sm text-forge-white focus:outline-none focus:border-forge-blue"
                          />
                          <label className="text-3xs font-mono uppercase text-amber-300 block pt-1">Edit Subheading / Manifesto</label>
                          <textarea
                            rows={2}
                            value={editableHeroSubhead}
                            onChange={e => setEditableHeroSubhead(e.target.value)}
                            className="w-full bg-forge-black border border-forge-border rounded-lg p-2 text-xs text-forge-white focus:outline-none focus:border-forge-blue resize-none"
                          />
                          <label className="text-3xs font-mono uppercase text-amber-300 block pt-1">Edit Primary CTA Button</label>
                          <input
                            type="text"
                            value={editableCtaLabel}
                            onChange={e => setEditableCtaLabel(e.target.value)}
                            className="w-full bg-forge-black border border-forge-border rounded-lg p-2 text-xs text-forge-white focus:outline-none focus:border-forge-blue"
                          />
                        </div>
                      ) : (
                        <>
                          <h2 className="text-2xl sm:text-4xl font-extrabold text-forge-white uppercase tracking-tight leading-tight">
                            {editableHeroHeadline || `${projectName.toUpperCase()} — DIGITAL MANIFESTO`}
                          </h2>
                          <p className="text-xs sm:text-sm text-forge-muted font-light leading-relaxed">
                            {editableHeroSubhead || originalIdea || 'An intelligent digital craft experience engineered for high-signal audiences.'}
                          </p>
                        </>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-xl bg-forge-blue hover:bg-forge-blue-light text-white text-xs font-bold uppercase tracking-wider shadow-blue-glow cursor-pointer transition-all"
                        >
                          {isEditingWebsite ? editableCtaLabel : compiledSpec.primaryCTA}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePreviewPage(compiledSpec.selectedPages[1] || 'About')}
                          className="px-4 py-2.5 rounded-xl border border-forge-border hover:border-forge-muted text-forge-muted hover:text-forge-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          EXPLORE {compiledSpec.selectedPages[1] || 'ABOUT'} →
                        </button>
                      </div>
                    </div>

                    {/* Feature Cards Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                      <div className="p-4 rounded-xl border border-forge-border/80 bg-forge-surface/60 space-y-2">
                        <div className="w-6 h-6 rounded-lg bg-forge-blue/20 flex items-center justify-center text-forge-blue text-xs font-bold">01</div>
                        <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider">Concept Authority</h4>
                        <p className="text-3xs text-forge-muted font-light leading-relaxed">
                          Anchored by {targetAudience} market alignment and strategic differentiation.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-forge-border/80 bg-forge-surface/60 space-y-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">02</div>
                        <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider">Digital Architecture</h4>
                        <p className="text-3xs text-forge-muted font-light leading-relaxed">
                          {compiledSpec.selectedPages.length} verified pages with fluid responsiveness.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-forge-border/80 bg-forge-surface/60 space-y-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">03</div>
                        <h4 className="text-xs font-bold text-forge-white uppercase tracking-wider">Conversion Focus</h4>
                        <p className="text-3xs text-forge-muted font-light leading-relaxed">
                          Actionable CTA funnel leading into project milestones and client capture.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Secondary Page Mock Preview */
                  <div className="space-y-6 text-left py-8">
                    <span className="text-3xs font-mono text-forge-blue uppercase tracking-widest">
                      {compiledSpec.websiteType} • SECTION VIEW
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-forge-white uppercase tracking-tight">
                      {activePreviewPage}
                    </h2>
                    <p className="text-xs sm:text-sm text-forge-muted font-light max-w-xl leading-relaxed">
                      This is the simulated digital layout for the <strong className="text-forge-white">{activePreviewPage}</strong> page of <strong className="text-forge-white">{projectName}</strong>, styled under the {compiledSpec.visualStyle} design doctrine.
                    </p>
                    <div className="p-4 rounded-xl border border-forge-border bg-forge-surface/50 max-w-lg space-y-2">
                      <span className="text-3xs font-mono uppercase text-forge-muted">SPECIFIED TARGET GOAL</span>
                      <p className="text-xs text-forge-white/90">{mainGoal}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActivePreviewPage('Home')}
                      className="inline-flex items-center gap-1.5 text-2xs font-mono text-forge-blue hover:underline cursor-pointer"
                    >
                      ← RETURN TO HOMEPAGE PREVIEW
                    </button>
                  </div>
                )}

                {/* Footer Wireframe Component */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-3xs font-mono text-forge-muted">
                  <span>© {new Date().getFullYear()} {projectName}. ALL RIGHTS RESERVED.</span>
                  <div className="flex gap-3 uppercase">
                    <span>PRIVACY</span>
                    <span>TERMS</span>
                    <span>SECURITY</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Next Steps Roadmap */}
            <div className="rounded-xl border border-forge-border bg-forge-surface/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-forge-white uppercase tracking-wider">
                <Terminal size={14} className="text-forge-blue" />
                <span>Next Steps in the Production Pipeline</span>
              </div>
              <p className="text-2xs text-forge-muted font-light leading-relaxed">
                This specification has been safely attached to your project in Firestore. Next, the Forge Code Generation Agent converts this architecture into a production React + Tailwind codebase, generating component trees, routes, SEO metadata, and ready-to-deploy static assets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-2xs">
                <div className="p-3 rounded-lg border border-forge-border bg-forge-navy/60">
                  <span className="text-forge-white font-semibold block mb-0.5">1. Route Manifest</span>
                  <span className="text-forge-muted">{compiledSpec.selectedPages.length} pages scheduled for synthesis</span>
                </div>
                <div className="p-3 rounded-lg border border-forge-border bg-forge-navy/60">
                  <span className="text-forge-white font-semibold block mb-0.5">2. Visual Vocabulary</span>
                  <span className="text-forge-muted">{compiledSpec.visualStyle} aesthetic tokens applied</span>
                </div>
                <div className="p-3 rounded-lg border border-forge-border bg-forge-navy/60">
                  <span className="text-forge-white font-semibold block mb-0.5">3. Primary Conversion</span>
                  <span className="text-forge-muted font-mono text-3xs text-forge-blue">"{compiledSpec.primaryCTA}"</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}
