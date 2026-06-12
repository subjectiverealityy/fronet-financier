import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '@/store/dashboardStore'
import { useAuthStore } from '@/store/authStore'
import { Chip } from '@/components/ui'
import { getInitials } from '@/lib/utils'
import LocationDropdown from './LocationDropdown'
import PeriodSelector from './PeriodSelector'
import { RevenueTab, TransactionsTab, NetworkTab } from './tabs/RevenueTab'
import { KPIStrip, MarketplaceBanner, MOCK_KPIS } from './PeriodSelector'
import PayoutModal from './PayoutModal'
import type { DashboardTab } from '@/types'

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'network', label: 'Network' },
]

export default function Dashboard() {
  const { activeTab, setActiveTab } = useDashboardStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  async function handleConfirmPayout() {
    // TODO: replace with requestPayout({ amount: MOCK_KPIS.payoutBalance })
    await new Promise((r) => setTimeout(r, 1000))
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md md:max-w-full mx-auto">

      {/* Topbar */}
      <div className="bg-surface-1 border-b border-border safe-top relative z-20">
        <div className="px-4 md:px-6 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-bold text-text-primary">Fronet Financier</p>
            {user && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-text-tertiary">{user.name}</p>
                <div className="w-7 h-7 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center text-[10px] font-semibold text-brand flex-shrink-0">
                  {getInitials(user.name)}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <LocationDropdown
              open={dropdownOpen}
              onToggle={() => setDropdownOpen((o) => !o)}
              onClose={() => setDropdownOpen(false)}
            />
            <PeriodSelector />
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="bg-surface-1 border-b border-border px-4 md:px-6 py-3 flex flex-col gap-2">
        <KPIStrip onRequestPayout={() => setPayoutModalOpen(true)} />
      </div>

      {/* Tabs */}
      <div className="bg-surface-1 border-b border-border flex px-4 md:px-6">
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
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 flex flex-col gap-3 safe-bottom">
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

      {/* Payout modal */}
      <PayoutModal
        open={payoutModalOpen}
        balance={MOCK_KPIS.payoutBalance}
        onClose={() => setPayoutModalOpen(false)}
        onConfirm={handleConfirmPayout}
      />
    </div>
  )
}