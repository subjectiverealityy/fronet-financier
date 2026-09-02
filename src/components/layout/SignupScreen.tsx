// SignupScreen.tsx
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function SignupScreen() {
  const { setUser } = useAuthStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: replace with real API call — apiFetch('/auth/signup', { method: 'POST', body: ... })
    await new Promise((r) => setTimeout(r, 800))
    setUser({
      id: '1',
      name: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email,
      referralCode: referralCode.trim() || undefined,
      kycStatus: 'none',
      role: 'prospect',
    })
    setLoading(false)
    navigate('/')  
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-brand text-sm font-medium mb-1">FroNet</p>
          <h1 className="text-2xl font-semibold text-text-primary">Financier Portal</h1>
          <p className="text-text-tertiary text-sm mt-1">Create your financier profile</p>
        </div>
        <form onSubmit={handleSignup} className="flex flex-col gap-3">

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">First name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                        text-sm text-text-primary placeholder:text-text-tertiary
                        focus:outline-none focus:border-brand/50"
            />
          </div>

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">Last name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                        text-sm text-text-primary placeholder:text-text-tertiary
                        focus:outline-none focus:border-brand/50"
            />
          </div>

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                         text-sm text-text-primary placeholder:text-text-tertiary
                         focus:outline-none focus:border-brand/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-text-tertiary mb-1.5 block">Referral code</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                        text-sm text-text-primary placeholder:text-text-tertiary
                        focus:outline-none focus:border-brand/50"
              placeholder="(optional)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full py-3 mt-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}
