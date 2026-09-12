import * as functions from 'firebase-functions'

// ─── Validate analyzeIdea input ───────────────────────────────
export function validateIdeaInput(data: unknown): { idea: string; context: Record<string, string> } {
  if (!data || typeof data !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'Request body must be an object.')
  }
  const d = data as Record<string, unknown>
  if (!d.idea || typeof d.idea !== 'string' || d.idea.trim().length < 3) {
    throw new functions.https.HttpsError('invalid-argument', 'Idea must be a string of at least 3 characters.')
  }
  if (d.idea.trim().length > 2000) {
    throw new functions.https.HttpsError('invalid-argument', 'Idea must be under 2000 characters.')
  }
  return {
    idea: d.idea.trim(),
    context: (d.context as Record<string, string>) || {},
  }
}

// ─── Validate blueprint generation input ──────────────────────
export function validateBlueprintInput(data: unknown): { ideaDna: unknown } {
  if (!data || typeof data !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'Request body must be an object.')
  }
  const d = data as Record<string, unknown>
  if (!d.ideaDna || typeof d.ideaDna !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'ideaDna is required.')
  }
  return { ideaDna: d.ideaDna }
}

// ─── Validate refine input ────────────────────────────────────
export function validateRefineInput(data: unknown): { section: string; currentContent: unknown; instruction: string; specialistRole?: string } {
  if (!data || typeof data !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'Request body must be an object.')
  }
  const d = data as Record<string, unknown>
  if (!d.section || typeof d.section !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'section is required.')
  }
  if (!d.instruction || typeof d.instruction !== 'string' || d.instruction.trim().length < 2) {
    throw new functions.https.HttpsError('invalid-argument', 'instruction must be a non-empty string.')
  }
  return {
    section:        d.section,
    currentContent: d.currentContent,
    instruction:    d.instruction.trim(),
    specialistRole: d.specialistRole as string | undefined,
  }
}

// ─── Validate content input (with platforms) ──────────────────
export function validateContentInput(data: unknown): { ideaDna: unknown; platforms: string[] } {
  if (!data || typeof data !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'Request body must be an object.')
  }
  const d = data as Record<string, unknown>
  if (!d.ideaDna || typeof d.ideaDna !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'ideaDna is required.')
  }
  const platforms = Array.isArray(d.platforms) ? d.platforms as string[] : ['instagram', 'website']
  return { ideaDna: d.ideaDna, platforms }
}
