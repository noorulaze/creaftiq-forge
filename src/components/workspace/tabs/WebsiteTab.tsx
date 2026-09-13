import { useState } from 'react'
import { Globe, Smartphone, Monitor, Layers, ArrowRight, Eye, Layout, CheckCircle } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import type { WebsiteOutput } from '@/types'

interface WebsiteTabProps {
  website: WebsiteOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

const WIREFRAME_SECTIONS = [
  {
    id: 'hero',
    name: '01 / HERO MANIFESTO',
    role: 'First Impression & Hook',
    ux: 'Immediate brand authority, single-sentence manifesto, electric blue flowing line, and primary CTA ("START FORGING").',
    kpi: 'Sub-second clarity & waitlist initiation',
  },
  {
    id: 'features',
    name: '02 / FEATURE MATRIX',
    role: 'Capability Proof',
    ux: '3 interactive visual cards showcasing core competencies without overwhelming technical jargon.',
    kpi: 'Scroll retention past 50% viewport',
  },
  {
    id: 'craft',
    name: '03 / CRAFT & ETHOS',
    role: 'Authority & Story',
    ux: 'Editorial narrative block detailing the design philosophy and why the product exists.',
    kpi: 'Deep brand affinity & trust',
  },
  {
    id: 'drop',
    name: '04 / VIP COHORT CAPTURE',
    role: 'Conversion Hub',
    ux: 'High-contrast email / wallet capture with instant verification feedback and invitation key access.',
    kpi: 'Direct conversion rate',
  },
  {
    id: 'footer',
    name: '05 / FOOTER MATRIX',
    role: 'Closure & Compliance',
    ux: 'Clean 4-column link matrix, copyright, social channels, and subtle mountain silhouette.',
    kpi: 'Secondary exploration routes',
  },
]

const SITE_PAGES = [
  { name: 'HOME', path: '/', role: 'Manifesto, interactive wireframe demo, and conversion hook' },
  { name: 'ABOUT', path: '/about', role: 'Founding ethos, craft methodology, and studio roots' },
  { name: 'FEATURES', path: '/features', role: 'In-depth capability breakdowns and performance specs' },
  { name: 'DROPS', path: '/drops', role: 'Time-boxed releases and limited edition cohort access' },
  { name: 'FAQ', path: '/faq', role: 'Addressing user objections, pricing, and system security' },
  { name: 'CONTACT', path: '/contact', role: 'Direct executive inquiries and partnership submissions' },
]

export function WebsiteTab({
  website,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: WebsiteTabProps) {
  const [selectedSection, setSelectedSection] = useState<string>('hero')

  const activeSectionData = WIREFRAME_SECTIONS.find(s => s.id === selectedSection) || WIREFRAME_SECTIONS[0]

  const websiteCopy = `WEBSITE DIGITAL ARCHITECTURE BLUEPRINT:
Purpose: ${website?.structure || 'A high-conversion narrative web presence transitioning visitors from manifesto to active engagement.'}
Homepage Sections Flow:
1. Hero Manifesto: Large editorial typography, flowing blue ridge, and primary action.
2. Feature Matrix: 3-column interactive capability proof.
3. Craft & Ethos: Narrative studio background and design pedigree.
4. VIP Cohort Capture: Direct invitation key and early-access onboarding.
5. Footer Matrix: Clean links, copyright, and social access.
Site Map: 6 Primary Pages (Home, About, Features, Drops, FAQ, Contact).
Mobile Specs: Built for 320px-390px thumb-zone comfort with zero horizontal scroll clipping.`

  return (
    <BlueprintSection
      badge="DIGITAL ARCHITECTURE & WIREFRAMES"
      heading="DESIGN THE DIGITAL EXPERIENCE."
      subheading="Organize page hierarchies, homepage scroll flow, interactive section specifications, and mobile responsiveness rules."
      copyContent={websiteCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* Interactive Browser Wireframe Mockup                          */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/90 p-5 sm:p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">HOMEPAGE WIREFRAME SIMULATOR</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Visual Viewport Prototype
              </h3>
            </div>
            <div className="flex items-center gap-2 text-2xs font-mono text-forge-muted">
              <span className="flex items-center gap-1"><Monitor size={12} /> 1440PX DESKTOP</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Smartphone size={12} /> 390PX MOBILE ADAPTIVE</span>
            </div>
          </div>

          {/* Browser Window Chrome */}
          <div className="rounded-xl border border-forge-border bg-forge-black overflow-hidden shadow-2xl">
            {/* Address Bar */}
            <div className="bg-forge-surface px-4 py-2.5 border-b border-forge-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-forge-black border border-forge-border/80 rounded-md px-3 py-1 text-center text-3xs font-mono text-forge-muted truncate">
                https://yourbrand.com
              </div>
              <div className="text-3xs font-mono text-emerald-400">SSL ENCRYPTED</div>
            </div>

            {/* Simulated Web Canvas */}
            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-forge-black via-forge-navy to-forge-black">
              
              {/* Wireframe Nav */}
              <div className="flex items-center justify-between border-b border-forge-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-forge-blue/30 border border-forge-blue/50" />
                  <span className="text-xs font-mono font-bold text-forge-white">BRANDSTUDIO</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-3xs font-mono text-forge-muted">
                  <span>MANIFESTO</span>
                  <span>FEATURES</span>
                  <span>DROPS</span>
                </div>
                <div className="px-2.5 py-1 rounded bg-forge-blue text-white text-3xs font-mono font-bold">
                  GET ACCESS
                </div>
              </div>

              {/* Wireframe Hero Section */}
              <button
                type="button"
                onClick={() => setSelectedSection('hero')}
                className={`w-full text-left p-6 rounded-xl border transition-all ${
                  selectedSection === 'hero'
                    ? 'border-forge-blue bg-forge-blue/10 shadow-blue-glow-sm'
                    : 'border-dashed border-forge-border/80 hover:border-forge-border bg-forge-surface/30'
                }`}
              >
                <div className="max-w-xl space-y-3">
                  <span className="text-3xs font-mono px-2 py-0.5 rounded bg-forge-blue/20 text-forge-blue uppercase">
                    HERO COMPONENT
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-forge-white uppercase leading-tight">
                    ONE IDEA. ONE INTELLIGENT WORKSPACE.
                  </h4>
                  <p className="text-xs text-forge-muted font-light">
                    Turn a raw idea into a clear creative, brand, website, content, and marketing direction.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <span className="px-3 py-1.5 rounded bg-forge-blue text-white text-2xs font-bold uppercase">
                      START FORGING
                    </span>
                    <span className="px-3 py-1.5 rounded border border-forge-border text-forge-muted text-2xs uppercase">
                      EXPLORE WORKSPACE
                    </span>
                  </div>
                </div>
              </button>

              {/* Wireframe Feature Grid */}
              <button
                type="button"
                onClick={() => setSelectedSection('features')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedSection === 'features'
                    ? 'border-forge-blue bg-forge-blue/10 shadow-blue-glow-sm'
                    : 'border-dashed border-forge-border/80 hover:border-forge-border bg-forge-surface/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xs font-mono uppercase text-forge-muted">3-COLUMN FEATURE MATRIX</span>
                  <span className="text-3xs font-mono text-forge-blue">CLICK TO INSPECT</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Idea DNA Analysis', 'Brand Specification', 'Launch Roadmap'].map(item => (
                    <div key={item} className="p-3 rounded-lg bg-forge-navy border border-forge-border text-left">
                      <div className="w-4 h-4 rounded bg-forge-blue/20 mb-2" />
                      <p className="text-xs font-semibold text-forge-white">{item}</p>
                      <p className="text-3xs text-forge-muted mt-1">Structured generation without fragmented prompts.</p>
                    </div>
                  ))}
                </div>
              </button>

              {/* Wireframe Waitlist Hub */}
              <button
                type="button"
                onClick={() => setSelectedSection('drop')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedSection === 'drop'
                    ? 'border-forge-blue bg-forge-blue/10 shadow-blue-glow-sm'
                    : 'border-dashed border-forge-border/80 hover:border-forge-border bg-forge-surface/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-3xs font-mono uppercase text-forge-blue">VIP COHORT REGISTRATION</span>
                    <p className="text-xs font-bold text-forge-white mt-0.5">Genesis Drop Access Keys</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded bg-forge-black border border-forge-border text-3xs font-mono text-forge-muted">
                      Enter email...
                    </div>
                    <div className="px-3 py-1.5 rounded bg-forge-white text-forge-black text-3xs font-bold font-mono">
                      JOIN WAITLIST
                    </div>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Selected Wireframe Section Inspector Panel                    */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-forge-border/60 pb-3 mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-forge-blue" />
              <h4 className="text-xs font-mono font-bold text-forge-white uppercase tracking-wider">
                {activeSectionData.name} — COMPONENT SPEC
              </h4>
            </div>
            <span className="text-3xs font-mono uppercase px-2 py-0.5 rounded bg-forge-blue/10 text-forge-blue border border-forge-blue/20">
              ROLE: {activeSectionData.role}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-forge-white font-semibold block mb-1">UX Execution & Narrative Rules:</span>
              <p className="text-forge-muted font-light leading-relaxed">
                {activeSectionData.ux}
              </p>
            </div>
            <div>
              <span className="text-forge-white font-semibold block mb-1">Target Conversion Impact:</span>
              <p className="text-forge-muted font-light leading-relaxed">
                {activeSectionData.kpi}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6-Page Site Architecture Grid                                 */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">INFORMATION ARCHITECTURE</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                6 Primary Site Pages
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">
              SITEMAP ARCHITECTURE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {SITE_PAGES.map(page => (
              <div
                key={page.name}
                className="p-4 rounded-xl border border-forge-border bg-forge-navy/80 flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-forge-white tracking-wider font-mono">
                      {page.name}
                    </span>
                    <span className="text-3xs font-mono text-forge-blue bg-forge-blue/10 px-1.5 py-0.5 rounded">
                      {page.path}
                    </span>
                  </div>
                  <p className="text-2xs text-forge-muted font-light leading-relaxed">
                    {page.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Mobile Ergonomics & Performance Checklist                     */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/70 p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={14} className="text-emerald-400" />
            <p className="section-label mb-0">MOBILE RESPONSIVENESS & ERGONOMICS</p>
          </div>
          <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider mb-4">
            320px - 390px Mobile Viewport Standards
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-forge-border bg-forge-surface/90">
              <span className="text-forge-white font-semibold block mb-1">Thumb-Zone Touch Targets</span>
              <p className="text-2xs text-forge-muted font-light leading-relaxed">
                All interactive triggers, tabs, and action buttons maintain minimum 44px height for touch accuracy.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-forge-border bg-forge-surface/90">
              <span className="text-forge-white font-semibold block mb-1">Zero Side Scroll Clipping</span>
              <p className="text-2xs text-forge-muted font-light leading-relaxed">
                Tested down to 320px viewport width with fluid max-width constraints to prevent horizontal overflow.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-forge-border bg-forge-surface/90">
              <span className="text-forge-white font-semibold block mb-1">Sub-Second First Contentful Paint</span>
              <p className="text-2xs text-forge-muted font-light leading-relaxed">
                Minimal CSS overhead, SVG vector ridge styling, and pure CSS gradients for fast mobile loading.
              </p>
            </div>
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}

