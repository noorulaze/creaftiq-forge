// ============================================================
// CREAFTIQ FORGE — Auth Store (Zustand)
// ============================================================
import { create } from 'zustand'
import type { User } from 'firebase/auth'
import { onAuthChange } from '@/services/auth'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => () => void  // returns unsubscribe
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initialize: () => {
    const unsubscribe = onAuthChange((user) => {
      set({ user, loading: false, initialized: true })
    })
    return unsubscribe
  },
}))
