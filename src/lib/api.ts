import type {
  KPIs,
  PlanBreakdown,
  ChannelSummary,
  GatewayResponse,
  NetworkStats,
  APLocation,
  Transaction,
  Offer,
  Location,
} from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.fronet.app'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('fronet-token')
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? `API error ${res.status}`)
  }
  return res.json()
}

// ─── Locations ───────────────────────────────────────────────────────────────

export const getMyLocations = () =>
  apiFetch<Location[]>('/financier/locations')

// ─── Dashboard ───────────────────────────────────────────────────────────────

interface DashboardParams {
  locationId?: string // omit for aggregated 'all'
  month: number
  year: number
}

export const getKPIs = ({ locationId, month, year }: DashboardParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<KPIs>(`/financier/dashboard${loc}/kpis?month=${month}&year=${year}`)
}

export const getPlanBreakdown = ({ locationId, month, year }: DashboardParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<PlanBreakdown[]>(`/financier/dashboard${loc}/plans?month=${month}&year=${year}`)
}

export const getChannelSummary = ({ locationId, month, year }: DashboardParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<ChannelSummary[]>(`/financier/dashboard${loc}/channels?month=${month}&year=${year}`)
}

export const getGatewayResponses = ({ locationId, month, year }: DashboardParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<GatewayResponse[]>(`/financier/dashboard${loc}/gateway?month=${month}&year=${year}`)
}

export const getNetworkStats = ({ locationId, month, year }: DashboardParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<NetworkStats>(`/financier/dashboard${loc}/network?month=${month}&year=${year}`)
}

export const getAPBreakdown = ({ locationId, month, year }: DashboardParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<APLocation[]>(`/financier/dashboard${loc}/access-points?month=${month}&year=${year}`)
}

// ─── Transactions ─────────────────────────────────────────────────────────────

interface TxnParams extends DashboardParams {
  page?: number
  limit?: number
}

export const getTransactions = ({ locationId, month, year, page = 1, limit = 20 }: TxnParams) => {
  const loc = locationId ? `/${locationId}` : ''
  return apiFetch<{ data: Transaction[]; total: number; page: number }>(
    `/financier/dashboard${loc}/transactions?month=${month}&year=${year}&page=${page}&limit=${limit}`
  )
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

export const getOffers = () => apiFetch<Offer[]>('/marketplace/offers')

// ─── KYC ─────────────────────────────────────────────────────────────────────

export const submitKYC = (payload: { nin: string; bvn: string }) =>
  apiFetch<{ status: string }>('/kyc/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
