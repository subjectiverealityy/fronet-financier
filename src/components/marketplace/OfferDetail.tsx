import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui'
import { getOffer, createCommitment, ApiError } from '@/lib/api'
import type { Commitment, Offer } from '@/types'
import { formatMoney } from '@/lib/utils'
import { OfferBody, DeploymentTracker, FundingTotal } from './offerShared'

export default function OfferDetail() {
  const navigate = useNavigate()
  const { slug = '' } = useParams()

  const { data: offer, isLoading, error } = useQuery({
    queryKey: ['offer', slug],
    queryFn: () => getOffer(slug),
    // A 404 won't fix itself on retry.
    retry: (count, err) => !(err instanceof ApiError && err.status === 404) && count < 2,
  })

  const notFound = error instanceof ApiError && error.status === 404

  return (
    <div className="min-h-dvh bg-surface-base flex flex-col max-w-md md:max-w-none mx-auto w-full">
      {/* Header */}
      <div className="bg-surface-1 border-b border-border px-4 md:px-6 py-4 safe-top flex items-center gap-3">
        <button
          onClick={() => navigate('/marketplace')}
          className="w-8 h-8 flex items-center justify-center text-text-tertiary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-base font-medium text-text-primary truncate">
          {offer?.title ?? 'Offer'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-3 flex flex-col gap-3 safe-bottom md:max-w-2xl md:mx-auto md:w-full">
        {isLoading && <p className="text-sm text-text-tertiary">Loading offer…</p>}

        {notFound && (
          <p role="alert" className="text-sm text-text-tertiary">
            This offer isn't available. It may have closed or been removed.
          </p>
        )}

        {error && !notFound && (
          <p role="alert" className="text-sm text-danger">
            We couldn't load this offer. Please try again later.
          </p>
        )}

        {offer && (
          <>
            <Card>
              {/* Image placeholder */}
              <div className="w-full h-24 bg-surface-2 border-b border-border flex items-center justify-center px-4">
                <p className="text-xs text-text-tertiary truncate">{offer.location} · {offer.asset_type}</p>
              </div>
              <OfferBody offer={offer} />
              <DeploymentTracker />
              <div className="px-4 py-3">
                <FundingTotal offer={offer} />
              </div>
            </Card>

            <CommitmentForm offer={offer} />
          </>
        )}
      </div>
    </div>
  )
}

function CommitmentForm({ offer }: { offer: Offer }) {
  const queryClient = useQueryClient()

  const unitPrice = Number(offer.unit_price)
  // Smallest number of units that meets the offer's minimum investment.
  const minUnits = Math.max(1, unitPrice > 0 ? Math.ceil(Number(offer.minimum_investment) / unitPrice) : 1)
  const maxUnits = offer.available_units

  const [units, setUnits] = useState(minUnits)
  const [commitment, setCommitment] = useState<Commitment | null>(null)

  const mutation = useMutation({
    mutationFn: (unitsToCommit: number) => createCommitment(offer.slug, { units: unitsToCommit }),
    onSuccess: (created) => {
      setCommitment(created)
      // Units left may have changed.
      queryClient.invalidateQueries({ queryKey: ['offers'] })
      queryClient.invalidateQueries({ queryKey: ['offer', offer.slug] })
    },
  })

  if (commitment) return <PendingCommitment commitment={commitment} />

  if (maxUnits === 0) {
    return <Card><p className="p-4 text-sm text-text-tertiary">This offer is fully funded.</p></Card>
  }

  if (!offer.is_open) {
    return <Card><p className="p-4 text-sm text-text-tertiary">This offer isn't open for funding right now.</p></Card>
  }

  if (maxUnits < minUnits) {
    return (
      <Card>
        <p className="p-4 text-sm text-text-tertiary">
          Not enough units are left to meet this offer's minimum investment.
        </p>
      </Card>
    )
  }

  // Keeps units a whole number between the minimum and units left (empty input → minimum).
  const clamp = (value: number) =>
    Math.min(maxUnits, Math.max(minUnits, Math.floor(value) || minUnits))
  const setClamped = (value: number) => setUnits(clamp(value))

  // Estimate only: the backend calculates the real amount.
  const estimate = clamp(units) * unitPrice

  return (
    <Card>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Fund this offer</p>
          <p className="text-xs text-text-tertiary mt-0.5">
            {formatMoney(offer.unit_price, offer.currency)} per unit · minimum {minUnits} unit{minUnits !== 1 ? 's' : ''} · {maxUnits} left
          </p>
        </div>

        <div>
          <label htmlFor="units" className="text-xs text-text-tertiary mb-1.5 block">Units</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Fewer units"
              onClick={() => setClamped(units - 1)}
              disabled={units <= minUnits || mutation.isPending}
              className="btn-ghost w-11 h-11 text-base disabled:opacity-40"
            >
              −
            </button>
            <input
              id="units"
              type="number"
              inputMode="numeric"
              min={minUnits}
              max={maxUnits}
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              onBlur={(e) => setClamped(Number(e.target.value))}
              disabled={mutation.isPending}
              className="flex-1 min-w-0 bg-surface-2 border border-border-strong rounded-card px-4 py-3 text-sm text-text-primary text-center"
            />
            <button
              type="button"
              aria-label="More units"
              onClick={() => setClamped(units + 1)}
              disabled={units >= maxUnits || mutation.isPending}
              className="btn-ghost w-11 h-11 text-base disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-card bg-surface-2 border border-border px-4 py-3">
          <p className="text-xs text-text-tertiary">Estimated amount</p>
          <p className="text-base font-semibold text-text-primary">{formatMoney(estimate, offer.currency)}</p>
        </div>

        {mutation.isError && (
          <p role="alert" className="text-sm text-danger">{mutation.error.message}</p>
        )}

        <button
          type="button"
          onClick={() => {
            // Send the corrected value directly; the state update lands after this click.
            const finalUnits = clamp(units)
            setUnits(finalUnits)
            mutation.mutate(finalUnits)
          }}
          disabled={mutation.isPending}
          className="btn-brand w-full py-3 text-sm disabled:opacity-50"
        >
          {mutation.isPending ? 'Submitting…' : 'Commit to fund'}
        </button>

        <p className="text-[11px] text-text-tertiary leading-relaxed">
          This records your intention to fund. It isn't a payment, and no money is taken.
          Payment will be available in a later step.
        </p>
      </div>
    </Card>
  )
}

// Per the API guide: a commitment is pending until payment is verified, so never
// present it as funded or active.
function PendingCommitment({ commitment }: { commitment: Commitment }) {
  return (
    <Card className="border-warning/30 bg-warning/5">
      <div className="p-4 flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Pending payment verification</p>
          <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
            Your commitment has been recorded. It isn't an active investment until payment is verified.
          </p>
        </div>

        <div className="grid grid-cols-3 border border-border rounded-lg overflow-hidden">
          {[
            { label: 'Units', value: String(commitment.units) },
            { label: 'Amount', value: formatMoney(commitment.amount, commitment.currency) },
            { label: 'Reference', value: `#${commitment.id}` },
          ].map((s, i) => (
            <div key={s.label} className={['px-2.5 py-2 min-w-0', i < 2 ? 'border-r border-border' : ''].join(' ')}>
              <p className="text-[10px] text-text-tertiary mb-1">{s.label}</p>
              <p className="text-sm font-medium text-text-primary truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
