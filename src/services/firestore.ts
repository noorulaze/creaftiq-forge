// ============================================================
// CREAFTIQ FORGE — Firestore Service
// Structure: users/{userId}/projects/{projectId}
// Fields: projectName, originalIdea, industry, targetAudience,
//         mainGoal, ideaDNA, brand, product, website,
//         content, marketing, roadmap, creativeDirection,
//         createdAt, updatedAt
// ============================================================
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import type {
  Project,
  ProjectContext,
  ProjectOutputs,
  ProjectStatus,
  FirestoreProjectDoc,
  IdeaDNA,
  BrandOutput,
  ProductOutput,
  WebsiteOutput,
  ContentOutput,
  MarketingOutput,
  RoadmapOutput,
  CreativeDirectionOutput,
} from '@/types'

const LOCAL_PROJECTS_KEY = 'forge_local_projects'
const LOCAL_OUTPUTS_KEY = 'forge_local_outputs'

// ─── Helper: Local storage storage ───────────────────────────
function getLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROJECTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalProjects(projects: Project[]) {
  try {
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects))
  } catch {
    // Ignored
  }
}

// ─── Helper: convert Firestore doc to Project ────────────────
function docToProject(id: string, data: Record<string, unknown>, fallbackUid = 'user_demo_1'): Project {
  const uid = (data.uid as string) || fallbackUid
  const name = (data.projectName as string) || (data.name as string) || 'Untitled Project'
  const idea = (data.originalIdea as string) || (data.idea as string) || ''
  
  const context: ProjectContext = (data.context as ProjectContext) || {
    name,
    industry: (data.industry as string) || undefined,
    targetAudience: (data.targetAudience as string) || undefined,
    mainGoal: (data.mainGoal as string) || undefined,
  }

  const createdAt = (data.createdAt as { toDate?: () => Date })?.toDate?.() ||
    (typeof data.createdAt === 'string' ? new Date(data.createdAt) : new Date())
  const updatedAt = (data.updatedAt as { toDate?: () => Date })?.toDate?.() ||
    (typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : new Date())

  return {
    id,
    uid,
    name,
    idea,
    context,
    status: (data.status as ProjectStatus) || 'complete',
    createdAt,
    updatedAt,
    projectName: name,
    originalIdea: idea,
    industry: (data.industry as string) || context.industry,
    targetAudience: (data.targetAudience as string) || context.targetAudience,
    mainGoal: (data.mainGoal as string) || context.mainGoal,
    ideaDNA: (data.ideaDNA as IdeaDNA) || undefined,
    brand: (data.brand as BrandOutput) || undefined,
    product: (data.product as ProductOutput) || undefined,
    website: (data.website as WebsiteOutput) || undefined,
    content: (data.content as ContentOutput) || undefined,
    marketing: (data.marketing as MarketingOutput) || undefined,
    roadmap: (data.roadmap as RoadmapOutput) || undefined,
    creativeDirection: (data.creativeDirection as CreativeDirectionOutput) || undefined,
  }
}

// ─── Create Project ──────────────────────────────────────────
export async function createProject(
  uid: string,
  idea: string,
  context: ProjectContext,
): Promise<string> {
  const projectName = context.name || idea.slice(0, 40) + (idea.length > 40 ? '...' : '')
  const industry = context.industry || ''
  const targetAudience = context.targetAudience || ''
  const mainGoal = context.mainGoal || ''

  const projectPayload: Partial<FirestoreProjectDoc> & Record<string, unknown> = {
    projectName,
    originalIdea: idea,
    industry,
    targetAudience,
    mainGoal,
    ideaDNA: null,
    brand: null,
    product: null,
    website: null,
    content: null,
    marketing: null,
    roadmap: null,
    creativeDirection: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'draft',
    uid,
    name: projectName,
    idea,
    context,
  }

  try {
    // 1. Primary path: users/{userId}/projects
    const userProjectsRef = collection(db, 'users', uid, 'projects')
    const ref = await addDoc(userProjectsRef, projectPayload)
    
    // Also save to root projects collection for backward compatibility if desired
    try {
      await setDoc(doc(db, 'projects', ref.id), { ...projectPayload, uid })
    } catch {
      // Ignored
    }

    return ref.id
  } catch {
    // Fallback: local demo storage
    const id = 'proj_' + Date.now()
    const newProj: Project = {
      id,
      uid,
      name: projectName,
      idea,
      context,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      projectName,
      originalIdea: idea,
      industry,
      targetAudience,
      mainGoal,
    }
    const list = getLocalProjects()
    list.unshift(newProj)
    saveLocalProjects(list)
    return id
  }
}

