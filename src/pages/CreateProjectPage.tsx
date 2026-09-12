import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/shared'
import { useAuthStore } from '@/store/useAuthStore'
import { createProject } from '@/services/firestore'
import type { ProjectContext } from '@/types'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

const EXAMPLES = [
  'A streetwear brand for college students',
  'A modern cafe in Kerala',
  'A fitness app for beginners',
  'A creative agency',
  'A sustainable fashion label',
]

export function CreateProjectPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [idea, setIdea]         = useState('')
  const [showFields, setShowFields] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  // Optional context fields
  const [projectName, setProjectName]       = useState('')
  const [industry, setIndustry]             = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [location, setLocation]             = useState('')
  const [mainGoal, setMainGoal]             = useState('')

  const charCount = idea.length

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim()) { setError('Please describe your idea.'); return }
    if (!user) return
    setError(null)
    setLoading(true)

    const context: ProjectContext = {
      name: projectName.trim() || undefined,
      industry: industry.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      location: location.trim() || undefined,
      mainGoal: mainGoal.trim() || undefined,
    }

    try {
      const projectId = await createProject(user.uid, idea.trim(), context)
      navigate(`/forge/${projectId}/processing`)
    } catch {
      toast.error('Failed to create project. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forge-black pt-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-4">CREAFTIQ FORGE</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-forge-white tracking-tight mb-3">
            What are you building?
          </h1>
          <p className="text-forge-muted text-base leading-relaxed">
            Describe your idea. FORGE will turn it into a structured creative blueprint.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Main idea input */}
            <div className="relative mb-6">
              <textarea
                value={idea}
                onChange={e => { setIdea(e.target.value); setError(null) }}
                placeholder="I want to create..."
                className={cn(
                  'w-full min-h-[180px] bg-forge-navy border rounded-2xl px-5 py-4 text-forge-white text-xl placeholder:text-forge-muted/50 focus:outline-none transition-all duration-200 resize-none leading-relaxed',
                  error
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
                    : 'border-forge-border focus:border-forge-blue focus:ring-1 focus:ring-forge-blue/30',
                )}
                autoFocus
                disabled={loading}
              />

              {/* Character count */}
              <div className="absolute bottom-3 right-4 text-xs text-forge-muted/50">
                {charCount > 0 && charCount}
              </div>
            </div>

            {/* Example ideas */}
            <div className="mb-6">
              <p className="text-xs text-forge-muted mb-2 tracking-wide">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => { setIdea(ex); setError(null) }}
                    className="text-xs text-forge-muted border border-forge-border rounded-full px-3 py-1 hover:text-forge-white hover:border-forge-border2 hover:bg-forge-surface transition-all duration-150"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-4 text-red-400 text-sm"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Optional fields toggle */}
            <button
              type="button"
              onClick={() => setShowFields(!showFields)}
              className="flex items-center gap-2 text-sm text-forge-muted hover:text-forge-white transition-colors mb-4"
            >
              <ChevronDown
                size={15}
                className={cn('transition-transform duration-200', showFields && 'rotate-180')}
              />
              {showFields ? 'Hide details' : 'Add details (optional)'}
            </button>

            {/* Optional fields */}
            <AnimatePresence>
              {showFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-forge-navy rounded-2xl border border-forge-border p-5">
                    <div>
                      <label className="forge-label">Project Name</label>
                      <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                        placeholder="My Brand" className="forge-input" disabled={loading} />
                    </div>
                    <div>
                      <label className="forge-label">Industry</label>
                      <input type="text" value={industry} onChange={e => setIndustry(e.target.value)}
                        placeholder="Fashion, Tech, Food..." className="forge-input" disabled={loading} />
                    </div>
                    <div>
                      <label className="forge-label">Target Audience</label>
                      <input type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)}
                        placeholder="College students, Parents..." className="forge-input" disabled={loading} />
                    </div>
                    <div>
                      <label className="forge-label">Location</label>
                      <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                        placeholder="India, New York, Global..." className="forge-input" disabled={loading} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="forge-label">Main Goal</label>
                      <input type="text" value={mainGoal} onChange={e => setMainGoal(e.target.value)}
                        placeholder="Build awareness, Launch MVP, Grow community..." className="forge-input" disabled={loading} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="xl"
              fullWidth
              loading={loading}
              disabled={!idea.trim()}
              iconPosition="right"
              icon={<ArrowRight size={18} />}
              className="tracking-widest font-semibold text-sm uppercase"
            >
              START FORGING
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
