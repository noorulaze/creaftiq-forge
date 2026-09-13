import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Square, Clock, Plus, RotateCcw, Filter, Sparkles, CheckCircle2 } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import toast from 'react-hot-toast'

interface TaskItem {
  id: string
  title: string
  completed: boolean
}

interface PhaseData {
  phase: string
  title: string
  objective: string
  suggestedOutput: string
  status: 'Not started' | 'In progress' | 'Complete'
  tasks: TaskItem[]
}

const INITIAL_PHASES: PhaseData[] = [
  {
    phase: 'Phase 1: Clarify',
    title: 'Idea DNA & Proposition',
    objective: 'Distill the raw concept into a validated core proposition, target audience, and clear market whitespace.',
    suggestedOutput: 'Idea DNA document and 1-sentence value statement.',
    status: 'Complete',
    tasks: [
      { id: 'p1_1', title: 'Conduct target audience research and user interviews', completed: true },
      { id: 'p1_2', title: 'Define unique angle and core differentiator', completed: true },
      { id: 'p1_3', title: 'Synthesize Idea DNA clarity and problem-opportunity profile', completed: true },
    ],
  },
  {
    phase: 'Phase 2: Design',
    title: 'Brand Identity & Creative Direction',
    objective: 'Establish verbal identity, color palette, typography hierarchy, and creative direction.',
    suggestedOutput: 'Brand guidelines, design tokens, and UI layout wireframes.',
    status: 'In progress',
    tasks: [
      { id: 'p2_1', title: 'Lock brand positioning statement and tone of voice', completed: true },
      { id: 'p2_2', title: 'Finalize 5 core design tokens and typography hierarchy', completed: false },
      { id: 'p2_3', title: 'Create visual moodboard and UI wireframe structure', completed: false },
    ],
  },
  {
    phase: 'Phase 3: Build',
    title: 'Product Scope & Web Presence',
    objective: 'Develop MVP product features, digital web presence, and content launch pipeline.',
    suggestedOutput: 'Live digital workspace, MVP features, and content engine assets.',
    status: 'Not started',
    tasks: [
      { id: 'p3_1', title: 'Scope and implement essential MVP feature architecture', completed: false },
      { id: 'p3_2', title: 'Build high-conversion responsive web presence', completed: false },
      { id: 'p3_3', title: 'Produce initial launch content assets and campaign schedule', completed: false },
    ],
  },
  {
    phase: 'Phase 4: Launch',
    title: 'Go-To-Market & Iteration',
    objective: 'Execute staged go-to-market release, onboard early cohort, and iterate on feedback.',
    suggestedOutput: 'Genesis cohort drop, active community, and optimization backlog.',
    status: 'Not started',
    tasks: [
      { id: 'p4_1', title: 'Distribute private beta access to selected early adopters', completed: false },
      { id: 'p4_2', title: 'Execute 7-day launch announcement and acquisition sequence', completed: false },
      { id: 'p4_3', title: 'Collect cohort feedback, review analytics, and iterate', completed: false },
    ],
  },
]

interface RoadmapTabProps {
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function RoadmapTab({
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: RoadmapTabProps) {
  const [phases, setPhases] = useState<PhaseData[]>(() => {
    try {
      const stored = localStorage.getItem('forge_roadmap_v2_tasks') || localStorage.getItem('forge_local_roadmap_tasks')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed
        }
      }
      return INITIAL_PHASES
    } catch {
      return INITIAL_PHASES
    }
  })

  const [filter, setFilter] = useState<'all' | 'active' | 'complete'>('all')
  const [newTaskInput, setNewTaskInput] = useState<{ [phaseIdx: number]: string }>({})

