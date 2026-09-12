import * as functions from 'firebase-functions'
import { callGemini } from '../utils/gemini'
import { buildWebsitePrompt } from '../prompts'
import { validateBlueprintInput } from '../utils/validate'

export const generateWebsite = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.')
  const { ideaDna } = validateBlueprintInput(data)
  return callGemini(buildWebsitePrompt(ideaDna), 'generateWebsite', data)
})
