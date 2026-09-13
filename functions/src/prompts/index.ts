// ============================================================
// CREAFTIQ FORGE — Modular Prompt Templates
// Each function returns a complete prompt string for Gemini.
// All prompts instruct Gemini to return ONLY valid JSON.
// ============================================================

const FORGE_CONTEXT = `You are FORGE, an AI creative workspace by CREAFTIQ. 
Your role is to analyze ideas and generate structured, actionable creative and digital blueprints.
Always respond with ONLY valid JSON. No markdown fences, no extra text, just the JSON object.`

// ─── Analyze Idea → IdeaDNA + Readiness ──────────────────────
export function buildAnalyzeIdeaPrompt(idea: string, context: Record<string, string>): string {
  const contextStr = Object.entries(context)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  return `${FORGE_CONTEXT}

Analyze this idea and return a JSON object with exactly this structure:
{
  "ideaDna": {
    "purpose": "2-3 sentences on the core purpose and why it matters",
    "audience": "2-3 sentences describing the primary audience and their characteristics",
    "problem": "2-3 sentences on the core problem being solved",
    "opportunity": "2-3 sentences on the market opportunity",
    "personality": "2-3 sentences describing the brand personality traits",
    "direction": "2-3 sentences on the overall creative and strategic direction"
  },
  "readiness": {
    "clarity": { "score": <0-100>, "label": "Clarity", "why": "2 sentences explaining the score", "suggestion": "1 concrete improvement suggestion" },
    "audience": { "score": <0-100>, "label": "Audience", "why": "2 sentences", "suggestion": "1 concrete suggestion" },
    "differentiation": { "score": <0-100>, "label": "Differentiation", "why": "2 sentences", "suggestion": "1 concrete suggestion" },
    "execution": { "score": <0-100>, "label": "Execution", "why": "2 sentences", "suggestion": "1 concrete suggestion" },
    "overall": <average of four scores>
  }
}

IDEA: ${idea}
${contextStr ? `\nADDITIONAL CONTEXT:\n${contextStr}` : ''}

Be specific, insightful, and honest. Scores should reflect genuine analysis, not false optimism.`
}

