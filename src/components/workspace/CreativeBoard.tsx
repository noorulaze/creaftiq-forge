import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Copy, Check, Eye, Palette, Type, Compass, Mountain } from 'lucide-react'
import { BlueprintSection } from './BlueprintSection'
import type { CreativeDirectionOutput } from '@/types'
import toast from 'react-hot-toast'

interface CreativeBoardProps {
  creativeDirection: CreativeDirectionOutput | null
  loading?: boolean
  onRefine?: () => void
  onRegenerate?: () => void
  onSave?: () => void
}

const DESIGN_TOKENS = [
  { name: 'Obsidian Void',   hex: '#0A0A0F', role: 'Primary Base', usage: 'Canvas & Deep Dark Views' },
  { name: 'Slate Carbon',    hex: '#111827', role: 'Surface Level 1', usage: 'Cards, Drawers & Modals' },
  { name: 'Electric Signal', hex: '#2563EB', role: 'Active Glowing Vector', usage: 'Buttons, Active Indicators, Focus Rings' },
  { name: 'Atmosphere Cyan', hex: '#60A5FA', role: 'Secondary Vector', usage: 'Ambient Highlights & Sub-Accents' },
  { name: 'Chalk White',     hex: '#F8F9FA', role: 'Editorial Headline', usage: 'High-Contrast Typography' },
]

