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
  PayoutRequest,
  HealthCheckResponse,
  RegistrationPayload,
  AuthResponse,
  ApiUser,
  TokenRefreshResponse,
  User,
} from '@/types'
import { useApiStatusStore } from '@/store/apiStatusStore'
import { useAuthStore } from '@/store/authStore'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '@/lib/session'

const BASE_URL = import.meta.env.VITE_API_URL

if (!BASE_URL) {
  throw new Error('VITE_API_URL is not configured')
}

const HEALTH_CHECK_TIMEOUT_MS = 5000

// Errors

export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  status: number
  fields: FieldErrors

  constructor(status: number, message: string, fields: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

function toFieldErrors(body: unknown): FieldErrors {
  if (!body || typeof body !== 'object') return {}
  const fields: FieldErrors = {}
  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value)) fields[key] = value.map(String)
    else if (typeof value === 'string') fields[key] = [value]
  }
  return fields
}

function toErrorMessage(status: number, body: unknown, fields: FieldErrors): string {
  const b = (body ?? {}) as { message?: unknown; detail?: unknown }
  if (typeof b.detail === 'string') return b.detail
  if (typeof b.message === 'string') return b.message
  const flat = Object.values(fields).flat()
  if (flat.length) return flat.join(' ')
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 429 || status >= 500) return 'The server is busy. Please try again shortly.'
  return `API error ${status}`
}

// Token refresh

// Shared promise so concurrent 401s trigger a single refresh call.
let refreshing: Promise<boolean> | null = null

async function requestTokenRefresh(): Promise<boolean> {
  const refresh = getRefreshToken()
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) {
      // Only clear if another tab hasn't already rotated in a newer token.
      if (getRefreshToken() === refresh) clearTokens()
      return false
    }
    saveTokens((await res.json()) as TokenRefreshResponse)
    return true
  } catch {
    return false
  }
}

function refreshAccessToken(): Promise<boolean> {
  if (!refreshing) {
    refreshing = requestTokenRefresh().finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

// Clearing auth state makes ProtectedRoute redirect to sign in.
const endSession = () => useAuthStore.getState().logout()

// Core request

async function apiFetch<T>(path: string, options?: RequestInit, isRetry = false): Promise<T> {
  const token = getAccessToken()
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })
  } catch (err) {
    // fetch rejects when no HTTP response was received (offline, DNS, CORS, server down)
    useApiStatusStore.getState().reportNetworkFailure()
    throw err
  }
  useApiStatusStore.getState().clearNetworkFailure()

  // One refresh attempt per request, only when there is a session to refresh.
  if (res.status === 401 && getRefreshToken() && !isRetry) {
    if (await refreshAccessToken()) return apiFetch<T>(path, options, true)
    // Token gone means the server rejected it; still present means a network blip.
    if (!getRefreshToken()) endSession()
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const fields = res.status === 400 ? toFieldErrors(body) : {}
    throw new ApiError(res.status, toErrorMessage(res.status, body, fields), fields)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

// Auth

export const register = (payload: RegistrationPayload) =>
  apiFetch<AuthResponse>('/api/v1/auth/registration/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getCurrentUser = () => apiFetch<ApiUser>('/api/v1/auth/user/')

// Map the backend user into the frontend User model.
export const toUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.pk),
  name: apiUser.full_name || `${apiUser.first_name} ${apiUser.last_name}`.trim(),
  firstName: apiUser.first_name,
  lastName: apiUser.last_name,
  email: apiUser.email,
  kycStatus: 'none',
  role: 'prospect',
})

// On app load: trade the stored refresh token for an access token, then load the user.
export async function restoreSession(): Promise<User | null> {
  if (!getRefreshToken()) return null
  if (!(await refreshAccessToken())) return null
  try {
    return toUser(await getCurrentUser())
  } catch {
    return null
  }
}

// Health Check
export async function checkApiHealth(): Promise<HealthCheckResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/auth/health/`, {
    signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
  return res.json()
}

// Locations

export const getMyLocations = () =>
  apiFetch<Location[]>('/financier/locations')

// Dashboard

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

// Transactions

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

// Marketplace 

export const getOffers = () => apiFetch<Offer[]>('/marketplace/offers')

// KYC

export const submitKYC = (payload: { nin: string; bvn: string }) =>
  apiFetch<{ status: string }>('/kyc/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

// Payouts 

export const getPayoutHistory = () =>
  apiFetch<PayoutRequest[]>('/financier/payouts')

export const requestPayout = (payload: { amount: number }) =>
  apiFetch<PayoutRequest>('/financier/payouts/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  })