// ─── Get User Projects (users/{userId}/projects) ─────────────
export async function getUserProjects(uid: string): Promise<Project[]> {
  try {
    const userProjectsRef = collection(db, 'users', uid, 'projects')
    const q = query(userProjectsRef, orderBy('updatedAt', 'desc'))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return snap.docs.map(d => docToProject(d.id, d.data() as Record<string, unknown>, uid))
    }

    // Fallback: try root projects collection
    const rootQ = query(collection(db, 'projects'), where('uid', '==', uid), orderBy('updatedAt', 'desc'))
    const rootSnap = await getDocs(rootQ)
    if (!rootSnap.empty) {
      return rootSnap.docs.map(d => docToProject(d.id, d.data() as Record<string, unknown>, uid))
    }

    return getLocalProjects().filter(p => p.uid === uid)
  } catch {
    return getLocalProjects().filter(p => p.uid === uid)
  }
}

// ─── Subscribe to User Projects (real-time) ──────────────────
export function subscribeToUserProjects(
  uid: string,
  callback: (projects: Project[]) => void,
): Unsubscribe {
  try {
    const userProjectsRef = collection(db, 'users', uid, 'projects')
    const q = query(userProjectsRef, orderBy('updatedAt', 'desc'))

    return onSnapshot(
      q,
      snap => {
        if (!snap.empty) {
          const projects = snap.docs.map(d => docToProject(d.id, d.data() as Record<string, unknown>, uid))
          callback(projects)
        } else {
          getUserProjects(uid).then(callback)
        }
      },
      () => {
        callback(getLocalProjects().filter(p => p.uid === uid))
      }
    )
  } catch {
    callback(getLocalProjects().filter(p => p.uid === uid))
    return () => {}
  }
}

// ─── Get Single Project ──────────────────────────────────────
export async function getProject(
  projectId: string,
  uid?: string,
): Promise<Project | null> {
  try {
    // 1. If uid provided, check users/{userId}/projects/{projectId}
    if (uid) {
      const userDocRef = doc(db, 'users', uid, 'projects', projectId)
      const userSnap = await getDoc(userDocRef)
      if (userSnap.exists()) {
        return docToProject(userSnap.id, userSnap.data() as Record<string, unknown>, uid)
      }
    }

    // 2. Check root collection
    const rootSnap = await getDoc(doc(db, 'projects', projectId))
    if (rootSnap.exists()) {
      return docToProject(rootSnap.id, rootSnap.data() as Record<string, unknown>, uid)
    }

    // 3. Fallback to local storage
    return getLocalProjects().find(p => p.id === projectId) || null
  } catch {
    return getLocalProjects().find(p => p.id === projectId) || null
  }
}

