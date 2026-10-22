import { useState } from 'react'
import { changePassword, ApiError } from '@/lib/api'

interface Props {
  open: boolean
  onClose: () => void
}

const inputClass =
  'w-full bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary'

export default function ChangePasswordModal({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setError('')

    if (newPassword !== confirmPassword) {
      setError('Your new passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Your new password must be at least 8 characters long.')
      return
    }

    setLoading(true)

    try {
      await changePassword({
        old_password: currentPassword,
        new_password1: newPassword,
        new_password2: confirmPassword,
      })
      setDone(true)
    } catch (err) {
      if (err instanceof ApiError && err.fields.old_password) {
        setError('Your current password is incorrect.')
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Clear everything so passwords don't linger if the modal is reopened.
  function handleClose() {
    if (loading) return
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setDone(false)
    onClose()
  }

  return (
    // Bottom sheet on mobile. Centered modal from the md breakpoint up.
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 md:p-4" onClick={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="w-full max-w-md bg-surface-1 border-t md:border border-border-strong rounded-t-2xl md:rounded-2xl p-5 safe-bottom animate-fade-up"
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
              <p className="text-sm font-semibold text-text-primary">Password changed</p>
              <p className="text-xs text-text-tertiary mt-1 max-w-xs">
                Use your new password the next time you sign in.
              </p>
            </div>
            <button onClick={handleClose} className="btn-brand mt-2 text-sm w-full">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p id="change-password-title" className="text-sm font-semibold text-text-primary mb-4">
              Change password
            </p>

            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Current password</label>
                <input
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">New password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-danger">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={handleClose} className="btn-ghost flex-1 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-brand flex-1 text-sm disabled:opacity-50"
              >
                {loading ? 'Changing…' : 'Change password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
