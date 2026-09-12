import { motion } from 'framer-motion'
import { SkeletonCard } from '@/components/shared'
import type { CreativeDirectionOutput } from '@/types'

interface CreativeBoardProps {
  creativeDirection: CreativeDirectionOutput | null
  loading?: boolean
}

export function CreativeBoard({ creativeDirection, loading = false }: CreativeBoardProps) {
  if (loading || !creativeDirection) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
      </div>
    )
  }

  const cd = creativeDirection

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <p className="section-label mb-2">CREATIVE DIRECTION</p>
        <h2 className="text-2xl font-bold text-forge-white tracking-tight">Creative Board</h2>
        <p className="text-forge-muted text-sm mt-1">The visual and tonal direction for your brand.</p>
      </div>

      {/* Color Palette */}
      <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
        <p className="section-label mb-4">COLOR PALETTE</p>
        <div className="flex flex-wrap gap-4">
          {cd.colorPalette.map((swatch, i) => (
            <motion.div
              key={swatch.hex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-xl border border-forge-border shadow-card"
                style={{ background: swatch.hex }}
                title={swatch.hex}
              />
              <div className="text-center">
                <p className="text-forge-white text-xs font-medium">{swatch.name}</p>
                <p className="text-forge-muted text-xs font-mono">{swatch.hex}</p>
                <p className="text-forge-muted/60 text-2xs">{swatch.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mood + Visual Keywords row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mood */}
        <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
          <p className="section-label mb-3">MOOD</p>
          <p className="text-forge-white text-lg font-light italic leading-relaxed">"{cd.mood}"</p>
        </div>

        {/* Visual Keywords */}
        <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
          <p className="section-label mb-3">VISUAL KEYWORDS</p>
          <div className="flex flex-wrap gap-2">
            {cd.visualKeywords.map((kw, i) => (
              <motion.span
                key={kw}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 rounded-full border border-forge-border bg-forge-navy text-forge-white text-xs font-medium"
                style={{ fontSize: `${Math.max(10, Math.min(14, 10 + (i % 3) * 2))}px` }}
              >
                {kw}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
        <p className="section-label mb-3">TYPOGRAPHY DIRECTION</p>
        <p className="text-forge-white text-sm leading-relaxed">{cd.typographyDirection}</p>
      </div>

      {/* Image Direction + UI Direction row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
          <p className="section-label mb-3">IMAGE DIRECTION</p>
          <p className="text-forge-white text-sm leading-relaxed">{cd.imageDirection}</p>
        </div>
        <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
          <p className="section-label mb-3">UI DIRECTION</p>
          <p className="text-forge-white text-sm leading-relaxed">{cd.uiDirection}</p>
        </div>
      </div>

      {/* Brand Personality tags */}
      <div className="rounded-xl border border-forge-border bg-forge-surface p-6">
        <p className="section-label mb-3">BRAND PERSONALITY</p>
        <div className="flex flex-wrap gap-2">
          {cd.brandPersonality.map((trait) => (
            <span key={trait} className="px-4 py-2 rounded-lg border border-forge-blue/30 bg-forge-blue/10 text-forge-blue text-xs font-medium">
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