// ─── Update Project ──────────────────────────────────────────
export async function updateProject(
  projectId: string,
  data: Partial<FirestoreProjectDoc> & Record<string, unknown>,
  uid?: string,
): Promise<void> {
  const updatePayload = {
    ...data,
    updatedAt: serverTimestamp(),
  }

  let updated = false

  if (uid) {
    try {
      const userDocRef = doc(db, 'users', uid, 'projects', projectId)
      await updateDoc(userDocRef, updatePayload)
      updated = true
    } catch {
      try {
        const userDocRef = doc(db, 'users', uid, 'projects', projectId)
        await setDoc(userDocRef, updatePayload, { merge: true })
        updated = true
      } catch {
        // Continue to fallback
      }
    }
  }

  // Also update root projects collection if present
  try {
    const rootDocRef = doc(db, 'projects', projectId)
    await updateDoc(rootDocRef, updatePayload)
    updated = true
  } catch {
    // Ignored
  }

  // Local fallback
  const list = getLocalProjects()
  const p = list.find(x => x.id === projectId)
  if (p) {
    Object.assign(p, data, { updatedAt: new Date() })
    saveLocalProjects(list)
  } else if (!updated) {
    list.unshift({
      id: projectId,
      uid: uid || 'user_demo_1',
      name: (data.projectName as string) || (data.name as string) || 'Project',
      idea: (data.originalIdea as string) || (data.idea as string) || '',
      context: (data.context as ProjectContext) || {},
      status: (data.status as ProjectStatus) || 'complete',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    saveLocalProjects(list)
  }
}

// ─── Update Project Status ───────────────────────────────────
export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
  uid?: string,
): Promise<void> {
  await updateProject(projectId, { status }, uid)
}

// ─── Rename Project ──────────────────────────────────────────
export async function renameProject(
  projectId: string,
  name: string,
  uid?: string,
): Promise<void> {
  await updateProject(projectId, { projectName: name, name }, uid)
}

// ─── Delete Project ──────────────────────────────────────────
export async function deleteProject(
  projectId: string,
  uid?: string,
): Promise<void> {
  let deletedFromFirestore = false

  if (uid) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'projects', projectId))
      deletedFromFirestore = true
    } catch {
      // Continue
    }
  }

  try {
    await deleteDoc(doc(db, 'projects', projectId))
    deletedFromFirestore = true
  } catch {
    // Continue
  }

  const list = getLocalProjects().filter(x => x.id !== projectId)
  saveLocalProjects(list)

  if (isFirebaseConfigured && uid && !deletedFromFirestore) {
    throw new Error('Failed to delete project from Firestore.')
  }
}

// ─── Duplicate Project ────────────────────────────────────────
export async function duplicateProject(
  sourceProjectId: string,
  uid?: string,
): Promise<string> {
  const existing = await getProject(sourceProjectId, uid)
  if (!existing) {
    throw new Error('Original project not found.')
  }

  const duplicatedName = `${existing.name || existing.projectName || 'Project'} (Copy)`
  const newPayload: Partial<FirestoreProjectDoc> & Record<string, unknown> = {
    projectName: duplicatedName,
    originalIdea: existing.idea || existing.originalIdea || '',
    industry: existing.context?.industry || existing.industry || '',
    targetAudience: existing.context?.targetAudience || existing.targetAudience || '',
    mainGoal: existing.context?.mainGoal || existing.mainGoal || '',
    ideaDNA: existing.ideaDNA || null,
    brand: existing.brand || null,
    product: existing.product || null,
    website: existing.website || null,
    content: existing.content || null,
    marketing: existing.marketing || null,
    roadmap: existing.roadmap || null,
    creativeDirection: existing.creativeDirection || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: existing.status || 'complete',
    uid: uid || existing.uid,
    name: duplicatedName,
    idea: existing.idea || existing.originalIdea || '',
    context: {
      ...existing.context,
      name: duplicatedName,
    },
  }

  if (uid) {
    try {
      const userProjectsRef = collection(db, 'users', uid, 'projects')
      const ref = await addDoc(userProjectsRef, newPayload)
      try {
        await setDoc(doc(db, 'projects', ref.id), { ...newPayload, uid })
      } catch {
        // Ignored
      }
      return ref.id
    } catch {
      // Fallback
    }
  }

  const newId = 'proj_' + Date.now()
  const newProj: Project = {
    id: newId,
    uid: uid || existing.uid || 'user_demo_1',
    name: duplicatedName,
    idea: existing.idea,
    context: { ...existing.context, name: duplicatedName },
    status: existing.status || 'complete',
    createdAt: new Date(),
    updatedAt: new Date(),
    projectName: duplicatedName,
    originalIdea: existing.idea,
    industry: existing.context?.industry,
    targetAudience: existing.context?.targetAudience,
    mainGoal: existing.context?.mainGoal,
    ideaDNA: existing.ideaDNA,
    brand: existing.brand,
    product: existing.product,
    website: existing.website,
    content: existing.content,
    marketing: existing.marketing,
    roadmap: existing.roadmap,
    creativeDirection: existing.creativeDirection,
  }
  const list = getLocalProjects()
  list.unshift(newProj)
  saveLocalProjects(list)

  // Also duplicate outputs in local storage
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_OUTPUTS_KEY) || '{}')
    if (all[sourceProjectId]) {
      all[newId] = { ...all[sourceProjectId] }
      localStorage.setItem(LOCAL_OUTPUTS_KEY, JSON.stringify(all))
    }
  } catch {
    // Ignored
  }

  return newId
}


