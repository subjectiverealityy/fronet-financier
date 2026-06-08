import { create } from 'zustand'
import type { DashboardTab, DashboardView } from '@/types'

interface DashboardState {
  selectedView: DashboardView
  selectedMonth: number
  selectedYear: number
  activeTab: DashboardTab
  setSelectedView: (view: DashboardView) => void
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  setActiveTab: (tab: DashboardTab) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedView: 'all',
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  activeTab: 'revenue',
  setSelectedView: (view) => set({ selectedView: view }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
