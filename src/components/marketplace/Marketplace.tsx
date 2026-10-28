import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui'
import { getOffers } from '@/lib/api'
import { trackMarketplaceKycBannerClicked, trackOfferClicked } from '@/lib/ga'
import type { Offer } from '@/types'
import { OfferBody, DeploymentTracker, FundingTotal } from './offerShared'
import { SAMPLE_OFFERS, SHOW_SAMPLE_OFFERS } from './sampleOffers'

export default function Marketplace() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const kycDone = user?.kycStatus === 'verified'

  // Public list, the same for every user, so no user id in the key.
  const { data: realOffers, isLoading, isError } = useQuery({
    queryKey: ['offers'],
    queryFn: getOffers,
  })

  // In development only, fall back to sample offers when the real list fails or is empty.
  const showSamples = SHOW_SAMPLE_OFFERS && (isError || realOffers?.length === 0)
  const offers = showSamples ? SAMPLE_OFFERS : realOffers

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

        {showSamples && (
          <p className="text-xs text-warning bg-warning/10 border border-warning/30 rounded-card px-3 py-2">
            Development preview: showing sample offers because real offers couldn't be loaded.
            Production users won't see these.
          </p>
        )}

        {isError && !showSamples && (
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
              <OfferCard key={offer.id} offer={offer} />
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


function OfferCard({ offer }: { offer: Offer }) {
  const navigate = useNavigate()
  const fullyFunded = offer.available_units === 0

  const openOffer = () => {
    trackOfferClicked(String(offer.id))
    navigate(`/marketplace/${offer.slug}`)
  }

  return (
    <Card>
      {/* Image placeholder */}
      <div className="w-full h-16 bg-surface-2 border-b border-border flex items-center justify-center px-4">
        <p className="text-xs text-text-tertiary truncate">{offer.location} · {offer.asset_type}</p>
      </div>

      <OfferBody offer={offer} onTitleClick={openOffer} />
      <DeploymentTracker />

      {/* Footer */}
      <div className="px-4 py-3 flex items-center justify-between">
        <FundingTotal offer={offer} />
        {fullyFunded ? (
          <button disabled className="btn-ghost opacity-50 cursor-default text-xs">Fully funded</button>
        ) : !offer.is_open ? (
          <button disabled className="btn-ghost opacity-50 cursor-default text-xs">Not open</button>
        ) : (
          <button onClick={openOffer} className="btn-brand text-xs">Fund now</button>
        )}
      </div>
    </Card>
  )
}
