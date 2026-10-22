import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Link, useNavigate } from 'react-router-dom'
import { login, getCurrentUser, toUser, ApiError } from '@/lib/api'
import { saveTokens } from '@/lib/session'

export default function LoginScreen() {
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)

    try {
      const response = await login({ email: email.trim(), password })

      saveTokens(response)

      // The login response includes the user; fall back to fetching it if not.
      const apiUser = response.user ?? (await getCurrentUser())

      setUser(toUser(apiUser))
      navigate('/')
    } catch (err) {
      // 400 means bad credentials. Keep it generic so we don't reveal
      // whether an account exists for this email.
      if (err instanceof ApiError && err.status === 400) {
        setError('Incorrect email or password.')
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

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-brand text-sm font-medium mb-1">FroNet</p>

          <h1 className="text-2xl font-semibold text-text-primary">
            Financier Portal
          </h1>

          <p className="text-text-tertiary text-sm mt-1">
            Sign in to your financier profile
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">
              Password
            </label>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-text-tertiary text-sm mt-6 text-center">
          New to FroNet?{' '}
          <Link to="/signup" className="text-brand">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
