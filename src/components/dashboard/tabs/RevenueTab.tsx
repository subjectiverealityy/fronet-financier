import { useEffect, useState } from 'react'
import { Card, CardHeader, Dot, StatusBadge, ViewAllFooter } from '@/components/ui'
import { formatNaira, formatNairaFull, formatGB, formatMoney } from '@/lib/utils'
import { useInvestorDashboard } from '@/hooks/useInvestorDashboard'
import type { InvestorPortfolio } from '@/types'
import { useDashboardStore } from '@/store/dashboardStore'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getMyReferrals } from '@/lib/api'

// ─── Revenue Tab ─────────────────────────────────────────────────────────────

// PLACEHOLDER: the investor dashboard endpoint has no income, yield or projection
// figures yet. Replace these once the backend provides them.
const PLACEHOLDER_METRICS = {
  netIncome: formatNaira(326400),
  netYield: '13.1%',
  projectedYield: '15.8%',
  projectedReturn3y: formatNaira(1180000),
}

// Real figures from GET /financing/dashboard/me/ where they exist; '—' while loading or unavailable.
function investmentMetrics(portfolio?: InvestorPortfolio) {
  const money = (amount: number) => (portfolio ? formatMoney(amount, portfolio.currency) : '—')
  const p = portfolio
  return [
    { label: 'Initial investment amount', value: money(Number(p?.confirmed_investment_amount)) },
    { label: 'Confirmed investments', value: p ? String(p.confirmed_investment_count) : '—' },
    { label: 'Net income', value: PLACEHOLDER_METRICS.netIncome },
    { label: 'Earnings to date', value: money(Number(p?.distribution_paid) + Number(p?.distribution_available)) },
    { label: 'Net % yield', value: PLACEHOLDER_METRICS.netYield },
    { label: 'Projected annualized yield', value: PLACEHOLDER_METRICS.projectedYield },
    { label: '3-year projected return', value: PLACEHOLDER_METRICS.projectedReturn3y },
    // Backend values the dashboard didn't show before.
    // Hidden for now: total of commitments not yet confirmed by payment.
    // { label: 'Pending payment verification', value: money(Number(p?.pending_commitment_amount)) },
    { label: 'Paid out to you', value: money(Number(p?.distribution_paid)) },
    // Hidden for now: waiting for the backend to explain what ledger_balance means.
    // { label: 'Ledger balance', value: money(Number(p?.ledger_balance)) },
  ]
}

const EARNINGS_HISTORY = [
  { label: 'Last 30 days', value: formatNaira(128000) },
  { label: 'Last 90 days', value: formatNaira(326400) },
  { label: 'Last 180 days', value: formatNaira(489200) },
  { label: 'Last 365 days', value: formatNaira(612000) },
]

const DEPLOYMENTS = [
  {
    title: 'Deployment #024 · Example Hostel, UNN, Enugu',
    story: 'A new shared infrastructure deployment is now serving 180 residents and generating recurring revenue through a solar-backed network upgrade.',
    location: 'Example Hostel, UNN, Enugu',
    gps: 'https://www.google.com/maps/search/?api=1&query=Example+Hostel+UNN+Enugu',
    deploymentDate: 'Apr 2026',
    investmentDeployed: formatNaira(2400000),
    users: '180 users',
    revenue: formatNaira(162000),
    yield: '14.2%',
    assets: 'Solar panels · Wi-Fi access points · Backup batteries',
    media: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://www.w3schools.com/html/mov_bbb.mp4',
    ],
  },
  {
    title: 'Deployment #027 · Example Hostel, UNN, Enugu',
    story: 'The latest deployment expanded access with stronger uptime and more resilient coverage for surrounding homes and small businesses.',
    location: 'Example Hostel, UNN, Enugu',
    gps: 'https://www.google.com/maps/search/?api=1&query=Example+Hostel+UNN+Enugu',
    deploymentDate: 'Jun 2026',
    investmentDeployed: formatNaira(1800000),
    users: '94 users',
    revenue: formatNaira(98000),
    yield: '12.6%',
    assets: 'Outdoor routers · Power backup units · Network cabinet',
    media: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    ],
  },
]

