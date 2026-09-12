// ============================================================
// CREAFTIQ FORGE — Forge Store (Zustand)
// ============================================================
import { create } from 'zustand'
import type {
  Project,
  ProjectOutputs,
  ForgingStage,
  WorkspaceTab,
  SpecialistRole,
  ContentPlatform,
} from '@/types'

interface ForgeState {
  // ─── Projects ─────────────────────────────────────────────
  projects: Project[]
  currentProject: Project | null
  currentOutputs: ProjectOutputs | null

  // ─── Forging ──────────────────────────────────────────────
  forgingStage: ForgingStage | null
  forgingStageIndex: number
  forgingStageLabel: string
  forgingError: string | null

  // ─── Workspace ─────────────────────────────────────────────
  activeTab: WorkspaceTab
  activeSpecialist: SpecialistRole
  selectedPlatforms: ContentPlatform[]

  // ─── Loading States ────────────────────────────────────────
  projectsLoading: boolean
  outputsLoading: boolean
  refiningSection: string | null

  // ─── Actions ──────────────────────────────────────────────
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  setCurrentOutputs: (outputs: ProjectOutputs | null) => void
  updateOutputs: (partial: Partial<ProjectOutputs>) => void

  setForgingStage: (stage: ForgingStage | null, index?: number, label?: string) => void
  setForgingError: (error: string | null) => void

  setActiveTab: (tab: WorkspaceTab) => void
  setActiveSpecialist: (specialist: SpecialistRole) => void
  setSelectedPlatforms: (platforms: ContentPlatform[]) => void

  setProjectsLoading: (loading: boolean) => void
  setOutputsLoading: (loading: boolean) => void
  setRefiningSection: (section: string | null) => void

  reset: () => void
}

const initialState = {
  projects: [],
  currentProject: null,
  currentOutputs: null,
  forgingStage: null,
  forgingStageIndex: 0,
  forgingStageLabel: '',
  forgingError: null,
  activeTab: 'overview' as WorkspaceTab,
  activeSpecialist: 'strategist' as SpecialistRole,
  selectedPlatforms: ['instagram', 'website'] as ContentPlatform[],
  projectsLoading: false,
  outputsLoading: false,
  refiningSection: null,
}

export const useForgeStore = create<ForgeState>((set, get) => ({
  ...initialState,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentOutputs: (outputs) => set({ currentOutputs: outputs }),
  updateOutputs: (partial) =>
    set({ currentOutputs: { ...(get().currentOutputs ?? {}), ...partial } as ProjectOutputs }),

  setForgingStage: (stage, index = 0, label = '') =>
    set({ forgingStage: stage, forgingStageIndex: index, forgingStageLabel: label }),
  setForgingError: (error) => set({ forgingError: error }),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveSpecialist: (specialist) => set({ activeSpecialist: specialist }),
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),

  setProjectsLoading: (loading) => set({ projectsLoading: loading }),
  setOutputsLoading: (loading) => set({ outputsLoading: loading }),
  setRefiningSection: (section) => set({ refiningSection: section }),

  reset: () => set(initialState),
}))
