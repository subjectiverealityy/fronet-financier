import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui'
import { getOffers } from '@/lib/api'
import { trackMarketplaceKycBannerClicked, trackOfferClicked } from '@/lib/ga'
import type { Offer, DeploymentStage } from '@/types'

// PLACEHOLDER: offers from the backend have no rooms, install cost, deployment
// stage or GPS link yet. Replace these once the backend adds them.
const PLACEHOLDER = {
  rooms: '—',
  costOfInstall: '—',
  stage: 'paid' as DeploymentStage,
  gps: '',
}

const STAGES: DeploymentStage[] = ['paid', 'procured', 'invested', 'live']
const STAGE_LABELS: Record<DeploymentStage, string> = {
  paid: 'Paid', procured: 'Procured', invested: 'Invested', live: 'Live',
}

// Backend amounts are decimal strings in the offer's own currency.
function formatMoney(amount: string | number, currency: string) {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(Number(amount))
      .replace('NGN', '₦')
      .trim()
  } catch {
    // Unknown currency code: show it plainly rather than crash the card.
    return `${currency} ${amount}`
  }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

function fundingWindow(offer: Offer): string | null {
  const now = Date.now()
  if (offer.funding_opens_at && new Date(offer.funding_opens_at).getTime() > now) {
    return `Opens ${formatDate(offer.funding_opens_at)}`
  }
  if (offer.funding_closes_at) {
    const closed = new Date(offer.funding_closes_at).getTime() <= now
    return `${closed ? 'Closed' : 'Closes'} ${formatDate(offer.funding_closes_at)}`
  }
  return null
}

export default function Marketplace() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const kycDone = user?.kycStatus === 'verified'

  // Public list, the same for every user, so no user id in the key.
  const { data: offers, isLoading, isError } = useQuery({
    queryKey: ['offers'],
    queryFn: getOffers,
  })

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md md:max-w-none mx-auto w-full">
      {/* Header */}
      <div className="bg-surface-1 border-b border-border px-4 md:px-6 py-4 safe-top flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center text-text-tertiary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-base font-medium text-text-primary">Marketplace</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 flex flex-col gap-3 safe-bottom">
        {/* KYC banner — full width */}
        {!kycDone && <KYCBanner onComplete={() => {
          trackMarketplaceKycBannerClicked()
          navigate('/profile')
        }} />}

        {isLoading && <p className="text-sm text-text-tertiary">Loading offers…</p>}

        {isError && (
          <p role="alert" className="text-sm text-danger">
            We couldn't load offers. Please try again later.
          </p>
        )}

        {offers && offers.length === 0 && (
          <p className="text-sm text-text-tertiary">No offers are open right now. Check back soon.</p>
        )}

        {/* Offer cards — 1 col mobile, 3 cols desktop */}
        {offers && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} kycDone={kycDone} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KYCBanner({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="bg-info/10 border border-info/30 rounded-card p-3.5 flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-info/15 border border-info/30 flex items-center
                      justify-center flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0
               01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332
               9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-300">Complete your KYC to invest</p>
        <p className="text-xs text-blue-300/70 mt-0.5 mb-2 leading-relaxed">
          Add your NIN and BVN to unlock investment. Takes less than 2 minutes.
        </p>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-blue-300 bg-info/15 border border-info/30
                     rounded-pill px-3.5 py-1.5"
        >
          Complete verification →
        </button>
      </div>
    </div>
  )
}

