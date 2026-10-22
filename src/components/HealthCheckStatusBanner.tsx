import { useApiHealth } from '@/hooks/useApiHealth'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export default function HealthCheckStatusBanner() {
  const { isUnreachable } = useApiHealth()
  const isOnline = useOnlineStatus()
  if (!isUnreachable) return null

  const message = isOnline
    ? "We're having trouble reaching our servers. Please try again shortly."
    : "You may be offline. Please check your internet connection and try again."

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 border-b border-warning/40 bg-surface-3 px-4 py-2 text-center text-sm text-warning"
    >
      {message}
    </div>
  )
}
