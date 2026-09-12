import * as functions from 'firebase-functions'
import { callGemini } from '../utils/gemini'
import { buildContentPrompt } from '../prompts'
import { validateContentInput } from '../utils/validate'

export const generateContent = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.')
  const { ideaDna, platforms } = validateContentInput(data)
  return callGemini(buildContentPrompt(ideaDna, platforms), 'generateContent', data)
})
