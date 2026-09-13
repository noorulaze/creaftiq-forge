import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MoreVertical,
  Calendar,
  Zap,
  Trash2,
  Edit3,
  FolderOpen,
  Plus,
  Copy,
  LogOut,
  User,
  ChevronDown,
  RefreshCw,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { Button, Badge, Modal, SkeletonCard, ErrorState } from '@/components/shared'
import { MountainBackdrop } from '@/components/landing/MountainBackdrop'
import { useAuthStore } from '@/store/useAuthStore'
import { useForgeStore } from '@/store/useForgeStore'
import {
  subscribeToUserProjects,
  deleteProject,
  renameProject,
  duplicateProject,
  createProject,
  getUserProjects,
} from '@/services/firestore'
import { logoutUser } from '@/services/auth'
import { isFirebaseConfigured } from '@/services/firebase'
import type { Project, ProjectStatus } from '@/types'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

// ─── Status Badge Component ──────────────────────────────────
function StatusBadge({ status }: { status: ProjectStatus }) {
  const map = {
    draft:    { label: 'Draft',    variant: 'neutral' },
    forging:  { label: 'Forging',  variant: 'amber'   },
    complete: { label: 'Complete', variant: 'green'   },
    error:    { label: 'Error',    variant: 'red'     },
  } as const
  const { label, variant } = map[status] || map.complete
  return <Badge variant={variant} dot>{label}</Badge>
}

