// ============================================================
// CREAFTIQ FORGE — Authentication Service
// ============================================================
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase'

const DEMO_USER_KEY = 'forge_demo_user'

function getLocalDemoUser(): User | null {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      uid: parsed.uid,
      email: parsed.email,
      displayName: parsed.displayName,
    } as unknown as User
  } catch {
    return null
  }
}

// ─── Register ────────────────────────────────────────────────
export async function registerUser(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const user = credential.user

    await updateProfile(user, { displayName })

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        createdAt: serverTimestamp(),
      })
    } catch {
      // Ignored if local demo
    }

    return user
  } catch (error: unknown) {
    if (isFirebaseConfigured) {
      throw error
    }
    // Fallback: create a local demo session if Firebase is not yet configured
    const mockUser = {
      uid: 'user_' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
    } as unknown as User
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
      uid: (mockUser as any).uid,
      email: (mockUser as any).email,
      displayName: (mockUser as any).displayName,
    }))
    authSubscribers.forEach(cb => cb(mockUser))
    return mockUser
  }
}

// ─── Login ────────────────────────────────────────────────────
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  } catch (error: unknown) {
    if (isFirebaseConfigured) {
      throw error
    }
    // Fallback: local demo login when Firebase is not configured
    const mockUser = {
      uid: 'user_demo_1',
      email,
      displayName: email.split('@')[0] || 'Demo Creator',
    } as unknown as User
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
      uid: (mockUser as any).uid,
      email: (mockUser as any).email,
      displayName: (mockUser as any).displayName,
    }))
    authSubscribers.forEach(cb => cb(mockUser))
    return mockUser
  }
}


// ─── Logout ───────────────────────────────────────────────────
export async function logoutUser(): Promise<void> {
  localStorage.removeItem(DEMO_USER_KEY)
  authSubscribers.forEach(cb => cb(null))
  try {
    await signOut(auth)
  } catch {
    // Ignored
  }
}

// ─── Auth State Listener ─────────────────────────────────────
const authSubscribers: Array<(u: User | null) => void> = []

export function onAuthChange(callback: (user: User | null) => void) {
  authSubscribers.push(callback)
  const local = getLocalDemoUser()
  if (local) {
    callback(local)
  } else {
    // Initial check
    try {
      return onAuthStateChanged(auth, (u) => {
        if (!getLocalDemoUser()) callback(u)
      })
    } catch {
      callback(null)
    }
  }

  return () => {
    const idx = authSubscribers.indexOf(callback)
    if (idx !== -1) authSubscribers.splice(idx, 1)
  }
}
