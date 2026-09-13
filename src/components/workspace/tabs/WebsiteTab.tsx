import { Globe, Smartphone, CheckSquare } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import { InsightCard } from '../InsightCard'
import type { WebsiteOutput } from '@/types'

interface WebsiteTabProps {
  website: WebsiteOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

export function WebsiteTab({
  website,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: WebsiteTabProps) {
  const websiteCopy = `WEBSITE BLUEPRINT:
Purpose: High-conversion narrative web presence.
Page Structure: Home, About, Services or Features, Work or Products, FAQ, Contact
Homepage Flow: Hero Manifesto, Drop Countdown, Signature Showcase, Interactive DNA, Community Hub, Footer Matrix
Main CTA: START FORGING / EXPLORE STORY
UX Priorities: Sub-second load times, spring physics, dark mode native.`

  return (
    <BlueprintSection
      badge="DIGITAL ARCHITECTURE"
      heading="DESIGN THE DIGITAL EXPERIENCE."
      subheading="Organize page structures, content hierarchies, CTA strategy, and mobile considerations."
      copyContent={websiteCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-6">
        
        {/* Purpose & Main CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="01 / PURPOSE" title="Website Purpose" highlight>
            <p className="text-forge-white text-xs leading-relaxed">
              {website?.structure || 'A high-impact narrative experience transitioning visitors smoothly from brand manifesto to product exploration.'}
            </p>
          </InsightCard>

          <InsightCard label="02 / CONVERSION STRATEGY" title="Main CTA & UX Priorities">
            <p className="text-forge-white text-xs leading-relaxed">
              Primary: <span className="text-forge-blue font-semibold">"START FORGING"</span> / Secondary: <span className="text-forge-muted">"EXPLORE STORY"</span>. Emphasizes sub-second loading and seamless thumb-zone mobile navigation.
            </p>
          </InsightCard>
        </div>

        {/* Suggested 6-Page Structure */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label mb-1">PAGE BLUEPRINT</p>
              <h3 className="text-sm font-bold text-forge-white uppercase tracking-wider">
                Suggested Page Structure
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-muted">6 PRIMARY PAGES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { name: 'Home', role: 'Manifesto & Conversion' },
              { name: 'About', role: 'Founder Story & Ethos' },
              { name: 'Features', role: 'Capabilities Matrix' },
              { name: 'Products', role: 'Curated Drops & Catalog' },
              { name: 'FAQ', role: 'Trust & Validation' },
              { name: 'Contact', role: 'Direct Channel & Inquiries' },
            ].map(page => (
              <div key={page.name} className="p-3.5 rounded-xl border border-forge-border bg-forge-navy/80 text-left">
                <p className="text-xs font-bold text-forge-white uppercase tracking-wider">{page.name}</p>
                <p className="text-3xs text-forge-muted mt-1 leading-snug">{page.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Homepage Sections & Mobile Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCard label="03 / SECTION ORDER" title="Homepage Sections Flow">
            <div className="space-y-2 pt-1 font-mono text-xs text-forge-white">
              <div className="flex items-center gap-2">
                <span className="text-forge-blue">01</span>
                <span>Hero Manifesto & Action CTA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-forge-blue">02</span>
                <span>Signature Product / Feature Showcase</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-forge-blue">03</span>
                <span>Ethos & Craftsmanship Study</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-forge-blue">04</span>
                <span>Community Pulse & Member Access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-forge-blue">05</span>
                <span>Footer Matrix & Legal Navigation</span>
              </div>
            </div>
          </InsightCard>

          <InsightCard label="04 / RESPONSIVENESS" title="Mobile Experience Notes">
            <div className="space-y-2 text-xs text-forge-muted font-light leading-relaxed">
              <p>• Clean 320px fluid scaling without side-scroll clipping.</p>
              <p>• Touch-friendly bottom action drawers for navigation.</p>
              <p>• High-contrast off-white body text on deep black background for sunlight legibility.</p>
            </div>
          </InsightCard>
        </div>

      </div>
    </BlueprintSection>
  )
}
