import { useNavigate } from 'react-router-dom'

// Header with a back-to-dashboard button, for pages opened from the dashboard overview.
export default function SubPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md md:max-w-none mx-auto w-full">
      <div className="bg-surface-1 border-b border-border px-4 md:px-6 py-4 safe-top flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to dashboard"
          className="w-8 h-8 flex items-center justify-center text-text-tertiary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-base font-medium text-text-primary">{title}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 flex flex-col gap-3 safe-bottom">
        {children}
      </div>
    </div>
  )
}
