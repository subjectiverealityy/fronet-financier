import { useDashboardStore } from '@/store/dashboardStore'
import { KpiCard } from '@/components/ui'
import { getMonthName, formatNaira, MONTHS, YEARS } from '@/lib/utils'

// ─── PeriodSelector ──────────────────────────────────────────────────────────

export function PeriodSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useDashboardStore()

  return (
    <div className="flex gap-2 mt-2.5">
      <select
        className="flex items-center gap-1 text-xs text-text-secondary bg-surface-2
                   border border-border-strong rounded-pill px-3 py-1.5 appearance-none
                   focus:outline-none focus:border-brand/50"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        className="flex items-center gap-1 text-xs text-text-secondary bg-surface-2
                   border border-border-strong rounded-pill px-3 py-1.5 appearance-none
                   focus:outline-none focus:border-brand/50"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  )
}

export default PeriodSelector

// ─── KPIStrip ────────────────────────────────────────────────────────────────

// Placeholder data — swap each value with useQuery(getKPIs(...)) once API is live
export const MOCK_KPIS = {
  financierEarnings: 112860,
  financierSharePct: 40,
  grossRevenue: 282149,
  netRevenue: 275916,
  successfulTxns: 101,
  totalTxns: 118,
  wifiUsers: 48,
  failedTxns: 17,
  paystackFees: 6233,
  payoutBalance: 173790,  
  payoutStatus: 'none' as 'none' | 'pending',       
}

export function KPIStrip({ onRequestPayout }: { onRequestPayout: () => void }) {
  const { selectedView, selectedMonth, selectedYear } = useDashboardStore()
  const kpis = MOCK_KPIS

  return (
    <>
      {/* Earnings highlight */}
      <div className="bg-brand/10 border border-brand/20 rounded-card p-4">
        <p className="text-[10px] text-brand/60 uppercase tracking-wider mb-1">
          {selectedView === 'all' ? 'Total earnings this month' : 'Your earnings this month'}
        </p>
        <p className="text-2xl font-semibold text-brand">{formatNaira(kpis.financierEarnings)}</p>
        <p className="text-[11px] text-brand/50 mt-0.5">
          {kpis.financierSharePct}% of gross revenue
          {selectedView !== 'all' ? ` · ${getMonthName(selectedMonth)} ${selectedYear}` : ''}
        </p>
      </div>

      {/* Payout balance + CTA */}
      <div className="bg-surface-2 border border-border rounded-card p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-text-tertiary mb-1">Available for payout</p>
          <p className="text-lg font-medium text-text-primary">{formatNaira(kpis.payoutBalance)}</p>
        </div>
        <button
          onClick={onRequestPayout}
          disabled={kpis.payoutBalance <= 0 || kpis.payoutStatus === 'pending'}
          className="btn-brand text-xs whitespace-nowrap disabled:opacity-40 disabled:cursor-default"
        >
          {kpis.payoutStatus === 'pending' ? 'Payout requested →' : 'Request payout →'}
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-2">
        <KpiCard label="Gross revenue" value={formatNaira(kpis.grossRevenue)} />
        <KpiCard label="Net revenue" value={formatNaira(kpis.netRevenue)} />
        <KpiCard
          label="Transactions"
          value={<>{kpis.successfulTxns} <span className="text-xs font-normal text-text-tertiary">/ {kpis.totalTxns}</span></>}
        />
        <KpiCard label="WiFi users" value={kpis.wifiUsers} />
        <KpiCard label="Failed transactions" value={kpis.failedTxns} danger />
        <KpiCard label="Paystack fees" value={formatNaira(kpis.paystackFees)} />
      </div>
    </>
  )
}

// ─── MarketplaceBanner ───────────────────────────────────────────────────────

export function MarketplaceBanner({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-brand/10 border border-brand/20 rounded-card px-4 py-3.5
                 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
    >
      <div>
        <p className="text-[10px] text-brand/60 uppercase tracking-wider mb-0.5">
          FroNet Marketplace
        </p>
        <p className="text-sm font-medium text-text-primary">Browse Active Offers</p>
        <p className="text-xs text-text-tertiary mt-0.5">4 active offers available</p>
      </div>
      <span className="w-8 h-8 bg-brand/15 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  )
}