const INVESTMENT_PERFORMANCE_ROWS = [
  { name: 'Bims Hostel', sub: 'University of Ilorin', stake: 15, amt: 16929, color: '#03c9a6' },
  { name: 'Akoka Heights Hostel', sub: 'University of Lagos', stake: 100, amt: 89400, color: '#3d8eff' },
  { name: 'Canaanland Lodge', sub: 'Covenant University', stake: 32, amt: 4902, color: '#f5a623' },
]

export function RevenueTab() {
  const { selectedView } = useDashboardStore()
  const { data: investorDashboard, isError: portfolioError } = useInvestorDashboard()
  const metrics = investmentMetrics(investorDashboard?.portfolio)
  // const projectedTotal = 540000
  // const actualTotal = 510000
  // const variance = actualTotal - projectedTotal
  // const variancePct = Math.round((variance / projectedTotal) * 100)
  const cumulativeAmount = INVESTMENT_PERFORMANCE_ROWS.reduce((sum, row) => sum + row.amt, 0)

  return (
    <>
      <Card className="border-brand/30 bg-brand/5">
        <CardHeader>
          <div>
            <p className="card-title">Investment performance</p>
            <p className="card-subtitle">
              {selectedView === 'all'
                ? 'Cumulative earnings across all deployments'
                : `15% stake · 6% of gross · Bims Hostel`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-brand">
              {selectedView === 'all' ? formatNaira(cumulativeAmount) : formatNaira(16929)}
            </p>
            <p className="text-xs text-text-tertiary mt-0.5">
              {selectedView === 'all' ? 'Your cumulative earnings' : 'Your earnings'}
            </p>
          </div>
        </CardHeader>

        {selectedView === 'all' && (
          <div>
            {INVESTMENT_PERFORMANCE_ROWS.map((loc) => (
              <div key={loc.name} className="row-item">
                <div className="flex items-center gap-2">
                  <Dot color={loc.color} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{loc.name}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{loc.sub}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">{formatNaira(loc.amt)}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">Stake {loc.stake}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <p className="card-title">Investment summary</p>
        </CardHeader>
        {portfolioError && (
          <p role="alert" className="px-4 pt-3 text-xs text-text-tertiary">
            We couldn't load your portfolio right now.
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-card border border-border bg-surface-2/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-text-tertiary">{metric.label}</p>
              <p className="mt-1 text-base font-semibold text-text-primary">{metric.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actual vs projected returns: commented out for now. To restore, uncomment this
          card and the projectedTotal / actualTotal / variance lines at the top of RevenueTab. */}
      {/* <Card>
        <CardHeader>
          <p className="card-title">Actual vs projected returns</p>
          <p className="text-xs text-text-tertiary">Variance {formatNaira(Math.abs(variance))} / {variancePct}%</p>
        </CardHeader>
        <div className="p-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-card border border-border bg-surface-2/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Projected return</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">{formatNaira(projectedTotal)}</p>
          </div>
          <div className="rounded-card border border-border bg-surface-2/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Actual return</p>
            <p className="mt-1 text-lg font-semibold text-text-primary">{formatNaira(actualTotal)}</p>
          </div>
          <div className="rounded-card border border-border bg-surface-2/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Variance</p>
            <p className={`mt-1 text-lg font-semibold ${variance >= 0 ? 'text-brand' : 'text-warning'}`}>
              {variance >= 0 ? '+' : ''}{formatNaira(Math.abs(variance))}
            </p>
          </div>
        </div>
      </Card> */}

      <Card>
        <CardHeader>
          <p className="card-title">Earnings over time</p>
          <p className="text-xs text-text-tertiary">Cumulative earnings across selected timelines</p>
        </CardHeader>
        <div className="p-4 space-y-2">
          {EARNINGS_HISTORY.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-card border border-border bg-surface-2/60 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                {/* <p className="text-xs text-text-tertiary">Cumulative earnings</p> */}
              </div>
              <p className="text-sm font-semibold text-text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col md:flex-row gap-3">
        <Card className="md:flex-1">
          <CardHeader><p className="card-title">Subscription plan breakdown</p></CardHeader>
          {[
            { plan: 'FroWeek', sessions: 39, avg: 2499, revenue: 97461, pct: 34.5 },
            { plan: 'FroMonth', sessions: 6, avg: 9559, revenue: 57354, pct: 20.3 },
            { plan: 'FroDay', sessions: 30, avg: 969, revenue: 29070, pct: 10.3 },
            { plan: 'DuoMonth', sessions: 1, avg: 14699, revenue: 14699, pct: 5.2 },
            { plan: 'DuoWeek', sessions: 3, avg: 3749, revenue: 11247, pct: 4.0 },
            { plan: 'TriWeek', sessions: 2, avg: 4949, revenue: 9898, pct: 3.5 },
          ].map((p) => (
            <div key={p.plan} className="row-item">
              <div>
                <p className="text-sm font-medium text-text-primary">{p.plan}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{p.sessions} sessions · average {formatNaira(p.avg)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{formatNaira(p.revenue)}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{p.pct}%</p>
              </div>
            </div>
          ))}
        </Card>

        {/* <Card className="md:flex-1 h-fit">
          <CardHeader><p className="card-title">Capital movement summary</p></CardHeader>
          {[
            { name: 'Initial deployment', value: formatNaira(2500000), detail: 'Capital deployed to infrastructure' },
            { name: 'Investor uplift', value: formatNaira(326400), detail: 'Current net income generated' },
            { name: 'Revenue retention', value: '87%', detail: 'Available for reinvestment' },
          ].map((item) => (
            <div key={item.name} className="row-item">
              <div>
                <p className="text-sm text-text-primary">{item.name}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{item.detail}</p>
              </div>
              <p className="text-sm font-medium text-text-primary">{item.value}</p>
            </div>
          ))}
        </Card> */}
      </div>
    </>
  )
}

export function DeploymentsTab() {
  const [activeMedia, setActiveMedia] = useState<{ deploymentTitle: string; items: string[]; index: number } | null>(null)
  // Cards start closed; this holds the titles of the ones the user has opened.
  const [openDeployments, setOpenDeployments] = useState<Set<string>>(new Set())

  const toggleDeployment = (title: string) =>
    setOpenDeployments((current) => {
      const next = new Set(current)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })

  useEffect(() => {
    if (!activeMedia) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMedia(null)
      if (event.key === 'ArrowRight') {
        setActiveMedia((current) => current ? { ...current, index: (current.index + 1) % current.items.length } : current)
      }
      if (event.key === 'ArrowLeft') {
        setActiveMedia((current) => current ? { ...current, index: (current.index - 1 + current.items.length) % current.items.length } : current)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeMedia])

  const renderMedia = (src: string) => {
    const isVideo = src.match(/\.(mp4|webm|ogg)$/i) || src.includes('video')

    if (isVideo) {
      return <video src={src} controls className="max-h-[70vh] w-full rounded-card object-contain bg-black" />
    }

    return <img src={src} alt="Deployment media" className="max-h-[70vh] w-full rounded-card object-contain bg-surface-2" />
  }

  return (
    <Card>
      <CardHeader>
        <p className="card-title">Deployments</p>
        <p className="text-xs text-text-tertiary">Visible proof of funded infrastructure</p>
      </CardHeader>
      <div className="p-4 space-y-3">
        {DEPLOYMENTS.map((deployment, index) => {
          const isOpen = openDeployments.has(deployment.title)
          const detailsId = `deployment-details-${index}`
          return (
            <div key={deployment.title} className="rounded-card border border-border bg-surface-2/60">
              <button
                type="button"
                onClick={() => toggleDeployment(deployment.title)}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                className="w-full flex items-center justify-between gap-3 p-3 text-left"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{deployment.title}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Deployed {deployment.deploymentDate} · {deployment.users}
                  </p>
                </div>
                <svg
                  className={`h-4 w-4 flex-shrink-0 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div id={detailsId} className="px-3 pb-3">
                  <p className="text-xs text-text-tertiary">{deployment.story}</p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(deployment.gps, '_blank', 'noopener,noreferrer')}
                      className="flex flex-1 items-center justify-center gap-2 rounded-card border border-border bg-surface-1/70 px-3 py-2 text-sm text-text-primary"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View location
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMedia({ deploymentTitle: deployment.title, items: deployment.media, index: 0 })}
                      className="flex flex-1 items-center justify-center gap-2 rounded-card border border-border bg-surface-1/70 px-3 py-2 text-sm text-text-primary"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                      </svg>
                      View media
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-card border border-border bg-surface-1/70 p-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Revenue generated</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.revenue}</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-1/70 p-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Investment deployed</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.investmentDeployed}</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-1/70 p-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Deployment date</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.deploymentDate}</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-1/70 p-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Users served</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.users}</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-1/70 p-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Monthly revenue</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.revenue}</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-1/70 p-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Current yield</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.yield}</p>
                    </div>
                    <div className="rounded-card border border-border bg-surface-1/70 p-2 col-span-2">
                      <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Infrastructure funded</p>
                      <p className="mt-1 font-medium text-text-primary">{deployment.assets}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-3 py-4" onClick={() => setActiveMedia(null)}>
          <div className="w-full max-w-3xl rounded-card border border-border bg-surface-1 p-3" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text-primary">{activeMedia.deploymentTitle}</p>
                <p className="text-xs text-text-tertiary">Media slideshow</p>
              </div>
              <button type="button" onClick={() => setActiveMedia(null)} className="rounded-full border border-border px-2.5 py-1 text-xs text-text-tertiary">
                Close
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveMedia((current) => current ? { ...current, index: (current.index - 1 + current.items.length) % current.items.length } : current)}
                className="rounded-pill border border-border px-3 py-1.5 text-sm text-text-primary"
              >
                Previous
              </button>
              <p className="text-xs text-text-tertiary">{activeMedia.index + 1} / {activeMedia.items.length}</p>
              <button
                type="button"
                onClick={() => setActiveMedia((current) => current ? { ...current, index: (current.index + 1) % current.items.length } : current)}
                className="rounded-pill border border-border px-3 py-1.5 text-sm text-text-primary"
              >
                Next
              </button>
            </div>

            {renderMedia(activeMedia.items[activeMedia.index])}
          </div>
        </div>
      )}
    </Card>
  )
}

// ─── Transactions Tab ─────────────────────────────────────────────────────────

const MOCK_TXNS = [
  { id: '1', date: 'Apr 10', transactionId: 'TRX-1041', userId: 'UI-2041', amount: 2499, fees: 37.49, net: 2461.51, status: 'Success' as const, apLocation: 'Bims 3', hostel: 'Bims Hostel' },
  { id: '2', date: 'Apr 11', transactionId: 'TRX-1042', userId: 'UI-2042', amount: 14699, fees: 320.49, net: 14378.51, status: 'Success' as const, apLocation: 'Bims 2', hostel: 'Bims Hostel' },
  { id: '3', date: 'Apr 1', transactionId: 'TRX-1043', userId: 'UI-2043', amount: 2499, fees: 0, net: null, status: 'Abandoned' as const, apLocation: '—', hostel: 'Akoka Heights Hostel' },
  { id: '4', date: 'Apr 23', transactionId: 'TRX-1044', userId: 'UI-2044', amount: 2499, fees: 0, net: null, status: 'Failed' as const, apLocation: '—', hostel: 'Canaanland Lodge' },
  { id: '5', date: 'Apr 27', transactionId: 'TRX-1045', userId: 'UI-2045', amount: 9559, fees: 243.39, net: 9315.61, status: 'Success' as const, apLocation: '2nd Floor 3', hostel: 'Bims Hostel' },
  { id: '6', date: 'Apr 22', transactionId: 'TRX-1046', userId: 'UI-2046', amount: 9559, fees: 243.39, net: 9315.61, status: 'Success' as const, apLocation: '1st Floor 4', hostel: 'Akoka Heights Hostel' },
]

export function TransactionsTab() {
  return (
    <Card>
      <CardHeader>
        <p className="card-title">Transactions</p>
        <p className="text-xs text-text-tertiary">118 total</p>
      </CardHeader>

      <div className="md:hidden">
        {MOCK_TXNS.map((txn) => (
          <div key={txn.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{txn.transactionId}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{txn.date} · {txn.userId} · {txn.hostel ?? txn.apLocation}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <p className="text-sm font-medium text-text-primary">{formatNaira(txn.amount)}</p>
              <StatusBadge status={txn.status} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary">Date</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary">Transaction ID</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary">Hostel</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary">AP location</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Amount</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Fees</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Net</th>
              <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_TXNS.map((txn) => (
              <tr key={txn.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2.5 text-text-secondary">{txn.date}</td>
                <td className="px-4 py-2.5 font-medium text-text-primary">{txn.transactionId}</td>
                <td className="px-4 py-2.5 text-text-secondary">{txn.hostel ?? '—'}</td>
                <td className="px-4 py-2.5 text-text-secondary">{txn.apLocation}</td>
                <td className="px-4 py-2.5 text-right font-medium text-text-primary">{formatNaira(txn.amount)}</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">{txn.fees ? formatNairaFull(txn.fees) : '—'}</td>
                <td className="px-4 py-2.5 text-right text-text-secondary">{txn.net ? formatNairaFull(txn.net) : '—'}</td>
                <td className="px-4 py-2.5 text-right"><StatusBadge status={txn.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewAllFooter label="Load more transactions" onClick={() => {}} />
    </Card>
  )
}

// ─── Network Tab ─────────────────────────────────────────────────────────────

const GATEWAY = [
  { label: 'Approved', description: 'Successful - payment captured', count: 101, pct: 85.6, color: '#03c9a6' },
  { label: 'Not completed', description: 'Customer abandoned before completing', count: 10, pct: 8.5, color: '#f5a623' },
  { label: 'Session timed out', description: 'Bank session timed out', count: 3, pct: 2.5, color: '#ff5a5a' },
  { label: 'No transfer received', description: 'Bank transfer not received', count: 2, pct: 1.7, color: '#ff5a5a' },
  { label: 'Marked successful', description: 'Marked successful but check status', count: 1, pct: 0.8, color: '#555' },
  { label: 'Wrong amount', description: 'Wrong amount - check reconciliation', count: 1, pct: 0.8, color: '#555' },
]

// Used by the hidden "Breakdown by location" card in NetworkTab.
// const AP_LOCATIONS = [
//   { name: 'Bims 4', downloadGB: 392.42, uploadGB: 36.33, totalGB: 428.75, activeClients: 4 },
//   { name: 'Bims 2', downloadGB: 257.62, uploadGB: 34.36, totalGB: 291.97, activeClients: 1 },
//   { name: 'Bims 1', downloadGB: 250.01, uploadGB: 28.16, totalGB: 278.17, activeClients: 2 },
//   { name: 'Bims 3', downloadGB: 182.87, uploadGB: 31.88, totalGB: 214.75, activeClients: 4 },
//   { name: '2nd Floor 1', downloadGB: 144.79, uploadGB: 20.34, totalGB: 165.13, activeClients: 1 },
// ]

const formatReferralDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const COMMISSION_MONTHS = 6

// PLACEHOLDER: the backend does not return referral earnings yet. Replace with
// real figures once /referrals/me/ provides them.
const PLACEHOLDER_EARNINGS = 0

// Commission runs for the first 6 months after the referral. May change later if referrals structure changes.
function monthsLeft(referredAt: string) {
  const start = new Date(referredAt)
  const now = new Date()
  const elapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(0, COMMISSION_MONTHS - elapsed)
}

export function ReferralsTab() {
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)

  // Keyed by user id so a different account signing in never sees cached referrals.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['referrals', user?.id],
    queryFn: getMyReferrals,
    enabled: !!user,
  })

  // Opening this link pre-fills the code on the sign-up screen.
  const shareLink = data ? `${window.location.origin}/signup?ref=${encodeURIComponent(data.referral_code)}` : ''

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked (e.g. non-HTTPS); the link is still visible to copy by hand.
    }
  }

  if (isLoading) {
    return <Card><p className="p-4 text-sm text-text-tertiary">Loading referrals…</p></Card>
  }

  if (isError || !data) {
    return (
      <Card>
        <p role="alert" className="p-4 text-sm text-danger">
          We couldn't load your referrals. Please try again later.
        </p>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-brand/30 bg-brand/5">
        <CardHeader>
          <div>
            <p className="card-title">Referral earnings</p>
            <p className="card-subtitle">You earn 5% of the first 6 months of each financier you refer.</p>
          </div>
        </CardHeader>

        <div className="p-4 grid gap-2 md:grid-cols-3">
          <div className="rounded-card border border-border bg-surface-2/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Your referral code</p>
            <p className="mt-1 text-base font-semibold text-text-primary">{data.referral_code}</p>
          </div>
          <div className="rounded-card border border-border bg-surface-2/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Total referrals</p>
            <p className="mt-1 text-base font-semibold text-text-primary">{data.total_referrals}</p>
          </div>
          <div className="rounded-card border border-border bg-surface-2/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-text-tertiary">Total earnings</p>
            <p className="mt-1 text-base font-semibold text-text-primary">{formatNaira(PLACEHOLDER_EARNINGS)}</p>
          </div>
        </div>

        <div className="px-4 pb-4 flex items-center gap-2">
          <p className="flex-1 min-w-0 truncate rounded-card border border-border bg-surface-2/60 px-3 py-2 text-xs text-text-secondary">
            {shareLink}
          </p>
          <button
            type="button"
            onClick={copyShareLink}
            className="btn-brand px-4 py-2 text-xs flex-shrink-0"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <p className="card-title">Your referrals</p>
          <p className="text-xs text-text-tertiary">Commission applies for the first 6 months</p>
        </CardHeader>
        <div className="space-y-2 p-4">
          {data.referrals.length === 0 && (
            <p className="text-sm text-text-tertiary">
              No referrals yet. Share your link to get started.
            </p>
          )}
          {data.referrals.map((referral) => (
            <div key={referral.email} className="rounded-card border border-border bg-surface-2/60 px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{referral.email}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    Started {formatReferralDate(referral.referred_at)} · {capitalize(referral.status)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-text-primary">{formatNaira(PLACEHOLDER_EARNINGS)}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{monthsLeft(referral.referred_at)} months left</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

export function NetworkTab() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3">
        <Card className="md:flex-1 h-fit">
          <CardHeader><p className="card-title">Network usage & access points</p></CardHeader>
          <div className="grid grid-cols-2">
            {[
              { label: 'Download', value: formatGB(1553.4) },
              { label: 'Upload', value: formatGB(201.1) },
              { label: 'Total bandwidth', value: formatGB(1754.6) },
              { label: 'Total users', value: '48' },
              { label: 'Online now', value: '13' },
              { label: 'Access points', value: '19' },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                className={[
                  'px-4 py-3',
                  i % 2 === 0 ? 'border-r border-border' : '',
                  i < arr.length - 2 ? 'border-b border-border' : '',
                ].join(' ')}
              >
                <p className="text-xs text-text-tertiary mb-1">{stat.label}</p>
                <p className="text-base font-medium text-text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="md:flex-1">
          <CardHeader><p className="card-title">Gateway response breakdown</p></CardHeader>
          {GATEWAY.map((g) => (
            <div key={g.label} className="row-item">
              <div className="flex items-center gap-2">
                <Dot color={g.color} />
                <div>
                  <p className="text-sm text-text-primary">{g.label}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{g.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-sm font-medium text-text-primary">{g.count}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{g.pct}%</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Breakdown by location: hidden for now. To restore, uncomment this card and
          the AP_LOCATIONS data near the top of the Network tab section. */}
      {/* <Card>
        <CardHeader>
          <p className="card-title">Breakdown by location</p>
          <button className="text-xs text-text-tertiary">View all →</button>
        </CardHeader>

        <div className="md:hidden">
          {AP_LOCATIONS.map((ap) => (
            <div key={ap.name} className="row-item">
              <div>
                <p className="text-sm text-text-primary">{ap.name}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{ap.activeClients} active client{ap.activeClients !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{formatGB(ap.totalGB)}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{ap.downloadGB.toFixed(1)} ↓ · {ap.uploadGB.toFixed(1)} ↑</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary">AP location</th>
                <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Download</th>
                <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Upload</th>
                <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Total</th>
                <th className="px-4 py-2.5 text-xs font-medium text-text-tertiary text-right">Active clients</th>
              </tr>
            </thead>
            <tbody>
              {AP_LOCATIONS.map((ap) => (
                <tr key={ap.name} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5 font-medium text-text-primary">{ap.name}</td>
                  <td className="px-4 py-2.5 text-right text-text-secondary">{formatGB(ap.downloadGB)}</td>
                  <td className="px-4 py-2.5 text-right text-text-secondary">{formatGB(ap.uploadGB)}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-text-primary">{formatGB(ap.totalGB)}</td>
                  <td className="px-4 py-2.5 text-right text-text-secondary">{ap.activeClients}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card> */}
    </>
  )
}