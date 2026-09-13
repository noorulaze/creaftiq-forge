// ============================================================
// CREAFTIQ FORGE — Firestore Service
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
import { db } from './firebase'
import type { Project, ProjectContext, ProjectOutputs, ProjectStatus } from '@/types'

// ─── Helper: convert Firestore doc to Project ────────────────
function docToProject(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    uid: data.uid as string,
    name: (data.name as string) || 'Untitled Project',
    idea: (data.idea as string) || '',
    context: (data.context as ProjectContext) || {},
    status: (data.status as ProjectStatus) || 'draft',
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
    updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
  }
}

const LOCAL_PROJECTS_KEY = 'forge_local_projects'
const LOCAL_OUTPUTS_KEY = 'forge_local_outputs'

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

// ─── Create Project ──────────────────────────────────────────
export async function createProject(
  uid: string,
  idea: string,
  context: ProjectContext,
): Promise<string> {
  const name = context.name || idea.slice(0, 40) + (idea.length > 40 ? '...' : '')
  try {
    const ref = await addDoc(collection(db, 'projects'), {
      uid,
      name,
      idea,
      context,
      status: 'draft' satisfies ProjectStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  } catch {
    const id = 'proj_' + Date.now()
    const newProj: Project = {
      id,
      uid,
      name,
      idea,
      context,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const list = getLocalProjects()
    list.unshift(newProj)
    saveLocalProjects(list)
    return id
  }
}

// ─── Get User Projects ───────────────────────────────────────
export async function getUserProjects(uid: string): Promise<Project[]> {
  try {
    const q = query(
      collection(db, 'projects'),
      where('uid', '==', uid),
      orderBy('updatedAt', 'desc'),
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => docToProject(d.id, d.data() as Record<string, unknown>))
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
    const q = query(
      collection(db, 'projects'),
      where('uid', '==', uid),
      orderBy('updatedAt', 'desc'),
    )
    return onSnapshot(q, snap => {
      const projects = snap.docs.map(d => docToProject(d.id, d.data() as Record<string, unknown>))
      callback(projects)
    }, () => {
      callback(getLocalProjects().filter(p => p.uid === uid))
    })
  } catch {
    callback(getLocalProjects().filter(p => p.uid === uid))
    return () => {}
  }
}

// ─── Get Single Project ──────────────────────────────────────
export async function getProject(projectId: string): Promise<Project | null> {
  try {
    const snap = await getDoc(doc(db, 'projects', projectId))
    if (!snap.exists()) return null
    return docToProject(snap.id, snap.data() as Record<string, unknown>)
  } catch {
    return getLocalProjects().find(p => p.id === projectId) || null
  }
}

// ─── Update Project Status ───────────────────────────────────
export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
): Promise<void> {
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch {
    const list = getLocalProjects()
    const p = list.find(x => x.id === projectId)
    if (p) {
      p.status = status
      p.updatedAt = new Date()
      saveLocalProjects(list)
    }
  }
}

// ─── Rename Project ──────────────────────────────────────────
export async function renameProject(projectId: string, name: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      name,
      updatedAt: serverTimestamp(),
    })
  } catch {
    const list = getLocalProjects()
    const p = list.find(x => x.id === projectId)
    if (p) {
      p.name = name
      p.updatedAt = new Date()
      saveLocalProjects(list)
    }
  }
}

// ─── Delete Project ──────────────────────────────────────────
export async function deleteProject(projectId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'projects', projectId))
  } catch {
    const list = getLocalProjects().filter(x => x.id !== projectId)
    saveLocalProjects(list)
  }
}

// ─── Save Project Outputs ────────────────────────────────────
export async function saveProjectOutputs(
  projectId: string,
  outputs: Partial<ProjectOutputs>,
): Promise<void> {
  try {
    const outputsRef = doc(db, 'projects', projectId, 'outputs', 'main')
    await updateDoc(outputsRef, {
      ...outputs,
      updatedAt: serverTimestamp(),
    }).catch(async () => {
      await setDoc(outputsRef, {
        ...outputs,
        updatedAt: serverTimestamp(),
      })
    })

  } catch {
    // Local storage
    try {
      const all = JSON.parse(localStorage.getItem(LOCAL_OUTPUTS_KEY) || '{}')
      all[projectId] = { ...(all[projectId] || {}), ...outputs }
      localStorage.setItem(LOCAL_OUTPUTS_KEY, JSON.stringify(all))
    } catch {
      // Ignored
    }
  }
}

// ─── Get Project Outputs ─────────────────────────────────────
export async function getProjectOutputs(projectId: string): Promise<ProjectOutputs | null> {
  try {
    const snap = await getDoc(doc(db, 'projects', projectId, 'outputs', 'main'))
    if (!snap.exists()) return null
    return snap.data() as ProjectOutputs
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
): Unsubscribe {
  try {
    return onSnapshot(
      doc(db, 'projects', projectId, 'outputs', 'main'),
      snap => callback(snap.exists() ? (snap.data() as ProjectOutputs) : null),
      () => {
        getProjectOutputs(projectId).then(callback)
      }
    )
  } catch {
    getProjectOutputs(projectId).then(callback)
    return () => {}
  }
}
