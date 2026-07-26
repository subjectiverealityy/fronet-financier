import { create } from 'zustand'
import type { DashboardTab, DashboardView } from '@/types'

interface DashboardState {
  selectedView: DashboardView
  selectedMonth: number
  selectedYear: number
  selectedRange: '7d' | '30d' | '3m' | '6m' | '1y' | 'custom'
  customStartDate: string
  customEndDate: string
  activeTab: DashboardTab
  setSelectedView: (view: DashboardView) => void
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  setSelectedRange: (range: DashboardState['selectedRange']) => void
  setCustomStartDate: (date: string) => void
  setCustomEndDate: (date: string) => void
  setActiveTab: (tab: DashboardTab) => void
}

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedView: 'all',
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  selectedRange: '30d',
  customStartDate: toInputDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())),
  customEndDate: toInputDate(new Date()),
  activeTab: 'revenue',
  setSelectedView: (view) => set({ selectedView: view }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedRange: (range) => set({ selectedRange: range }),
  setCustomStartDate: (date) => set({ customStartDate: date }),
  setCustomEndDate: (date) => set({ customEndDate: date }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
