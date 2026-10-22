const REFRESH_KEY = 'fronet-refresh-token'

// Remove keys from the old storage scheme (access token + persisted user).
localStorage.removeItem('fronet-token')
localStorage.removeItem('fronet-auth')

// The access token lives in memory only; on reload it is re-issued from the refresh token.
let accessToken: string | null = null

export const getAccessToken = () => accessToken
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)

// Refresh-token rotation: only overwrite the refresh token when a new one is issued.
export function saveTokens({ access, refresh }: { access: string; refresh?: string }) {
  accessToken = access
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  accessToken = null
  localStorage.removeItem(REFRESH_KEY)
}