export function CreativeBoard({
  creativeDirection,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: CreativeBoardProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const cd = creativeDirection

  function handleCopyColor(hex: string) {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast.success(`Copied ${hex} to clipboard`)
    setTimeout(() => setCopiedHex(null), 1800)
  }

  const creativeCopy = `THE CREATIVE WORLD BLUEPRINT:
Visual Mood: "${cd?.mood || 'An electric creative laboratory under midnight skies — precision engineering meets high-taste artistic vision.'}"
Color Palette Tokens:
- Obsidian Void: #0A0A0F (Primary Canvas)
- Slate Carbon: #111827 (Surface Containers)
- Electric Signal: #2563EB (Focal Glow Vector)
- Atmosphere Cyan: #60A5FA (Ambient Accents)
- Chalk White: #F8F9FA (High-Contrast Editorial Text)
Typographic Hierarchy: Inter Display (Editorial Headlines) paired with JetBrains Mono (Technical Specs)
Motion Principles: Spring physics with restrained opacity reveals.`

  return (
    <BlueprintSection
      badge="ATMOSPHERIC WORLD & TASTE"
      heading="THE CREATIVE WORLD OF YOUR IDEA."
      subheading="Explore the aesthetic texture, mood references, motion guidance, and visual palette of your project."
      copyContent={creativeCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* Atmospheric Creative Hero Banner                              */}
        {/* ============================================================ */}
        <div className="relative rounded-2xl border border-forge-border bg-gradient-to-br from-forge-black via-forge-navy to-forge-black p-6 sm:p-10 overflow-hidden shadow-2xl">
          {/* Subtle atmospheric blue glow aura */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-forge-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 flex-wrap gap-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-forge-blue font-bold flex items-center gap-1.5">
                <Sparkles size={13} />
                01 / MOOD & ATMOSPHERE
              </span>
              <span className="text-2xs font-mono text-forge-muted">
                TASTE SPECIFICATION: NO. 01
              </span>
            </div>

            <blockquote className="text-lg sm:text-2xl font-light text-forge-white italic leading-relaxed max-w-3xl">
              "{cd?.mood || 'An electric creative laboratory under midnight skies — where architectural precision meets high-taste artistic vision.'}"
            </blockquote>

            <div className="flex items-center gap-2 pt-2 border-t border-forge-border/60 flex-wrap text-3xs font-mono">
              <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-forge-muted">
                AESTHETIC: MINIMAL EDITORIAL
              </span>
              <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-forge-blue">
                LIGHTING: MIDNIGHT OBSIDIAN & ELECTRIC BLUE
              </span>
              <span className="px-2.5 py-1 rounded bg-forge-navy border border-forge-border text-forge-muted">
                TEXTURE: MATTE GRAPHITE WITH SUBTLE GRAIN
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Abstract Visual Mood Studies (Tactile Panels)                */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/80 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">VISUAL RESEARCH STUDIES</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Abstract Form & Lighting Explorations
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">
              PURE DESIGN EXPERIMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Study 1: Obsidian Void */}
            <div className="rounded-xl border border-forge-border bg-gradient-to-br from-[#0A0A0F] to-[#1E293B] p-5 h-48 flex flex-col justify-between relative overflow-hidden shadow-lg group hover:border-forge-blue/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-mono text-forge-muted uppercase tracking-wider">STUDY 01 / FORM</span>
                <span className="w-2 h-2 rounded-full bg-forge-muted/40" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-1">
                  Monochrome Obsidian
                </h4>
                <p className="text-3xs text-forge-muted font-light leading-relaxed">
                  Generous negative space with high optical contrast between off-white typography and void black backgrounds.
                </p>
              </div>
            </div>

            {/* Study 2: Electric Vector Ridge */}
            <div className="rounded-xl border border-forge-blue/40 bg-gradient-to-br from-[#0D1117] via-[#1E1B4B] to-[#0A0A0F] p-5 h-48 flex flex-col justify-between relative overflow-hidden shadow-blue-glow-sm group hover:border-forge-blue transition-colors">
              {/* Subtle glowing mountain line SVG */}
              <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 300 200">
                <path d="M0,160 Q70,90 150,130 T300,70" fill="none" stroke="#2563EB" strokeWidth="1.5" />
              </svg>
              <div className="flex items-center justify-between relative z-10">
                <span className="text-3xs font-mono text-forge-blue uppercase tracking-wider">STUDY 02 / ILLUMINATION</span>
                <span className="w-2 h-2 rounded-full bg-forge-blue animate-pulse" />
              </div>
              <div className="relative z-10">
                <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-1">
                  Electric Blue Contour
                </h4>
                <p className="text-3xs text-forge-offwhite/80 font-light leading-relaxed">
                  A thin, intentional vector contour flowing through the horizon, representing intelligence emerging from raw ideas.
                </p>
              </div>
            </div>

            {/* Study 3: Tactile Grain & Specs */}
            <div className="rounded-xl border border-forge-border bg-gradient-to-br from-[#111827] to-[#0F172A] p-5 h-48 flex flex-col justify-between relative overflow-hidden shadow-lg group hover:border-forge-blue/50 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-mono text-forge-muted uppercase tracking-wider">STUDY 03 / TACTILITY</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400/40" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-1">
                  Editorial Craft & Grain
                </h4>
                <p className="text-3xs text-forge-muted font-light leading-relaxed">
                  Matte surfaces paired with razor-sharp geometric metadata tags evoke high-end editorial magazines.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 02 / Colors & Design Tokens                                  */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">02 / COLORS & DESIGN TOKENS</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Click Token Swatch To Copy Hex
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue">
              5 PRODUCTION TOKENS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
            {DESIGN_TOKENS.map(token => {
              const isCopied = copiedHex === token.hex
              return (
                <button
                  key={token.hex}
                  type="button"
                  onClick={() => handleCopyColor(token.hex)}
                  className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/80 hover:bg-forge-navy transition-all text-left flex flex-col justify-between gap-3 group hover:border-forge-blue/50"
                  title="Click to copy hex"
                >
                  <div
                    className="w-full h-14 rounded-lg border border-forge-border/60 relative overflow-hidden flex items-end justify-end p-2 transition-transform group-hover:scale-[1.02]"
                    style={{ backgroundColor: token.hex }}
                  >
                    <span className="p-1 rounded bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-forge-white truncate">{token.name}</span>
                      <span className="text-3xs font-mono text-forge-blue font-bold">{token.hex}</span>
                    </div>
                    <p className="text-3xs text-forge-muted font-light">{token.role}</p>
                    <p className="text-3xs font-mono text-forge-muted/70 mt-1 truncate">{token.usage}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 03 / Typography Direction                                    */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Type size={15} className="text-forge-blue" />
              <h4 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                03 / TYPOGRAPHY DIRECTION
              </h4>
            </div>
            <span className="text-3xs font-mono text-forge-muted">
              INTER DISPLAY + JETBRAINS MONO
            </span>
          </div>

          <div className="space-y-4 text-left">
            <div className="border-b border-forge-border/40 pb-4">
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted mb-1">
                <span>DISPLAY HERO / 48PX</span>
                <span>TRACKING: -0.03EM • WEIGHT: 900</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-forge-white uppercase tracking-tight">
                ONE IDEA. ONE INTELLIGENT WORKSPACE.
              </h2>
            </div>

            <div className="border-b border-forge-border/40 pb-4">
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted mb-1">
                <span>EDITORIAL SUBHEAD / 18PX</span>
                <span>TRACKING: -0.01EM • WEIGHT: 400</span>
              </div>
              <p className="text-sm sm:text-base text-forge-offwhite font-light leading-relaxed">
                Turn a raw idea into a clear creative, brand, website, content, and marketing direction.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-3xs font-mono text-forge-muted mb-1">
                <span>TECHNICAL METADATA SPEC / 11PX</span>
                <span>JETBRAINS MONO • TRACKING: +0.05EM</span>
              </div>
              <p className="text-xs font-mono text-forge-blue">
                FORGE_V1 // STATUS: COMPILED // RUNTIME: REACTIVE LOCAL
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 04 / Image Direction & 05 / UI Direction                      */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 04 / Image Direction */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
                <div>
                  <p className="section-label mb-1">04 / IMAGE DIRECTION</p>
                  <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                    Visual Treatment & Photography
                  </h3>
                </div>
                <span className="text-2xs font-mono text-forge-blue">CINEMATIC CRAFT</span>
              </div>

              <ul className="space-y-3 text-xs text-forge-offwhite/90 font-light leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forge-blue mt-1.5 flex-shrink-0" />
                  <span><strong>Atmospheric Lighting:</strong> Chiaroscuro high-contrast lighting with deep obsidian shadows and cool ambient accents.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Architectural Compositions:</strong> Uncluttered, disciplined geometry with natural textures — matte concrete, brushed metal, and dark glass.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Zero Stock Cliches:</strong> Reject generic stock photos, smiling business models, or hyper-saturated fake 3D renders.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-forge-border/60 text-3xs font-mono text-forge-muted">
              PALETTE PROFILE: MONOCHROME OBSIDIAN WITH SINGLE POINT ACCENTS
            </div>
          </div>

          {/* 05 / UI Direction */}
          <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
                <div>
                  <p className="section-label mb-1">05 / UI DIRECTION</p>
                  <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                    Interface Craft & Ergonomics
                  </h3>
                </div>
                <span className="text-2xs font-mono text-cyan-400">DESIGN SYSTEM</span>
              </div>

              <ul className="space-y-3 text-xs text-forge-offwhite/90 font-light leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Monolithic Containers:</strong> Matte graphite and navy cards with subtle 1px border dividers (`border-forge-border`).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forge-blue mt-1.5 flex-shrink-0" />
                  <span><strong>Restrained Electric Glows:</strong> Reserved for interactive focal points, active tab indicators, and primary action buttons.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span><strong>Fluid Spring Physics:</strong> Gentle Framer Motion transitions with instant feedback and zero laggy easing.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-forge-border/60 text-3xs font-mono text-forge-muted">
              ACCESSIBILITY: AAA CONTRAST ON OBSIDIAN CANVASES
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 06 / Brand Keywords                                          */}
        {/* ============================================================ */}
        <div className="rounded-xl border border-forge-border bg-forge-navy/60 p-5">
          <p className="section-label mb-2">06 / BRAND KEYWORDS</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Obsidian', 'Editorial', 'Precision', 'Architectural', 'Electric', 'Atmospheric', 'Refined', 'Monolithic', 'High Craft', 'Kinetic'].map(kw => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full border border-forge-border bg-forge-surface text-xs font-mono text-forge-white hover:border-forge-blue/50 transition-colors cursor-default"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}

