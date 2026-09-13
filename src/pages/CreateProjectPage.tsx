import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, AlertCircle, Sparkles, Compass } from 'lucide-react'
import { Button } from '@/components/shared'
import { MountainBackdrop } from '@/components/landing/MountainBackdrop'
import { useAuthStore } from '@/store/useAuthStore'
import { createProject } from '@/services/firestore'
import type { ProjectContext } from '@/types'
import { cn } from '@/utils/cn'

const INDUSTRIES = [
  'Technology',
  'Fashion',
  'Education',
  'Food & Beverage',
  'Health & Fitness',
  'E-commerce',
  'Creative Services',
  'Other',
]

const GOALS = [
  'Build a brand',
  'Launch a website',
  'Create an app',
  'Grow a business',
  'Plan a marketing campaign',
  'Explore an idea',
]

export function CreateProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Controlled form states
  const [projectName, setProjectName] = useState('')
  const [ideaDescription, setIdeaDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [mainGoal, setMainGoal] = useState('')

  // Validation & interaction states
  const [errors, setErrors] = useState<{ projectName?: string; ideaDescription?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const charCount = ideaDescription.length

  function validate() {
    const nextErrors: { projectName?: string; ideaDescription?: string } = {}
    if (!projectName.trim()) {
      nextErrors.projectName = 'Project name is required.'
    }
    if (!ideaDescription.trim()) {
      nextErrors.ideaDescription = 'Please describe what you want to build.'
    } else if (ideaDescription.trim().length < 10) {
      nextErrors.ideaDescription = 'Please enter at least 10 characters so FORGE can understand your concept.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Store local project object (per user request: store projectName, ideaDescription, industry, targetAudience, mainGoal, createdAt)
    const localProjectData = {
      projectName: projectName.trim(),
      ideaDescription: ideaDescription.trim(),
      industry: industry || undefined,
      targetAudience: targetAudience.trim() || undefined,
      mainGoal: mainGoal || undefined,
      createdAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem('forge_pending_submission', JSON.stringify(localProjectData))
    } catch {
      // Ignored
    }

    const context: ProjectContext = {
      name: projectName.trim(),
      industry: industry || undefined,
      targetAudience: targetAudience.trim() || undefined,
      mainGoal: mainGoal || undefined,
    }

    try {
      const uid = user?.uid || 'user_demo_1'
      // Pass project name & context to persistence layer
      const projectId = await createProject(uid, ideaDescription.trim(), context)
      navigate(`/forge/${projectId}/processing`)
    } catch {
      const fallbackId = 'proj_' + Date.now()
      navigate(`/forge/${fallbackId}/processing`)
    }
  }

  return (
    <div className="relative min-h-screen bg-forge-black pt-20 pb-20 overflow-hidden flex items-center">
      {/* Background: subtle blurred mountain and blue light */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ============================================================ */}
          {/* Left Column: Heading, Subtext, and Journey Guidance          */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 text-left pt-2 lg:pt-6"
          >
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xs font-semibold tracking-widest uppercase text-forge-muted hover:text-forge-white transition-colors mb-6 group"
            >
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
              <span>BACK TO HOME</span>
            </Link>

            {/* Small Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
              <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-muted">
                STEP 01 — CREATIVE INPUT
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-forge-white uppercase leading-[1.08] mb-4">
              LET’S FORGE <br />
              <span className="text-gradient-blue">SOMETHING GREAT.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-forge-muted font-light leading-relaxed mb-8 max-w-md">
              Give your idea a name and tell FORGE what you want to build.
            </p>

            {/* Process overview cards */}
            <div className="hidden lg:block space-y-3 pt-6 border-t border-forge-border/40 max-w-md">
              <div className="flex items-start gap-3 text-xs text-forge-muted">
                <div className="w-5 h-5 rounded bg-forge-blue/10 border border-forge-blue/20 flex items-center justify-center text-forge-blue font-mono font-bold text-2xs flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-forge-white uppercase tracking-wider text-2xs">Define Raw Vision</p>
                  <p className="text-2xs font-light mt-0.5">Capture your concept in everyday language without corporate jargon.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-forge-muted">
                <div className="w-5 h-5 rounded bg-forge-surface border border-forge-border flex items-center justify-center text-forge-muted font-mono font-bold text-2xs flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-forge-white uppercase tracking-wider text-2xs">Intelligent Structuring</p>
                  <p className="text-2xs font-light mt-0.5">Deconstructs audience, positioning, brand vectors, and launch milestones.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* Right Column: High-Polished Project Input Form                */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full"
          >
            <div className="rounded-2xl border border-forge-border/90 bg-forge-surface/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-card">
              
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                
                {/* 1. Project Name */}
                <div>
                  <label htmlFor="projectName" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                    PROJECT NAME <span className="text-forge-blue">*</span>
                  </label>
                  <input
                    id="projectName"
                    type="text"
                    value={projectName}
                    onChange={e => {
                      setProjectName(e.target.value)
                      if (errors.projectName) setErrors(prev => ({ ...prev, projectName: undefined }))
                    }}
                    placeholder="My next big idea"
                    className={cn(
                      'w-full bg-forge-navy border rounded-xl px-4 py-3.5 text-sm text-forge-white placeholder:text-forge-muted/40 focus:outline-none transition-all duration-200',
                      errors.projectName
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-forge-border focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30',
                    )}
                    disabled={isSubmitting}
                    autoFocus
                  />
                  {errors.projectName && (
                    <p className="flex items-center gap-1.5 text-2xs text-red-400 mt-1.5">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.projectName}</span>
                    </p>
                  )}
                </div>

                {/* 2. What are you building? (Large Textarea) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="ideaDescription" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white">
                      WHAT ARE YOU BUILDING? <span className="text-forge-blue">*</span>
                    </label>
                    <span className="text-2xs font-mono text-forge-muted">
                      {charCount} chars
                    </span>
                  </div>
                  <textarea
                    id="ideaDescription"
                    value={ideaDescription}
                    onChange={e => {
                      setIdeaDescription(e.target.value)
                      if (errors.ideaDescription) setErrors(prev => ({ ...prev, ideaDescription: undefined }))
                    }}
                    placeholder="Describe your idea in your own words…"
                    className={cn(
                      'w-full min-h-[160px] bg-forge-navy border rounded-xl px-4 py-3.5 text-sm sm:text-base text-forge-white placeholder:text-forge-muted/40 focus:outline-none transition-all duration-200 resize-none leading-relaxed',
                      errors.ideaDescription
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                        : 'border-forge-border focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30',
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.ideaDescription && (
                    <p className="flex items-center gap-1.5 text-2xs text-red-400 mt-1.5">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.ideaDescription}</span>
                    </p>
                  )}
                </div>

                {/* Grid for Industry & Who is it for */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* 3. Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                      INDUSTRY
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      className="w-full bg-forge-navy border border-forge-border rounded-xl px-4 py-3.5 text-xs text-forge-white focus:outline-none focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30 transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      <option value="">Select industry...</option>
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind} className="bg-forge-navy text-forge-white">
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Who is it for? */}
                  <div>
                    <label htmlFor="targetAudience" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                      WHO IS IT FOR? <span className="text-forge-muted/50 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="targetAudience"
                      type="text"
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      placeholder="Students, creators, small businesses…"
                      className="w-full bg-forge-navy border border-forge-border rounded-xl px-4 py-3.5 text-xs text-forge-white placeholder:text-forge-muted/40 focus:outline-none focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* 5. What is your main goal? */}
                <div>
                  <label htmlFor="mainGoal" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                    WHAT IS YOUR MAIN GOAL?
                  </label>
                  <select
                    id="mainGoal"
                    value={mainGoal}
                    onChange={e => setMainGoal(e.target.value)}
                    className="w-full bg-forge-navy border border-forge-border rounded-xl px-4 py-3.5 text-xs text-forge-white focus:outline-none focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <option value="">Select main goal...</option>
                    {GOALS.map(goal => (
                      <option key={goal} value={goal} className="bg-forge-navy text-forge-white">
                        {goal}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions: Primary & Secondary buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="xl"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    icon={<ArrowRight size={15} />}
                    iconPosition="right"
                    className="w-full sm:flex-1 text-2xs font-semibold tracking-widest uppercase py-4 rounded-xl shadow-blue-glow-sm"
                  >
                    FORGE MY IDEA
                  </Button>
                  
                  <Link to="/" className="w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xl"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto text-2xs font-semibold tracking-widest uppercase text-forge-muted hover:text-forge-white"
                    >
                      BACK
                    </Button>
                  </Link>
                </div>

              </form>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