// ─── Save Project Blueprint / Outputs ────────────────────────
export async function saveProjectOutputs(
  projectId: string,
  outputs: Partial<ProjectOutputs>,
  uid?: string,
  metadata?: {
    projectName?: string
    originalIdea?: string
    industry?: string
    targetAudience?: string
    mainGoal?: string
  },
): Promise<void> {
  const fieldsToSave: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  }

  if (metadata?.projectName) fieldsToSave.projectName = metadata.projectName
  if (metadata?.originalIdea) fieldsToSave.originalIdea = metadata.originalIdea
  if (metadata?.industry) fieldsToSave.industry = metadata.industry
  if (metadata?.targetAudience) fieldsToSave.targetAudience = metadata.targetAudience
  if (metadata?.mainGoal) fieldsToSave.mainGoal = metadata.mainGoal

  if (outputs.ideaDna !== undefined) fieldsToSave.ideaDNA = outputs.ideaDna
  if (outputs.brand !== undefined) fieldsToSave.brand = outputs.brand
  if (outputs.product !== undefined) fieldsToSave.product = outputs.product
  if (outputs.website !== undefined) fieldsToSave.website = outputs.website
  if (outputs.content !== undefined) fieldsToSave.content = outputs.content
  if (outputs.marketing !== undefined) fieldsToSave.marketing = outputs.marketing
  if (outputs.roadmap !== undefined) fieldsToSave.roadmap = outputs.roadmap
  if (outputs.creativeDirection !== undefined) fieldsToSave.creativeDirection = outputs.creativeDirection

  let savedToFirestore = false

  if (uid) {
    try {
      const userProjectRef = doc(db, 'users', uid, 'projects', projectId)
      await setDoc(userProjectRef, fieldsToSave, { merge: true })
      savedToFirestore = true
    } catch {
      // Continue
    }
  }

  try {
    const outputsRef = doc(db, 'projects', projectId, 'outputs', 'main')
    await setDoc(outputsRef, { ...outputs, updatedAt: serverTimestamp() }, { merge: true })
    savedToFirestore = true
  } catch {
    // Ignored
  }

  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_OUTPUTS_KEY) || '{}')
    all[projectId] = { ...(all[projectId] || {}), ...outputs }
    localStorage.setItem(LOCAL_OUTPUTS_KEY, JSON.stringify(all))
  } catch {
    // Ignored
  }

  if (isFirebaseConfigured && uid && !savedToFirestore) {
    throw new Error('Failed to persist project outputs to Firestore.')
  }
}

