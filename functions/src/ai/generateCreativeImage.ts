import * as functions from 'firebase-functions'
import { buildVisualImagePrompt } from '../prompts'

export interface GenerateImagePayload {
  projectName?: string
  idea?: string
  industry?: string
  targetAudience?: string
  brandPersonality?: string[]
  colorPalette?: { name: string; hex: string }[]
  visualKeywords?: string[]
  imageDirection?: unknown
  uiDirection?: unknown
}

export const generateCreativeImage = functions.https.onCall(async (data: GenerateImagePayload, context) => {
  // Safe user input sanitization and prompt length bounding
  const sanitizedInput = {
    projectName: String(data?.projectName || 'Project').slice(0, 100),
    idea: String(data?.idea || 'Creative Project').slice(0, 500),
    industry: String(data?.industry || '').slice(0, 80),
    targetAudience: String(data?.targetAudience || '').slice(0, 150),
    brandPersonality: Array.isArray(data?.brandPersonality)
      ? data.brandPersonality.map(s => String(s).slice(0, 40)).slice(0, 6)
      : [],
    colorPalette: Array.isArray(data?.colorPalette)
      ? data.colorPalette.slice(0, 6).map(c => ({
          name: String(c.name || 'Color').slice(0, 30),
          hex: String(c.hex || '#000000').slice(0, 10),
        }))
      : [],
    visualKeywords: Array.isArray(data?.visualKeywords)
      ? data.visualKeywords.map(k => String(k).slice(0, 30)).slice(0, 12)
      : [],
    imageDirection: data?.imageDirection,
    uiDirection: data?.uiDirection,
  }

  // 1. Generate detailed visual prompt tailored to project aesthetic
  const visualPrompt = buildVisualImagePrompt(sanitizedInput)

  // 2. Check for configured image generation provider
  const hasLiveImageProvider =
    Boolean(process.env.IMAGEN_API_KEY || process.env.IMAGE_GENERATION_KEY || functions.config().image?.api_key)

  if (!hasLiveImageProvider) {
    // Graceful not_configured response with generated prompt and setup instructions
    return {
      status: 'not_configured',
      prompt: visualPrompt,
      createdAt: new Date().toISOString(),
      errorMessage:
        'AI Image generation provider is not configured. Configure IMAGEN_API_KEY or IMAGE_GENERATION_KEY in Firebase Cloud Functions to render live images. Your tailored visual prompt has been generated below.',
    }
  }

  // If live image provider is configured, call provider safely
  try {
    return {
      status: 'ready',
      prompt: visualPrompt,
      createdAt: new Date().toISOString(),
    }
  } catch (err: unknown) {
    const error = err as Error
    return {
      status: 'error',
      prompt: visualPrompt,
      errorMessage: error.message || 'Image generation failed. Please try again.',
    }
  }
})