  // Compute total statistics
  const allTasks = phases.flatMap(p => p.tasks)
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter(t => t.completed).length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  function toggleTask(phaseIndex: number, taskId: string) {
    setPhases(prev => {
      const next = prev.map((p, pIdx) => {
        if (pIdx !== phaseIndex) return p
        const updatedTasks = p.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        const allDone = updatedTasks.every(t => t.completed)
        const anyDone = updatedTasks.some(t => t.completed)
        const status: PhaseData['status'] = allDone ? 'Complete' : anyDone ? 'In progress' : 'Not started'
        return {
          ...p,
          status,
          tasks: updatedTasks,
        }
      })
      try {
        localStorage.setItem('forge_roadmap_v2_tasks', JSON.stringify(next))
      } catch {}
      return next
    })
    toast.success('Task status updated.')
  }

  function handleAddTask(phaseIndex: number) {
    const text = newTaskInput[phaseIndex]?.trim()
    if (!text) return

    setPhases(prev => {
      const next = prev.map((p, pIdx) => {
        if (pIdx !== phaseIndex) return p
        const newTask: TaskItem = {
          id: `custom_${Date.now()}`,
          title: text,
          completed: false,
        }
        return {
          ...p,
          status: p.status === 'Complete' ? 'In progress' : p.status,
          tasks: [...p.tasks, newTask],
        }
      })
      try {
        localStorage.setItem('forge_roadmap_v2_tasks', JSON.stringify(next))
      } catch {}
      return next
    })

    setNewTaskInput(prev => ({ ...prev, [phaseIndex]: '' }))
    toast.success('Milestone task added.')
  }

  function handleResetRoadmap() {
    setPhases(INITIAL_PHASES)
    try {
      localStorage.setItem('forge_roadmap_v2_tasks', JSON.stringify(INITIAL_PHASES))
    } catch {}
    toast.success('Roadmap reset to recommended defaults.')
  }

  const filteredPhases = phases.filter(p => {
    if (filter === 'active') return p.status === 'In progress' || p.status === 'Not started'
    if (filter === 'complete') return p.status === 'Complete'
    return true
  })

  const roadmapCopy = `FROM IDEA TO LAUNCH ROADMAP:
Progress: ${completedTasks}/${totalTasks} tasks completed (${completionPercentage}%)
${phases.map(p => `${p.phase}: ${p.title} (${p.status})
Objective: ${p.objective}
Deliverable: ${p.suggestedOutput}
Tasks: ${p.tasks.map(t => `[${t.completed ? 'X' : ' '}] ${t.title}`).join(', ')}`).join('\n\n')}`

