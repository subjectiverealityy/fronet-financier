import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import DashboardPage from '@/pages/DashboardPage'
import MarketplacePage from '@/pages/MarketplacePage'
import SignupPage from '@/pages/SignupPage'
import KYCPage from '@/pages/KYCPage'
import ProfilePage from '@/pages/ProfilePage'
import { trackPageView } from '@/lib/ga'
import { usePageEngagement } from '@/hooks/usePageEngagement'

function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location.pathname])
}

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/signup" replace />
  return <Outlet />
}

export default function App() {
  usePageTracking()
  usePageEngagement()

  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
