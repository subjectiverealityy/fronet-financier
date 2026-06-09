// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  kycStatus: 'none' | 'pending' | 'verified'
  role: 'partner' | 'prospect' // partner = has active deployments
}

// ─── Locations ───────────────────────────────────────────────────────────────

export interface Location {
  id: string
  name: string
  institution: string
  state: string
  status: 'live' | 'pending'
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface KPIs {
  grossRevenue: number
  netRevenue: number
  successfulTxns: number
  totalTxns: number
  failedTxns: number
  wifiUsers: number
  paystackFees: number
  financierEarnings: number
  financierSharePct: number
}

export interface PlanBreakdown {
  plan: string
  sessions: number
  revenue: number
  averagePerSession: number
  pct: number
}

export interface ChannelSummary {
  channel: string
  txns: number
  revenue: number
  pct: number
}

export interface RevenueDistribution {
  landlordFee: number
  financierFee: number
  operatorFee: number
}

export interface GatewayResponse {
  label: string
  description: string
  count: number
  pct: number
  type: 'success' | 'warning' | 'error' | 'neutral'
}

export interface NetworkStats {
  downloadGB: number
  uploadGB: number
  totalBandwidthGB: number
  totalUsers: number
  onlineNow: number
  accessPoints: number
}

export interface APLocation {
  name: string
  downloadGB: number
  uploadGB: number
  totalGB: number
  activeClients: number
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TxnStatus = 'Success' | 'Abandoned' | 'Failed'
export type TxnChannel = 'BT' | 'bank' | 'card' | 'unknown'

export interface Transaction {
  id: string
  date: string
  customerName: string
  amount: number
  fees: number
  net: number | null
  status: TxnStatus
  channel: TxnChannel
  apLocation: string
  hostel?: string // present in aggregated view
}

// ─── Marketplace ─────────────────────────────────────────────────────────────

export type DeploymentStage = 'paid' | 'procured' | 'invested' | 'live'

export interface Offer {
  id: string
  name: string
  institution: string
  state: string
  rooms: number
  costOfInstall: number
  projectedReturns: number // percentage
  fundingRaised: number
  fundingTarget: number
  stage: DeploymentStage
  fullyFunded: boolean
  gps: string
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export type DashboardView = 'all' | string // 'all' or a location id
export type DashboardTab = 'revenue' | 'transactions' | 'network'