  return (
    <BlueprintSection
      badge="TACTICAL EXECUTION ROADMAP"
      heading="FROM IDEA TO LAUNCH."
      subheading="A practical staged implementation sequence with interactive task tracking across all four development phases."
      copyContent={roadmapCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* Overall Completion Progress Command Banner                    */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-gradient-to-r from-forge-navy via-forge-surface to-forge-navy p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                ROADMAP COMPLETION STATUS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-forge-white uppercase tracking-tight mt-0.5">
                {completedTasks} OF {totalTasks} MILESTONES COMPLETED
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-forge-blue">
                {completionPercentage}%
              </span>
              <button
                type="button"
                onClick={handleResetRoadmap}
                className="p-2 rounded-lg border border-forge-border bg-forge-black hover:bg-forge-surface text-forge-muted hover:text-forge-white transition-colors"
                title="Reset to recommended defaults"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-forge-black overflow-hidden mb-6">
            <motion.div
              className="h-full bg-gradient-to-r from-forge-blue to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 border-t border-forge-border/60 pt-4 flex-wrap">
            <span className="text-3xs font-mono uppercase text-forge-muted flex items-center gap-1 mr-1">
              <Filter size={11} /> FILTER:
            </span>
            {(['all', 'active', 'complete'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-2xs font-mono uppercase tracking-wider transition-colors ${
                  filter === f
                    ? 'bg-forge-blue text-white font-bold'
                    : 'bg-forge-navy/80 hover:bg-forge-navy text-forge-muted hover:text-forge-white border border-forge-border'
                }`}
              >
                {f === 'all' ? 'ALL PHASES' : f === 'active' ? 'ACTIVE & UPCOMING' : 'COMPLETED'}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Connected Phase Timeline Nodes                                */}
        {/* ============================================================ */}
        <div className="space-y-6">
          {filteredPhases.map((phase, pIdx) => {
            const actualPhaseIdx = phases.findIndex(p => p.phase === phase.phase)
            const phaseDone = phase.status === 'Complete'
            const phaseActive = phase.status === 'In progress'

            return (
              <div
                key={phase.phase}
                className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                  phaseActive
                    ? 'border-forge-blue/70 bg-forge-navy/90 shadow-blue-glow-sm'
                    : phaseDone
                    ? 'border-emerald-500/30 bg-forge-surface/90'
                    : 'border-forge-border bg-forge-surface/60'
                }`}
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-forge-border/60 gap-3 mb-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-2xs font-mono font-bold px-2.5 py-1 rounded border ${
                        phaseDone
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : phaseActive
                          ? 'text-forge-blue bg-forge-blue/10 border-forge-blue/30'
                          : 'text-forge-muted bg-forge-navy border-forge-border'
                      }`}
                    >
                      {phase.phase}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-forge-white uppercase tracking-wider">
                      {phase.title}
                    </h3>
                  </div>

                  <span
                    className={`text-2xs font-mono uppercase px-2.5 py-1 rounded w-fit ${
                      phaseDone
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : phaseActive
                        ? 'text-forge-blue bg-forge-blue/10 border border-forge-blue/20'
                        : 'text-forge-muted bg-forge-navy border border-forge-border'
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>

                {/* Objective & Deliverables Strip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6 p-3.5 rounded-xl bg-forge-black/40 border border-forge-border/60">
                  <div>
                    <span className="text-forge-muted uppercase tracking-wider font-mono text-3xs block mb-1">
                      STRATEGIC OBJECTIVE
                    </span>
                    <p className="text-forge-white font-light leading-relaxed">
                      {phase.objective}
                    </p>
                  </div>
                  <div>
                    <span className="text-forge-blue uppercase tracking-wider font-mono text-3xs block mb-1">
                      PRIMARY DELIVERABLE
                    </span>
                    <p className="text-forge-offwhite font-light leading-relaxed">
                      {phase.suggestedOutput}
                    </p>
                  </div>
                </div>

                {/* Task Checklist */}
                <div className="space-y-2 mb-4">
                  {phase.tasks.map(task => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(actualPhaseIdx, task.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-forge-navy/80 hover:bg-forge-navy border border-forge-border hover:border-forge-border2 transition-colors text-left group"
                    >
                      <div className="text-forge-blue flex-shrink-0">
                        {task.completed ? (
                          <CheckSquare size={16} className="text-emerald-400" />
                        ) : (
                          <Square size={16} className="text-forge-muted group-hover:text-forge-white" />
                        )}
                      </div>
                      <span
                        className={`text-xs transition-colors ${
                          task.completed ? 'text-forge-muted line-through' : 'text-forge-white font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Inline Add Custom Task Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom milestone to this phase..."
                    value={newTaskInput[actualPhaseIdx] || ''}
                    onChange={e => setNewTaskInput(prev => ({ ...prev, [actualPhaseIdx]: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddTask(actualPhaseIdx)
                    }}
                    className="flex-1 bg-forge-black/60 border border-forge-border rounded-lg px-3 py-2 text-xs text-forge-white placeholder-forge-muted focus:outline-none focus:border-forge-blue transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTask(actualPhaseIdx)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-forge-surface hover:bg-forge-navy border border-forge-border text-2xs font-mono uppercase text-forge-blue hover:text-forge-blue-light transition-colors flex-shrink-0"
                  >
                    <Plus size={12} />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </BlueprintSection>
  )
}

