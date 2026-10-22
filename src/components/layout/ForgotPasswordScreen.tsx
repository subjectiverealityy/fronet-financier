import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '@/lib/api'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)

    try {
      await requestPasswordReset(email.trim())
      setSent(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-brand text-sm font-medium mb-1">FroNet</p>

          <h1 className="text-2xl font-semibold text-text-primary">
            Reset your password
          </h1>

          <p className="text-text-tertiary text-sm mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          // Same message whether or not the email has an account, so we
          // don't reveal which emails are registered.
          <p className="text-sm text-text-secondary">
            If an account exists for <span className="text-text-primary">{email.trim()}</span>,
            you'll receive an email with a link to reset your password. Check your inbox
            (and your spam folder).
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-text-tertiary mb-1.5 block">
                Email
              </label>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
                placeholder="you@example.com"
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
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-text-tertiary text-sm mt-6 text-center">
          <Link to="/login" className="text-brand">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
