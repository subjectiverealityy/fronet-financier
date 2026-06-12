import { useState } from 'react'
import { formatNaira } from '@/lib/utils'

interface Props {
  open: boolean
  balance: number
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

export default function PayoutModal({ open, balance, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    setDone(true)
  }

  function handleClose() {
    setDone(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={handleClose}>
      <div
        className="w-full max-w-md bg-surface-1 border-t border-border-strong rounded-t-2xl p-5 safe-bottom animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Payout requested</p>
              <p className="text-xs text-text-tertiary mt-1 max-w-xs">
                {formatNaira(balance)} will be sent to your verified bank account within 48 hours.
              </p>
            </div>
            <button onClick={handleClose} className="btn-brand mt-2 text-sm w-full">Done</button>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-text-primary mb-1">Request payout</p>
            <p className="text-xs text-text-tertiary mb-4 leading-relaxed">
              Your full available balance will be processed to your verified bank account within 48 hours.
            </p>
            <div className="bg-surface-2 border border-border rounded-card p-4 mb-4">
              <p className="text-xs text-text-tertiary mb-1">Amount</p>
              <p className="text-2xl font-semibold text-brand">{formatNaira(balance)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleClose} className="btn-ghost flex-1 text-sm">Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn-brand flex-1 text-sm disabled:opacity-50"
              >
                {loading ? 'Requesting…' : 'Confirm'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}