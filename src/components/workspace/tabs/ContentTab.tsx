import { useState } from 'react'
import { Film, Instagram, Twitter, Calendar, Sparkles, Copy, Check, Play, Music2 } from 'lucide-react'
import { BlueprintSection } from '../BlueprintSection'
import type { ContentOutput } from '@/types'
import toast from 'react-hot-toast'

interface ContentTabProps {
  content: ContentOutput | null
  loading?: boolean
  onRefine: () => void
  onRegenerate: () => void
  onSave?: () => void
}

const CADENCE_SCHEDULE = [
  {
    day: 'MON / 09:00',
    channel: 'X & LinkedIn',
    format: 'Long-Form Breakdown',
    intent: 'Authority & Methodology',
    hook: 'Why 90% of AI launch plans fail: they produce conversational text instead of multidisciplinary blueprints.',
  },
  {
    day: 'WED / 17:00',
    channel: 'TikTok & Reels',
    format: '9:16 Behind-The-Build',
    intent: 'Viral Discovery',
    hook: 'Deconstructing a 6-figure creative launch in 30 seconds using CREAFTIQ FORGE.',
  },
  {
    day: 'FRI / 12:00',
    channel: 'Instagram & Email',
    format: 'Editorial Carousel',
    intent: 'Community & VIP Access',
    hook: 'Genesis Cohort Drop: 5 foundational design rules from our studio launch playbook.',
  },
]

