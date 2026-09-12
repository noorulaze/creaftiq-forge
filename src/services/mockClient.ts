// ============================================================
// CREAFTIQ FORGE — Client-Side Mock Data Engine
// When Firebase is not configured or in local demo mode,
// this allows the user to immediately see and interact with
// the entire FORGE experience in the browser.
// ============================================================

import type {
  IdeaDNA,
  IdeaReadiness,
  BrandOutput,
  ProductOutput,
  WebsiteOutput,
  ContentOutput,
  MarketingOutput,
  RoadmapOutput,
  CreativeDirectionOutput,
} from '@/types'

export function getClientMockResponse(operation: string, input?: unknown): unknown {
  const idea = (input as Record<string, unknown>)?.idea as string || 'a creative digital project'
  const shortIdea = idea.length > 30 ? idea.slice(0, 30) + '...' : idea

  switch (operation) {
    case 'analyzeIdea':
      return {
        ideaDna: {
          purpose: `To build an authentic, community-first brand and experience around "${shortIdea}" that solves a real need.`,
          audience: `Culture-forward, digitally-native individuals aged 18–34 seeking quality, identity, and peer-driven community.`,
          problem: `Generic incumbent solutions are bloated, uninspired, and disconnected from genuine modern lifestyle values.`,
          opportunity: `A major whitespace exists for a modern, design-first brand that delivers exceptional craft with an unmistakable voice.`,
          personality: `Sharp, confident, intentional, and editorial. Speaks with clarity, warmth, and relentless creative ambition.`,
          direction: `Minimal dark-aesthetic digital presence, tight product drops, and high-engagement content storytelling.`,
        } as IdeaDNA,
        readiness: {
          clarity: { score: 86, label: 'Clarity', why: 'Concept intent and value premise are sharp and direct.', suggestion: 'Focus your initial release on a signature flagship item.' },
          audience: { score: 79, label: 'Audience', why: 'Demographic is receptive and highly active across modern social channels.', suggestion: 'Engage 5 early beta community members for direct feedback.' },
          differentiation: { score: 74, label: 'Differentiation', why: 'Clear aesthetic and cultural positioning separates it from legacy competitors.', suggestion: 'Solidify your core tagline and signature hook.' },
          execution: { score: 82, label: 'Execution', why: 'Launch roadmap is lean, realistic, and highly actionable.', suggestion: 'Prioritize landing page email capture before full launch.' },
          overall: 80,
        } as IdeaReadiness,
      }

    case 'generateBrand':
      return {
        nameDirection: ['FORMA', 'VELO', 'ARCUS', 'KLAVE', 'MERIDIAN'],
        taglineIdeas: [
          'Made for the ones who move.',
          'Where culture meets craft.',
          'Built different. Born authentic.',
          'Your story, sharper.',
        ],
        brandPersonality: 'Confident and culturally rooted with an editorial sharpness. Speaks directly, never talks down, and earns loyalty through consistency.',
        positioning: 'The premium yet accessible digital brand offering genuine craft and culture where others offer only superficial aesthetics.',
        visualDirection: 'Clean, bold, editorial. High contrast typography, generous negative space, and candid lifestyle imagery with rich grain.',
        colorDirection: {
          primary: '#0A0A0F',
          secondary: '#F8F9FA',
          accent: '#2563EB',
          rationale: 'Deep obsidian base gives authority; off-white chalk provides crisp legibility; electric blue commands high-impact conversion.',
        },
        typographyDirection: 'Headlines: Condensed display sans with heavy weights. Body: Clean geometric sans (Inter) for effortless reading.',
      } as BrandOutput

    case 'generateProduct':
      return {
        coreProduct: 'A curated digital suite and product line designed for daily impact — minimal, functional, and built to last.',
        targetUsers: ['Urban creatives', 'Next-gen founders', 'Design enthusiasts', 'Digital natives'],
        valueProposition: 'Premium quality and cultural elevation without the friction — giving users work and tools they are proud to share.',
        coreFeatures: [
          { name: 'Core Collection', description: 'Curated flagship offerings focused on depth rather than bloated catalogs.', priority: 'high' },
          { name: 'Inner Circle Hub', description: 'Exclusive early access, member drops, and interactive workshops.', priority: 'high' },
          { name: 'Craft Transparency', description: 'Behind-the-scenes breakdowns showing every step of development.', priority: 'medium' },
          { name: 'Limited Drops', description: 'Time-boxed releases that cultivate urgency and high community momentum.', priority: 'medium' },
          { name: 'Advocate Program', description: 'Tiered recognition rewarding authentic word-of-mouth supporters.', priority: 'low' },
        ],
        userJourney: [
          { stage: 'Discovery', action: 'Encounters viral editorial visual on Instagram or X', emotion: 'Curious' },
          { stage: 'Immersion', action: 'Explores the FORGE interactive showcase and brand story', emotion: 'Inspired' },
          { stage: 'Engagement', action: 'Signs up for early member drop notification and community access', emotion: 'Invested' },
          { stage: 'Activation', action: 'Completes first purchase or project blueprint with instant confirmation', emotion: 'Excited' },
          { stage: 'Loyalty', action: 'Shares results with peers and attends community launch sessions', emotion: 'Belonging' },
        ],
      } as ProductOutput

    case 'generateWebsite':
      return {
        structure: 'Narrative-driven single-scroll experience that smoothly transitions from ethos to showcase and conversion.',
        pages: [
          { name: 'Home', purpose: 'Immediate manifesto statement, flagship showcase, and instant conversion.', sections: ['Hero Manifesto', 'Drop Spotlight', 'Ethos Grid', 'Community Pulse'] },
          { name: 'Showcase', purpose: 'Immersive exploration of products and design studies.', sections: ['Filter Bar', 'Interactive Grid', 'Specs & Detail', 'Lookbook'] },
          { name: 'Story', purpose: 'Founder journey, craft standards, and design philosophy.', sections: ['Manifesto', 'Timeline', 'Craft & Sourcing', 'Press Mentions'] },
          { name: 'Members', purpose: 'Private community perks, early drops, and direct channel access.', sections: ['Perks Matrix', 'Leaderboard', 'FAQ', 'Sign-up'] },
        ],
        homepageSections: ['Immersive Video Hero', 'Drop Countdown Banner', 'Signature Showcase', 'Interactive Product DNA', 'Editorial Quotes', 'Newsletter VIP Capture', 'Footer Matrix'],
        navigation: ['Home', 'Showcase', 'Story', 'Members', 'Launch Plan'],
        ctaStrategy: 'Clear primary action: "Get Started" or "Join Drop". Secondary: "Explore Story". Subtle micro-copy boosts confidence.',
        uxDirection: 'Ultra-fast sub-second loading, subtle spring physics, dark mode native, and mobile-first thumb-zone navigation.',
      } as WebsiteOutput

    case 'generateContent':
      return {
        platforms: ['instagram', 'website', 'youtube', 'linkedin', 'ads'],
        contentPillars: [
          { name: 'The Craft & Process', description: 'Raw, behind-the-scenes looks into building and refinement.', examples: ['Deconstructed sketches', 'Timeline time-lapses', 'Founder decisions'] },
          { name: 'Cultural Commentary', description: 'Perspective on industry trends, creative mindset, and future directions.', examples: ['Hot takes on design', 'Manifesto reels', 'Curated inspiration drops'] },
          { name: 'Community Triumphs', description: 'Spotlighting members and creators using the product to build their own visions.', examples: ['Creator spotlights', 'Before/After transformations', 'User stories'] },
        ],
        postIdeas: [
          { platform: 'instagram', format: 'Carousel', headline: 'Why good ideas die in notes apps', concept: '5 slides contrasting chaotic brainstorming with structured blueprints.', hook: 'Having ideas is cheap. Execution architecture is rare.' },
          { platform: 'instagram', format: 'Reel', headline: 'From prompt to launch plan in 60s', concept: 'High-energy fast cuts of FORGE synthesizing brand, product, and launch.', hook: 'Watch what happens when AI actually understands creative work.' },
          { platform: 'linkedin', format: 'Case Study', headline: 'The architecture of a modern digital launch', concept: 'Deep dive into why multi-disciplinary alignment wins markets.', hook: 'Most startups fail not from bad products, but from disjointed narratives.' },
          { platform: 'website', format: 'Editorial Post', headline: 'The CREAFTIQ Philosophy: Speed meets Craft', concept: 'Long-form essay on the intersection of generative AI and human taste.', hook: undefined },
        ],
        reelConcepts: [
          '3-second sound bite: "Stop asking ChatGPT for generic plans. Here is what real strategy looks like."',
          'Aesthetic studio vlog: Late-night design sprint assembling the first physical prototype.',
          'Split screen: Standard brainstorming meeting vs. generating a 6-stage blueprint in minutes.',
        ],
        campaignIdeas: [
          '#BuiltOnForge: Community challenge where founders share their synthesized launch blueprints.',
          'The Genesis 100: Exclusive numbered onboarding cards for the first 100 creators.',
        ],
        launchIdeas: [
          'Live interactive teardown of popular community ideas into instant blueprints.',
          'Exclusive 48-hour access window for waitlist subscribers before public release.',
          'Collaborative drop with 3 top creative studios.',
        ],
      } as ContentOutput

    case 'generateMarketing':
      return {
        targetAudience: 'Digital founders, independent operators, creative directors, and ambitious builders aged 20–38 navigating the digital creator economy.',
        positioning: 'FORGE is the purpose-built AI creative workspace that transforms raw inspiration into complete, deployable digital launch blueprints.',
        launchStrategy: 'High-signal proof-of-work marketing: show real outputs, empower community beta testers, and leverage curated word-of-mouth momentum.',
        channels: [
          { name: 'Instagram & X (Visual Storytelling)', priority: 'primary', rationale: 'Highest density of visual creators, designers, and founders looking for inspiration.' },
          { name: 'Owned Email VIP List', priority: 'primary', rationale: 'Direct relationship channel delivering the highest sustained conversion.' },
          { name: 'YouTube Long-form Teardowns', priority: 'secondary', rationale: 'Builds deep domain authority and demonstrates workflow depth.' },
        ],
        campaignConcepts: [
          { name: 'Blueprint Zero', hook: 'Turn your chaotic thoughts into a bankable roadmap today.', channels: ['X', 'Instagram', 'Email'], concept: 'Interactive free audit showing founders their readiness score and immediate quick wins.' },
          { name: 'The Forge Residency', hook: 'Build your dream venture in 14 days.', channels: ['Community', 'Live Streams'], concept: 'Cohort-based sprint where participants turn ideas into fully launched products.' },
        ],
        initialActionPlan: [
          'Deploy high-conversion VIP early-access landing page (Week 1)',
          'Publish 3 marquee visual case studies on Instagram and X (Week 1–2)',
          'Distribute invite keys to 25 target creative directors for initial reviews (Week 2)',
          'Host live interactive YouTube launch breakdown session (Week 3)',
          'Open public onboarding with limited daily forge capacity (Week 4)',
        ],
      } as MarketingOutput

    case 'generateRoadmap':
      return {
        now: [
          { title: 'Finalize Identity & Brand Guidelines', description: 'Lock color tokens, typography scales, and logo assets for all platforms.', timeframe: 'Days 1–7', category: 'brand' },
          { title: 'Deploy Interactive Landing Page', description: 'Launch fast, responsive web experience with email capture and dynamic demos.', timeframe: 'Days 3–10', category: 'tech' },
          { title: 'Setup VIP Community Channel', description: 'Establish member communications on Discord/Telegram with custom bot onboarding.', timeframe: 'Days 7–14', category: 'ops' },
          { title: 'Curate First Content Cohort', description: 'Batch-produce 12 high-aesthetic reels and carousel teardowns.', timeframe: 'Days 10–14', category: 'content' },
        ],
        next: [
          { title: 'Private Beta Access Rollout', description: 'Invite first 200 waitlist members to experience full workspace generation.', timeframe: 'Weeks 3–4', category: 'product' },
          { title: 'Creator Affiliate Program Launch', description: 'Equip top creative advocates with custom referral links and co-branded perks.', timeframe: 'Month 2', category: 'marketing' },
          { title: 'Drop #1 Release', description: 'Launch initial signature collection with live countdown and social momentum.', timeframe: 'Month 2', category: 'brand' },
        ],
        later: [
          { title: 'Public Scale & Automation', description: 'Scale cloud pipeline to support unlimited simultaneous user forge operations.', timeframe: 'Month 3', category: 'tech' },
          { title: 'Global Pop-up & Exhibition', description: 'Showcase premier community creations in a curated physical gallery.', timeframe: 'Month 4–5', category: 'ops' },
          { title: 'Enterprise Studio Suite', description: 'Introduce team collaborative spaces and white-label blueprint exports.', timeframe: 'Month 6', category: 'product' },
        ],
      } as RoadmapOutput

    case 'generateCreativeDirection':
      return {
        colorPalette: [
          { hex: '#0A0A0F', name: 'OBSIDIAN VOID', role: 'Primary Canvas' },
          { hex: '#111827', name: 'CARBON SURFACE', role: 'Elevated Cards & Containers' },
          { hex: '#2563EB', name: 'ELECTRIC SIGNAL', role: 'Primary Action & Glow Accent' },
          { hex: '#60A5FA', name: 'ATMOSPHERE BLUE', role: 'Secondary Gradients & Badges' },
          { hex: '#F8F9FA', name: 'CHALK WHITE', role: 'High-contrast Typography' },
        ],
        typographyDirection: 'Headlines: High-impact condensed sans with wide tracking. Body: Modern geometric sans (Inter) with generous line-height. Monospace accents in JetBrains Mono.',
        visualKeywords: ['Obsidian', 'Editorial', 'Precision', 'Architectural', 'Electric', 'Atmospheric', 'Refined', 'Kinetic', 'Bold', 'Minimal'],
        mood: 'An electric creative laboratory under midnight skies — precision engineering meets high-taste artistic vision.',
        imageDirection: 'Raw, grainy, high-contrast black-and-white photography punctuated by single electric blue light streaks.',
        uiDirection: 'Monochrome glassmorphism, subtle micro-borders, 1px luminous highlights, and fluid spring transitions.',
        brandPersonality: ['Unyielding Quality', 'Creative Visionary', 'Direct & Honest', 'Relentlessly Forward', 'Cultural Authority'],
      } as CreativeDirectionOutput

    case 'refineSection':
      return (input as Record<string, unknown>)?.currentContent || {}

    default:
      return {}
  }
}
