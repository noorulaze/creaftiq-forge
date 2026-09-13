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
            if (parsed.selectedPages) setSelectedPages(parsed.selectedPages)
            if (parsed.visualStyle) setVisualStyle(parsed.visualStyle)
            if (parsed.primaryCTA) setPrimaryCTA(parsed.primaryCTA)
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
      toast.success('Website Blueprint Specification successfully generated!')
    } catch {
      toast.error('Failed to save website specification. Please retry.')
    } finally {
      setGenerating(false)
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

            {/* Next Steps Roadmap */}
            <div className="rounded-xl border border-forge-border bg-forge-surface/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-forge-white uppercase tracking-wider">
                <Terminal size={14} className="text-forge-blue" />
                <span>Next Steps in the Production Pipeline</span>
              </div>
              <p className="text-2xs text-forge-muted font-light leading-relaxed">
                This specification has been safely attached to your project. Next, the Forge Code Generation Agent converts this architecture into a production React + Tailwind codebase, generating component trees, routes, SEO metadata, and ready-to-deploy static assets.
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
