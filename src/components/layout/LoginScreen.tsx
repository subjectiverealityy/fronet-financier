// LoginScreen.tsx
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function LoginScreen() {
  const { setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    navigate('/')  // add this line
    // TODO: replace with real API call — apiFetch('/auth/login', { method: 'POST', body: ... })
    await new Promise((r) => setTimeout(r, 800))
    setUser({
      id: '1',
      name: 'Demo Financier',
      email,
      kycStatus: 'none',
      role: 'partner',
    })
    setLoading(false)
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <p className="text-brand text-sm font-medium mb-1">FroNet</p>
          <h1 className="text-2xl font-semibold text-text-primary">Financier Portal</h1>
          <p className="text-text-tertiary text-sm mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
            <label className="text-xs text-text-tertiary mb-1.5 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                         text-sm text-text-primary placeholder:text-text-tertiary
                         focus:outline-none focus:border-brand/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full py-3 mt-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
