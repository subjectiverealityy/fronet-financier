import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui'
import { formatNaira } from '@/lib/utils'
import type { Offer, DeploymentStage } from '@/types'

const MOCK_OFFERS: Offer[] = [
  { id: '1', name: 'Greenfield Hostel', institution: 'University of Ilorin', state: 'Kwara State', rooms: 120, costOfInstall: 800000, projectedReturns: 40, fundingRaised: 1600000, fundingTarget: 2400000, stage: 'invested', fullyFunded: false, gps: 'https://x.com' },
  { id: '2', name: 'Lekki Student Lodge', institution: 'University of Lagos', state: 'Lagos State', rooms: 80, costOfInstall: 600000, projectedReturns: 38, fundingRaised: 1400000, fundingTarget: 1800000, stage: 'procured', fullyFunded: false, gps: 'https://x.com' },
  { id: '3', name: 'Capitol View Hostel', institution: 'University of Abuja', state: 'FCT', rooms: 200, costOfInstall: 1200000, projectedReturns: 42, fundingRaised: 3600000, fundingTarget: 3600000, stage: 'paid', fullyFunded: true, gps: 'https://x.com' },
]

const STAGES: DeploymentStage[] = ['paid', 'procured', 'invested', 'live']
const STAGE_LABELS: Record<DeploymentStage, string> = {
  paid: 'Paid', procured: 'Procured', invested: 'Invested', live: 'Live',
}

export default function Marketplace() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const kycDone = user?.kycStatus === 'verified'

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-surface-1 border-b border-border px-4 py-4 safe-top flex items-center gap-3">
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

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 safe-bottom">
        {/* KYC banner */}
        {!kycDone && <KYCBanner onComplete={() => navigate('/kyc')} />}

        {/* Offer cards */}
        {MOCK_OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} kycDone={kycDone} />
        ))}
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

function OfferCard({ offer, kycDone }: { offer: Offer; kycDone: boolean }) {
  const currentStageIndex = STAGES.indexOf(offer.stage)

  return (
    <Card>
      {/* Image placeholder */}
      <div className="w-full h-16 bg-surface-2 border-b border-border flex items-center justify-center">
        <p className="text-xs text-text-tertiary">{offer.state} · {offer.institution}</p>
      </div>

      {/* Body */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-base font-medium text-text-primary mb-0.5">{offer.name}</p>
        <p className="text-xs text-text-tertiary mb-3">{offer.institution}, {offer.state} <a href={offer.gps}className="text-brand">(GPS Location)</a></p>
        <div className="grid grid-cols-3 border border-border rounded-lg overflow-hidden">
          {[
            { label: 'Rooms', value: offer.rooms },
            { label: 'Cost of install', value: formatNaira(offer.costOfInstall) },
            { label: 'Projected returns', value: `${offer.projectedReturns}%` },
          ].map((s, i) => (
            <div key={s.label} className={['px-2.5 py-2', i < 2 ? 'border-r border-border' : ''].join(' ')}>
              <p className="text-[10px] text-text-tertiary mb-1">{s.label}</p>
              <p className="text-sm font-medium text-text-primary">{s.value}</p>
            </div>
          ))}
        </div>
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
            {formatNaira(offer.fundingRaised)} <span className="text-text-tertiary font-normal">/ {formatNaira(offer.fundingTarget)}</span>
          </p>
        </div>
        {offer.fullyFunded ? (
          <button disabled className="btn-ghost opacity-50 cursor-default text-xs">Fully funded</button>
        ) : !kycDone ? (
          <button className="btn-brand text-xs">Fund now</button>
        ) : (
          <button className="btn-brand text-xs">Fund now</button>
        )}
      </div>
    </Card>
  )
}
