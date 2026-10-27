// Pieces shared by the marketplace offer cards and the offer detail page.
import type { Offer, DeploymentStage } from '@/types'
import { formatMoney } from '@/lib/utils'

export { formatMoney }

// PLACEHOLDER: offers from the backend have no rooms, install cost, deployment
// stage or GPS link yet. Replace these once the backend adds them.
export const PLACEHOLDER = {
  rooms: '—',
  costOfInstall: '—',
  stage: 'paid' as DeploymentStage,
  gps: '',
}

const STAGES: DeploymentStage[] = ['paid', 'procured', 'invested', 'live']
const STAGE_LABELS: Record<DeploymentStage, string> = {
  paid: 'Paid', procured: 'Procured', invested: 'Invested', live: 'Live',
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

// Title, location, summary, the two stat rows, funding dates, risk note and terms.
export function OfferBody({ offer, onTitleClick }: { offer: Offer; onTitleClick?: () => void }) {
  const fundingDates = fundingWindow(offer)

  return (
    <div className="px-4 py-3 border-b border-border">
      {onTitleClick ? (
        <button onClick={onTitleClick} className="text-base font-medium text-text-primary mb-0.5 text-left">
          {offer.title}
        </button>
      ) : (
        <p className="text-base font-medium text-text-primary mb-0.5">{offer.title}</p>
      )}
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
  )
}

export function DeploymentTracker() {
  const currentStageIndex = STAGES.indexOf(PLACEHOLDER.stage)

  return (
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
  )
}

export function FundingTotal({ offer }: { offer: Offer }) {
  const raised = offer.units_sold * Number(offer.unit_price)

  return (
    <div>
      <p className="text-xs text-text-tertiary">Funding</p>
      <p className="text-sm font-medium text-text-primary">
        {formatMoney(raised, offer.currency)} <span className="text-text-tertiary font-normal">/ {formatMoney(offer.target_amount, offer.currency)}</span>
      </p>
    </div>
  )
}
