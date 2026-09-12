// ============================================================
// CREAFTIQ FORGE — Gemini AI Client (Server-side only)
// The API key NEVER leaves this Cloud Functions environment.
// ============================================================
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as functions from 'firebase-functions'
import { getMockResponse } from './mock'

// ─── Detect mock mode ────────────────────────────────────────
function isMockMode(): boolean {
  const envVal = process.env.GEMINI_MOCK || functions.config().gemini?.mock || 'true'
  return envVal === 'true' || envVal === '1'
}

// ─── Strip markdown code fences ──────────────────────────────
function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```$/m, '')
    .trim()
}

// ─── Parse JSON safely ───────────────────────────────────────
function safeParseJSON(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    // Try stripping code fences and retry
    try {
      return JSON.parse(stripCodeFences(text))
    } catch {
      throw new Error('AI returned invalid JSON. Please try again.')
    }
  }
}

// ─── Call Gemini ─────────────────────────────────────────────
export async function callGemini(
  prompt: string,
  operation: string,
  input: unknown,
  systemInstruction?: string,
): Promise<unknown> {
  // Mock mode — return realistic test data
  if (isMockMode()) {
    console.log(`[FORGE] Mock mode active — returning mock data for: ${operation}`)
    return getMockResponse(operation, input)
  }

  const apiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key
  if (!apiKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'GEMINI_API_KEY is not configured. Run: firebase functions:config:set gemini.api_key=YOUR_KEY',
    )
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      systemInstruction: systemInstruction || `You are FORGE, an AI creative workspace built by CREAFTIQ. 
You analyze ideas and generate structured creative and digital blueprints.
Always respond with valid JSON only. No markdown, no explanations outside the JSON structure.`,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return safeParseJSON(text)
  } catch (err: unknown) {
    const error = err as Error & { status?: number }
    if (error.status === 429) {
      throw new functions.https.HttpsError('resource-exhausted', 'AI rate limit reached. Please wait a moment.')
    }
    if (error.status === 503 || error.status === 500) {
      throw new functions.https.HttpsError('unavailable', 'AI service temporarily unavailable.')
    }
    throw new functions.https.HttpsError('internal', error.message || 'AI generation failed.')
  }
}
