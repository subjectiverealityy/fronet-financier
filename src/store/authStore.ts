import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { trackLoginSuccess, trackLogout } from '@/lib/ga'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        trackLoginSuccess()
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        trackLogout()
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: 'fronet-auth' }
  )
)
