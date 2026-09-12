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
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'REPLACE_WITH_YOUR_API_KEY',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'REPLACE_WITH_YOUR_AUTH_DOMAIN',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'REPLACE_WITH_YOUR_PROJECT_ID',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'REPLACE_WITH_YOUR_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'REPLACE_WITH_YOUR_SENDER_ID',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || 'REPLACE_WITH_YOUR_APP_ID',
}

// Initialize Firebase (avoid duplicate init in hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const fns  = getFunctions(app, 'us-central1')

export default app
