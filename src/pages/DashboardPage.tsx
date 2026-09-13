import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Calendar, Zap, Trash2, Edit3, FolderOpen, Plus } from 'lucide-react'
import { Button, Badge, Modal, EmptyState, SkeletonCard, ErrorState } from '@/components/shared'
import { useAuthStore } from '@/store/useAuthStore'
import { useForgeStore } from '@/store/useForgeStore'
import { subscribeToUserProjects, deleteProject, renameProject, createProject } from '@/services/firestore'
import { isFirebaseConfigured } from '@/services/firebase'
import type { Project, ProjectStatus } from '@/types'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'


// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: ProjectStatus }) {
  const map = {
    draft:    { label: 'Draft',    variant: 'neutral' },
    forging:  { label: 'Forging',  variant: 'amber'   },
    complete: { label: 'Complete', variant: 'green'   },
    error:    { label: 'Error',    variant: 'red'     },
  } as const
  const { label, variant } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

// ─── Project Card ─────────────────────────────────────────────
function ProjectCard({
  project,
  onRename,
  onDelete,
}: {
  project: Project
  onRename: (p: Project) => void
  onDelete: (p: Project) => void
}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="relative group rounded-xl border border-forge-border bg-forge-surface p-5 hover:border-forge-border2 hover:shadow-card-hover transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/forge/${project.id}`)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-forge-blue/10 border border-forge-blue/20 flex items-center justify-center flex-shrink-0">
            <Zap size={12} className="text-forge-blue" />
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-forge-muted hover:text-forge-white hover:bg-forge-border transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={14} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-8 w-40 rounded-xl border border-forge-border bg-forge-surface2 shadow-card py-1 z-20"
              >
                <button
                  onClick={() => { navigate(`/forge/${project.id}`); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-forge-muted hover:text-forge-white hover:bg-forge-border transition-colors"
                >
                  <FolderOpen size={12} /> Open Project
                </button>
                <button
                  onClick={() => { onRename(project); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-forge-muted hover:text-forge-white hover:bg-forge-border transition-colors"
                >
                  <Edit3 size={12} /> Rename
                </button>
                <div className="my-1 border-t border-forge-border" />
                <button
                  onClick={() => { onDelete(project); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-forge-white font-semibold text-sm mb-1.5 line-clamp-1">{project.name}</h3>

      {/* Idea preview */}
      <p className="text-forge-muted text-xs leading-relaxed line-clamp-2 mb-4">{project.idea}</p>

      {/* Footer bar with Last Updated & Continue button */}
      <div className="flex items-center justify-between pt-3 border-t border-forge-border/60">
        <div className="flex items-center gap-1.5 text-forge-muted/70 text-2xs font-mono">
          <Calendar size={11} />
          <span>Updated {formattedDate}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/forge/${project.id}`)
          }}
          className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-wider text-forge-blue hover:text-forge-blue-light transition-colors"
        >
          <span>Continue</span>
          <FolderOpen size={11} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Create Project Modal ─────────────────────────────────────
function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [idea, setIdea]     = useState('')
  const [name, setName]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!idea.trim()) { toast.error('Please enter your idea.'); return }
    if (!user) return
    setLoading(true)
    try {
      const id = await createProject(user.uid, idea.trim(), { name: name.trim() || undefined })
      toast.success('Project created.')
      onClose()
      navigate(`/forge/${id}/processing`)
    } catch {
      toast.error('Failed to create project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="NEW FORGE" size="md">
      <div className="space-y-4">
        <div>
          <label className="forge-label">Your Idea <span className="text-red-400">*</span></label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="I want to create..."
            className="forge-input resize-none h-24"
            autoFocus
          />
        </div>
        <div>
          <label className="forge-label">Project Name <span className="text-forge-muted font-normal normal-case">(optional)</span></label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My Streetwear Brand"
            className="forge-input"
          />
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleCreate}
          icon={<Zap size={14} />}
          className="tracking-wide mt-2"
        >
          START FORGING
        </Button>
      </div>
    </Modal>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────
export function DashboardPage() {
  const { user } = useAuthStore()
  const { projects, setProjects } = useForgeStore()
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  // Rename
  const [renameTarget, setRenameTarget] = useState<Project | null>(null)
  const [renameName, setRenameName]     = useState('')
  const [renameLoading, setRenameLoading] = useState(false)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Subscribe to real-time project updates
  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserProjects(user.uid, (p) => {
      setProjects(p)
      setLoading(false)
    })
    return unsubscribe
  }, [user, setProjects])

  async function handleRename() {
    if (!renameTarget || !renameName.trim()) return
    setRenameLoading(true)
    try {
      await renameProject(renameTarget.id, renameName.trim())
      toast.success('Project renamed.')
      setRenameTarget(null)
    } catch {
      toast.error('Failed to rename project.')
    } finally {
      setRenameLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteProject(deleteTarget.id)
      toast.success('Project deleted.')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete project.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (error) return <ErrorState message={error} onRetry={() => setError(null)} className="pt-24" />

  return (
    <div className="min-h-screen bg-forge-black pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="section-label mb-0">WORKSPACE</p>
              <span className="text-forge-border">•</span>
              {isFirebaseConfigured ? (
                <span className="inline-flex items-center gap-1 text-3xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FIRESTORE SYNC ACTIVE</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-navy text-forge-muted border border-forge-border">
                  <span>LOCAL WORKSPACE MODE</span>
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-forge-white tracking-tight">My Forges</h1>
            <p className="text-forge-muted text-sm mt-2">Your creative workspace. All your ideas in one place.</p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={15} />}
            onClick={() => setCreateOpen(true)}
            className="mt-1"
          >
            New Forge
          </Button>
        </div>


        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No forges yet"
            description="Start your first forge and turn an idea into a digital launch plan."
            action={
              <Button variant="primary" size="md" icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
                Start Your First Forge
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onRename={p => { setRenameTarget(p); setRenameName(p.name) }}
                onDelete={p => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Rename modal */}
      <Modal open={!!renameTarget} onClose={() => setRenameTarget(null)} title="RENAME PROJECT" size="sm">
        <div className="space-y-4">
          <input
            type="text"
            value={renameName}
            onChange={e => setRenameName(e.target.value)}
            className="forge-input"
            placeholder="Project name"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') handleRename() }}
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="md" fullWidth onClick={() => setRenameTarget(null)}>Cancel</Button>
            <Button variant="primary" size="md" fullWidth loading={renameLoading} onClick={handleRename}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="DELETE PROJECT" size="sm">
        <div className="space-y-4">
          <p className="text-forge-muted text-sm">
            Are you sure you want to delete <span className="text-forge-white font-medium">"{deleteTarget?.name}"</span>?
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="md" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" size="md" fullWidth loading={deleteLoading} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
