import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import DashboardPage from '@/pages/DashboardPage'
import MarketplacePage from '@/pages/MarketplacePage'
import SignupPage from '@/pages/SignupPage'
import LoginPage from '@/pages/LoginPage'
import KYCPage from '@/pages/KYCPage'
import ProfilePage from '@/pages/ProfilePage'
import HealthCheckStatusBanner from '@/components/HealthCheckStatusBanner'
import { trackPageView } from '@/lib/ga'
import { restoreSession } from '@/lib/api'
import { usePageEngagement } from '@/hooks/usePageEngagement'

function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location.pathname])
}

let restoring: Promise<void> | null = null

function useRestoreSession() {
  useEffect(() => {
    restoring ??= restoreSession().then((user) =>
      useAuthStore.getState().restoreUser(user)
    )
  }, [])
}

function ProtectedRoute() {
  const { isAuthenticated, isRestoring } = useAuthStore()
  if (isRestoring) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

// Send already signed-in users to the dashboard.
function GuestRoute() {
  const { isAuthenticated, isRestoring } = useAuthStore()
  if (isRestoring) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}

export default function App() {
  useRestoreSession()
  usePageTracking()
  usePageEngagement()

  return (
    <>
      <HealthCheckStatusBanner />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
