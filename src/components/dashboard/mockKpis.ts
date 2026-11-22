// Placeholder data for everything the investor dashboard endpoint doesn't cover:
// per-location earnings and the network revenue figures in the KPI grid.
export const MOCK_KPIS = {
  financierEarnings: 112860,
  financierSharePct: 40,
  myStakePct: 15,
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

// Revenue share earnings per location. ids match the location dropdown, so a
// selected location can find its row.
export const MOCK_LOCATION_EARNINGS = [
  { id: 'bims', name: 'Bims Hostel', sub: 'University of Ilorin', stake: 15, amt: 16929, color: '#03c9a6' },
  { id: 'akoka', name: 'Akoka Heights Hostel', sub: 'University of Lagos', stake: 100, amt: 89400, color: '#3d8eff' },
  { id: 'canaanland', name: 'Canaanland Lodge', sub: 'Covenant University', stake: 32, amt: 4902, color: '#f5a623' },
]

// Your share of a location's gross revenue = your stake × the financiers' share.
export const shareOfGrossPct = (stakePct: number) => (stakePct * MOCK_KPIS.financierSharePct) / 100
