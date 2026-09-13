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
  // Full project document fields stored in users/{userId}/projects/{projectId}
  projectName?: string
  originalIdea?: string
  industry?: string
  targetAudience?: string
  mainGoal?: string
  ideaDNA?: IdeaDNA
  brand?: BrandOutput
  product?: ProductOutput
  website?: WebsiteOutput
  content?: ContentOutput
  marketing?: MarketingOutput
  roadmap?: RoadmapOutput
  creativeDirection?: CreativeDirectionOutput
}

export interface FirestoreProjectDoc {
  projectName: string
  originalIdea: string
  industry: string
  targetAudience: string
  mainGoal: string
  ideaDNA: IdeaDNA | null
  brand: BrandOutput | null
  product: ProductOutput | null
  website: WebsiteOutput | null
  content: ContentOutput | null
  marketing: MarketingOutput | null
  roadmap: RoadmapOutput | null
  creativeDirection: CreativeDirectionOutput | null
  createdAt: unknown
  updatedAt: unknown
  status?: ProjectStatus
  uid?: string
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
  usage?: string
}

export interface TypographyDirectionDetails {
  headingStyle: string
  bodyTextStyle: string
  typographyMood: string
  fontCategories: string[]
  description?: string
}

export interface ImageDirectionDetails {
  photographyStyle: string
  lightingDirection: string
  compositionStyle: string
  subjectDirection: string
  backgroundDirection: string
  summary?: string
}

export interface UIDirectionDetails {
  layoutStyle: string
  cardStyle: string
  buttonStyle: string
  spacingDirection: string
  interactionStyle: string
  summary?: string
}

export interface GeneratedCreativeImage {
  url?: string
  prompt: string
  createdAt?: string
  status: 'idle' | 'generating' | 'ready' | 'not_configured' | 'error'
  errorMessage?: string
}

// ──────────────────────────────────────────────────────────────
// Video Creation Types
// ──────────────────────────────────────────────────────────────
export type VideoType =
  | 'Advertisement'
  | 'Product Promo'
  | 'Social Media Reel'
  | 'Brand Launch'
  | 'Cinematic Concept'
  | 'Website Hero Video'

export type VideoDuration = '5 seconds' | '10 seconds' | '15 seconds' | '30 seconds'
export type VideoFormat = '9:16 Vertical' | '16:9 Landscape' | '1:1 Square'
export type VideoStyle =
  | 'Cinematic'
  | 'Premium'
  | 'Minimal'
  | 'Youthful'
  | 'Editorial'
  | 'Bold'
  | 'Documentary'

export interface VideoScene {
  sceneNumber: number
  time: string
  visual: string
  cameraMovement: string
  transition: string
  onScreenText: string
}

export interface VideoGenerationOutput {
  title: string
  concept: string
  duration: string
  aspectRatio: string
  visualStyle: string
  voiceover: string
  musicMood: string
  scenes: VideoScene[]
  finalVideoPrompt: string
  videoUrl?: string
  status: 'idle' | 'generating' | 'ready' | 'not_configured' | 'error'
  errorMessage?: string
  createdAt?: string
}

export interface VideoGenerationInput {
  videoType: VideoType
  duration: VideoDuration
  format: VideoFormat
  style: VideoStyle
  voiceoverText?: string
  musicMood?: string
  visualInstruction?: string
  projectName?: string
  idea?: string
  industry?: string
  targetAudience?: string
  brandPersonality?: string[]
  visualKeywords?: string[]
  colorPalette?: ColorSwatch[]
  mood?: string
}

export interface CreativeDirectionOutput {
  colorPalette: ColorSwatch[]
  typographyDirection: string | TypographyDirectionDetails
  visualKeywords: string[]
  mood: string
  imageDirection: string | ImageDirectionDetails
  uiDirection: string | UIDirectionDetails
  brandPersonality: string[]
  typography?: TypographyDirectionDetails
  imageDetails?: ImageDirectionDetails
  uiDetails?: UIDirectionDetails
  generatedImage?: GeneratedCreativeImage
  generatedVideo?: VideoGenerationOutput
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
  | 'more-editorial'
  | 'more-local'
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
