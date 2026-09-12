// ============================================================
// CREAFTIQ FORGE — Mock Data Layer
// Returns realistic structured data matching all TypeScript types.
// Used when GEMINI_MOCK=true (default for dev/staging).
// ============================================================

export function getMockResponse(operation: string, input: unknown): unknown {
  // Simulate slight delay in mock mode
  const idea = (input as Record<string, unknown>)?.idea as string || 'a creative project'
  const shortIdea = idea.length > 30 ? idea.slice(0, 30) + '...' : idea

  switch (operation) {
    case 'analyzeIdea':
      return {
        ideaDna: {
          purpose:     `To build a meaningful, community-driven experience around "${shortIdea}" that solves a real problem for its target audience.`,
          audience:    `Young, digitally-native individuals aged 18–30 who value authenticity, quality, and community. They discover brands through social media and peer recommendations.`,
          problem:     `The existing market is saturated with generic, impersonal options that fail to speak to the specific lifestyle and values of the target demographic.`,
          opportunity: `A gap exists for a brand that combines genuine cultural relevance with high-quality execution. The audience is underserved and ready for something that truly represents them.`,
          personality: `Bold but thoughtful. Confident without being arrogant. Culturally aware, forward-thinking, and unapologetically authentic. Speaks like a peer, not a corporation.`,
          direction:   `Modern editorial aesthetic with strong brand voice. Digital-first strategy with community at the core. Think premium without the pretension.`,
        },
        readiness: {
          clarity:          { score: 82, label: 'Clarity',         why: 'The idea is clearly articulated with a defined target and purpose.',               suggestion: 'Narrow your first product focus to one core offering to sharpen execution.' },
          audience:         { score: 76, label: 'Audience',        why: 'Target demographic is identifiable and has established digital behaviors.',        suggestion: 'Conduct 5 user interviews to validate assumptions before building.' },
          differentiation:  { score: 68, label: 'Differentiation', why: 'Some unique angles exist but the core differentiator needs sharpening.',           suggestion: 'Define your one-sentence positioning that no competitor can say.' },
          execution:        { score: 74, label: 'Execution',       why: 'The concept is actionable with available tools and reasonable resources.',          suggestion: 'Map out your first 30-day plan with weekly milestones.' },
          overall:          75,
        },
      }

    case 'generateBrand':
      return {
        nameDirection:      ['FORMA', 'VELO', 'ARCUS', 'KLAVE', 'MERIDIAN'],
        taglineIdeas:       [
          'Made for the ones who move.',
          'Where culture meets craft.',
          'Built different. Born authentic.',
          'Your story, sharper.',
        ],
        brandPersonality:   'Confident and culturally rooted with an editorial sharpness. The brand speaks directly, never talks down, and earns trust through consistency and quality.',
        positioning:        'The premium yet accessible brand for the culture-forward generation — offering genuine quality and community connection where others offer only aesthetics.',
        visualDirection:    'Clean, bold, editorial. Think Highsnobiety meets Aesop. Heavy use of white space, strong typography, and intentional photography with real people in real environments.',
        colorDirection: {
          primary:   '#0A0A0F',
          secondary: '#F8F9FA',
          accent:    '#2563EB',
          rationale: 'A dark, premium base creates authority and quality perception. The off-white secondary ensures legibility and cleanliness. Electric blue punctuates key moments.',
        },
        typographyDirection: 'Primary: A geometric sans-serif like Neue Haas Grotesk or Inter for body and UI. Display: A condensed editorial typeface for headlines. All uppercase for brand elements to create visual consistency and authority.',
      }

    case 'generateProduct':
      return {
        coreProduct:      'A curated collection of quality essentials designed for daily use — functional, minimal, and built to last.',
        targetUsers:      ['College students aged 18–24', 'Urban creatives', 'Streetwear enthusiasts', 'Quality-conscious shoppers'],
        valueProposition: 'We give the culture-forward generation access to premium quality without the premium barrier — clothes (or products) you actually want to wear every day.',
        coreFeatures: [
          { name: 'Core Collection',       description: 'A small, curated selection of essential products. Quality over quantity.', priority: 'high' as const },
          { name: 'Community Access',      description: 'Members get early drops, community events, and exclusive content.',        priority: 'high' as const },
          { name: 'Transparent Sourcing',  description: 'Clear information about how and where products are made.',                 priority: 'medium' as const },
          { name: 'Drop Model',            description: 'Limited releases to create anticipation and exclusivity.',                 priority: 'medium' as const },
          { name: 'Loyalty Program',       description: 'Points system that rewards long-term community members.',                  priority: 'low' as const },
        ],
        userJourney: [
          { stage: 'Discovery',  action: 'Finds brand through Instagram or friend recommendation',       emotion: 'Curious' },
          { stage: 'Explore',    action: 'Browses website, reads about the brand story and values',     emotion: 'Interested' },
          { stage: 'Consider',   action: 'Checks product quality, reads community reviews, compares',   emotion: 'Evaluating' },
          { stage: 'Convert',    action: 'Makes first purchase, signs up for community access',          emotion: 'Excited' },
          { stage: 'Retain',     action: 'Shares purchase, engages with community, awaits next drop',   emotion: 'Belonging' },
        ],
      }

    case 'generateWebsite':
      return {
        structure:    'Single-brand e-commerce site with editorial storytelling. Home → Collection → Community → About → Shop.',
        pages: [
          { name: 'Home',        purpose: 'Brand statement and immediate product exposure',         sections: ['Hero', 'Featured Drop', 'Brand Story', 'Community CTA'] },
          { name: 'Collection',  purpose: 'Browse all products with filtering',                    sections: ['Filter Bar', 'Product Grid', 'Lookbook', 'Size Guide'] },
          { name: 'Product',     purpose: 'Individual product detail page',                        sections: ['Gallery', 'Details', 'Size Chart', 'Reviews', 'Related'] },
          { name: 'Community',   purpose: 'Community hub for members',                             sections: ['Member Stories', 'Events', 'Early Access Sign-up'] },
          { name: 'About',       purpose: 'Brand story and values',                                sections: ['Founder Story', 'Mission', 'Process', 'Press'] },
        ],
        homepageSections: ['Full-width brand video/image hero', 'Featured drop countdown', 'Product grid (3 hero items)', 'Brand story paragraph', 'Community testimonials', 'Newsletter / Early Access CTA', 'Press logos'],
        navigation:       ['Home', 'Shop', 'Collections', 'Community', 'About'],
        ctaStrategy:      'Primary CTA throughout: "Join the Community" (email capture). Secondary: "Shop Now" on product pages. Avoid generic CTAs — use active, culture-specific language.',
        uxDirection:      'Minimal navigation, maximum content. Long-scroll product pages with immersive photography. Mobile-first. Fast load times are non-negotiable. Dark mode option.',
      }

    case 'generateContent':
      return {
        platforms:       ['instagram', 'website'],
        contentPillars: [
          { name: 'Culture & Community', description: 'Content that celebrates the community and culture the brand exists within.',                       examples: ['Community spotlights', 'Cultural moments', 'Collab announcements'] },
          { name: 'Product & Craft',     description: 'Behind-the-scenes content about how products are made and why quality matters.',                   examples: ['Making-of videos', 'Material sourcing stories', 'Quality close-ups'] },
          { name: 'Lifestyle & Context', description: 'Editorial-style content showing products in real life — not studio shots, real environments.',     examples: ['Day-in-the-life', 'City shoots', 'Real customer features'] },
        ],
        postIdeas: [
          { platform: 'instagram' as const, format: 'Carousel', headline: 'The story behind the drop', concept: '5-slide carousel showing the design process from sketch to final product', hook: 'We almost scrapped this one. Here\'s why we didn\'t.' },
          { platform: 'instagram' as const, format: 'Reel',     headline: 'Community spotlight',        concept: '30-second video featuring a real community member and how they wear the brand', hook: 'This is why we build for community first.' },
          { platform: 'website' as const,   format: 'Blog Post', headline: 'Why we make less to give you more', concept: 'Editorial article on the drop model philosophy and quality-over-quantity approach', hook: undefined },
        ],
        reelConcepts: [
          'Day-in-the-life of a community member — shot documentary style, 45 seconds',
          'Before/after: empty warehouse to sold-out drop — time-lapse with voiceover',
          'The making of our core tee — fabric sourcing to finished product, 60 seconds',
          '"What does community mean to you?" — 5 members, 5 answers, rapid-cut edit',
        ],
        campaignIdeas:  ['#ForgedByCommunity launch campaign — UGC from day one', 'Drop countdown series — 7 days of teaser content', 'Founder\'s story mini-documentary series'],
        launchIdeas:    ['48-hour early access window for email subscribers only', 'Local pop-up in your city before online launch', 'Community Slack/Discord drop announcement with exclusive early link', 'Collab with 3 micro-influencers (10K–50K) from the actual community'],
      }

    case 'generateMarketing':
      return {
        targetAudience:  'Digital-native 18–28 year olds in urban centres. Discovery-first: they find brands through Instagram, TikTok, and peer sharing. They value authenticity over polish and community over celebrity endorsement.',
        positioning:     'For the culture-forward generation, [BRAND] is the only [category] that combines genuine quality with authentic community connection — without compromising on either.',
        launchStrategy:  'Community-first soft launch. Build email list 30 days before launch. Activate micro-influencers (authentic, not paid celebrities). Drop-model creates urgency. First launch is intentionally limited to drive FOMO and waitlists.',
        channels: [
          { name: 'Instagram',       priority: 'primary' as const,   rationale: 'Primary discovery channel for target demo. Visual-first format matches brand aesthetic.' },
          { name: 'Email/SMS',       priority: 'primary' as const,   rationale: 'Owned channel — highest conversion rate. Build list before launch.' },
          { name: 'TikTok',          priority: 'secondary' as const, rationale: 'Organic reach potential is high. Invest when content team has capacity.' },
          { name: 'Word of Mouth',   priority: 'primary' as const,   rationale: 'Community-first brands live or die by peer recommendation. Engineer this.' },
        ],
        campaignConcepts: [
          { name: 'The Founding Community', hook: 'Be one of the first 100.',         channels: ['Email', 'Instagram'],          concept: 'Exclusive founding member program. First 100 sign-ups get a unique badge, lifetime discount, and early access to every drop.' },
          { name: 'Made Real',              hook: 'Real people, real product.',        channels: ['Instagram', 'TikTok'],         concept: 'UGC-first campaign. Send product to 20 real community members before launch. Let them document it authentically.' },
        ],
        initialActionPlan: [
          'Build and verify email capture landing page (Week 1)',
          'Identify and brief 5–10 micro-influencer partners (Week 1–2)',
          'Create content calendar for 30 days of pre-launch content (Week 2)',
          'Set up Instagram and TikTok profiles with brand aesthetic (Week 2)',
          'Launch email capture with early access incentive (Week 3)',
          'Begin drip campaign for waitlist (Week 3–4)',
          'Activate influencer content drops (Week 4)',
          'LAUNCH — exclusive 48-hour early access for email list (Week 5)',
        ],
      }

    case 'generateRoadmap':
      return {
        now: [
          { title: 'Define brand identity',         description: 'Finalize name, visual direction, color palette, and core messaging.',              timeframe: 'Week 1–2', category: 'brand' as const    },
          { title: 'Set up domain & hosting',        description: 'Register domain, set up Shopify or Webflow site, configure email.',              timeframe: 'Week 1',   category: 'tech' as const     },
          { title: 'Build email waitlist',            description: 'Launch a simple landing page with email capture before full site goes live.',    timeframe: 'Week 2',   category: 'marketing' as const },
          { title: 'Create first content batch',      description: 'Shoot 15–20 pieces of content for Instagram launch. Editorial and lifestyle.',  timeframe: 'Week 2–3', category: 'content' as const  },
        ],
        next: [
          { title: 'Launch MVP website',              description: 'Go live with full product pages, brand story, and community sign-up.',            timeframe: 'Month 2', category: 'product' as const   },
          { title: 'First product drop',              description: 'Limited release with intentional scarcity. 100 units max for first drop.',        timeframe: 'Month 2', category: 'product' as const   },
          { title: 'Activate micro-influencers',      description: 'Send product to 5–10 authentic community voices. No scripts, let them speak.',    timeframe: 'Month 2', category: 'marketing' as const },
          { title: 'Post-launch content engine',      description: 'Establish 3-post-per-week cadence. Mix of product, community, and culture.',     timeframe: 'Month 2–3', category: 'content' as const },
        ],
        later: [
          { title: 'Community platform',              description: 'Build or integrate a community space — Discord, Circle, or custom forum.',         timeframe: 'Month 4–5', category: 'product' as const   },
          { title: 'Second drop + collaboration',     description: 'Bigger drop with a collab partner to expand reach and credibility.',              timeframe: 'Month 4',   category: 'product' as const   },
          { title: 'Paid acquisition testing',        description: 'Begin testing Meta/Instagram ads with conversion-focused creative.',               timeframe: 'Month 5',   category: 'marketing' as const },
          { title: 'Press & PR outreach',             description: 'Pitch to relevant culture/lifestyle publications after establishing track record.', timeframe: 'Month 5–6', category: 'marketing' as const },
          { title: 'Expand product range',            description: 'Add 2–3 new SKUs based on community feedback and sales data.',                    timeframe: 'Month 6',   category: 'product' as const   },
        ],
      }

    case 'generateCreativeDirection':
      return {
        colorPalette: [
          { hex: '#0A0A0F', name: 'VOID',      role: 'Primary Background' },
          { hex: '#F8F9FA', name: 'CHALK',     role: 'Primary Text'       },
          { hex: '#2563EB', name: 'SIGNAL',    role: 'Accent / CTA'       },
          { hex: '#1F2937', name: 'SMOKE',     role: 'Borders / Dividers' },
          { hex: '#9CA3AF', name: 'ASH',       role: 'Secondary Text'     },
        ],
        typographyDirection:  'Display: Condensed heavyweight sans-serif (e.g., Barlow Condensed Black) for headlines. Body: Geometric sans-serif (e.g., Inter Regular/Medium) for readability. Monospace: JetBrains Mono for codes/tags. All brand wordmarks in uppercase.',
        visualKeywords:       ['Editorial', 'Raw', 'Minimal', 'Urban', 'Intentional', 'Authentic', 'Clean', 'Textured', 'Bold', 'Considered'],
        mood:                 'Calm confidence. Like a well-dressed person who doesn\'t need to announce themselves.',
        imageDirection:       'Documentary-style photography over studio shots. Real people, real environments. Slight grain acceptable — it adds authenticity. Avoid white-background product shots unless editorial context.',
        uiDirection:          'Dark mode first. Maximum whitespace. Cards are minimal — content breathes. Micro-interactions: subtle hover states, no flashy transitions. Typography does the heavy lifting.',
        brandPersonality:     ['Bold', 'Authentic', 'Considered', 'Community-driven', 'Premium', 'Approachable'],
      }

    case 'refineSection':
      // Return a slightly modified version of whatever was passed in
      return (input as Record<string, unknown>)?.currentContent || {}

    default:
      return {}
  }
}
