import { Card, CardHeader, Dot, StatusBadge, ViewAllFooter } from '@/components/ui'
import { formatNaira, formatGB } from '@/lib/utils'
import { useDashboardStore } from '@/store/dashboardStore'
import { MOCK_KPIS } from '../PeriodSelector'

// ─── Revenue Tab ─────────────────────────────────────────────────────────────

export function RevenueTab() {
  const { selectedView } = useDashboardStore()

  return (
    <>
      {/* Revenue share */}
      <Card className="border-brand/30 bg-brand/5">
        <CardHeader>
          <div>
            <p className="text-sm font-semibold text-brand">Your revenue share</p>
            <p className="text-xs text-brand/60 mt-0.5">{selectedView === 'all' ? 'All hostels' : selectedView}</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-brand">{formatNaira(MOCK_KPIS.financierEarnings)}</p>
            <p className="text-xs text-brand/60 mt-0.5">{MOCK_KPIS.financierSharePct}%</p>
          </div>
        </CardHeader>

        {/* Earnings by location — only when 'all' is selected */}
        {selectedView === 'all' && (
          <div>
            {[
              { name: 'Bims Hostel', sub: 'University of Ilorin', amt: 112860, pct: 52, color: '#03c9a6' },
              { name: 'ZAHA Hostel', sub: 'University of Lagos', amt: 89400, pct: 41, color: '#3d8eff' },
              { name: 'Kings Court', sub: 'Covenant University', amt: 15320, pct: 7, color: '#f5a623' },
            ].map((loc) => (
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
                  <p className="text-xs text-text-tertiary mt-0.5">{loc.pct}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Subscription plans */}
      <Card>
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
              <p className="text-xs text-text-tertiary mt-0.5">
                {p.sessions} sessions · average {formatNaira(p.avg)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{formatNaira(p.revenue)}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{p.pct}%</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Payment channels */}
      <Card>
        <CardHeader><p className="card-title">Payment channel summary</p></CardHeader>
        {[
          { channel: 'Bank Transfer', txns: 67, revenue: 180213, pct: 63.9, color: '#03c9a6' },
          { channel: 'OPay (Bank)', txns: 34, revenue: 101936, pct: 36.1, color: '#3d8eff' },
          { channel: 'PalmPay', txns: 3, revenue: 3000, pct: 0, color: '#f5a623' },
          { channel: 'Unknown', txns: 1, revenue: 500, pct: 0, color: '#555' },
        ].map((c) => (
          <div key={c.channel} className="row-item">
            <div className="flex items-center gap-2">
              <Dot color={c.color} />
              <div>
                <p className="text-sm text-text-primary">{c.channel}</p>
                <p className="text-xs text-text-tertiary mt-0.5">{c.txns} transactions</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{formatNaira(c.revenue)}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{c.pct}%</p>
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}

// ─── Transactions Tab ─────────────────────────────────────────────────────────

const MOCK_TXNS = [
  { id: '1', date: 'Apr 10', customerName: 'Olajumoke Athar', amount: 2499, fees: 37.49, net: 2461.51, status: 'Success' as const, channel: 'BT' as const, apLocation: 'Bims 3', hostel: 'Bims Hostel' },
  { id: '2', date: 'Apr 11', customerName: 'Mubarak Alimi', amount: 14699, fees: 320.49, net: 14378.51, status: 'Success' as const, channel: 'bank' as const, apLocation: 'Bims 2', hostel: 'Bims Hostel' },
  { id: '3', date: 'Apr 1', customerName: 'Florence Ojo', amount: 2499, fees: 0, net: null, status: 'Abandoned' as const, channel: 'card' as const, apLocation: '—', hostel: 'ZAHA Hostel' },
  { id: '4', date: 'Apr 23', customerName: 'Ireoluwa Olayioye', amount: 2499, fees: 0, net: null, status: 'Failed' as const, channel: 'bank' as const, apLocation: '—', hostel: 'Kings Court' },
  { id: '5', date: 'Apr 27', customerName: 'Blessing Adekunle', amount: 9559, fees: 243.39, net: 9315.61, status: 'Success' as const, channel: 'BT' as const, apLocation: '2nd Floor 3', hostel: 'Bims Hostel' },
  { id: '6', date: 'Apr 22', customerName: 'Daniel Adeyeoluwa', amount: 9559, fees: 243.39, net: 9315.61, status: 'Success' as const, channel: 'BT' as const, apLocation: '1st Floor 4', hostel: 'ZAHA Hostel' },
]

const CHANNEL_LABELS: Record<string, string> = {
  BT: 'Bank Transfer',
  bank: 'Bank Transfer',
  card: 'Card',
  unknown: 'Unknown',
}

export function TransactionsTab() {
  return (
    <Card>
      <CardHeader>
        <p className="card-title">Transactions</p>
        <p className="text-xs text-text-tertiary">118 total</p>
      </CardHeader>
      {MOCK_TXNS.map((txn) => (
        <div key={txn.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{txn.customerName}</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              {txn.date} · {CHANNEL_LABELS[txn.channel] ?? txn.channel} · {txn.hostel ?? txn.apLocation}
            </p>
          </div>
          {/* Right */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <p className="text-sm font-medium text-text-primary">{formatNaira(txn.amount)}</p>
            <StatusBadge status={txn.status} />
          </div>
        </div>
      ))}
      <ViewAllFooter label="Load more transactions" onClick={() => {}} />
    </Card>
  )
}

// ─── Network Tab ─────────────────────────────────────────────────────────────

const GATEWAY = [
  { label: 'Approved', description: 'Successful — payment captured', count: 101, pct: 85.6, color: '#03c9a6' },
  { label: 'Not completed', description: 'Customer abandoned before completing', count: 10, pct: 8.5, color: '#f5a623' },
  { label: 'Session timed out', description: 'OPay/bank session timed out', count: 3, pct: 2.5, color: '#ff5a5a' },
  { label: 'No transfer received', description: 'Bank transfer not received', count: 2, pct: 1.7, color: '#ff5a5a' },
  { label: 'Marked successful', description: 'Marked successful but check status', count: 1, pct: 0.8, color: '#555' },
  { label: 'Wrong amount', description: 'Wrong amount — check reconciliation', count: 1, pct: 0.8, color: '#555' },
]

const AP_LOCATIONS = [
  { name: 'Bims 4', downloadGB: 392.42, uploadGB: 36.33, totalGB: 428.75, activeClients: 4 },
  { name: 'Bims 2', downloadGB: 257.62, uploadGB: 34.36, totalGB: 291.97, activeClients: 1 },
  { name: 'Bims 1', downloadGB: 250.01, uploadGB: 28.16, totalGB: 278.17, activeClients: 2 },
  { name: 'Bims 3', downloadGB: 182.87, uploadGB: 31.88, totalGB: 214.75, activeClients: 4 },
  { name: '2nd Floor 1', downloadGB: 144.79, uploadGB: 20.34, totalGB: 165.13, activeClients: 1 },
]

export function NetworkTab() {
  return (
    <>
      {/* Gateway responses */}
      <Card>
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

      {/* Network usage */}
      <Card>
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

      {/* AP breakdown */}
      <Card>
        <CardHeader>
          <p className="card-title">Breakdown by location</p>
          <button className="text-xs text-text-tertiary">View all →</button>
        </CardHeader>
        {AP_LOCATIONS.map((ap) => (
          <div key={ap.name} className="row-item">
            <div>
              <p className="text-sm text-text-primary">{ap.name}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{ap.activeClients} active client{ap.activeClients !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{formatGB(ap.totalGB)}</p>
              <p className="text-xs text-text-tertiary mt-0.5">
                {ap.downloadGB.toFixed(1)} ↓ · {ap.uploadGB.toFixed(1)} ↑
              </p>
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}