// ─── Generate Brand ───────────────────────────────────────────
export function buildBrandPrompt(ideaDna: unknown): string {
  return `${FORGE_CONTEXT}

Based on this Idea DNA, generate a complete brand blueprint as JSON:
{
  "nameDirection": ["5 brand name ideas — short, memorable, relevant"],
  "taglineIdeas": ["4 tagline options — concise, powerful, memorable"],
  "brandPersonality": "3 sentences on brand personality and tone of voice",
  "positioning": "2-3 sentence positioning statement",
  "visualDirection": "3-4 sentences describing visual aesthetic and direction",
  "colorDirection": {
    "primary": "<hex color code>",
    "secondary": "<hex color code>",
    "accent": "<hex color code>",
    "rationale": "2 sentences explaining color choices"
  },
  "typographyDirection": "2-3 sentences on typography approach"
}

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Product ─────────────────────────────────────────
export function buildProductPrompt(ideaDna: unknown): string {
  return `${FORGE_CONTEXT}

Generate a product strategy blueprint as JSON:
{
  "coreProduct": "1-2 sentences describing the core product/service",
  "targetUsers": ["4-6 specific user segments as short strings"],
  "valueProposition": "1 powerful sentence — the core value delivered",
  "coreFeatures": [
    { "name": "Feature Name", "description": "2 sentences", "priority": "high|medium|low" }
  ],
  "userJourney": [
    { "stage": "Stage Name", "action": "What the user does", "emotion": "How they feel" }
  ]
}
Include 5 core features and 5 journey stages.

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Website ─────────────────────────────────────────
export function buildWebsitePrompt(ideaDna: unknown): string {
  return `${FORGE_CONTEXT}

Generate a website architecture blueprint as JSON:
{
  "structure": "2 sentences describing the overall website structure and approach",
  "pages": [
    { "name": "Page Name", "purpose": "1 sentence", "sections": ["Section 1", "Section 2", "Section 3"] }
  ],
  "homepageSections": ["8 homepage sections in order from top to bottom"],
  "navigation": ["5-6 navigation items"],
  "ctaStrategy": "2-3 sentences on CTA strategy throughout the site",
  "uxDirection": "2-3 sentences on UX approach and design principles"
}
Include 5 pages.

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Content ─────────────────────────────────────────
export function buildContentPrompt(ideaDna: unknown, platforms: string[]): string {
  return `${FORGE_CONTEXT}

Generate a content strategy as JSON for platforms: ${platforms.join(', ')}:
{
  "platforms": ${JSON.stringify(platforms)},
  "contentPillars": [
    { "name": "Pillar Name", "description": "2 sentences", "examples": ["Example 1", "Example 2", "Example 3"] }
  ],
  "postIdeas": [
    { "platform": "<one of: instagram|youtube|linkedin|website|ads>", "format": "Post format", "headline": "Post headline", "concept": "2 sentences", "hook": "Opening hook or null" }
  ],
  "reelConcepts": ["4 video/reel concepts as single strings"],
  "campaignIdeas": ["3 campaign ideas"],
  "launchIdeas": ["4 launch content ideas"]
}
Include 3 content pillars and 5-8 post ideas across the selected platforms.

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Marketing ───────────────────────────────────────
export function buildMarketingPrompt(ideaDna: unknown): string {
  return `${FORGE_CONTEXT}

Generate a marketing strategy as JSON:
{
  "targetAudience": "3 sentences profiling the target audience",
  "positioning": "1-2 sentence positioning statement",
  "launchStrategy": "3-4 sentences on launch approach and sequencing",
  "channels": [
    { "name": "Channel", "priority": "primary|secondary", "rationale": "1-2 sentences" }
  ],
  "campaignConcepts": [
    { "name": "Campaign Name", "hook": "The hook/angle", "channels": ["channel1"], "concept": "2 sentences" }
  ],
  "initialActionPlan": ["6-8 specific action items as strings"]
}

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Roadmap ─────────────────────────────────────────
export function buildRoadmapPrompt(ideaDna: unknown): string {
  return `${FORGE_CONTEXT}

Generate a launch roadmap as JSON:
{
  "now": [
    { "title": "Action title", "description": "2 sentences", "timeframe": "Week X or Month X", "category": "brand|product|marketing|content|tech|ops" }
  ],
  "next": [ <same structure> ],
  "later": [ <same structure> ]
}
Include 4 items in NOW (immediate, first 2-4 weeks), 4 in NEXT (1-3 months), 4 in LATER (3-6 months).

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Creative Direction ──────────────────────────────
export function buildCreativeDirectionPrompt(ideaDna: unknown): string {
  return `${FORGE_CONTEXT}

Generate an evocative, visual creative direction moodboard as JSON:
{
  "mood": "1 evocative sentence capturing the visual mood and emotional feeling",
  "colorPalette": [
    { "hex": "#XXXXXX", "name": "COLOR NAME", "role": "Role in the palette", "usage": "Specific interface/visual usage" }
  ],
  "typographyDirection": "Overview of typographic tone and hierarchy",
  "typography": {
    "headingStyle": "Precise font weight, tracking, case, and display style for headlines",
    "bodyTextStyle": "Font family, line-height, and rhythm for body text",
    "typographyMood": "Overall typographic feeling (e.g. Disciplined Minimalist, Editorial Modern)",
    "fontCategories": ["Display Sans", "Geometric Sans", "Technical Mono"]
  },
  "imageDirection": "Overview of visual and photographic aesthetic",
  "imageDetails": {
    "photographyStyle": "e.g. Documentary realism, high tactile clarity, cinematic depth",
    "lightingDirection": "e.g. Directional chiaroscuro, natural golden side-light, obsidian shadows",
    "compositionStyle": "e.g. Architectural rule-of-thirds, disciplined framing, negative space",
    "subjectDirection": "e.g. Authentic artisans, raw materials, deliberate human focus",
    "backgroundDirection": "e.g. Matte slate surfaces, textured concrete, deep darkness"
  },
  "uiDirection": "Overview of digital UI principles",
  "uiDetails": {
    "layoutStyle": "e.g. Monolithic editorial grid with breathing room",
    "cardStyle": "e.g. Matte slate containers with 1px hairline border dividers",
    "buttonStyle": "e.g. High-contrast tactile buttons with focused electric blue glow",
    "spacingDirection": "e.g. 8pt baseline cadence with generous margins",
    "interactionStyle": "e.g. Responsive spring physics and subtle hover elevation"
  },
  "visualKeywords": ["10 evocative visual direction keywords"],
  "brandPersonality": ["6 personality trait words/phrases"]
}
Include 5 to 6 colors in the palette with actual valid hex codes.

IDEA DNA: ${JSON.stringify(ideaDna)}`
}

// ─── Generate Creative Image Prompt ───────────────────────────
export function buildVisualImagePrompt(input: {
  projectName?: string
  idea?: string
  industry?: string
  targetAudience?: string
  brandPersonality?: string[]
  colorPalette?: { name: string; hex: string }[]
  visualKeywords?: string[]
  imageDirection?: unknown
  uiDirection?: unknown
}): string {
  const idea = input.idea || 'Creative digital venture'
  const industry = input.industry ? `in the ${input.industry} domain` : ''
  const keywords = input.visualKeywords?.slice(0, 8).join(', ') || 'minimal, architectural, editorial'
  const colors = input.colorPalette?.map(c => `${c.name} (${c.hex})`).join(', ') || 'obsidian void, chalk white, electric blue'
  const personality = input.brandPersonality?.join(', ') || 'bold, authentic, refined'

  return [
    `Editorial photography capturing the visual essence of "${input.projectName || 'New Project'}" ${industry}.`,
    `Core concept: ${idea}.`,
    `Aesthetic tone: ${personality}. Visual atmosphere: ${keywords}.`,
    `Color palette guidance: Dominated by ${colors}. High optical contrast, deep shadows, and subtle ambient light streaks.`,
    `Stylistic direction: Cinematic documentary framing, natural texture, tactile materials (matte stone, dark glass, raw textile), disciplined architectural composition with deliberate negative space.`,
    `Negative constraints: Strictly no typography, no visible text or letters, no logos, no watermarks, no brand names, no stock photography smiles, no cheesy corporate office poses, no oversaturated plastic 3D renders, no warped artifacts.`
  ].join(' ')
}

// ─── Refine Section ───────────────────────────────────────────
export function buildRefinePrompt(
  section: string,
  currentContent: unknown,
  instruction: string,
  specialistRole?: string,
): string {
  const roleContext = specialistRole
    ? `You are operating as a ${specialistRole} specialist.`
    : ''

  return `${FORGE_CONTEXT}
${roleContext}

Refine the following ${section} content based on this instruction: "${instruction}"

Return the refined content in the EXACT SAME JSON structure as the input. Only change the content, not the structure.

CURRENT CONTENT:
${JSON.stringify(currentContent)}

Return ONLY the refined JSON object with the same structure.`
}
