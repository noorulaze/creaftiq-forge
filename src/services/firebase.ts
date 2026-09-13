// ============================================================
// CREAFTIQ FORGE — Firebase Initialization
// ============================================================
// Replace the config values below with your Firebase project config.
// Get them from: Firebase Console → Project Settings → Your Apps
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '',
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'REPLACE_WITH_YOUR_API_KEY' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'REPLACE_WITH_YOUR_PROJECT_ID'
)

// Fallback dummy config if not yet set so initializeApp doesn't throw on startup
const effectiveConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: 'demo-api-key',
      authDomain: 'demo-project.firebaseapp.com',
      projectId: 'demo-project',
      storageBucket: 'demo-project.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:demo',
    }

// Initialize Firebase (avoid duplicate init in hot reload)
const app = getApps().length === 0 ? initializeApp(effectiveConfig) : getApp()

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const fns  = getFunctions(app, 'us-central1')

export default app

