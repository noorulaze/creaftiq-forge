import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/shared'
import { useAuthStore } from '@/store/useAuthStore'
import { createProject } from '@/services/firestore'
import type { ProjectContext } from '@/types'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

const EXAMPLES = [
  'I want to start a Kerala-based streetwear brand for college students.',
  'A minimalist cold-brew coffee studio with subscription drops.',
  'An AI architecture workflow tool for boutique interior designers.',
  'A sustainable bamboo homeware brand targeting metropolitan apartments.',
]

const INDUSTRIES = [
  'Fashion & Apparel',
  'Food & Beverage',
  'Tech & Digital Product',
  'Design & Architecture',
  'Health & Wellness',
  'Art & Culture',
  'Other',
]

export function CreateProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [projectName, setProjectName] = useState('')
  const [idea, setIdea] = useState('')
  const [industry, setIndustry] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim()) {
      setError('Please describe your idea.')
      return
    }
    if (!user) {
      toast.error('Session required. Initializing guest session...')
    }
    setError(null)
    setLoading(true)

    const context: ProjectContext = {
      name: projectName.trim() || undefined,
      industry: industry.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
    }

    try {
      const uid = user?.uid || 'user_demo_1'
      const projectId = await createProject(uid, idea.trim(), context)
      navigate(`/forge/${projectId}/processing`)
    } catch {
      toast.error('Failed to initialize project. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forge-black pt-14 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-forge-blue" />
            <span className="section-label">CREATE PROJECT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-forge-white tracking-tight mb-2">
            What are you building?
          </h1>
          <p className="text-forge-muted text-sm leading-relaxed">
            Enter your raw concept. FORGE will analyze its core DNA and sculpt a comprehensive digital launch blueprint.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Project Name (Optional / Recommended) */}
            <div>
              <label className="forge-label">
                PROJECT NAME <span className="text-forge-muted/60 lowercase font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g., Velo Streetwear or Studio Meridian"
                className="forge-input text-sm"
                disabled={loading}
              />
            </div>

            {/* Raw Idea Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="forge-label mb-0">
                  RAW IDEA <span className="text-forge-blue">*</span>
                </label>
                {idea.length > 0 && (
                  <span className="text-2xs text-forge-muted font-mono">{idea.length} chars</span>
                )}
              </div>
              <textarea
                value={idea}
                onChange={e => { setIdea(e.target.value); setError(null) }}
                placeholder="Describe what you want to build, who it's for, or the vibe you have in mind..."
                className={cn(
                  'w-full min-h-[160px] bg-forge-navy border rounded-xl px-4 py-3.5 text-forge-white text-base placeholder:text-forge-muted/40 focus:outline-none transition-all duration-200 resize-none leading-relaxed',
                  error
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-forge-border focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30'
                )}
                autoFocus
                disabled={loading}
              />
            </div>

            {/* Example Idea Chips */}
            <div>
              <p className="text-2xs font-semibold tracking-wider text-forge-muted uppercase mb-2">
                Quick Prompts:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => { setIdea(ex); setError(null) }}
                    className="text-xs text-forge-muted/80 bg-forge-surface border border-forge-border rounded-lg px-3 py-1.5 hover:text-forge-white hover:border-forge-border2 hover:bg-forge-surface2 transition-colors text-left"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>

            {/* Error prompt */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Collapsible details toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-xs text-forge-muted hover:text-forge-white transition-colors"
              >
                <ChevronDown
                  size={14}
                  className={cn('transition-transform duration-200', showDetails && 'rotate-180')}
                />
                <span>{showDetails ? 'Hide optional parameters' : 'Specify industry & target audience (optional)'}</span>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-forge-surface border border-forge-border">
                      <div>
                        <label className="forge-label">INDUSTRY</label>
                        <select
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                          className="forge-input text-xs bg-forge-navy"
                          disabled={loading}
                        >
                          <option value="">Select industry...</option>
                          {INDUSTRIES.map(ind => (
                            <option key={ind} value={ind}>{ind}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="forge-label">TARGET AUDIENCE</label>
                        <input
                          type="text"
                          value={targetAudience}
                          onChange={e => setTargetAudience(e.target.value)}
                          placeholder="e.g., College students, designers"
                          className="forge-input text-xs"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                fullWidth
                loading={loading}
                disabled={!idea.trim()}
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="text-xs font-semibold tracking-widest uppercase py-4 rounded-xl"
              >
                FORGE MY IDEA
              </Button>
            </div>

          </motion.div>
        </form>

      </div>
    </div>
  )
}