// ─── Individual Project Card ─────────────────────────────────
function ProjectCard({
  project,
  onRename,
  onDuplicate,
  onDelete,
}: {
  project: Project
  onRename: (p: Project) => void
  onDuplicate: (p: Project) => void
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

  const updatedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const createdDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const industry = project.industry || project.context?.industry || 'Creative Direction'
  const ideaText = project.idea || project.originalIdea || 'No description available.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative group rounded-2xl border border-forge-border/80 bg-forge-surface/90 hover:bg-forge-surface backdrop-blur-sm p-5 sm:p-6 hover:border-forge-blue/50 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={() => navigate(`/forge/${project.id}`)}
    >
      {/* Card Header: Industry Tag, Status & Action Dropdown */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="inline-flex items-center gap-1 text-3xs font-mono uppercase px-2.5 py-1 rounded-md bg-forge-blue/10 border border-forge-blue/20 text-forge-blue font-semibold">
              <Sparkles size={10} className="text-forge-blue flex-shrink-0" />
              <span className="truncate max-w-[120px]">{industry}</span>
            </span>
            <StatusBadge status={project.status || 'complete'} />
          </div>

          {/* Three-dot context menu */}
          <div className="relative flex-shrink-0" ref={menuRef} onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-forge-muted hover:text-forge-white hover:bg-forge-surface2 border border-transparent hover:border-forge-border transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Project Actions"
            >
              <MoreVertical size={15} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-9 w-44 rounded-xl border border-forge-border bg-forge-surface2 shadow-2xl py-1.5 z-30"
                >
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/forge/${project.id}`)
                      setMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-forge-muted hover:text-forge-white hover:bg-forge-border/60 transition-colors text-left cursor-pointer"
                  >
                    <FolderOpen size={13} className="text-forge-blue" />
                    <span>Open Project</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onRename(project)
                      setMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-forge-muted hover:text-forge-white hover:bg-forge-border/60 transition-colors text-left cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Rename</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onDuplicate(project)
                      setMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-forge-muted hover:text-forge-white hover:bg-forge-border/60 transition-colors text-left cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>Duplicate</span>
                  </button>

                  <div className="my-1 border-t border-forge-border/80" />

                  <button
                    type="button"
                    onClick={() => {
                      onDelete(project)
                      setMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Project Name */}
        <h3 className="text-forge-white font-bold text-base sm:text-lg mb-2 tracking-tight group-hover:text-forge-white line-clamp-1">
          {project.name || project.projectName || 'Untitled Forge'}
        </h3>

        {/* Short Original Idea Preview */}
        <p className="text-forge-muted text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-5">
          {ideaText}
        </p>
      </div>

      {/* Card Footer: Timestamps & Quick Open Button */}
      <div className="pt-3.5 border-t border-forge-border/50 flex items-center justify-between gap-2">
        <div className="flex flex-col text-3xs font-mono text-forge-muted/80">
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-forge-muted/60 flex-shrink-0" />
            <span>Updated {updatedDate}</span>
          </div>
          {createdDate && createdDate !== updatedDate && (
            <span className="text-forge-muted/50 mt-0.5 ml-4">Created {createdDate}</span>
          )}
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            navigate(`/forge/${project.id}`)
          }}
          className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-forge-blue hover:text-forge-blue-light transition-colors cursor-pointer px-2 py-1 rounded hover:bg-forge-blue/10"
        >
          <span>Open</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Create Project Modal ─────────────────────────────────────
function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [idea, setIdea] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!idea.trim()) {
      toast.error('Please describe your idea.')
      return
    }
    if (!user) {
      toast.error('You must be signed in.')
      return
    }

    setLoading(true)
    try {
      const id = await createProject(user.uid, idea.trim(), {
        name: name.trim() || undefined,
      })
      toast.success('Project created. Commencing analysis...')
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
      <form onSubmit={handleCreate} className="space-y-4 text-left">
        <div>
          <label className="block text-2xs font-mono uppercase tracking-widest text-forge-muted mb-1.5">
            Your Idea <span className="text-red-400">*</span>
          </label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Explain what you want to create. It can be rough, raw, or unfinished..."
            className="w-full min-h-[110px] bg-forge-navy border border-forge-border hover:border-forge-border2 focus:border-forge-blue rounded-xl p-3.5 text-xs text-forge-white placeholder:text-forge-muted/40 outline-none transition-all resize-none"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-2xs font-mono uppercase tracking-widest text-forge-muted mb-1.5">
            Project Name <span className="text-forge-muted/60 normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Kerala Streetwear Brand"
            className="w-full bg-forge-navy border border-forge-border hover:border-forge-border2 focus:border-forge-blue rounded-xl px-3.5 py-2.5 text-xs text-forge-white placeholder:text-forge-muted/40 outline-none transition-all"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold uppercase text-forge-muted hover:text-forge-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
            icon={<Zap size={14} />}
            className="text-xs font-bold tracking-wider uppercase px-5 cursor-pointer"
          >
            START FORGING
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Main My Forges Dashboard Page ────────────────────────────
export function MyForgesPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { projects, setProjects } = useForgeStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  // User account menu state
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  // Rename state
  const [renameTarget, setRenameTarget] = useState<Project | null>(null)
  const [renameName, setRenameName] = useState('')
  const [renameLoading, setRenameLoading] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Duplicate in-progress tracking
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  // Close account menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Subscribe to real-time project updates for the authenticated user
  const loadProjectsData = () => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const unsubscribe = subscribeToUserProjects(user.uid, p => {
        setProjects(p)
        setLoading(false)
      })
      return unsubscribe
    } catch {
      getUserProjects(user.uid)
        .then(p => {
          setProjects(p)
          setLoading(false)
        })
        .catch(() => {
          setError('Failed to load your forges from database.')
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    const unsub = loadProjectsData()
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [user, setProjects])

  // ─── Action: Rename ──────────────────────────────────────────
  async function handleRenameSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!renameTarget) return
    const trimmed = renameName.trim()
    if (!trimmed) {
      setRenameError('Project name cannot be blank.')
      return
    }

    setRenameLoading(true)
    setRenameError(null)
    try {
      await renameProject(renameTarget.id, trimmed, user?.uid)
      toast.success('Project renamed successfully.')
      setRenameTarget(null)
    } catch {
      setRenameError('Could not update project name. Please try again.')
      toast.error('Failed to rename project.')
    } finally {
      setRenameLoading(false)
    }
  }

  // ─── Action: Duplicate ───────────────────────────────────────
  async function handleDuplicate(target: Project) {
    if (!user) return
    setDuplicatingId(target.id)
    try {
      const newId = await duplicateProject(target.id, user.uid)
      toast.success(`Duplicated "${target.name}" successfully.`)
      navigate(`/forge/${newId}`)
    } catch {
      toast.error('Failed to duplicate project.')
    } finally {
      setDuplicatingId(null)
    }
  }

  // ─── Action: Delete ──────────────────────────────────────────
  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteProject(deleteTarget.id, user?.uid)
      toast.success('Project deleted successfully.')
      setDeleteTarget(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed. Check your permissions.'
      toast.error(msg)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Action: Sign Out ────────────────────────────────────────
  async function handleSignOut() {
    setAccountMenuOpen(false)
    try {
      await logoutUser()
      toast.success('Signed out.')
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return (
    <div className="relative min-h-screen bg-forge-black pt-20 sm:pt-24 pb-28 text-left overflow-hidden">
      {/* Atmospheric blurred mountain backdrop */}
      <MountainBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ============================================================ */}
        {/* Page Header: Label, Heading, Description, New Forge & User   */}
        {/* ============================================================ */}
        <div className="pb-8 mb-8 border-b border-forge-border/60 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            {/* Small Label */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-2xs font-mono font-bold tracking-widest3 uppercase text-forge-blue">
                CREAFTIQ FORGE
              </span>
              <span className="text-forge-border">•</span>
              {isFirebaseConfigured ? (
                <span className="inline-flex items-center gap-1.5 text-3xs font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>FIRESTORE SYNC ACTIVE</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-navy text-forge-muted border border-forge-border">
                  <span>LOCAL WORKSPACE MODE</span>
                </span>
              )}
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl font-black text-forge-white tracking-tight uppercase leading-tight">
              YOUR <span className="text-gradient-blue">FORGES.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-forge-muted text-sm sm:text-base font-light mt-2 max-w-xl leading-relaxed">
              Your ideas, plans, and creative directions in one workspace.
            </p>
          </div>

          {/* Right Action Bar: New Forge Button + User Account Menu */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap flex-shrink-0">
            {/* New Forge Button */}
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={15} />}
              onClick={() => setCreateOpen(true)}
              className="text-2xs font-bold tracking-wider uppercase px-5 shadow-blue-glow-sm cursor-pointer"
            >
              NEW FORGE
            </Button>

            {/* User Account Menu Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-forge-border/80 bg-forge-surface/80 hover:bg-forge-surface hover:border-forge-border transition-colors text-xs text-forge-white font-medium cursor-pointer"
                title="Account Menu"
              >
                <div className="w-6 h-6 rounded-lg bg-forge-blue/20 border border-forge-blue/30 flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-forge-blue" />
                </div>
                <span className="truncate max-w-[130px] hidden sm:inline">
                  {user?.displayName || user?.email?.split('@')[0] || 'Account'}
                </span>
                <ChevronDown size={13} className="text-forge-muted transition-transform" />
              </button>

              <AnimatePresence>
                {accountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-56 rounded-xl border border-forge-border bg-forge-surface2 shadow-2xl p-2 z-40"
                  >
                    {/* User Info Tile */}
                    <div className="px-3 py-2 border-b border-forge-border/60 mb-1">
                      <p className="text-2xs font-semibold text-forge-white truncate">
                        {user?.displayName || 'Creator'}
                      </p>
                      <p className="text-3xs font-mono text-forge-muted truncate mt-0.5">
                        {user?.email || 'Authenticated User'}
                      </p>
                    </div>

                    <Link
                      to="/forge/new"
                      onClick={() => setAccountMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-forge-muted hover:text-forge-white hover:bg-forge-border/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={13} className="text-forge-blue" />
                      <span>Start New Forge</span>
                    </Link>

                    <div className="my-1 border-t border-forge-border/60" />

                    {/* Logout Button */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Main Content Area: Loading | Error | Empty State | Grid      */}
        {/* ============================================================ */}
        {error ? (
          <div className="py-16">
            <ErrorState
              message={error}
              onRetry={loadProjectsData}
            />
          </div>
        ) : loading ? (
          /* Polished Skeleton Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <SkeletonCard key={i} lines={4} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16 sm:py-24 rounded-3xl border border-forge-border/80 bg-forge-surface/40 backdrop-blur-md px-6 text-center max-w-2xl mx-auto my-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-forge-blue/15 border border-forge-blue/30 flex items-center justify-center mx-auto mb-6 shadow-blue-glow-sm">
              <Zap size={24} className="text-forge-blue" fill="currentColor" />
            </div>

            <p className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold mb-2">
              YOUR CREATIVE WORKSPACE
            </p>

            <h2 className="text-2xl sm:text-3xl font-black text-forge-white tracking-tight uppercase mb-3">
              YOUR FIRST FORGE STARTS HERE.
            </h2>

            <p className="text-forge-muted text-sm sm:text-base font-light max-w-md mx-auto mb-8 leading-relaxed">
              Turn your next idea into a clear digital direction.
            </p>

            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={15} />}
              iconPosition="right"
              onClick={() => setCreateOpen(true)}
              className="text-xs font-bold tracking-wider uppercase px-8 py-3.5 rounded-xl shadow-blue-glow-sm cursor-pointer"
            >
              START YOUR FIRST FORGE
            </Button>
          </motion.div>
        ) : (
          /* Responsive Projects Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onRename={p => {
                  setRenameTarget(p)
                  setRenameName(p.name || p.projectName || '')
                  setRenameError(null)
                }}
                onDuplicate={handleDuplicate}
                onDelete={p => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* Create Project Modal                                         */}
      {/* ============================================================ */}
      <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* ============================================================ */}
      {/* Rename Project Modal                                         */}
      {/* ============================================================ */}
      <Modal
        open={!!renameTarget}
        onClose={() => {
          if (!renameLoading) setRenameTarget(null)
        }}
        title="RENAME FORGE"
        size="sm"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-2xs font-mono uppercase tracking-widest text-forge-muted mb-1.5">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={renameName}
              onChange={e => {
                setRenameName(e.target.value)
                setRenameError(null)
              }}
              placeholder="e.g. Kerala Streetwear Brand"
              className="w-full bg-forge-navy border border-forge-border hover:border-forge-border2 focus:border-forge-blue rounded-xl px-3.5 py-2.5 text-xs text-forge-white placeholder:text-forge-muted/40 outline-none transition-all"
              autoFocus
            />
            {renameError && (
              <p className="flex items-center gap-1 text-2xs text-rose-400 mt-1.5">
                <AlertCircle size={11} />
                <span>{renameError}</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={renameLoading}
              onClick={() => setRenameTarget(null)}
              className="text-xs uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={renameLoading}
              className="text-xs font-bold tracking-wider uppercase px-5 cursor-pointer"
            >
              SAVE CHANGES
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============================================================ */}
      {/* Delete Confirmation Modal                                    */}
      {/* ============================================================ */}
      <Modal
        open={!!deleteTarget}
        onClose={() => {
          if (!deleteLoading) setDeleteTarget(null)
        }}
        title="DELETE PROJECT"
        size="sm"
      >
        <div className="space-y-4 text-left">
          <p className="text-forge-muted text-xs sm:text-sm leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="text-forge-white font-semibold">
              "{deleteTarget?.name || deleteTarget?.projectName || 'this project'}"
            </span>
            ? All Idea DNA parameters and synthesized Blueprint tabs will be permanently removed.
          </p>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-2xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={13} className="text-rose-400 flex-shrink-0" />
            <span>This action is irreversible and will delete this project from Firestore.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={deleteLoading}
              onClick={() => setDeleteTarget(null)}
              className="text-xs uppercase"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={deleteLoading}
              onClick={handleDeleteConfirm}
              className="text-xs font-bold tracking-wider uppercase px-5 cursor-pointer"
            >
              DELETE PROJECT
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  )
}