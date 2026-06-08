import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '@/store/dashboardStore'
import { useAuthStore } from '@/store/authStore'
import { Chip } from '@/components/ui'
import LocationDropdown from './LocationDropdown'
import PeriodSelector from './PeriodSelector'
// import KPIStrip from './KPIStrip'
// import RevenueTab from './tabs/RevenueTab'
// import TransactionsTab from './tabs/TransactionsTab'
// import NetworkTab from './tabs/NetworkTab'
import { RevenueTab, TransactionsTab, NetworkTab } from './tabs/RevenueTab'
// import MarketplaceBanner from './MarketplaceBanner'
import { KPIStrip, MarketplaceBanner } from './PeriodSelector'
import type { DashboardTab } from '@/types'

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'network', label: 'Network' },
]

export default function Dashboard() {
  const { activeTab, setActiveTab } = useDashboardStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md mx-auto">

      {/* Topbar */}
      <div className="bg-surface-1 border-b border-border safe-top relative z-20">
        <div className="px-4 pt-4 pb-3">
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest mb-1">
            FroNet · Financier Dashboard
          </p>
          <LocationDropdown
            open={dropdownOpen}
            onToggle={() => setDropdownOpen((o) => !o)}
            onClose={() => setDropdownOpen(false)}
          />
          <PeriodSelector />
        </div>
      </div>

      {/* KPI strip */}
      <div className="bg-surface-1 border-b border-border px-4 py-3 flex flex-col gap-2">
        <KPIStrip />
      </div>

      {/* Tabs */}
      <div className="bg-surface-1 border-b border-border flex px-4">
        {TABS.map((tab) => (
          <Chip
            key={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 safe-bottom">
        <MarketplaceBanner onClick={() => navigate('/marketplace')} />

        {activeTab === 'revenue' && <RevenueTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'network' && <NetworkTab />}
      </div>

      {/* Overlay to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  )
}