export function ContentTab({
  content,
  loading = false,
  onRefine,
  onRegenerate,
  onSave,
}: ContentTabProps) {
  const [carouselSlide, setCarouselSlide] = useState(0)
  const [copiedHook, setCopiedHook] = useState<string | null>(null)

  function handleCopyText(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopiedHook(text)
    toast.success(`Copied ${label} to clipboard`)
    setTimeout(() => setCopiedHook(null), 1800)
  }

  const CAROUSEL_SLIDES = [
    { num: '01/03', title: 'ONE IDEA. ONE INTELLIGENT WORKSPACE.', subtitle: 'The new paradigm for high-craft digital execution.' },
    { num: '02/03', title: 'BEYOND TEXT CHATBOTS', subtitle: 'How structured blueprints replace endless prompt loops.' },
    { num: '03/03', title: 'FROM CONCEPT TO DEPLOYMENT', subtitle: 'Your idea now has direction. Claim your Genesis drop key.' },
  ]

  const contentCopy = `CONTENT ENGINE BLUEPRINT:
Pillars:
1. The Craft & Process: Deep dive into design decisions, prototypes, and failures.
2. Cultural Perspective: Editorial critique of generic AI tools vs bespoke craft.
3. Genesis Member Triumphs: Highlighting real creations forged in the workspace.
Cadence: 3 weekly high-signal drops (Mon: Authority Thread, Wed: 30s Viral Reel, Fri: Carousel & VIP Invite).
Short Video Hook: "Stop asking ChatGPT for generic plans. Here is what real architecture looks like."`

  return (
    <BlueprintSection
      badge="EDITORIAL & MEDIA ENGINE"
      heading="CREATE THE CONTENT SYSTEM."
      subheading="Organize content pillars, visual post mockups, short video scripts, and high-signal editorial release cadences."
      copyContent={contentCopy}
      onRefine={onRefine}
      onRegenerate={onRegenerate}
      onSave={onSave}
    >
      <div className="space-y-8">

        {/* ============================================================ */}
        {/* Visual Media Card Previews: Carousel, 9:16 Reel, Thread       */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-navy/80 p-5 sm:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">VISUAL MEDIA SPECIMENS</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Production-Ready Content Formats
              </h3>
            </div>
            <span className="text-2xs font-mono text-forge-blue">
              MULTI-PLATFORM ASSET SUITE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Mockup 1: Instagram / LinkedIn Carousel */}
            <div className="rounded-xl border border-forge-border bg-forge-black p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-forge-border/60 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Instagram size={14} className="text-pink-400" />
                    <span className="text-forge-white font-bold">@creaftiq.forge</span>
                  </div>
                  <span className="text-3xs text-forge-muted">{CAROUSEL_SLIDES[carouselSlide].num}</span>
                </div>

                {/* Carousel Slide Body */}
                <div className="h-44 rounded-lg bg-gradient-to-br from-forge-navy to-forge-surface border border-forge-border p-4 flex flex-col justify-between mb-4">
                  <span className="text-3xs font-mono text-forge-blue uppercase tracking-widest">
                    CAROUSEL SLIDE
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-forge-white uppercase leading-snug">
                      {CAROUSEL_SLIDES[carouselSlide].title}
                    </h5>
                    <p className="text-2xs text-forge-muted mt-1 leading-relaxed">
                      {CAROUSEL_SLIDES[carouselSlide].subtitle}
                    </p>
                  </div>
                  <span className="text-3xs font-mono text-forge-muted">SWIPE FOR MORE →</span>
                </div>

                {/* Carousel Navigation Dots */}
                <div className="flex justify-center gap-1.5 mb-2">
                  {CAROUSEL_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        carouselSlide === idx ? 'bg-forge-blue w-5' : 'bg-forge-border'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyText(CAROUSEL_SLIDES[carouselSlide].title, 'Carousel Copy')}
                className="w-full mt-3 py-2 rounded-lg border border-forge-border bg-forge-surface hover:bg-forge-navy text-2xs font-mono text-forge-muted hover:text-forge-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy size={11} />
                <span>COPY SLIDE TEXT</span>
              </button>
            </div>

            {/* Mockup 2: TikTok / Reels 9:16 Vertical Video */}
            <div className="rounded-xl border border-forge-border bg-forge-black p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-forge-border/60 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Film size={14} className="text-cyan-400" />
                    <span className="text-forge-white font-bold">SHORT / 9:16 REEL</span>
                  </div>
                  <span className="text-3xs font-mono text-emerald-400">0:30 SEC</span>
                </div>

                {/* 9:16 Preview Card */}
                <div className="h-44 rounded-lg bg-gradient-to-t from-forge-navy via-[#0D1117] to-forge-black border border-forge-border p-4 flex flex-col justify-between relative overflow-hidden mb-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-3xs font-mono uppercase font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      HOOK
                    </span>
                    <Play size={12} className="text-forge-white" />
                  </div>

                  <p className="text-xs font-bold text-forge-white leading-snug bg-black/60 p-2 rounded backdrop-blur-xs">
                    "Stop asking ChatGPT for generic plans. Here is what real architecture looks like."
                  </p>

                  <div className="flex items-center gap-1.5 text-3xs font-mono text-forge-muted">
                    <Music2 size={10} className="text-forge-blue animate-pulse" />
                    <span className="truncate">Original Sound • Studio Atmosphere #04</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyText("Stop asking ChatGPT for generic plans. Here is what real architecture looks like.", 'Video Script Hook')}
                className="w-full mt-3 py-2 rounded-lg border border-forge-border bg-forge-surface hover:bg-forge-navy text-2xs font-mono text-forge-muted hover:text-forge-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy size={11} />
                <span>COPY VIDEO HOOK</span>
              </button>
            </div>

            {/* Mockup 3: X Thought Leadership Thread */}
            <div className="rounded-xl border border-forge-border bg-forge-black p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-forge-border/60 mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Twitter size={14} className="text-forge-blue" />
                    <span className="text-forge-white font-bold">X / LONG THREAD</span>
                  </div>
                  <span className="text-3xs text-forge-muted">POST 1 OF 6</span>
                </div>

                <div className="h-44 rounded-lg bg-forge-surface border border-forge-border p-4 flex flex-col justify-between mb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-forge-blue/30 border border-forge-blue/50" />
                      <span className="text-xs font-bold text-forge-white">CREAFTIQ FORGE</span>
                    </div>
                    <p className="text-2xs text-forge-offwhite font-light leading-relaxed">
                      Most AI tools produce conversational fluff. Ambitious founders don't need a chatbot — they need a unified creative blueprint. Here is our 5-stage framework: 🧵
                    </p>
                  </div>
                  <div className="pt-2 border-t border-forge-border/40 text-3xs font-mono text-forge-muted">
                    12 RETWEETS • 84 BOOKMARKS
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopyText("Most AI tools produce conversational fluff. Ambitious founders don't need a chatbot — they need a unified creative blueprint. Here is our 5-stage framework: 🧵", 'Thread Starter')}
                className="w-full mt-3 py-2 rounded-lg border border-forge-border bg-forge-surface hover:bg-forge-navy text-2xs font-mono text-forge-muted hover:text-forge-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy size={11} />
                <span>COPY THREAD OPENER</span>
              </button>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* Weekly Editorial Cadence Matrix                               */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-forge-border bg-forge-surface p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <div>
              <p className="section-label mb-1">RELEASE CADENCE DIRECTORY</p>
              <h3 className="text-base font-bold text-forge-white uppercase tracking-wider">
                Weekly High-Signal Publishing Schedule
              </h3>
            </div>
            <span className="text-2xs font-mono text-emerald-400">
              QUALITY OVER VOLUME (3 DROPS/WEEK)
            </span>
          </div>

          <div className="space-y-3">
            {CADENCE_SCHEDULE.map(item => (
              <div
                key={item.day}
                className="p-4 rounded-xl border border-forge-border bg-forge-navy/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 sm:max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs font-mono font-bold text-forge-blue bg-forge-blue/10 px-2 py-0.5 rounded">
                      {item.day}
                    </span>
                    <span className="text-xs font-semibold text-forge-white">
                      {item.channel}
                    </span>
                    <span className="text-3xs font-mono text-forge-muted uppercase px-1.5 py-0.5 rounded bg-forge-surface">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-xs text-forge-muted font-light leading-relaxed pt-1">
                    "{item.hook}"
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-3xs font-mono uppercase text-forge-blue/80 bg-forge-blue/5 border border-forge-blue/20 px-2.5 py-1 rounded">
                    INTENT: {item.intent}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(item.hook, 'Post Hook')}
                    className="p-2 rounded-lg border border-forge-border bg-forge-surface hover:bg-forge-navy text-forge-muted hover:text-forge-white transition-colors"
                    title="Copy Hook"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </BlueprintSection>
  )
}

