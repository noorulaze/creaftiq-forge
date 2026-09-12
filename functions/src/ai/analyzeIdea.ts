import * as functions from 'firebase-functions'
import { callGemini } from '../utils/gemini'
import { buildAnalyzeIdeaPrompt } from '../prompts'
import { validateIdeaInput } from '../utils/validate'

export const analyzeIdea = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in to use FORGE.')
  }
  const { idea, context: ctx } = validateIdeaInput(data)
  const prompt = buildAnalyzeIdeaPrompt(idea, ctx)
  return callGemini(prompt, 'analyzeIdea', data)
})
