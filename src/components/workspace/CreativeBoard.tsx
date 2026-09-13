import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  Palette,
  Type,
  Camera,
  Layers,
  Tag,
  ImageIcon,
  Film,
  RefreshCw,
  Download,
  AlertCircle,
  BookmarkCheck,
  Info,
  Clock,
  Ratio,
  Sliders,
  Volume2,
  Music,
  Play,
  FileText,
  ChevronRight,
} from 'lucide-react'
import { BlueprintSection } from './BlueprintSection'
import { generateCreativeImage, generateCreativeVideo } from '@/services/ai'
import type {
  CreativeDirectionOutput,
  ColorSwatch,
  TypographyDirectionDetails,
  ImageDirectionDetails,
  UIDirectionDetails,
  GeneratedCreativeImage,
  VideoGenerationOutput,
  VideoType,
  VideoDuration,
  VideoFormat,
  VideoStyle,
  IdeaDNA,
  BrandOutput,
} from '@/types'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

interface CreativeBoardProps {
  creativeDirection: CreativeDirectionOutput | null
  projectContext?: {
    name?: string
    idea?: string
    industry?: string
    targetAudience?: string
    mainGoal?: string
    ideaDna?: IdeaDNA | null
    brand?: BrandOutput | null
  }
  loading?: boolean
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => void
  onUpdateCreativeDirection?: (updated: CreativeDirectionOutput) => void
}

const DEFAULT_SWATCHES: ColorSwatch[] = [
  { hex: '#0A0A0F', name: 'Obsidian Void', role: 'Primary Canvas', usage: 'Deep background & foundational space' },
  { hex: '#111827', name: 'Slate Carbon', role: 'Surface Level 1', usage: 'Containers, cards, and modal elevations' },
  { hex: '#2563EB', name: 'Electric Signal', role: 'Active Vector', usage: 'Primary action vectors, focus indicators, glow accents' },
  { hex: '#60A5FA', name: 'Atmosphere Cyan', role: 'Secondary Vector', usage: 'Subtle gradients, active badges, and lighting' },
  { hex: '#F8F9FA', name: 'Chalk White', role: 'Editorial Headline', usage: 'High-contrast typography and focal points' },
]

const VIDEO_TYPES: VideoType[] = [
  'Advertisement',
  'Product Promo',
  'Social Media Reel',
  'Brand Launch',
  'Cinematic Concept',
  'Website Hero Video',
]

const VIDEO_DURATIONS: VideoDuration[] = [
  '5 seconds',
  '10 seconds',
  '15 seconds',
  '30 seconds',
]

const VIDEO_FORMATS: VideoFormat[] = [
  '9:16 Vertical',
  '16:9 Landscape',
  '1:1 Square',
]

const VIDEO_STYLES: VideoStyle[] = [
  'Cinematic',
  'Premium',
  'Minimal',
  'Youthful',
  'Editorial',
  'Bold',
  'Documentary',
]

