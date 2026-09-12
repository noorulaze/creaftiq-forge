import * as functions from 'firebase-functions'
import { callGemini } from '../utils/gemini'
import { buildRefinePrompt } from '../prompts'
import { validateRefineInput } from '../utils/validate'

export const refineSection = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.')
  const { section, currentContent, instruction, specialistRole } = validateRefineInput(data)
  const prompt = buildRefinePrompt(section, currentContent, instruction, specialistRole)
  return callGemini(prompt, 'refineSection', data)
})
