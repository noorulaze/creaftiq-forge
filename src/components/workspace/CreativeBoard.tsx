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
  RefreshCw,
  SlidersHorizontal,
  Download,
  AlertCircle,
  BookmarkCheck,
  ExternalLink,
  Info,
  Flame,
} from 'lucide-react'
import { BlueprintSection } from './BlueprintSection'
import { generateCreativeImage } from '@/services/ai'
import type {
  CreativeDirectionOutput,
  ColorSwatch,
  TypographyDirectionDetails,
  ImageDirectionDetails,
  UIDirectionDetails,
  GeneratedCreativeImage,
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

export function CreativeBoard({
  creativeDirection,
  projectContext,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
  onUpdateCreativeDirection,
}: CreativeBoardProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedPalette, setCopiedPalette] = useState(false)
  const [showPromptDetails, setShowPromptDetails] = useState(false)

  // Image Generation State
  const [imageGenerating, setImageGenerating] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageResult, setImageResult] = useState<GeneratedCreativeImage | null>(
    creativeDirection?.generatedImage || null,
  )

  const cd = creativeDirection

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

      // Persist generated image record in creative direction
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

  // ── Copy Image Prompt ───────────────────────────────────────
  function handleCopyPrompt(promptText: string) {
    navigator.clipboard.writeText(promptText)
    setCopiedPrompt(true)
    toast.success('Visual prompt copied to clipboard')
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  return (
    <BlueprintSection
      badge="CREATIVE DIRECTION BOARD"
      heading="THE CREATIVE WORLD OF YOUR IDEA."
      subheading="A visual moodboard and aesthetic system derived from your project context, audience, and creative DNA."
      copyContent={creativeSummary}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* ACTION BAR: Quick Actions Specific to Creative Board          */}
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
              onClick={handleGenerateImage}
              disabled={imageGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-2xs font-bold tracking-wider uppercase text-forge-white bg-forge-blue hover:bg-forge-blue-light transition-all shadow-blue-glow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {imageGenerating ? (
                <RefreshCw size={12} className="animate-spin text-white" />
              ) : (
                <Sparkles size={12} className="text-white" />
              )}
              <span>{imageGenerating ? 'GENERATING...' : 'GENERATE CREATIVE IMAGE'}</span>
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
          {/* Subtle electric blue ambient atmosphere */}
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

          <p className="text-xs text-forge-muted font-light mb-5 leading-relaxed max-w-2xl">
            Each color is calibrated for high optical contrast, emotional alignment with your target audience, and seamless digital execution.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
            {colors.map((token, idx) => {
              const isCopied = copiedHex === token.hex
              return (
                <div
                  key={`${token.hex}-${idx}`}
                  className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/80 hover:bg-forge-navy transition-all text-left flex flex-col justify-between gap-3 group hover:border-forge-blue/50 relative shadow-sm"
                >
                  {/* Swatch color preview box */}
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

                  {/* Swatch Details */}
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

          {/* 4 Structured Typography Specifications */}
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

          {/* Live Visual Specimen Hierarchy */}
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
        {/* SECTION 4: IMAGE DIRECTION                                   */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-forge-blue" />
              <h3 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                04 / IMAGE DIRECTION
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue">
              PHOTOGRAPHY & ART DIRECTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Photography Style */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-forge-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-forge-blue" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  PHOTOGRAPHY STYLE
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {imageDir.photographyStyle}
              </p>
            </div>

            {/* Lighting Direction */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  LIGHTING DIRECTION
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {imageDir.lightingDirection}
              </p>
            </div>

            {/* Composition Style */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  COMPOSITION STYLE
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {imageDir.compositionStyle}
              </p>
            </div>

            {/* Subject Direction */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  SUBJECT DIRECTION
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {imageDir.subjectDirection}
              </p>
            </div>

            {/* Background Direction */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  BACKGROUND DIRECTION
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {imageDir.backgroundDirection}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 5: UI DIRECTION                                      */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-forge-blue" />
              <h3 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                05 / UI DIRECTION
              </h3>
            </div>
            <span className="text-2xs font-mono text-cyan-400">
              INTERFACE CRAFT & ERGONOMICS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Layout Style */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  LAYOUT STYLE
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {uiDir.layoutStyle}
              </p>
            </div>

            {/* Card Style */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-forge-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-forge-blue" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  CARD STYLE
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {uiDir.cardStyle}
              </p>
            </div>

            {/* Button Style */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  BUTTON STYLE
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {uiDir.buttonStyle}
              </p>
            </div>

            {/* Spacing Direction */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  SPACING DIRECTION
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {uiDir.spacingDirection}
              </p>
            </div>

            {/* Interaction Style */}
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 space-y-1.5 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-3xs font-mono uppercase tracking-wider font-bold">
                  INTERACTION STYLE
                </span>
              </div>
              <p className="text-xs text-forge-offwhite font-light leading-relaxed">
                {uiDir.interactionStyle}
              </p>
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
        {/* IMAGE GENERATION: AI CREATIVE VISUAL                          */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-gradient-to-b from-forge-surface to-forge-black p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-4 mb-6 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon size={17} className="text-forge-blue" />
                <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                  AI CREATIVE IMAGE
                </h3>
              </div>
              <p className="text-xs text-forge-muted font-light mt-0.5">
                Generate a high-taste visual representation based on your project context and aesthetic direction.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {imageResult && (
                <button
                  type="button"
                  onClick={() => setShowPromptDetails(prev => !prev)}
                  className="text-2xs font-mono uppercase text-forge-muted hover:text-forge-white px-2.5 py-1.5 rounded-lg border border-forge-border bg-forge-navy transition-colors cursor-pointer"
                >
                  {showPromptDetails ? 'Hide Prompt' : 'View Prompt'}
                </button>
              )}

              {imageResult?.url && (
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-semibold tracking-wider uppercase text-forge-white bg-forge-surface hover:bg-forge-surface2 border border-forge-border transition-colors cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
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
                    ? 'ENGINEERING VISUAL...'
                    : imageResult
                    ? 'REGENERATE IMAGE'
                    : 'GENERATE CREATIVE IMAGE'}
                </span>
              </button>
            </div>
          </div>

          {/* 1. Loading State */}
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
                  Synthesizing your project concept, color tokens, lighting specifications, and aesthetic constraints through secure server-side AI.
                </p>
              </div>
            </div>
          )}

          {/* 2. Error State */}
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

          {/* 3. Ready State: Live Rendered Image */}
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

          {/* 4. Not Configured State: Setup Guidance + Visual Prompt */}
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
                      PROVIDER ABSTRACTION READY
                    </span>
                  </div>
                  <p className="text-xs text-forge-muted font-light leading-relaxed">
                    The server-side image abstraction and prompt generator are live. To enable instant live AI image generation, configure your preferred image provider (such as Imagen 3 or Gemini image model) in Firebase Cloud Functions or environment settings.
                  </p>
                </div>
              </div>

              {/* Engineered Visual Prompt Preview Container */}
              <div className="p-4 rounded-lg border border-forge-border bg-forge-black space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-3xs font-mono uppercase tracking-widest text-forge-blue font-bold">
                    ENGINEERED VISUAL PROMPT:
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
                  Use this prompt in Midjourney, Flux, or configure IMAGEN_API_KEY in Cloud Functions.
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

          {/* 5. Idle Initial State: Prompt to Generate */}
          {!imageGenerating && !imageResult && !imageError && (
            <div className="p-8 rounded-xl border border-dashed border-forge-border/80 bg-forge-navy/30 flex flex-col items-center justify-center text-center gap-3">
              <div className="p-3 rounded-full bg-forge-surface border border-forge-border text-forge-blue">
                <ImageIcon size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-forge-white">
                  NO CREATIVE IMAGE GENERATED YET
                </h4>
                <p className="text-xs text-forge-muted font-light max-w-md">
                  Click below to synthesize a tailored visual art prompt from your project idea, audience, and color palette.
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

          {/* Expandable Prompt Details Drawer */}
          <AnimatePresence>
            {showPromptDetails && imageResult?.prompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-forge-border/60 overflow-hidden"
              >
                <div className="p-3.5 rounded-lg border border-forge-border bg-forge-black space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-mono uppercase text-forge-muted">
                      PROMPT SPECIFICATION:
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

      </div>
    </BlueprintSection>
  )
}
