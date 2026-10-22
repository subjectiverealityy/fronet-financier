import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { trackSignupStarted, trackSignupSuccess } from '@/lib/ga'
import { register } from '@/lib/api'

export default function SignupScreen() {
  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
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

    trackSignupStarted()
    setLoading(true)

    try {
      const response = await register({
        email: email.trim(),
        password1: password,
        password2: confirmPassword,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        ...(referralCode.trim()
          ? { referral_code: referralCode.trim() }
          : {}),
      })

      // Store the tokens returned by the backend.
      localStorage.setItem('fronet-token', response.access)
      localStorage.setItem('fronet-refresh-token', response.refresh)

      // Fetch the canonical authenticated user record.
      // This avoids guessing user fields from the registration response.
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/user/`,
        {
          headers: {
            Authorization: `Bearer ${response.access}`,
          },
        }
      )

      if (!userResponse.ok) {
        throw new Error(
          'Your account was created, but we could not load your profile. Please sign in.'
        )
      }

      const apiUser = await userResponse.json()

      // Map the backend user into the existing frontend User model.
      setUser({
        id: String(apiUser.pk),
        name:
          apiUser.full_name ||
          `${apiUser.first_name} ${apiUser.last_name}`.trim(),
        firstName: apiUser.first_name,
        lastName: apiUser.last_name,
        email: apiUser.email,
        kycStatus: 'none',
        role: 'prospect',
      })

      trackSignupSuccess(email.trim())
      navigate('/')
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'

      setError(message)
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
            Create your financier profile
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">
              First name
            </label>

            <input
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
            />
          </div>

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">
              Last name
            </label>

            <input
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
            />
          </div>

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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
            />
          </div>

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">
              Confirm password
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

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">
              Referral code
            </label>

            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
              placeholder="Optional"
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
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}
