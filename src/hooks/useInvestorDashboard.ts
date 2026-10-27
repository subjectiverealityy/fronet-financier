import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getInvestorDashboard, ApiError } from '@/lib/api'

// Shared by the KPI strip and the Revenue tab so the dashboard makes one request.
export function useInvestorDashboard() {
  const { user } = useAuthStore()
  return useQuery({
    // Keyed by user id so a different account signing in never sees cached figures.
    queryKey: ['investor-dashboard', user?.id],
    queryFn: getInvestorDashboard,
    enabled: !!user,
    // A 404 (endpoint not deployed) won't fix itself on retry.
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 2,
  })
}
