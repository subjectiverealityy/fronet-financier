import { useDashboardStore } from '@/store/dashboardStore'
import { KpiCard } from '@/components/ui'
import {
  trackDashboardCustomRangeEnd,
  trackDashboardCustomRangeStart,
  trackDashboardPeriodChanged,
} from '@/lib/ga'
import { getMonthName, formatNaira, formatMoney } from '@/lib/utils'
import { useInvestorDashboard } from '@/hooks/useInvestorDashboard'
import { useQuery } from '@tanstack/react-query'
import { getOffers } from '@/lib/api'
import { MOCK_KPIS } from './mockKpis'

const RANGE_OPTIONS = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '3m', label: 'Last 3 months' },
  { id: '6m', label: 'Last 6 months' },
  { id: '1y', label: 'Last 1 year' },
  { id: 'custom', label: 'Custom range' },
] as const

// ─── PeriodSelector ──────────────────────────────────────────────────────────

export function PeriodSelector() {
  const {
    selectedRange,
    customStartDate,
    customEndDate,
    setSelectedRange,
    setCustomStartDate,
    setCustomEndDate,
  } = useDashboardStore()

  return (
    <div className="flex flex-col gap-2 mt-2.5 md:mt-0 md:items-end">
      <div className="flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((range) => (
          <button
            key={range.id}
            type="button"
            onClick={() => {
              setSelectedRange(range.id)
              trackDashboardPeriodChanged(range.id)
            }}
            className={`rounded-pill border px-2.5 py-1 text-[11px] transition-colors ${
              selectedRange === range.id
                ? 'border-brand/40 bg-brand/10 text-brand'
                : 'border-border bg-surface-2 text-text-secondary'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {selectedRange === 'custom' && (
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary">
            <span>From</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => {
                setCustomStartDate(e.target.value)
                trackDashboardCustomRangeStart(e.target.value)
              }}
              className="bg-transparent text-text-primary outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-text-secondary">
            <span>To</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => {
                setCustomEndDate(e.target.value)
                trackDashboardCustomRangeEnd(e.target.value)
              }}
              className="bg-transparent text-text-primary outline-none"
            />
          </label>
        </div>
      )}

    </div>
  )
}

export default PeriodSelector

// ─── KPIStrip ────────────────────────────────────────────────────────────────

export function KPIStrip({ onRequestPayout }: { onRequestPayout: () => void }) {
  const { selectedView, selectedMonth, selectedYear, selectedRange } = useDashboardStore()
  const kpis = MOCK_KPIS
  const portfolio = useInvestorDashboard().data?.portfolio
  // Earnings = distributions already paid + distributions available to pay out.
  const totalEarnings = portfolio
    ? formatMoney(Number(portfolio.distribution_paid) + Number(portfolio.distribution_available), portfolio.currency)
    : '—'
  const payoutBalance = portfolio ? formatMoney(portfolio.distribution_available, portfolio.currency) : '—'
  const rangeLabel = selectedRange === 'custom' ? 'custom range' : RANGE_OPTIONS.find((item) => item.id === selectedRange)?.label ?? 'selected range'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {/* Earnings highlight */}
        <div className="bg-brand/10 border border-brand/20 rounded-card p-4 flex-1 md:flex-[1.4] md:flex md:flex-col md:justify-center">
          <p className="text-[10px] text-brand/60 uppercase tracking-wider mb-1">
            {selectedView === 'all' ? 'Total earnings' : 'Your earnings'}
          </p>
          {/* The backend only has portfolio-wide totals, so single locations stay on placeholder figures. */}
          <p className="text-2xl font-semibold text-brand">
            {selectedView === 'all' ? totalEarnings : formatNaira(kpis.financierEarnings)}
          </p>
          <p className="text-[11px] text-brand/50 mt-0.5">
            {selectedView === 'all'
              ? `Across all your deployments`
              : `${kpis.myStakePct}% stake · ${kpis.financierSharePct}% of gross revenue`}
            {selectedView !== 'all' ? ` · ${getMonthName(selectedMonth)} ${selectedYear}` : ''}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-brand/50 mt-1">{rangeLabel}</p>
        </div>

        {/* Payout balance + CTA */}
        <div className="bg-surface-2 border border-border rounded-card p-4 flex flex-col flex-1  justify-between gap-3 md:flex-1 md:items-start md:justify-center md:gap-2">
          <div>
            <p className="text-xs text-text-tertiary mb-1">Available for payout</p>
            <p className="text-lg font-medium text-text-primary">{payoutBalance}</p>
          </div>
          {/* The API guide says not to implement payouts until the backend's payout
              workflow is live, so the mock payout flow stays switched off for now. */}
          <button
            onClick={onRequestPayout}
            disabled
            className="btn-brand text-xs disabled:opacity-40 disabled:cursor-default md:w-full md:text-center"
          >
            Payouts coming soon
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:flex-[2]">
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
    </div>
  )
}

// ─── MarketplaceBanner ───────────────────────────────────────────────────────

export function MarketplaceBanner({ onClick }: { onClick: () => void }) {
  // Same query key as the marketplace page, so both share one cached request.
  const { data: offers } = useQuery({ queryKey: ['offers'], queryFn: getOffers })
  const activeCount = offers?.filter((o) => o.is_open && o.available_units > 0).length

  return (
    <button
      onClick={onClick}
      className="w-full bg-brand/10 border border-brand/20 rounded-card px-4 py-3.5 flex items-center justify-between text-left active:scale-[0.98] transition-transform"
    >
      <div>
        <p className="text-[10px] text-brand/60 uppercase tracking-wider mb-0.5">FroNet Marketplace</p>
        <p className="text-sm font-medium text-text-primary">Browse Active Offers</p>
        {/* Hidden while loading or if offers can't be loaded, rather than showing a wrong count. */}
        {activeCount !== undefined && (
          <p className="text-xs text-text-tertiary mt-0.5">
            {activeCount === 0
              ? 'No active offers right now'
              : `${activeCount} active offer${activeCount === 1 ? '' : 's'} available`}
          </p>
        )}
      </div>
      <span className="w-8 h-8 bg-brand/15 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  )
}