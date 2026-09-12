// ============================================================
// CREAFTIQ FORGE — Core TypeScript Types
// ============================================================

// ──────────────────────────────────────────────────────────────
// Auth & User
// ──────────────────────────────────────────────────────────────
export interface ForgeUser {
  uid: string
  email: string | null
  displayName: string | null
  createdAt: Date
}

// ──────────────────────────────────────────────────────────────
// Project
// ──────────────────────────────────────────────────────────────
export type ProjectStatus = 'draft' | 'forging' | 'complete' | 'error'

export interface ProjectContext {
  name?: string
  industry?: string
  targetAudience?: string
  location?: string
  mainGoal?: string
}

export interface Project {
  id: string
  uid: string
  name: string
  idea: string
  context: ProjectContext
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
}

// ──────────────────────────────────────────────────────────────
// Idea DNA
// ──────────────────────────────────────────────────────────────
export interface IdeaDNA {
  purpose: string
  audience: string
  problem: string
  opportunity: string
  personality: string
  direction: string
}

// ──────────────────────────────────────────────────────────────
// Idea Readiness
// ──────────────────────────────────────────────────────────────
export interface ReadinessScore {
  score: number        // 0–100
  label: string
  why: string
  suggestion: string
}

export interface IdeaReadiness {
  clarity: ReadinessScore
  audience: ReadinessScore
  differentiation: ReadinessScore
  execution: ReadinessScore
  overall: number
}

// ──────────────────────────────────────────────────────────────
// Brand Output
// ──────────────────────────────────────────────────────────────
export interface BrandOutput {
  nameDirection: string[]
  taglineIdeas: string[]
  brandPersonality: string
  positioning: string
  visualDirection: string
  colorDirection: {
    primary: string
    secondary: string
    accent: string
    rationale: string
  }
  typographyDirection: string
}

// ──────────────────────────────────────────────────────────────
// Product Output
// ──────────────────────────────────────────────────────────────
export interface CoreFeature {
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface UserJourneyStep {
  stage: string
  action: string
  emotion: string
}

export interface ProductOutput {
  coreProduct: string
  targetUsers: string[]
  valueProposition: string
  coreFeatures: CoreFeature[]
  userJourney: UserJourneyStep[]
}

// ──────────────────────────────────────────────────────────────
// Website Output
// ──────────────────────────────────────────────────────────────
export interface WebsitePage {
  name: string
  purpose: string
  sections: string[]
}

export interface WebsiteOutput {
  structure: string
  pages: WebsitePage[]
  homepageSections: string[]
  navigation: string[]
  ctaStrategy: string
  uxDirection: string
}

// ──────────────────────────────────────────────────────────────
// Content Output
// ──────────────────────────────────────────────────────────────
export type ContentPlatform = 'instagram' | 'youtube' | 'linkedin' | 'website' | 'ads'

export interface ContentPillar {
  name: string
  description: string
  examples: string[]
}

export interface PostIdea {
  platform: ContentPlatform
  format: string
  headline: string
  concept: string
  hook?: string
}

export interface ContentOutput {
  platforms: ContentPlatform[]
  contentPillars: ContentPillar[]
  postIdeas: PostIdea[]
  reelConcepts: string[]
  campaignIdeas: string[]
  launchIdeas: string[]
}

// ──────────────────────────────────────────────────────────────
// Marketing Output
// ──────────────────────────────────────────────────────────────
export interface MarketingChannel {
  name: string
  priority: 'primary' | 'secondary'
  rationale: string
}

export interface CampaignConcept {
  name: string
  hook: string
  channels: string[]
  concept: string
}

export interface MarketingOutput {
  targetAudience: string
  positioning: string
  launchStrategy: string
  channels: MarketingChannel[]
  campaignConcepts: CampaignConcept[]
  initialActionPlan: string[]
}

// ──────────────────────────────────────────────────────────────
// Roadmap Output
// ──────────────────────────────────────────────────────────────
export interface RoadmapItem {
  title: string
  description: string
  timeframe: string
  category: 'brand' | 'product' | 'marketing' | 'content' | 'tech' | 'ops'
}

export interface RoadmapOutput {
  now: RoadmapItem[]
  next: RoadmapItem[]
  later: RoadmapItem[]
}

// ──────────────────────────────────────────────────────────────
// Creative Direction Output
// ──────────────────────────────────────────────────────────────
export interface ColorSwatch {
  hex: string
  name: string
  role: string
}

export interface CreativeDirectionOutput {
  colorPalette: ColorSwatch[]
  typographyDirection: string
  visualKeywords: string[]
  mood: string
  imageDirection: string
  uiDirection: string
  brandPersonality: string[]
}

// ──────────────────────────────────────────────────────────────
// Full Project Outputs (stored in Firestore)
// ──────────────────────────────────────────────────────────────
export interface ProjectOutputs {
  ideaDna?: IdeaDNA
  readiness?: IdeaReadiness
  brand?: BrandOutput
  product?: ProductOutput
  website?: WebsiteOutput
  content?: ContentOutput
  marketing?: MarketingOutput
  roadmap?: RoadmapOutput
  creativeDirection?: CreativeDirectionOutput
}

// ──────────────────────────────────────────────────────────────
// AI Function Types
// ──────────────────────────────────────────────────────────────
export type BlueprintSection = 'brand' | 'product' | 'website' | 'content' | 'marketing' | 'roadmap' | 'creativeDirection'

export type SpecialistRole = 'strategist' | 'creative-director' | 'product-architect' | 'ux-thinker' | 'marketer' | 'copywriter'

export interface RefineInstruction {
  section: BlueprintSection
  currentContent: unknown
  instruction: RefinePreset | string
}

export type RefinePreset =
  | 'more-premium'
  | 'more-youthful'
  | 'more-minimal'
  | 'more-bold'
  | 'more-professional'
  | 'simplify'
  | string

// ──────────────────────────────────────────────────────────────
// UI State Types
// ──────────────────────────────────────────────────────────────
export type ForgingStage =
  | 'understanding'
  | 'analyzing'
  | 'opportunity'
  | 'creative'
  | 'digital'
  | 'blueprint'
  | 'complete'

export interface ForgingStageInfo {
  id: ForgingStage
  label: string
  description: string
}

export type WorkspaceTab = 'overview' | 'brand' | 'product' | 'website' | 'content' | 'marketing' | 'roadmap'
