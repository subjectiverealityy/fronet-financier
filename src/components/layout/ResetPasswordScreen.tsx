import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { confirmPasswordReset, ApiError } from '@/lib/api'

const INVALID_LINK_MESSAGE =
  'This reset link is invalid or has expired. Please request a new one.'

// Opened from the reset email: /reset-password?uid=<uid>&token=<token>
export default function ResetPasswordScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid') ?? ''
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setError('')

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Your password must be at least 8 characters long.')
      return
    }

    setLoading(true)

    try {
      // uid and token go back exactly as they arrived in the link.
      await confirmPasswordReset({
        uid,
        token,
        new_password1: password,
        new_password2: confirmPassword,
      })
      navigate('/login', {
        replace: true,
        state: { message: 'Your password has been reset. Sign in with your new password.' },
      })
    } catch (err) {
      if (err instanceof ApiError && (err.fields.uid || err.fields.token)) {
        setError(INVALID_LINK_MESSAGE)
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

  const linkIsIncomplete = !uid || !token

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-brand text-sm font-medium mb-1">FroNet</p>

          <h1 className="text-2xl font-semibold text-text-primary">
            Choose a new password
          </h1>
        </div>

        {linkIsIncomplete ? (
          <p role="alert" className="text-sm text-red-500">
            {INVALID_LINK_MESSAGE}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-text-tertiary mb-1.5 block">
                New password
              </label>

              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
              />
            </div>

            <div>
              <label className="text-xs text-text-tertiary mb-1.5 block">
                Confirm new password
              </label>

              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-500"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full py-3 mt-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset password'}
            </button>
          </form>
        )}

        <p className="text-text-tertiary text-sm mt-6 text-center">
          <Link to="/forgot-password" className="text-brand">
            Request a new link
          </Link>
        </p>
      </div>
    </div>
  )
}
