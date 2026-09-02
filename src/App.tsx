import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import DashboardPage from '@/pages/DashboardPage'
import MarketplacePage from '@/pages/MarketplacePage'
import SignupPage from '@/pages/SignupPage'
import KYCPage from '@/pages/KYCPage'
import ProfilePage from '@/pages/ProfilePage'

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/signup" replace />
  return <Outlet />
}

export default function App() {
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
