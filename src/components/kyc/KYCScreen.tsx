import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function KYCScreen() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [nin, setNin] = useState('')
  const [bvn, setBvn] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: replace with real call — submitKYC({ nin, bvn })
    await new Promise((r) => setTimeout(r, 1000))
    if (user) setUser({ ...user, kycStatus: 'pending' })
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md mx-auto">
      <div className="bg-surface-1 border-b border-border px-4 py-4 safe-top flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-text-tertiary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-base font-medium text-text-primary">Identity verification</p>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-6 safe-bottom">
        {done ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">Verification submitted</p>
              <p className="text-sm text-text-tertiary mt-1 max-w-xs">
                Your NIN and BVN are being verified. This usually takes a few minutes.
              </p>
            </div>
            <button onClick={() => navigate('/')} className="btn-brand mt-2">
              Back to dashboard
            </button>
          </div>
        ) : (
          <>
            <div>
              <p className="text-sm text-text-secondary leading-relaxed">
                To invest in FroNet deployments, we need to verify your identity. Your NIN and BVN
                are encrypted and stored securely.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">
                  National Identification Number (NIN)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  required
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                             text-sm text-text-primary placeholder:text-text-tertiary font-mono
                             focus:outline-none focus:border-brand/50 tracking-widest"
                  placeholder="00000000000"
                />
              </div>
              <div>
                <label className="text-xs text-text-tertiary mb-1.5 block">
                  Bank Verification Number (BVN)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  required
                  value={bvn}
                  onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3
                             text-sm text-text-primary placeholder:text-text-tertiary font-mono
                             focus:outline-none focus:border-brand/50 tracking-widest"
                  placeholder="00000000000"
                />
              </div>
              <p className="text-xs text-text-tertiary leading-relaxed">
                By submitting, you consent to FroNet verifying your identity through NIMC and
                your bank. Your data will not be shared with third parties.
              </p>
              <button
                type="submit"
                disabled={loading || nin.length !== 11 || bvn.length !== 11}
                className="btn-brand w-full py-3 text-sm disabled:opacity-40"
              >
                {loading ? 'Submitting…' : 'Submit for verification'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs text-text-tertiary text-center"
              >
                Do this later
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
