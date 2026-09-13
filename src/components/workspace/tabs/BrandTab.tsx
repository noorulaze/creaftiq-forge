import { useState } from 'react'
import { Copy, Check, Sparkles, Volume2, ShieldAlert, Sliders } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import type { BrandOutput } from '@/types'
import toast from 'react-hot-toast'

interface BrandTabProps {
  brand: BrandOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

const BRAND_PALETTE = [
  { name: 'Obsidian Void',   hex: '#0A0A0F', role: 'Primary Canvas', contrast: 'Dark Background' },
  { name: 'Slate Carbon',    hex: '#111827', role: 'Containers & Cards', contrast: 'Surface 1' },
  { name: 'Electric Signal', hex: '#2563EB', role: 'Active Focal Accent', contrast: 'AAA on Obsidian' },
  { name: 'Atmosphere Cyan', hex: '#60A5FA', role: 'Secondary Vector', contrast: 'Glow Layer' },
  { name: 'Chalk White',     hex: '#F8F9FA', role: 'Editorial Typography', contrast: '21:1 on Obsidian' },
]

const TAGLINES = [
  { text: 'One idea. One intelligent workspace.', type: 'Primary Manifesto' },
  { text: 'Turn raw ambition into a structured launch plan.', type: 'Product Benefit' },
  { text: 'Where high craft meets generative precision.', type: 'Brand Ethos' },
]

export function BrandTab({
  brand,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: BrandTabProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [copiedTagline, setCopiedTagline] = useState<string | null>(null)

  function handleCopyColor(hex: string) {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast.success(`Copied ${hex} to clipboard`)
    setTimeout(() => setCopiedHex(null), 1800)
  }

  function handleCopyTagline(text: string) {
    navigator.clipboard.writeText(text)
    setCopiedTagline(text)
    toast.success(`Copied tagline to clipboard`)
    setTimeout(() => setCopiedTagline(null), 1800)
  }

  const brandCopy = `BRAND IDENTITY BLUEPRINT:
Positioning: ${brand?.positioning || 'The premier intelligent workspace for ambitious creators.'}
Personality: ${brand?.brandPersonality || 'Editorial, monolithic, technologically refined, and deeply intentional.'}
Core Color Palette:
- Obsidian Void: #0A0A0F
- Slate Carbon: #111827
- Electric Signal: #2563EB
- Atmosphere Cyan: #60A5FA
- Chalk White: #F8F9FA
Typography: Inter Display (Headlines) / JetBrains Mono (Specs) / Inter (Body)
Voice & Tone: Articulate, authoritative, calm, avoiding marketing buzzwords and corporate jargon.`

  return (
    <BlueprintSection
      badge="IDENTITY & TONAL PRESENCE"
      heading="BUILD THE BRAND."
      subheading="Establish the memorable essence, visual vocabulary, and verbal identity of your project."
      copyContent={brandCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* 01 / Brand Positioning                                       */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
              01 / BRAND POSITIONING
            </span>
            <span className="text-3xs font-mono text-forge-muted uppercase">
              MARKET STANCE & ANCHOR
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold text-forge-white tracking-tight">
              {brand?.positioning || 'The premier intelligent workspace for ambitious creators and forward-thinking studios.'}
            </h3>
            <p className="text-xs sm:text-sm text-forge-muted font-light leading-relaxed">
              Positioned at the intersection of architectural discipline and digital speed. We reject superficial chatbots, instead delivering structured multi-modal launch blueprints with uncompromising creative authority.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 02 / Typography Direction                                    */}
        {/* ============================================================ */}
        <div className="relative rounded-2xl border border-forge-border bg-gradient-to-b from-forge-navy/90 to-forge-surface p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-4 mb-8 flex-wrap gap-2">
            <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold">
              02 / TYPOGRAPHY DIRECTION
            </span>
            <span className="text-2xs font-mono text-forge-muted">
              PAIRING: INTER DISPLAY + JETBRAINS MONO
            </span>
          </div>

          {/* Large Editorial Headline Showcase */}
          <div className="space-y-4 py-2">
            <p className="text-3xs font-mono uppercase tracking-widest text-forge-muted">
              PRIMARY DISPLAY HEADLINE (TRACKING: -0.03EM)
            </p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase text-forge-white tracking-tight leading-none">
              ONE IDEA. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forge-white via-forge-offwhite to-forge-muted">
                ONE INTELLIGENT WORKSPACE.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-forge-muted max-w-2xl font-light leading-relaxed pt-2">
              Body Typography: Set at 14px/22px line height with high optical kerning. Clean, legible, avoiding decorative distraction to keep the focus on strategic content.
            </p>
          </div>

          <div className="pt-8 border-t border-forge-border/60 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-forge-blue/20 border border-forge-blue/40 flex items-center justify-center font-black text-xs text-forge-blue">
                CF
              </div>
              <span className="text-xs font-mono font-semibold text-forge-white">
                CREAFTIQ FORGE MONOGRAM SPEC
              </span>
            </div>
            <span className="text-2xs font-mono text-forge-muted uppercase">
              GRID: 8PX SUBDIVISION • OPTICAL BALANCE
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 03 / Color Direction                                         */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">03 / COLOR DIRECTION</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Click Swatch To Copy Hex
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue">
              5 VERIFIED DESIGN TOKENS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
            {BRAND_PALETTE.map(c => {
              const isCopied = copiedHex === c.hex
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => handleCopyColor(c.hex)}
                  className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/80 hover:bg-forge-navy transition-all text-left group flex flex-col justify-between gap-3 hover:border-forge-blue/40"
                  title="Click to copy hex"
                >
                  <div
                    className="w-full h-14 rounded-lg border border-forge-border/60 relative overflow-hidden flex items-end justify-end p-2 transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span className="p-1 rounded bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-forge-white truncate">{c.name}</span>
                      <span className="text-3xs font-mono text-forge-blue font-semibold">{c.hex}</span>
                    </div>
                    <p className="text-3xs text-forge-muted font-light">{c.role}</p>
                    <span className="inline-block mt-1 text-3xs font-mono px-1.5 py-0.5 rounded bg-forge-surface text-forge-muted/80">
                      {c.contrast}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 04 / Brand Personality & 05 / Brand Voice                    */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Voice Spectrum Sliders (5-col) */}
          <div className="lg:col-span-5 rounded-2xl border border-forge-border bg-forge-surface p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sliders size={14} className="text-forge-blue" />
                <p className="section-label mb-0">04 / BRAND PERSONALITY</p>
              </div>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-4">
                Personality Matrix
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-2xs text-forge-muted mb-1.5">
                    <span className="text-forge-white font-semibold">Editorial & Poised</span>
                    <span>Casual / Slang</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-forge-navy overflow-hidden">
                    <div className="h-full bg-forge-blue rounded-full w-[25%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-2xs text-forge-muted mb-1.5">
                    <span className="text-forge-white font-semibold">Technological Precision</span>
                    <span>Corporate Fluff</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-forge-navy overflow-hidden">
                    <div className="h-full bg-forge-blue rounded-full w-[15%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-2xs text-forge-muted mb-1.5">
                    <span className="text-forge-white font-semibold">Calm & Minimal</span>
                    <span>Hyperactive Hype</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-forge-navy overflow-hidden">
                    <div className="h-full bg-forge-blue rounded-full w-[20%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-forge-border/60 text-2xs text-forge-muted font-light leading-relaxed">
              Grounds the identity in high taste and craft authority, avoiding aggressive SaaS jargon.
            </div>
          </div>

          {/* What We Say vs What We Avoid Table (7-col) */}
          <div className="lg:col-span-7 rounded-2xl border border-forge-border bg-forge-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 size={14} className="text-cyan-400" />
              <p className="section-label mb-0">05 / BRAND VOICE</p>
            </div>
            <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-4">
              Verbal Guidelines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <span className="text-3xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-2">
                  ✓ WHAT WE SOUND LIKE
                </span>
                <ul className="space-y-1.5 text-xs text-forge-white/90 font-light">
                  <li>• "Turn raw ambition into a structured launch plan."</li>
                  <li>• "Architected for founders who value design craft."</li>
                  <li>• "Clear, direct, and actionable execution."</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5">
                <span className="text-3xs font-mono uppercase tracking-widest text-red-400 font-bold block mb-2">
                  ✕ WHAT WE NEVER SAY
                </span>
                <ul className="space-y-1.5 text-xs text-forge-muted font-light">
                  <li>• "10x your growth overnight with magical AI."</li>
                  <li>• "Crush the competition with synergy."</li>
                  <li>• "All-in-one revolutionary game-changer."</li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Curated Taglines & Manifesto Showcase */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/70 p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">BRAND NARRATIVE PORTFOLIO</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                Approved Taglines & Positioning Concepts
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">CLICK TO COPY</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TAGLINES.map(t => {
              const isCopied = copiedTagline === t.text
              return (
                <button
                  key={t.text}
                  type="button"
                  onClick={() => handleCopyTagline(t.text)}
                  className="p-4 rounded-xl border border-forge-border bg-forge-surface/90 hover:bg-forge-surface transition-all text-left flex flex-col justify-between gap-3 group hover:border-forge-blue/50"
                >
                  <div>
                    <span className="text-3xs font-mono uppercase text-forge-blue tracking-wider block mb-1">
                      {t.type}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-forge-white leading-snug">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-forge-border/40 text-3xs font-mono text-forge-muted">
                    <span>{isCopied ? 'COPIED TO CLIPBOARD' : 'CLICK TO COPY'}</span>
                    {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="group-hover:text-forge-white" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 06 / Visual Identity Notes                                   */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">06 / VISUAL IDENTITY NOTES</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Design System & Aesthetic Grammar
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue">SYSTEM GOVERNANCE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <h4 className="text-xs font-mono font-bold text-forge-white uppercase mb-1.5">
                01. Monogram & Mark
              </h4>
              <p className="text-xs text-forge-muted font-light leading-relaxed">
                Precision geometric letterforms with optical kerning. Clean silhouette that functions at 16px favicons and large billboards alike.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <h4 className="text-xs font-mono font-bold text-forge-white uppercase mb-1.5">
                02. 8px Geometric Grid
              </h4>
              <p className="text-xs text-forge-muted font-light leading-relaxed">
                All padding, typography line-heights, card margins, and icon placements conform to an 8px architectural grid for mathematical balance.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-forge-border bg-forge-navy/60">
              <h4 className="text-xs font-mono font-bold text-forge-white uppercase mb-1.5">
                03. Lighting & Atmosphere
              </h4>
              <p className="text-xs text-forge-muted font-light leading-relaxed">
                Deep obsidian void canvas with restrained electric blue glows. Avoid saturated rainbows, harsh lasers, or cyberpunk neon tropes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}

