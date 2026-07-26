import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function KYCScreen() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [nin, setNin] = useState('')
  const [bvn, setBvn] = useState('')
  const [residency, setResidency] = useState<'nigeria' | 'diaspora'>('nigeria')
  const [country, setCountry] = useState('NG')
  const [currency, setCurrency] = useState('NGN')
  const [passportId, setPassportId] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    if (user) setUser({ ...user, kycStatus: 'pending' })
    setLoading(false)
    setDone(true)
  }

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md md:max-w-none mx-auto w-full">
      <div className="bg-surface-1 border-b border-border px-4 md:px-6 py-4 safe-top flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center text-text-tertiary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-base font-medium text-text-primary">Identity verification</p>
      </div>

      <div className="flex-1 px-4 md:px-6 py-6 md:py-12 safe-bottom flex flex-col md:flex-row md:items-start md:justify-center md:gap-16">
        <div className="hidden md:block md:max-w-sm md:pt-2">
          <p className="text-2xl font-semibold text-text-primary mb-3">Verify your identity</p>
          <p className="text-sm text-text-secondary leading-relaxed mb-6">
            To invest in FroNet deployments, we need to verify your identity. We tailor the verification path for local and diaspora financiers so onboarding stays clear and compliant.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: 'Why we ask', body: 'Nigerian financial regulations require KYC before accepting investment funds.' },
              { title: 'How long it takes', body: 'Verification is usually instant, but can take a few minutes during busy periods.' },
              { title: 'Your data', body: 'Never shared with third parties beyond regulatory verification.' },
            ].map((item) => (
              <div key={item.title} className="bg-surface-1 border border-border rounded-card p-3">
                <p className="text-xs font-medium text-text-primary mb-1">{item.title}</p>
                <p className="text-xs text-text-tertiary leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md">
          {done ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 py-12">
              <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-text-primary">Verification submitted</p>
                <p className="text-sm text-text-tertiary mt-1 max-w-xs">
                  Your onboarding details are being reviewed. This usually takes a few minutes.
                </p>
              </div>
              <button onClick={() => navigate('/')} className="btn-brand mt-2">
                Back to dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="md:hidden mb-6">
                <p className="text-sm text-text-secondary leading-relaxed">
                  To invest in FroNet deployments, we need to verify your identity. We tailor the process for local and diaspora financiers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="rounded-card border border-border bg-surface-1 p-3">
                  <label className="text-xs text-text-tertiary mb-2 block">Where are you based?</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setResidency('nigeria')}
                      className={`flex-1 rounded-pill border px-3 py-2 text-sm ${residency === 'nigeria' ? 'border-brand bg-brand/10 text-brand' : 'border-border text-text-secondary'}`}
                    >
                      Nigeria
                    </button>
                    <button
                      type="button"
                      onClick={() => setResidency('diaspora')}
                      className={`flex-1 rounded-pill border px-3 py-2 text-sm ${residency === 'diaspora' ? 'border-brand bg-brand/10 text-brand' : 'border-border text-text-secondary'}`}
                    >
                      Outside Nigeria
                    </button>
                  </div>
                </div>

                {residency === 'diaspora' && (
                  <div className="rounded-card border border-brand/20 bg-brand/5 p-3 flex flex-col gap-3">
                    <p className="text-sm font-medium text-text-primary">Diaspora onboarding</p>
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      We will request your passport or international ID, preferred currency, and country of residence for compliance and settlement.
                    </p>
                    <div>
                      <label className="text-xs text-text-tertiary mb-1.5 block">Country of residence</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
                      >
                        <option value="NG">Nigeria</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-text-tertiary mb-1.5 block">Preferred currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand/50"
                      >
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-text-tertiary mb-1.5 block">Passport / international ID</label>
                      <input
                        type="text"
                        value={passportId}
                        onChange={(e) => setPassportId(e.target.value)}
                        className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand/50"
                        placeholder="Passport number"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">National Identification Number (NIN)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    required
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary font-mono focus:outline-none focus:border-brand/50 tracking-widest"
                    placeholder="00000000000"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-tertiary mb-1.5 block">Bank Verification Number (BVN)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    required
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-surface-1 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary font-mono focus:outline-none focus:border-brand/50 tracking-widest"
                    placeholder="00000000000"
                  />
                </div>
                <p className="text-xs text-text-tertiary leading-relaxed">
                  By submitting, you consent to FroNet verifying your identity through NIMC and your bank. Diaspora submissions may require additional compliance checks.
                </p>
                <button
                  type="submit"
                  disabled={loading || nin.length !== 11 || bvn.length !== 11 || (residency === 'diaspora' && passportId.trim().length < 3)}
                  className="btn-brand w-full py-3 text-sm disabled:opacity-40"
                >
                  {loading ? 'Submitting…' : 'Submit for verification'}
                </button>
                <button type="button" onClick={() => navigate(-1)} className="text-xs text-text-tertiary text-center">
                  Do this later
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}