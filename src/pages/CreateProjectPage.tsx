import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, AlertCircle, Sparkles, CheckCircle2, Loader2, Lightbulb, ChevronDown } from 'lucide-react'
import { MountainBackdrop } from '@/components/landing/MountainBackdrop'
import { useAuthStore } from '@/store/useAuthStore'
import { createProject } from '@/services/firestore'
import type { ProjectContext } from '@/types'
import { cn } from '@/utils/cn'

const INDUSTRIES = [
  'Fashion',
  'Education',
  'Technology',
  'Food',
  'Fitness',
  'E-commerce',
  'Media',
  'Other',
]

const GOALS = [
  'Launch a brand',
  'Build a website',
  'Create an app',
  'Start a business',
  'Improve an existing idea',
  'Build a campaign',
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
  const [touched, setTouched] = useState<{ projectName?: boolean; ideaDescription?: boolean }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const charCount = ideaDescription.length
  const isFormEmpty = !projectName.trim() || !ideaDescription.trim()

  function validate() {
    const nextErrors: { projectName?: string; ideaDescription?: string } = {}
    if (!projectName.trim()) {
      nextErrors.projectName = 'Project name is required.'
    }
    if (!ideaDescription.trim()) {
      nextErrors.ideaDescription = 'Please describe your idea in your own words.'
    } else if (ideaDescription.trim().length < 5) {
      nextErrors.ideaDescription = 'Please provide a little more detail about your idea.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleBlur(field: 'projectName' | 'ideaDescription') {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (field === 'projectName' && !projectName.trim()) {
      setErrors(prev => ({ ...prev, projectName: 'Project name is required.' }))
    } else if (field === 'projectName') {
      setErrors(prev => ({ ...prev, projectName: undefined }))
    }

    if (field === 'ideaDescription' && !ideaDescription.trim()) {
      setErrors(prev => ({ ...prev, ideaDescription: 'Please describe your idea in your own words.' }))
    } else if (field === 'ideaDescription' && ideaDescription.trim().length >= 5) {
      setErrors(prev => ({ ...prev, ideaDescription: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched({ projectName: true, ideaDescription: true })
    if (!validate()) return

    setIsSubmitting(true)

    // Construct local project object to store in temporary state / localStorage
    const timestamp = new Date().toISOString()
    const fallbackId = 'proj_' + Date.now()

    const localProjectData = {
      id: fallbackId,
      projectName: projectName.trim(),
      ideaDescription: ideaDescription.trim(),
      industry: industry || undefined,
      targetAudience: targetAudience.trim() || undefined,
      mainGoal: mainGoal || undefined,
      createdAt: timestamp,
    }

    try {
      localStorage.setItem('forge_pending_submission', JSON.stringify(localProjectData))
      localStorage.setItem('forge_last_project', JSON.stringify(localProjectData))
    } catch {
      // Safe fallback
    }

    const context: ProjectContext = {
      name: projectName.trim(),
      industry: industry || undefined,
      targetAudience: targetAudience.trim() || undefined,
      mainGoal: mainGoal || undefined,
    }

    try {
      const uid = user?.uid || 'user_demo_1'
      const projectId = await createProject(uid, ideaDescription.trim(), context)
      // Navigate to the Idea Analysis flow (mock processing loading screen -> Idea DNA)
      navigate(`/forge/${projectId}/processing`)
    } catch {
      navigate(`/forge/${fallbackId}/processing`)
    }
  }

  return (
    <div className="relative min-h-screen bg-forge-black pt-24 sm:pt-28 pb-20 overflow-hidden flex items-center">
      {/* Background: atmospheric blurred mountain and subtle blue illumination */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ============================================================ */}
          {/* Left Column: Heading, Context, and Creative Guidance         */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 text-left pt-2 lg:pt-6"
          >
            {/* Back Button to Landing Page */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xs font-semibold tracking-widest uppercase text-forge-muted hover:text-forge-white transition-colors mb-8 group"
            >
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
              <span>BACK TO HOME</span>
            </Link>

            {/* Small Label Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-forge-border/80 bg-forge-surface/80 backdrop-blur-md mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-blue animate-pulse" />
              <span className="text-2xs font-semibold tracking-widest3 uppercase text-forge-white">
                CREAFTIQ FORGE
              </span>
              <span className="text-forge-border">/</span>
              <span className="text-2xs font-mono text-forge-muted">NEW PROJECT</span>
            </div>

            {/* Page Heading: START WITH AN IDEA. */}
            <h1 className="text-3xl sm:text-5xl lg:text-5.5xl font-black tracking-tight text-forge-white uppercase leading-[1.06] mb-4">
              START WITH <br />
              <span className="text-gradient-blue font-bold">AN IDEA.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-forge-muted font-light leading-relaxed mb-8 max-w-md">
              Tell us what you are thinking. FORGE will help turn it into a clear digital direction.
            </p>

            {/* Creative Thought Starters */}
            <div className="space-y-3 pt-6 border-t border-forge-border/50 max-w-md">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-forge-border/60 bg-forge-surface/40">
                <div className="w-7 h-7 rounded-lg bg-forge-blue/15 border border-forge-blue/30 flex items-center justify-center text-forge-blue flex-shrink-0 mt-0.5">
                  <Lightbulb size={13} />
                </div>
                <div>
                  <p className="font-semibold text-forge-white uppercase tracking-wider text-2xs">Rough Notes Welcome</p>
                  <p className="text-2xs font-light text-forge-muted mt-0.5 leading-relaxed">
                    No need for complete business plans. Raw and unpolished ideas give FORGE the best foundation to explore.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-forge-border/60 bg-forge-surface/40">
                <div className="w-7 h-7 rounded-lg bg-forge-navy border border-forge-border flex items-center justify-center text-forge-muted flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <p className="font-semibold text-forge-white uppercase tracking-wider text-2xs">Structured Synthesis</p>
                  <p className="text-2xs font-light text-forge-muted mt-0.5 leading-relaxed">
                    Instantly transformed into Idea DNA, brand identity, digital UX blueprints, content hooks, and an execution roadmap.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* Right Column: Premium Form Canvas                            */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 w-full"
          >
            <div className="relative rounded-2xl border border-forge-border/90 bg-forge-surface/90 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-card">
              
              {/* Studio Canvas Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-forge-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <div className="w-2.5 h-2.5 rounded-full bg-forge-border2" />
                  <span className="ml-2 text-2xs font-mono text-forge-muted tracking-wider">forge.studio / new-idea-canvas</span>
                </div>
                <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-forge-blue/10 text-forge-blue border border-forge-blue/20">
                  INPUT CANVAS
                </span>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                
                {/* 1. Project Name */}
                <div>
                  <label htmlFor="projectName" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                    PROJECT NAME <span className="text-forge-blue">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="projectName"
                      type="text"
                      value={projectName}
                      onBlur={() => handleBlur('projectName')}
                      onChange={e => {
                        setProjectName(e.target.value)
                        if (errors.projectName) setErrors(prev => ({ ...prev, projectName: undefined }))
                      }}
                      placeholder="Kerala Streetwear Brand"
                      className={cn(
                        'w-full bg-forge-navy border rounded-xl px-4 py-3.5 text-sm text-forge-white placeholder:text-forge-muted/40 transition-all duration-200 outline-none',
                        errors.projectName && touched.projectName
                          ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-forge-border hover:border-forge-border2 focus:border-forge-blue focus:ring-2 focus:ring-forge-blue/25 focus:bg-forge-navy/90',
                      )}
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  {errors.projectName && touched.projectName && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-2xs text-red-400 mt-2 font-medium">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.projectName}</span>
                    </motion.p>
                  )}
                </div>

                {/* 2. Your Idea (Large Textarea) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="ideaDescription" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white">
                      YOUR IDEA <span className="text-forge-blue">*</span>
                    </label>
                    <span className="text-2xs font-mono text-forge-muted">
                      {charCount} chars
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      id="ideaDescription"
                      value={ideaDescription}
                      onBlur={() => handleBlur('ideaDescription')}
                      onChange={e => {
                        setIdeaDescription(e.target.value)
                        if (errors.ideaDescription) setErrors(prev => ({ ...prev, ideaDescription: undefined }))
                      }}
                      placeholder="Explain your idea in your own words. It can be rough, unfinished, or incomplete."
                      className={cn(
                        'w-full min-h-[160px] bg-forge-navy border rounded-xl px-4 py-3.5 text-sm sm:text-base text-forge-white placeholder:text-forge-muted/40 transition-all duration-200 resize-none leading-relaxed outline-none',
                        errors.ideaDescription && touched.ideaDescription
                          ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-forge-border hover:border-forge-border2 focus:border-forge-blue focus:ring-2 focus:ring-forge-blue/25 focus:bg-forge-navy/90',
                      )}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.ideaDescription && touched.ideaDescription && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-2xs text-red-400 mt-2 font-medium">
                      <AlertCircle size={12} className="flex-shrink-0" />
                      <span>{errors.ideaDescription}</span>
                    </motion.p>
                  )}
                </div>

                {/* Grid for Industry & Target Audience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* 3. Industry */}
                  <div>
                    <label htmlFor="industry" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                      INDUSTRY <span className="text-forge-muted/50 font-normal lowercase">(optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        id="industry"
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="w-full bg-forge-navy border border-forge-border hover:border-forge-border2 rounded-xl px-4 py-3.5 text-xs text-forge-white focus:outline-none focus:border-forge-blue focus:ring-2 focus:ring-forge-blue/25 transition-all duration-200 appearance-none cursor-pointer"
                        disabled={isSubmitting}
                      >
                        <option value="">Select industry...</option>
                        {INDUSTRIES.map(ind => (
                          <option key={ind} value={ind} className="bg-forge-navy text-forge-white py-1">
                            {ind}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-forge-muted">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  {/* 4. Target Audience */}
                  <div>
                    <label htmlFor="targetAudience" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                      TARGET AUDIENCE <span className="text-forge-muted/50 font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="targetAudience"
                      type="text"
                      value={targetAudience}
                      onChange={e => setTargetAudience(e.target.value)}
                      placeholder="College students in Kerala"
                      className="w-full bg-forge-navy border border-forge-border hover:border-forge-border2 rounded-xl px-4 py-3.5 text-xs text-forge-white placeholder:text-forge-muted/40 focus:outline-none focus:border-forge-blue focus:ring-2 focus:ring-forge-blue/25 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* 5. Main Goal */}
                <div>
                  <label htmlFor="mainGoal" className="block text-2xs font-semibold tracking-widest uppercase text-forge-white mb-2">
                    MAIN GOAL <span className="text-forge-muted/50 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      id="mainGoal"
                      value={mainGoal}
                      onChange={e => setMainGoal(e.target.value)}
                      className="w-full bg-forge-navy border border-forge-border hover:border-forge-border2 rounded-xl px-4 py-3.5 text-xs text-forge-white focus:outline-none focus:border-forge-blue focus:ring-2 focus:ring-forge-blue/25 transition-all duration-200 appearance-none cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <option value="">Select main goal...</option>
                      {GOALS.map(goal => (
                        <option key={goal} value={goal} className="bg-forge-navy text-forge-white py-1">
                          {goal}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-forge-muted">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Actions: Primary Forge Button & Back Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3.5">
                  <motion.div whileHover={isFormEmpty || isSubmitting ? {} : { scale: 1.01 }} whileTap={isFormEmpty || isSubmitting ? {} : { scale: 0.99 }} className="w-full sm:flex-1">
                    <button
                      type="submit"
                      disabled={isFormEmpty || isSubmitting}
                      className={cn(
                        'w-full relative group overflow-hidden rounded-xl py-4 px-6 font-bold text-xs tracking-widest2 uppercase text-white shadow-blue-glow transition-all duration-200 flex items-center justify-center gap-2',
                        isFormEmpty
                          ? 'bg-forge-surface border border-forge-border text-forge-muted/40 cursor-not-allowed shadow-none'
                          : isSubmitting
                          ? 'bg-forge-blue/80 opacity-90 cursor-wait'
                          : 'bg-gradient-to-r from-forge-blue via-forge-blue-light to-forge-blue hover:shadow-blue-glow cursor-pointer',
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin text-white" />
                          <span>FORGING YOUR IDEA...</span>
                        </>
                      ) : (
                        <>
                          <span>FORGE MY IDEA</span>
                          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </motion.div>
                  
                  {/* Back button to return to landing page */}
                  <Link to="/" className="w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-4 rounded-xl border border-forge-border/80 bg-forge-navy hover:bg-forge-surface text-2xs font-semibold tracking-widest uppercase text-forge-muted hover:text-forge-white transition-colors cursor-pointer"
                    >
                      BACK
                    </button>
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
