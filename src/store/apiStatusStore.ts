import { create } from 'zustand'

interface ApiStatusState {
  hasNetworkFailure: boolean
  reportNetworkFailure: () => void
  clearNetworkFailure: () => void
}

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  hasNetworkFailure: false,
  reportNetworkFailure: () => set({ hasNetworkFailure: true }),
  clearNetworkFailure: () => set({ hasNetworkFailure: false }),
}))