function StatRow({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-3 border border-border rounded-lg overflow-hidden">
      {stats.map((s, i) => (
        <div key={s.label} className={['px-2.5 py-2 min-w-0', i < 2 ? 'border-r border-border' : ''].join(' ')}>
          <p className="text-[10px] text-text-tertiary mb-1">{s.label}</p>
          <p className="text-sm font-medium text-text-primary truncate" title={s.value}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

function OfferCard({ offer, kycDone }: { offer: Offer; kycDone: boolean }) {
  const currentStageIndex = STAGES.indexOf(PLACEHOLDER.stage)
  const raised = offer.units_sold * Number(offer.unit_price)
  const fullyFunded = offer.available_units === 0
  const fundingDates = fundingWindow(offer)

  const handleOfferClick = () => {
    trackOfferClicked(String(offer.id))
  }

  return (
    <Card>
      {/* Image placeholder */}
      <div className="w-full h-16 bg-surface-2 border-b border-border flex items-center justify-center px-4">
        <p className="text-xs text-text-tertiary truncate">{offer.location} · {offer.asset_type}</p>
      </div>

      {/* Body */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-base font-medium text-text-primary mb-0.5">{offer.title}</p>
        <p className="text-xs text-text-tertiary mb-2">
          {offer.location}{' '}
          {PLACEHOLDER.gps ? (
            <a href={PLACEHOLDER.gps} target="_blank" rel="noreferrer" className="text-brand">(GPS Location)</a>
          ) : (
            <span title="Location link coming soon">(GPS Location)</span>
          )}
        </p>
        {offer.summary && (
          <p className="text-xs text-text-secondary mb-3 leading-relaxed">{offer.summary}</p>
        )}

        <div className="flex flex-col gap-2">
          <StatRow
            stats={[
              { label: 'Rooms', value: PLACEHOLDER.rooms },
              { label: 'Cost of install', value: PLACEHOLDER.costOfInstall },
              { label: 'Projected returns', value: offer.target_return_note || '—' },
            ]}
          />
          <StatRow
            stats={[
              { label: 'Unit price', value: formatMoney(offer.unit_price, offer.currency) },
              { label: 'Min. investment', value: formatMoney(offer.minimum_investment, offer.currency) },
              { label: 'Units left', value: `${offer.available_units} / ${offer.total_units}` },
            ]}
          />
        </div>

        {(fundingDates || offer.risk_note || offer.terms_url) && (
          <div className="mt-3 flex flex-col gap-1 text-xs text-text-tertiary">
            {fundingDates && <p>{fundingDates}</p>}
            {offer.risk_note && <p>Risk: {offer.risk_note}</p>}
            {offer.terms_url && (
              <a href={offer.terms_url} target="_blank" rel="noreferrer" className="text-brand w-fit">
                View terms ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Progress tracker */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-text-tertiary mb-2.5">Deployment progress</p>
        <div className="flex items-center">
          {STAGES.map((stage, i) => {
            const done = i < currentStageIndex
            const current = i === currentStageIndex
            return (
              <div key={stage} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={[
                    'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0',
                    done ? 'bg-brand text-black' : current ? 'bg-white text-black' : 'bg-surface-2 border border-border-strong text-text-tertiary',
                  ].join(' ')}>
                    {done ? (
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4L3.5 6L6.5 2" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <p className={[
                    'text-[9px] mt-1 text-center leading-tight',
                    done ? 'text-brand font-semibold' : current ? 'text-white font-semibold' : 'text-text-tertiary',
                  ].join(' ')}>
                    {STAGE_LABELS[stage]}
                  </p>
                </div>
                {i < STAGES.length - 1 && (
                  <div className={['flex-1 h-px mb-4 mx-0.5', done ? 'bg-brand' : 'bg-border-strong'].join(' ')} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-tertiary">Funding</p>
          <p className="text-sm font-medium text-text-primary">
            {formatMoney(raised, offer.currency)} <span className="text-text-tertiary font-normal">/ {formatMoney(offer.target_amount, offer.currency)}</span>
          </p>
        </div>
        {fullyFunded ? (
          <button disabled className="btn-ghost opacity-50 cursor-default text-xs">Fully funded</button>
        ) : !offer.is_open ? (
          <button disabled className="btn-ghost opacity-50 cursor-default text-xs">Not open</button>
        ) : !kycDone ? (
          <button onClick={handleOfferClick} className="btn-brand text-xs">Fund now</button>
        ) : (
          <button onClick={handleOfferClick} className="btn-brand text-xs">Fund now</button>
        )}
      </div>
    </Card>
  )
}