// Auth

export interface HealthCheckResponse {
  status: string
  service: string
  version: string
}

export interface PersonalKycProfile {
  fullName: string
  nin: string
  phone: string
  address: string
  dob: string
}

export interface BusinessKycProfile {
  businessName: string
  rcNumber: string
  businessType: string
  contactPerson: string
  address: string
}

export interface KycProfile {
  personal: PersonalKycProfile
  business: BusinessKycProfile
}

export interface User {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  referralCode?: string
  kycStatus: 'none' | 'pending' | 'verified' | 'rejected'
  kycRejectionReason?: string
  role: 'partner' | 'prospect' // partner = has active deployments
  kycProfile?: KycProfile
}

// Backend Authentication 

export interface ApiUser {
  pk: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_staff: boolean
  date_joined: string
}

export interface RegistrationPayload {
  email: string
  password1: string
  password2: string
  first_name: string
  last_name: string
  referral_code?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user?: ApiUser
}

// Profile

export interface ApiProfile {
  id: number
  user: number
  email: string
  first_name: string
  last_name: string
  phone_number: string | null
  date_of_birth: string | null // YYYY-MM-DD
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Only the writable fields; id, user, email and timestamps are read-only.
export type ProfileUpdatePayload = Partial<
  Pick<ApiProfile, 'first_name' | 'last_name' | 'phone_number' | 'date_of_birth' | 'avatar_url'>
>

// Passwords

export interface ChangePasswordPayload {
  old_password: string
  new_password1: string
  new_password2: string
}

export interface ResetPasswordConfirmPayload {
  uid: string // from the reset email link, sent back unchanged
  token: string
  new_password1: string
  new_password2: string
}

export interface DetailResponse {
  detail: string
}

// Referrals

export interface Referral {
  email: string
  date_joined: string
  status: string // e.g. 'completed'
  referred_at: string
}

export interface ReferralDetails {
  referral_code: string
  total_referrals: number
  referrals: Referral[]
}

export interface TokenRefreshResponse {
  access: string
  refresh?: string // present when the backend rotates the refresh token
}

// Locations

export interface Location {
  id: string
  name: string
  institution: string
  state: string
  status: 'live' | 'pending'
  myStakePct: number        
  myEarnings: number
}

// Dashboard 

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
  myStakePct: number
  payoutBalance: number 
  payoutStatus: 'none' | 'pending'       
  lastPayoutAt?: string
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

// Transactions 

export type TxnStatus = 'Success' | 'Abandoned' | 'Failed'
export type TxnChannel = 'BT' | 'bank' | 'card' | 'unknown'

export interface Transaction {
  id: string
  date: string
  customerName?: string
  transactionId?: string
  userId?: string
  amount: number
  fees: number
  net: number | null
  status: TxnStatus
  channel?: TxnChannel
  apLocation: string
  hostel?: string // present in aggregated view
}

// Marketplace 

export type DeploymentStage = 'paid' | 'procured' | 'invested' | 'live'

export interface Offer {
  id: number
  title: string
  slug: string // used for the offer detail and commitment endpoints
  summary: string
  location: string 
  asset_type: string
  currency: string
  target_amount: string
  minimum_investment: string
  unit_price: string
  total_units: number
  units_sold: number
  available_units: number
  funding_amount: string
  target_return_note: string // free text, may be empty
  risk_note: string
  terms_url: string
  funding_opens_at: string | null
  funding_closes_at: string | null
  status: string // only 'published' offers are listed
  is_open: boolean
}

export interface CommitmentPayload {
  units: number // the backend works out the amount from unit_price; never send an amount
  payment_reference?: string
}

// A pending promise to invest. Not a payment, investment or ownership position.
export interface Commitment {
  id: number
  offer: Pick<Offer, 'id' | 'title' | 'slug'>
  currency: string
  unit_price: string
  units: number
  amount: string
  status: string // 'pending' until payment is verified
  payment_reference: string
  confirmed_at: string | null
}

// Utility

export type DashboardView = 'all' | string // 'all' or a location id
export type DashboardTab = 'revenue' | 'transactions' | 'network' | 'deployments' | 'referrals'

// Payouts 

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed'

export interface PayoutRequest {
  id: string
  amount: number
  status: PayoutStatus
  requestedAt: string
  processedAt?: string
}
// Investor dashboard (GET /api/v1/financing/dashboard/me/)

export interface InvestorPortfolio {
  confirmed_investment_amount: number
  pending_commitment_amount: number // awaiting payment verification; not invested yet
  confirmed_investment_count: number
  distribution_available: number
  distribution_paid: number
  ledger_balance: number
  currency: string
}

export interface InvestorDashboard {
  portfolio: InvestorPortfolio
  // Item shapes aren't documented yet (the guide's example has empty lists).
  recent_investments: unknown[]
  recent_distributions: unknown[]
}
