import * as functions from 'firebase-functions'
import { callGemini } from '../utils/gemini'
import { buildBrandPrompt } from '../prompts'
import { validateBlueprintInput } from '../utils/validate'

export const generateBrand = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.')
  const { ideaDna } = validateBlueprintInput(data)
  return callGemini(buildBrandPrompt(ideaDna), 'generateBrand', data)
})
