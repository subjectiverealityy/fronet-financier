import type { FixedReturnInvestment } from '@/types'

// SAMPLE DATA: made-up fixed-return investments so the Revenue tab looks complete
// while testers use the app and the backend doesn't send real ones yet.
// Shown everywhere, including the live site, so every signed-in user sees them as
// their own. Set to false (or back to import.meta.env.DEV) before real investors use the app.
export const SHOW_SAMPLE_FIXED_RETURNS = true

export const SAMPLE_FIXED_RETURNS: FixedReturnInvestment[] = [
  {
    id: 9101,
    offer_title: 'Bims Hostel Solar Wi-Fi',
    location_id: 'bims',
    currency: 'NGN',
    principal: 100000,
    return_rate_pct: 30,
    term_months: 12,
    payout_plan: 'early_return',
    start_date: '2026-06-14',
    maturity_date: '2027-06-14',
    payments: [
      { kind: 'return', amount: 30000, due_date: '2026-09-14', paid_at: '2026-09-14' },
      { kind: 'principal', amount: 100000, due_date: '2027-06-14', paid_at: null },
    ],
  },
  {
    id: 9102,
    offer_title: 'Akoka Heights Network Upgrade',
    location_id: 'akoka',
    currency: 'NGN',
    principal: 250000,
    return_rate_pct: 30,
    term_months: 12,
    payout_plan: 'at_maturity',
    start_date: '2026-03-02',
    maturity_date: '2027-03-02',
    payments: [
      { kind: 'principal_and_return', amount: 325000, due_date: '2027-03-02', paid_at: null },
    ],
  },
]