export function CreativeBoard({
  creativeDirection,
  projectContext,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
  onUpdateCreativeDirection,
}: CreativeBoardProps) {
  const cd = creativeDirection

  // ── Studio Creation Mode: 'image' | 'video' ─────────────────
  const [activeCreationMode, setActiveCreationMode] = useState<'image' | 'video'>('image')

  // ── Copy states ─────────────────────────────────────────────
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [copiedPalette, setCopiedPalette] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedVideoPrompt, setCopiedVideoPrompt] = useState(false)
  const [copiedStoryboard, setCopiedStoryboard] = useState(false)
  const [showImagePromptDetails, setShowImagePromptDetails] = useState(false)

  // ── Image Generation State ──────────────────────────────────
  const [imageGenerating, setImageGenerating] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageResult, setImageResult] = useState<GeneratedCreativeImage | null>(
    cd?.generatedImage || null,
  )

  // ── Video Generation Form State ─────────────────────────────
  const [videoType, setVideoType] = useState<VideoType>('Cinematic Concept')
  const [videoDuration, setVideoDuration] = useState<VideoDuration>('15 seconds')
  const [videoFormat, setVideoFormat] = useState<VideoFormat>('16:9 Landscape')
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('Cinematic')
  const [voiceoverText, setVoiceoverText] = useState('')
  const [musicMood, setMusicMood] = useState('')
  const [visualInstruction, setVisualInstruction] = useState('')

  // ── Video Generation Result State ───────────────────────────
  const [videoGenerating, setVideoGenerating] = useState(false)
  const [videoGenerationStage, setVideoGenerationStage] = useState<string>('')
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoResult, setVideoResult] = useState<VideoGenerationOutput | null>(
    cd?.generatedVideo || null,
  )

  // ── Normalize Colors (4 to 6 swatches) ──────────────────────
  const colors: ColorSwatch[] = useMemo(() => {
    if (cd?.colorPalette && Array.isArray(cd.colorPalette) && cd.colorPalette.length >= 4) {
      return cd.colorPalette.slice(0, 6)
    }
    return DEFAULT_SWATCHES
  }, [cd?.colorPalette])

  // ── Normalize Typography Direction ──────────────────────────
  const typography: TypographyDirectionDetails = useMemo(() => {
    if (cd?.typography && typeof cd.typography === 'object') {
      return cd.typography
    }
    if (typeof cd?.typographyDirection === 'object' && cd.typographyDirection !== null) {
      return cd.typographyDirection as TypographyDirectionDetails
    }
    return {
      headingStyle: 'Condensed Bold Sans (-0.03em tracking, uppercase display weight 900)',
      bodyTextStyle: 'Modern Geometric Sans (Inter 400/500, generous 1.6 line-height)',
      typographyMood: 'Disciplined Minimalist & Authoritative Modern',
      fontCategories: ['Display Condensed Sans', 'Geometric Sans-Serif', 'Technical Monospace'],
    }
  }, [cd?.typography, cd?.typographyDirection])

  // ── Normalize Image Direction ───────────────────────────────
  const imageDir: ImageDirectionDetails = useMemo(() => {
    if (cd?.imageDetails && typeof cd.imageDetails === 'object') {
      return cd.imageDetails
    }
    if (typeof cd?.imageDirection === 'object' && cd.imageDirection !== null) {
      return cd.imageDirection as ImageDirectionDetails
    }
    return {
      photographyStyle: 'Documentary realism with tactile clarity and subtle natural film grain',
      lightingDirection: 'Directional chiaroscuro with deep obsidian shadows and ambient cool rim lighting',
      compositionStyle: 'Disciplined architectural rule-of-thirds with generous deliberate negative space',
      subjectDirection: 'Authentic artisans, focused makers, and real human craft in functional context',
      backgroundDirection: 'Matte graphite, textured concrete, dark volcanic stone, and brushed metal',
    }
  }, [cd?.imageDetails, cd?.imageDirection])

  // ── Normalize UI Direction ──────────────────────────────────
  const uiDir: UIDirectionDetails = useMemo(() => {
    if (cd?.uiDetails && typeof cd.uiDetails === 'object') {
      return cd.uiDetails
    }
    if (typeof cd?.uiDirection === 'object' && cd.uiDirection !== null) {
      return cd.uiDirection as UIDirectionDetails
    }
    return {
      layoutStyle: 'Monolithic modular grid with deliberate breathing room and clear hierarchy',
      cardStyle: 'Matte slate containers with 1px hairline border dividers and subtle ambient glow',
      buttonStyle: 'High-contrast tactile buttons with focused electric blue glow vectors',
      spacingDirection: 'Strict 8pt baseline cadence with generous macro margins (64px–96px)',
      interactionStyle: 'Snappy spring physics with instant tactile feedback and zero laggy easing',
    }
  }, [cd?.uiDetails, cd?.uiDirection])

  // ── Normalize Visual Keywords ───────────────────────────────
  const visualKeywords: string[] = useMemo(() => {
    if (cd?.visualKeywords && Array.isArray(cd.visualKeywords) && cd.visualKeywords.length > 0) {
      return cd.visualKeywords
    }
    return ['Obsidian', 'Editorial', 'Precision', 'Architectural', 'Electric', 'Atmospheric', 'Refined', 'Kinetic', 'Bold', 'Minimal']
  }, [cd?.visualKeywords])

  // ── Copy Individual Hex ────────────────────────────────────
  function handleCopyColor(hex: string) {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast.success(`Copied ${hex} to clipboard`)
    setTimeout(() => setCopiedHex(null), 1800)
  }

  // ── Copy Full Palette ───────────────────────────────────────
  function handleCopyPalette() {
    const formatted = colors
      .map(c => `${c.name}: ${c.hex} (${c.role})`)
      .join('\n')
    navigator.clipboard.writeText(formatted)
    setCopiedPalette(true)
    toast.success('Color palette copied to clipboard')
    setTimeout(() => setCopiedPalette(false), 2000)
  }

  // ── Copy Full Creative Direction ────────────────────────────
  const creativeSummary = `CREAFTIQ FORGE — CREATIVE DIRECTION BOARD
==================================================
Project: ${projectContext?.name || 'Creative Direction'}
Overall Mood: "${cd?.mood || 'An electric creative laboratory under midnight skies — precision engineering meets high-taste artistic vision.'}"

COLOR PALETTE:
${colors.map(c => `- ${c.name}: ${c.hex} [${c.role}] (${c.usage || 'Surface/Accent'})`).join('\n')}

TYPOGRAPHY DIRECTION:
- Heading Style: ${typography.headingStyle}
- Body Text Style: ${typography.bodyTextStyle}
- Typography Mood: ${typography.typographyMood}
- Font Categories: ${typography.fontCategories.join(', ')}

IMAGE DIRECTION:
- Photography Style: ${imageDir.photographyStyle}
- Lighting Direction: ${imageDir.lightingDirection}
- Composition Style: ${imageDir.compositionStyle}
- Subject Direction: ${imageDir.subjectDirection}
- Background Direction: ${imageDir.backgroundDirection}

UI DIRECTION:
- Layout Style: ${uiDir.layoutStyle}
- Card Style: ${uiDir.cardStyle}
- Button Style: ${uiDir.buttonStyle}
- Spacing Direction: ${uiDir.spacingDirection}
- Interaction Style: ${uiDir.interactionStyle}

VISUAL KEYWORDS:
${visualKeywords.join(', ')}
`

  // ── Image Generation Handler ────────────────────────────────
  async function handleGenerateImage() {
    setImageGenerating(true)
    setImageError(null)

    try {
      const response = await generateCreativeImage({
        projectName: projectContext?.name,
        idea: projectContext?.idea,
        industry: projectContext?.industry,
        targetAudience: projectContext?.targetAudience,
        brandPersonality: cd?.brandPersonality,
        colorPalette: colors,
        visualKeywords,
        imageDirection: imageDir,
        uiDirection: uiDir,
      })

      setImageResult(response)

      if (response.status === 'ready') {
        toast.success('Creative visual generated!')
      } else if (response.status === 'not_configured') {
        toast('Visual prompt generated. Image provider setup required.', {
          icon: '⚡',
        })
      } else if (response.status === 'error') {
        setImageError(response.errorMessage || 'Image generation failed.')
        toast.error('Image generation encountered an error.')
      }

      if (onUpdateCreativeDirection && cd) {
        onUpdateCreativeDirection({
          ...cd,
          generatedImage: response,
        })
      }
    } catch (err: unknown) {
      const error = err as Error
      setImageError(error.message || 'Image generation failed. Please try again.')
      toast.error('Image generation request failed.')
    } finally {
      setImageGenerating(false)
    }
  }

  // ── Video Generation Handler ────────────────────────────────
  async function handleGenerateVideo() {
    setVideoGenerating(true)
    setVideoError(null)
    setVideoGenerationStage('Synthesizing video concept & narrative hook...')

    try {
      // Step 1: Concept
      await new Promise(r => setTimeout(r, 400))
      setVideoGenerationStage('Architecting scene-by-scene storyboard & camera directions...')

      // Step 2: Storyboard & Prompts
      const response = await generateCreativeVideo({
        videoType,
        duration: videoDuration,
        format: videoFormat,
        style: videoStyle,
        voiceoverText: voiceoverText.trim() || undefined,
        musicMood: musicMood.trim() || undefined,
        visualInstruction: visualInstruction.trim() || undefined,
        projectName: projectContext?.name,
        idea: projectContext?.idea,
        industry: projectContext?.industry,
        targetAudience: projectContext?.targetAudience,
        brandPersonality: cd?.brandPersonality,
        visualKeywords,
        colorPalette: colors,
        mood: cd?.mood,
      })

      setVideoResult(response)

      if (response.status === 'ready') {
        toast.success('Cinematic video ready!')
      } else if (response.status === 'not_configured') {
        toast('Video storyboard & master prompt ready.', { icon: '🎬' })
      } else if (response.status === 'error') {
        setVideoError(response.errorMessage || 'Video generation failed.')
        toast.error('Video generation failed.')
      }

      // Persist generated video in project creative direction
      if (onUpdateCreativeDirection && cd) {
        onUpdateCreativeDirection({
          ...cd,
          generatedVideo: response,
        })
      }
    } catch (err: unknown) {
      const error = err as Error
      setVideoError(error.message || 'Video generation failed. Please try again.')
      toast.error('Video generation request failed.')
    } finally {
      setVideoGenerating(false)
      setVideoGenerationStage('')
    }
  }

  // ── Save Video or Image to Project ──────────────────────────
  function handleSaveMediaToProject(type: 'image' | 'video') {
    if (onSave) {
      onSave()
      toast.success(`${type === 'image' ? 'Image' : 'Video storyboard'} saved to project.`)
    }
  }

  // ── Copy Storyboard Text ────────────────────────────────────
  function handleCopyStoryboard() {
    if (!videoResult) return
    const text = [
      `TITLE: ${videoResult.title}`,
      `CONCEPT: ${videoResult.concept}`,
      `FORMAT: ${videoResult.duration} | ${videoResult.aspectRatio} | ${videoResult.visualStyle}`,
      `VOICEOVER: ${videoResult.voiceover}`,
      `MUSIC MOOD: ${videoResult.musicMood}`,
      '',
      'SCENE-BY-SCENE STORYBOARD:',
      ...videoResult.scenes.map(
        s =>
          `[Scene ${s.sceneNumber} (${s.time})] Visual: ${s.visual} | Camera: ${s.cameraMovement} | Transition: ${s.transition} | On-Screen: ${s.onScreenText || 'None'}`
      ),
      '',
      `FINAL PROMPT: ${videoResult.finalVideoPrompt}`,
    ].join('\n')

    navigator.clipboard.writeText(text)
    setCopiedStoryboard(true)
    toast.success('Full storyboard copied to clipboard')
    setTimeout(() => setCopiedStoryboard(false), 2000)
  }

  // ── Download Generated Image ────────────────────────────────
  function handleDownloadImage() {
    if (!imageResult?.url) return
    const link = document.createElement('a')
    link.href = imageResult.url
    link.download = `${(projectContext?.name || 'forge').toLowerCase().replace(/\s+/g, '-')}-creative-direction.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Download initiated.')
  }

  // ── Copy Prompts ────────────────────────────────────────────
  function handleCopyPrompt(promptText: string) {
    navigator.clipboard.writeText(promptText)
    setCopiedPrompt(true)
    toast.success('Visual prompt copied to clipboard')
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  function handleCopyVideoPrompt(promptText: string) {
    navigator.clipboard.writeText(promptText)
    setCopiedVideoPrompt(true)
    toast.success('Master video prompt copied to clipboard')
    setTimeout(() => setCopiedVideoPrompt(false), 2000)
  }

  return (
    <BlueprintSection
      badge="CREATIVE DIRECTION BOARD"
      heading="THE CREATIVE WORLD OF YOUR IDEA."
      subheading="A visual moodboard and AI creation workspace derived from your project context, audience, and creative DNA."
      copyContent={creativeSummary}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* QUICK ACTION BAR                                              */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 p-3 rounded-xl border border-forge-border/80 bg-forge-surface/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-3xs font-mono uppercase tracking-widest text-forge-muted px-2 py-1 rounded bg-forge-navy border border-forge-border">
              TASTE PROFILE V1
            </span>
            {projectContext?.industry && (
              <span className="text-3xs font-mono uppercase text-forge-blue px-2 py-1 rounded bg-forge-navy border border-forge-border">
                {projectContext.industry}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyPalette}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-white bg-forge-navy hover:bg-forge-surface border border-forge-border transition-colors cursor-pointer"
              title="Copy All Hex Values"
            >
              {copiedPalette ? <Check size={12} className="text-emerald-400" /> : <Palette size={12} className="text-forge-blue" />}
              <span>{copiedPalette ? 'PALETTE COPIED' : 'COPY COLOR PALETTE'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCreationMode('image')
                handleGenerateImage()
              }}
              disabled={imageGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-bold tracking-wider uppercase text-forge-white bg-forge-navy hover:bg-forge-surface border border-forge-border transition-colors cursor-pointer disabled:opacity-50"
            >
              <ImageIcon size={12} className="text-forge-blue" />
              <span>GENERATE IMAGE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCreationMode('video')
                const el = document.getElementById('visual-creation-workspace')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-bold tracking-wider uppercase text-forge-white bg-forge-blue hover:bg-forge-blue-light transition-all shadow-blue-glow-sm cursor-pointer"
            >
              <Film size={12} className="text-white" />
              <span>GENERATE VIDEO</span>
            </button>

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-muted hover:text-forge-white bg-forge-surface border border-forge-border transition-colors cursor-pointer"
              >
                <BookmarkCheck size={12} />
                <span>SAVE</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: OVERALL MOOD                                      */}
        {/* ============================================================ */}
        <div className="relative rounded-2xl border border-forge-border bg-gradient-to-br from-forge-black via-forge-navy to-forge-black p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -right-24 w-88 h-88 rounded-full bg-forge-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-88 h-88 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 flex-wrap gap-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold flex items-center gap-1.5">
                <Sparkles size={13} />
                01 / OVERALL MOOD & ATMOSPHERE
              </span>
              <span className="text-2xs font-mono text-forge-muted">
                GENERATED TASTE DIRECTION
              </span>
            </div>

            <blockquote className="text-lg sm:text-2xl font-light text-forge-white italic leading-relaxed max-w-4xl">
              "{cd?.mood || 'An electric creative laboratory under midnight skies — where architectural precision meets high-taste artistic vision.'}"
            </blockquote>

            <div className="flex items-center gap-2 pt-3 border-t border-forge-border/60 flex-wrap text-3xs font-mono">
              <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-forge-muted">
                AESTHETIC: MINIMAL EDITORIAL
              </span>
              <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-forge-blue">
                LIGHTING: DIRECTIONAL CHIAROSCURO & ELECTRIC ACCENTS
              </span>
              <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-forge-muted">
                TEXTURE: TACTILE GRAPHITE WITH NATURAL GRAIN
              </span>
              {projectContext?.targetAudience && (
                <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-emerald-400">
                  AUDIENCE: {projectContext.targetAudience}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: COLOR PALETTE (4 to 6 Swatches)                   */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">02 / COLOR PALETTE</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Production Swatches & Tokens
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono text-forge-blue">
                {colors.length} PRODUCTION SWATCHES
              </span>
              <button
                type="button"
                onClick={handleCopyPalette}
                className="text-3xs font-mono uppercase text-forge-muted hover:text-forge-white bg-forge-navy border border-forge-border px-2.5 py-1 rounded transition-colors"
              >
                {copiedPalette ? 'Copied' : 'Copy All'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
            {colors.map((token, idx) => {
              const isCopied = copiedHex === token.hex
              return (
                <div
                  key={`${token.hex}-${idx}`}
                  className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/80 hover:bg-forge-navy transition-all text-left flex flex-col justify-between gap-3 group hover:border-forge-blue/50 relative shadow-sm"
                >
                  <div
                    className="w-full h-16 rounded-lg border border-forge-border/60 relative overflow-hidden flex items-end justify-between p-2 transition-transform group-hover:scale-[1.01]"
                    style={{ backgroundColor: token.hex }}
                  >
                    <span className="text-3xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                      0{idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyColor(token.hex)}
                      className="p-1.5 rounded-md bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Copy HEX"
                    >
                      {isCopied ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} className="text-white hover:text-forge-blue" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forge-white truncate" title={token.name}>
                        {token.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyColor(token.hex)}
                        className="text-3xs font-mono text-forge-blue hover:underline font-bold"
                        title="Click to copy"
                      >
                        {token.hex}
                      </button>
                    </div>

                    <p className="text-3xs text-forge-muted font-light truncate">{token.role}</p>
                    {token.usage && (
                      <p className="text-3xs font-mono text-forge-muted/70 truncate">{token.usage}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 3: TYPOGRAPHY DIRECTION                              */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Type size={16} className="text-forge-blue" />
              <h3 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                03 / TYPOGRAPHY DIRECTION
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {typography.fontCategories.map(cat => (
                <span
                  key={cat}
                  className="text-3xs font-mono text-forge-blue bg-forge-navy border border-forge-border px-2 py-0.5 rounded"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <span className="text-3xs font-mono uppercase tracking-wider text-forge-muted block mb-1">
                HEADING STYLE
              </span>
              <p className="text-xs font-bold text-forge-white leading-snug">
                {typography.headingStyle}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <span className="text-3xs font-mono uppercase tracking-wider text-forge-muted block mb-1">
                BODY TEXT STYLE
              </span>
              <p className="text-xs font-bold text-forge-white leading-snug">
                {typography.bodyTextStyle}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <span className="text-3xs font-mono uppercase tracking-wider text-forge-muted block mb-1">
                TYPOGRAPHY MOOD
              </span>
              <p className="text-xs font-bold text-forge-blue leading-snug">
                {typography.typographyMood}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <span className="text-3xs font-mono uppercase tracking-wider text-forge-muted block mb-1">
                FONT CATEGORIES
              </span>
              <p className="text-xs font-bold text-forge-white leading-snug">
                {typography.fontCategories.join(' • ')}
              </p>
            </div>
          </div>

          {/* Live Specimen Hierarchy */}
          <div className="p-5 rounded-xl border border-forge-border/80 bg-forge-black space-y-4 text-left">
            <div className="border-b border-forge-border/40 pb-4">
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted mb-1.5">
                <span>DISPLAY HERO / SPECIMEN</span>
                <span>TRACKING: -0.03EM • DISPLAY WEIGHT: 900</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-forge-white uppercase tracking-tight">
                {projectContext?.name ? `${projectContext.name.toUpperCase()}.` : 'ONE RAW IDEA. TOTAL CLARITY.'}
              </h2>
            </div>

            <div className="border-b border-forge-border/40 pb-4">
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted mb-1.5">
                <span>EDITORIAL SUBHEAD / BODY SPECIMEN</span>
                <span>GEOMETRIC SANS • LINE-HEIGHT: 1.6</span>
              </div>
              <p className="text-sm sm:text-base text-forge-offwhite font-light leading-relaxed">
                {projectContext?.idea || 'Turn a raw idea into a clear creative, brand, website, content, and marketing direction.'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted mb-1.5">
                <span>TECHNICAL METADATA SPECIMEN</span>
                <span>JETBRAINS MONO • TRACKING: +0.05EM</span>
              </div>
              <p className="text-xs font-mono text-forge-blue">
                FORGE_DIRECTION // SPEC_ID: 04 // AUDIENCE: {projectContext?.targetAudience || 'CREATORS'} // STATUS: LOCKED
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 4 & 5: IMAGE DIRECTION & UI DIRECTION                */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Image Direction */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Camera size={15} className="text-forge-blue" />
                  <h3 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                    04 / IMAGE DIRECTION
                  </h3>
                </div>
                <span className="text-2xs font-mono text-forge-blue">CINEMATIC CRAFT</span>
              </div>

              <div className="space-y-3 text-xs text-forge-offwhite font-light leading-relaxed">
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Photography Style:
                  </span>
                  <span>{imageDir.photographyStyle}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Lighting Direction:
                  </span>
                  <span>{imageDir.lightingDirection}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Composition Style:
                  </span>
                  <span>{imageDir.compositionStyle}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Subject Direction:
                  </span>
                  <span>{imageDir.subjectDirection}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Background Direction:
                  </span>
                  <span>{imageDir.backgroundDirection}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UI Direction */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                    05 / UI DIRECTION
                  </h3>
                </div>
                <span className="text-2xs font-mono text-cyan-400">DESIGN SYSTEM</span>
              </div>

              <div className="space-y-3 text-xs text-forge-offwhite font-light leading-relaxed">
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Layout Style:
                  </span>
                  <span>{uiDir.layoutStyle}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Card Style:
                  </span>
                  <span>{uiDir.cardStyle}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Button Style:
                  </span>
                  <span>{uiDir.buttonStyle}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Spacing Direction:
                  </span>
                  <span>{uiDir.spacingDirection}</span>
                </div>
                <div>
                  <span className="font-semibold text-forge-white block text-3xs font-mono uppercase text-forge-muted">
                    Interaction Style:
                  </span>
                  <span>{uiDir.interactionStyle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 6: VISUAL KEYWORDS                                   */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-forge-blue" />
              <h3 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                06 / VISUAL KEYWORDS
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">
              {visualKeywords.length} AESTHETIC SIGNALS
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {visualKeywords.map(kw => (
              <span
                key={kw}
                className="px-3.5 py-1.5 rounded-lg border border-forge-border bg-forge-navy/70 text-xs font-mono text-forge-white hover:border-forge-blue/60 transition-colors shadow-sm cursor-default"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* AI VISUAL CREATION WORKSPACE (IMAGE & VIDEO MODES)           */}
        {/* ============================================================ */}
        <div
          id="visual-creation-workspace"
          className="rounded-2xl border border-forge-blue/30 bg-gradient-to-b from-forge-surface via-forge-navy/40 to-forge-black p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Workspace Header with Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forge-border/80 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue font-bold px-2 py-0.5 rounded bg-forge-navy border border-forge-blue/30">
                  AI CREATION STUDIO
                </span>
                <span className="text-3xs font-mono text-forge-muted">
                  SECURE GEMINI BACKEND
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-forge-white tracking-tight uppercase">
                AI VISUAL CREATION WORKSPACE
              </h3>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center p-1 rounded-xl bg-forge-black border border-forge-border/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveCreationMode('image')}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                  activeCreationMode === 'image'
                    ? 'bg-forge-navy text-forge-white border border-forge-blue/40 shadow-blue-glow-sm'
                    : 'text-forge-muted hover:text-forge-white',
                )}
              >
                <ImageIcon size={14} className={activeCreationMode === 'image' ? 'text-forge-blue' : ''} />
                <span>1. Generate Image</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCreationMode('video')}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                  activeCreationMode === 'video'
                    ? 'bg-forge-navy text-forge-white border border-forge-blue/40 shadow-blue-glow-sm'
                    : 'text-forge-muted hover:text-forge-white',
                )}
              >
                <Film size={14} className={activeCreationMode === 'video' ? 'text-forge-blue' : ''} />
                <span>2. Generate Video</span>
              </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* MODE 1: GENERATE IMAGE                                       */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeCreationMode === 'image' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-forge-muted font-light max-w-xl">
                  Synthesizes your project concept, Idea DNA, brand personality, color tokens, and visual keywords into an editorial visual prompt using the secure Gemini backend.
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  {imageResult && (
                    <button
                      type="button"
                      onClick={() => setShowImagePromptDetails(prev => !prev)}
                      className="text-2xs font-mono uppercase text-forge-muted hover:text-forge-white px-3 py-1.5 rounded-lg border border-forge-border bg-forge-navy transition-colors cursor-pointer"
                    >
                      {showImagePromptDetails ? 'Hide Prompt' : 'View Prompt'}
                    </button>
                  )}

                  {imageResult?.url && (
                    <>
                      <button
                        type="button"
                        onClick={handleDownloadImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-white bg-forge-surface hover:bg-forge-surface2 border border-forge-border transition-colors cursor-pointer"
                      >
                        <Download size={12} />
                        <span>Download</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveMediaToProject('image')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 transition-colors cursor-pointer"
                      >
                        <BookmarkCheck size={12} />
                        <span>Save to Project</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={imageGenerating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-2xs font-bold tracking-wider uppercase text-forge-white bg-forge-blue hover:bg-forge-blue-light transition-all shadow-blue-glow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imageGenerating ? (
                      <RefreshCw size={13} className="animate-spin text-white" />
                    ) : imageResult ? (
                      <RefreshCw size={13} className="text-white" />
                    ) : (
                      <Sparkles size={13} className="text-white" />
                    )}
                    <span>
                      {imageGenerating
                        ? 'ENGINEERING IMAGE PROMPT...'
                        : imageResult
                        ? 'REGENERATE IMAGE'
                        : 'GENERATE CREATIVE IMAGE'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {imageGenerating && (
                <div className="p-10 rounded-xl border border-forge-blue/30 bg-forge-navy/50 flex flex-col items-center justify-center text-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-forge-blue/20 border-t-forge-blue animate-spin" />
                    <Sparkles size={18} className="absolute inset-0 m-auto text-forge-blue animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                      ENGINEERING VISUAL PROMPT & GENERATING IMAGE...
                    </h4>
                    <p className="text-xs text-forge-muted font-light max-w-md">
                      Synthesizing project concept, color tokens, lighting specifications, and aesthetic constraints through secure server-side AI.
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {!imageGenerating && imageError && (
                <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        IMAGE GENERATION ENCOUNTERED AN ISSUE
                      </h4>
                      <p className="text-xs text-rose-200/90 font-light leading-relaxed">
                        {imageError}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-white bg-rose-500 hover:bg-rose-600 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Ready State */}
              {!imageGenerating && imageResult?.status === 'ready' && imageResult.url && (
                <div className="space-y-4">
                  <div className="relative rounded-xl border border-forge-border bg-forge-black overflow-hidden shadow-2xl group max-h-[480px] flex items-center justify-center">
                    <img
                      src={imageResult.url}
                      alt={projectContext?.name || 'Creative Direction'}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between flex-wrap gap-2 opacity-95">
                      <div className="flex items-center gap-2 text-3xs font-mono text-forge-white">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>AI VISUAL DIRECTION READY</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadImage}
                        className="text-3xs font-mono uppercase text-forge-blue hover:text-forge-blue-light transition-colors"
                      >
                        Download Asset
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Not Configured State */}
              {!imageGenerating && imageResult?.status === 'not_configured' && (
                <div className="rounded-xl border border-forge-border bg-forge-navy/60 p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-forge-surface border border-forge-border text-forge-blue flex-shrink-0">
                      <Info size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forge-white">
                          IMAGE GENERATION SETUP REQUIRED
                        </h4>
                        <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-surface text-forge-muted border border-forge-border">
                          BACKEND PROMPT ENGINE READY
                        </span>
                      </div>
                      <p className="text-xs text-forge-muted font-light leading-relaxed">
                        The secure server-side Gemini prompt synthesis engine is active. To enable live AI image file generation, configure your preferred image provider (e.g. Imagen 3 or Gemini image model) in Firebase Cloud Functions via <code className="text-forge-blue font-mono text-3xs">IMAGEN_API_KEY</code>.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-forge-border bg-forge-black space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                        GEMINI ENGINEERED IMAGE PROMPT:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(imageResult.prompt)}
                        className="inline-flex items-center gap-1 text-3xs font-mono uppercase text-forge-muted hover:text-forge-white transition-colors cursor-pointer"
                      >
                        {copiedPrompt ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                    </div>
                    <p className="text-xs font-mono text-forge-offwhite/90 leading-relaxed break-words">
                      "{imageResult.prompt}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-forge-border/40 flex-wrap gap-2">
                    <span className="text-3xs font-mono text-forge-muted">
                      Use this prompt directly in Midjourney, Flux, or configure IMAGEN_API_KEY.
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateImage}
                      className="inline-flex items-center gap-1 text-2xs font-semibold uppercase text-forge-blue hover:text-forge-blue-light transition-colors cursor-pointer"
                    >
                      <RefreshCw size={11} />
                      <span>Try Generate Again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Idle State */}
              {!imageGenerating && !imageResult && !imageError && (
                <div className="p-8 rounded-xl border border-dashed border-forge-border/80 bg-forge-navy/30 flex flex-col items-center justify-center text-center gap-3">
                  <div className="p-3 rounded-full bg-forge-surface border border-forge-border text-forge-blue">
                    <ImageIcon size={22} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forge-white">
                      READY TO GENERATE AI CREATIVE VISUAL
                    </h4>
                    <p className="text-xs text-forge-muted font-light max-w-md">
                      Click below to generate a tailored visual prompt and render an editorial image from your project tokens.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-2xs font-bold tracking-wider uppercase text-forge-white bg-forge-blue hover:bg-forge-blue-light transition-all shadow-blue-glow-sm cursor-pointer"
                  >
                    <Sparkles size={12} className="text-white" />
                    <span>GENERATE CREATIVE IMAGE</span>
                  </button>
                </div>
              )}

              {/* Expandable Image Prompt Details */}
              <AnimatePresence>
                {showImagePromptDetails && imageResult?.prompt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <div className="p-3.5 rounded-lg border border-forge-border bg-forge-black space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-3xs font-mono uppercase text-forge-muted">
                          IMAGE PROMPT SPECIFICATION:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(imageResult.prompt)}
                          className="text-3xs font-mono uppercase text-forge-blue hover:underline"
                        >
                          {copiedPrompt ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-forge-offwhite/90 leading-relaxed">
                        {imageResult.prompt}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* MODE 2: GENERATE VIDEO                                       */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeCreationMode === 'video' && (
            <div className="space-y-6">
              <p className="text-xs text-forge-muted font-light max-w-xl">
                Configure your video parameters below. Gemini will synthesize a cinematic video concept, a scene-by-scene storyboard with camera directions, and a master AI video prompt.
              </p>

              {/* Video Configuration Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl border border-forge-border bg-forge-navy/40">
                {/* 1. Video Type */}
                <div className="space-y-2">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted font-bold block">
                    VIDEO TYPE
                  </label>
                  <select
                    value={videoType}
                    onChange={e => setVideoType(e.target.value as VideoType)}
                    className="w-full text-xs font-mono bg-forge-surface border border-forge-border rounded-lg px-3 py-2 text-forge-white focus:outline-none focus:border-forge-blue"
                  >
                    {VIDEO_TYPES.map(vt => (
                      <option key={vt} value={vt} className="bg-forge-black">
                        {vt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Duration */}
                <div className="space-y-2">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted font-bold block">
                    DURATION
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VIDEO_DURATIONS.map(dur => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setVideoDuration(dur)}
                        className={cn(
                          'px-2 py-1.5 rounded text-3xs font-mono text-center transition-colors',
                          videoDuration === dur
                            ? 'bg-forge-blue text-white font-bold'
                            : 'bg-forge-surface text-forge-muted hover:text-white border border-forge-border',
                        )}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Format / Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted font-bold block">
                    FORMAT / ASPECT RATIO
                  </label>
                  <div className="space-y-1">
                    {VIDEO_FORMATS.map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setVideoFormat(fmt)}
                        className={cn(
                          'w-full px-2.5 py-1.5 rounded text-3xs font-mono text-left transition-colors flex items-center justify-between',
                          videoFormat === fmt
                            ? 'bg-forge-blue text-white font-bold'
                            : 'bg-forge-surface text-forge-muted hover:text-white border border-forge-border',
                        )}
                      >
                        <span>{fmt}</span>
                        {videoFormat === fmt && <Check size={11} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Visual Style */}
                <div className="space-y-2">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted font-bold block">
                    VISUAL STYLE
                  </label>
                  <select
                    value={videoStyle}
                    onChange={e => setVideoStyle(e.target.value as VideoStyle)}
                    className="w-full text-xs font-mono bg-forge-surface border border-forge-border rounded-lg px-3 py-2 text-forge-white focus:outline-none focus:border-forge-blue"
                  >
                    {VIDEO_STYLES.map(st => (
                      <option key={st} value={st} className="bg-forge-black">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Guidance Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted block">
                    OPTIONAL VOICEOVER SCRIPT GUIDANCE
                  </label>
                  <input
                    type="text"
                    value={voiceoverText}
                    onChange={e => setVoiceoverText(e.target.value)}
                    placeholder="e.g. Every breakthrough begins in the dark..."
                    className="w-full text-xs bg-forge-surface border border-forge-border rounded-lg px-3 py-2 text-forge-white placeholder-forge-muted/60 focus:outline-none focus:border-forge-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted block">
                    OPTIONAL MUSIC / AUDIO MOOD
                  </label>
                  <input
                    type="text"
                    value={musicMood}
                    onChange={e => setMusicMood(e.target.value)}
                    placeholder="e.g. Deep ambient sub-bass swelling into electronic pulse..."
                    className="w-full text-xs bg-forge-surface border border-forge-border rounded-lg px-3 py-2 text-forge-white placeholder-forge-muted/60 focus:outline-none focus:border-forge-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-3xs font-mono uppercase tracking-wider text-forge-muted block">
                    OPTIONAL VISUAL INSTRUCTION
                  </label>
                  <input
                    type="text"
                    value={visualInstruction}
                    onChange={e => setVisualInstruction(e.target.value)}
                    placeholder="e.g. High tactile detail on materials, 35mm lens..."
                    className="w-full text-xs bg-forge-surface border border-forge-border rounded-lg px-3 py-2 text-forge-white placeholder-forge-muted/60 focus:outline-none focus:border-forge-blue"
                  />
                </div>
              </div>

              {/* Primary Video Generate Action */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 text-3xs font-mono text-forge-muted">
                  <Sparkles size={13} className="text-forge-blue" />
                  <span>OUTPUTS: CONCEPT • SCENE STORYBOARD • MASTER PROMPT</span>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={videoGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-forge-white bg-forge-blue hover:bg-forge-blue-light transition-all shadow-blue-glow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {videoGenerating ? (
                    <RefreshCw size={13} className="animate-spin text-white" />
                  ) : (
                    <Film size={13} className="text-white" />
                  )}
                  <span>{videoGenerating ? 'GENERATING STORYBOARD...' : 'GENERATE VIDEO STORYBOARD'}</span>
                </button>
              </div>

              {/* Loading State */}
              {videoGenerating && (
                <div className="p-10 rounded-xl border border-forge-blue/30 bg-forge-navy/50 flex flex-col items-center justify-center text-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-forge-blue/20 border-t-forge-blue animate-spin" />
                    <Film size={18} className="absolute inset-0 m-auto text-forge-blue animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                      {videoGenerationStage || 'GENERATING SCENE STORYBOARD WITH GEMINI...'}
                    </h4>
                    <p className="text-xs text-forge-muted font-light max-w-md">
                      Orchestrating pacing for {videoDuration}, camera angles, lighting cues, and master prompt parameters.
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {!videoGenerating && videoError && (
                <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                        VIDEO GENERATION ENCOUNTERED AN ISSUE
                      </h4>
                      <p className="text-xs text-rose-200/90 font-light leading-relaxed">
                        {videoError}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateVideo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-white bg-rose-500 hover:bg-rose-600 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Video Result Display (Storyboard & Concepts) */}
              {!videoGenerating && videoResult && (
                <div className="space-y-6 pt-2">
                  {/* Action Bar for Video Result */}
                  <div className="flex items-center justify-between flex-wrap gap-2.5 p-3 rounded-xl border border-forge-border bg-forge-navy/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-surface text-forge-white font-bold border border-forge-border">
                        {videoResult.visualStyle}
                      </span>
                      <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-surface text-forge-muted border border-forge-border">
                        {videoResult.duration}
                      </span>
                      <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-surface text-forge-muted border border-forge-border">
                        {videoResult.aspectRatio}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleCopyStoryboard}
                        className="inline-flex items-center gap-1 text-2xs font-semibold uppercase text-forge-white bg-forge-surface hover:bg-forge-surface2 border border-forge-border px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedStoryboard ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedStoryboard ? 'Copied' : 'Copy Storyboard'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveMediaToProject('video')}
                        className="inline-flex items-center gap-1 text-2xs font-semibold uppercase text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <BookmarkCheck size={12} />
                        <span>Save to Project</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateVideo}
                        className="inline-flex items-center gap-1 text-2xs font-semibold uppercase text-forge-muted hover:text-forge-white bg-forge-navy border border-forge-border px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>

                  {/* Ready State: Live Video Player if available */}
                  {videoResult.status === 'ready' && videoResult.videoUrl && (
                    <div className="relative rounded-xl border border-forge-border bg-forge-black overflow-hidden shadow-2xl">
                      <video
                        src={videoResult.videoUrl}
                        controls
                        className="w-full max-h-[440px] object-contain bg-black"
                      />
                    </div>
                  )}

                  {/* Provider Setup Message if not configured */}
                  {videoResult.status === 'not_configured' && (
                    <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 flex items-start gap-3">
                      <Info size={18} className="text-forge-blue flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-forge-white">
                            VIDEO RENDERING ENGINE SETUP REQUIRED
                          </h4>
                          <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-surface text-forge-muted border border-forge-border">
                            STORYBOARD COMPILED
                          </span>
                        </div>
                        <p className="text-xs text-forge-muted font-light leading-relaxed">
                          The complete scene-by-scene storyboard, camera choreography, and master video prompt are ready below. To render live MP4 files, configure your video provider (e.g. Google Veo, Runway Gen-3, or Luma Dream Machine) via <code className="text-forge-blue font-mono text-3xs">VIDEO_GENERATION_KEY</code> in Firebase Cloud Functions.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Video Concept Header Card */}
                  <div className="p-6 rounded-xl border border-forge-border bg-forge-surface space-y-4">
                    <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 flex-wrap gap-2">
                      <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                        VIDEO NARRATIVE & CONCEPT
                      </span>
                      <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                        {videoResult.title}
                      </h4>
                    </div>

                    <p className="text-sm text-forge-offwhite font-light leading-relaxed">
                      {videoResult.concept}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-lg border border-forge-border bg-forge-navy/60 space-y-1">
                        <span className="text-3xs font-mono uppercase text-forge-muted flex items-center gap-1.5">
                          <Volume2 size={12} className="text-forge-blue" />
                          VOICEOVER SCRIPT:
                        </span>
                        <p className="text-xs text-forge-offwhite italic">
                          "{videoResult.voiceover}"
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-forge-border bg-forge-navy/60 space-y-1">
                        <span className="text-3xs font-mono uppercase text-forge-muted flex items-center gap-1.5">
                          <Music size={12} className="text-cyan-400" />
                          AUDIO DIRECTION & MUSIC MOOD:
                        </span>
                        <p className="text-xs text-forge-offwhite">
                          {videoResult.musicMood}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Scene-by-Scene Storyboard */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider flex items-center gap-1.5">
                        <Film size={14} className="text-forge-blue" />
                        SCENE-BY-SCENE STORYBOARD ({videoResult.scenes.length} SCENES)
                      </h4>
                      <span className="text-3xs font-mono text-forge-muted">
                        CHOREOGRAPHED FOR {videoResult.duration}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {videoResult.scenes.map(scene => (
                        <div
                          key={scene.sceneNumber}
                          className="p-4 rounded-xl border border-forge-border bg-forge-navy/50 hover:bg-forge-navy/80 transition-colors space-y-2.5"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-forge-border/40 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-forge-blue/20 text-forge-blue border border-forge-blue/30">
                                SCENE 0{scene.sceneNumber}
                              </span>
                              <span className="text-xs font-mono text-forge-muted flex items-center gap-1">
                                <Clock size={12} />
                                {scene.time}
                              </span>
                            </div>

                            {scene.onScreenText && (
                              <span className="text-3xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                TEXT: "{scene.onScreenText}"
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-forge-white leading-relaxed">
                            <strong className="text-forge-muted font-mono text-3xs uppercase block mb-0.5">
                              VISUAL DIRECTION:
                            </strong>
                            {scene.visual}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-3xs font-mono pt-1">
                            <div className="px-2.5 py-1.5 rounded bg-forge-black/60 border border-forge-border/50 text-forge-muted">
                              <span className="text-forge-blue font-bold">CAMERA: </span>
                              {scene.cameraMovement}
                            </div>
                            <div className="px-2.5 py-1.5 rounded bg-forge-black/60 border border-forge-border/50 text-forge-muted">
                              <span className="text-cyan-400 font-bold">TRANSITION: </span>
                              {scene.transition}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Consolidated Video Prompt */}
                  <div className="p-5 rounded-xl border border-forge-border bg-forge-black space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                        MASTER AI VIDEO GENERATION PROMPT:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyVideoPrompt(videoResult.finalVideoPrompt)}
                        className="inline-flex items-center gap-1 text-3xs font-mono uppercase text-forge-muted hover:text-forge-white transition-colors cursor-pointer"
                      >
                        {copiedVideoPrompt ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedVideoPrompt ? 'Copied' : 'Copy Master Prompt'}</span>
                      </button>
                    </div>

                    <p className="text-xs font-mono text-forge-offwhite/90 leading-relaxed break-words bg-forge-navy/40 p-3 rounded-lg border border-forge-border/40">
                      "{videoResult.finalVideoPrompt}"
                    </p>

                    <p className="text-3xs font-mono text-forge-muted">
                      Compatible with Google Veo, Runway Gen-3 Alpha, and Luma Dream Machine.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </BlueprintSection>
  )
}
