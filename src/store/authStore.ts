import { create } from 'zustand'
import { trackLoginSuccess, trackLogout } from '@/lib/ga'
import { clearTokens } from '@/lib/session'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isRestoring: boolean // true until the startup session check finishes
  setUser: (user: User) => void
  updateUser: (changes: Partial<User>) => void
  restoreUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isRestoring: true,
  setUser: (user) => {
    trackLoginSuccess()
    set({ user, isAuthenticated: true })
  },
  // Edits to the signed-in user (e.g. profile save).
  updateUser: (changes) => {
    set((state) => (state.user ? { user: { ...state.user, ...changes } } : {}))
  },
  // Startup restore: while the restore was still in flight, keep that session instead of overwriting it.
  restoreUser: (user) => {
    set((state) =>
      state.isAuthenticated
        ? { isRestoring: false }
        : { user, isAuthenticated: user !== null, isRestoring: false }
    )
  },
  logout: () => {
    trackLogout()
    clearTokens()
    set({ user: null, isAuthenticated: false })
  },
}))
