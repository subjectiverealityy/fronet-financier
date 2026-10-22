import { useQuery } from '@tanstack/react-query'
import { checkApiHealth } from '@/lib/api'
import { useApiStatusStore } from '@/store/apiStatusStore'

const RECHECK_INTERVAL_MS = 15_000

export function useApiHealth() {
  const hasNetworkFailure = useApiStatusStore((s) => s.hasNetworkFailure)
  const clearNetworkFailure = useApiStatusStore((s) => s.clearNetworkFailure)

  const { isError } = useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      const health = await checkApiHealth()
      clearNetworkFailure()
      return health
    },
    enabled: hasNetworkFailure,
    retry: false,
    staleTime: 0,
    refetchInterval: hasNetworkFailure ? RECHECK_INTERVAL_MS : false,
  })

  return { isUnreachable: hasNetworkFailure && isError }
}