// ─── Get Project Outputs ─────────────────────────────────────
export async function getProjectOutputs(
  projectId: string,
  uid?: string,
): Promise<ProjectOutputs | null> {
  try {
    if (uid) {
      const userSnap = await getDoc(doc(db, 'users', uid, 'projects', projectId))
      if (userSnap.exists()) {
        const data = userSnap.data() as Record<string, unknown>
        if (data.ideaDNA || data.brand || data.product || data.website) {
          return {
            ideaDna: (data.ideaDNA as IdeaDNA) || undefined,
            brand: (data.brand as BrandOutput) || undefined,
            product: (data.product as ProductOutput) || undefined,
            website: (data.website as WebsiteOutput) || undefined,
            content: (data.content as ContentOutput) || undefined,
            marketing: (data.marketing as MarketingOutput) || undefined,
            roadmap: (data.roadmap as RoadmapOutput) || undefined,
            creativeDirection: (data.creativeDirection as CreativeDirectionOutput) || undefined,
          }
        }
      }
    }

    const snap = await getDoc(doc(db, 'projects', projectId, 'outputs', 'main'))
    if (snap.exists()) return snap.data() as ProjectOutputs

    const all = JSON.parse(localStorage.getItem(LOCAL_OUTPUTS_KEY) || '{}')
    return all[projectId] || null
  } catch {
    try {
      const all = JSON.parse(localStorage.getItem(LOCAL_OUTPUTS_KEY) || '{}')
      return all[projectId] || null
    } catch {
      return null
    }
  }
}

// ─── Subscribe to Project Outputs (real-time) ────────────────
export function subscribeToProjectOutputs(
  projectId: string,
  callback: (outputs: ProjectOutputs | null) => void,
  uid?: string,
): Unsubscribe {
  try {
    if (uid) {
      return onSnapshot(
        doc(db, 'users', uid, 'projects', projectId),
        snap => {
          if (snap.exists()) {
            const data = snap.data() as Record<string, unknown>
            if (data.ideaDNA || data.brand || data.product || data.website) {
              callback({
                ideaDna: (data.ideaDNA as IdeaDNA) || undefined,
                brand: (data.brand as BrandOutput) || undefined,
                product: (data.product as ProductOutput) || undefined,
                website: (data.website as WebsiteOutput) || undefined,
                content: (data.content as ContentOutput) || undefined,
                marketing: (data.marketing as MarketingOutput) || undefined,
                roadmap: (data.roadmap as RoadmapOutput) || undefined,
                creativeDirection: (data.creativeDirection as CreativeDirectionOutput) || undefined,
              })
              return
            }
          }
          getProjectOutputs(projectId, uid).then(callback)
        },
        () => {
          getProjectOutputs(projectId, uid).then(callback)
        }
      )
    }

    return onSnapshot(
      doc(db, 'projects', projectId, 'outputs', 'main'),
      snap => callback(snap.exists() ? (snap.data() as ProjectOutputs) : null),
      () => {
        getProjectOutputs(projectId).then(callback)
      }
    )
  } catch {
    getProjectOutputs(projectId, uid).then(callback)
    return () => {}
  }
}

// ─── Save Website Builder Specification ──────────────────────
export async function saveWebsiteBuilderRequest(
  projectId: string,
  request: import('@/types').WebsiteBuilderRequest,
  uid?: string,
): Promise<void> {
  const fieldsToSave: Record<string, unknown> = {
    websiteRequest: request,
    updatedAt: serverTimestamp(),
  }

  let saved = false
  if (uid) {
    try {
      const userProjectRef = doc(db, 'users', uid, 'projects', projectId)
      await setDoc(userProjectRef, fieldsToSave, { merge: true })
      saved = true
    } catch {
      // Continue to fallback
    }
  }

  try {
    const projRef = doc(db, 'projects', projectId)
    await setDoc(projRef, fieldsToSave, { merge: true })
    saved = true
  } catch {
    // Ignored
  }

  try {
    const key = `forge_website_spec_${projectId}`
    localStorage.setItem(key, JSON.stringify(request))
  } catch {
    // Ignored
  }

  if (isFirebaseConfigured && uid && !saved) {
    // If Firebase is configured, non-fatal fallback
    console.warn('Could not persist websiteRequest to Firestore, kept in local storage')
  }
}

