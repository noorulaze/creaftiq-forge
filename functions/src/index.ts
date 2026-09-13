// ============================================================
// CREAFTIQ FORGE — Cloud Functions Entry Point
// All exports register Firebase Cloud Functions.
// ============================================================
import * as admin from 'firebase-admin'

admin.initializeApp()

// ─── AI Functions ────────────────────────────────────────────
export { analyzeIdea }             from './ai/analyzeIdea'
export { generateBrand }           from './ai/generateBrand'
export { generateProduct }         from './ai/generateProduct'
export { generateWebsite }         from './ai/generateWebsite'
export { generateContent }         from './ai/generateContent'
export { generateMarketing }       from './ai/generateMarketing'
export { generateRoadmap }         from './ai/generateRoadmap'
export { generateCreativeDirection } from './ai/generateCreativeDirection'
export { generateCreativeImage }     from './ai/generateCreativeImage'
export { generateCreativeVideo }     from './ai/generateCreativeVideo'
export { refineSection }           from './ai/refineSection'
