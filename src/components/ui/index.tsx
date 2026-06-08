import { cn } from '@/lib/utils'
import type { TxnStatus } from '@/types'

// ─── Badge ───────────────────────────────────────────────────────────────────

const statusMap: Record<TxnStatus, string> = {
  Success: 'bg-brand/10 text-brand',
  Abandoned: 'bg-warning/10 text-warning',
  Failed: 'bg-danger/10 text-danger',
}

export function StatusBadge({ status }: { status: TxnStatus }) {
  return (
    <span className={cn('badge', statusMap[status])}>
      {status}
    </span>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('card', className)}>{children}</div>
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('card-header', className)}>{children}</div>
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────

export function KpiCard({
  label,
  value,
  danger,
}: {
  label: string
  value: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className={cn('kpi-value', danger && 'text-danger')}>{value}</p>
    </div>
  )
}

// ─── Chip ────────────────────────────────────────────────────────────────────

export function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn('chip', active && 'chip-active')}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

// ─── Row ─────────────────────────────────────────────────────────────────────

export function RowItem({
  left,
  right,
  sub,
}: {
  left: React.ReactNode
  right: React.ReactNode
  sub?: React.ReactNode
}) {
  return (
    <div className="row-item">
      <div>
        <div className="text-sm font-medium text-text-primary">{left}</div>
        {sub && <div className="text-xs text-text-tertiary mt-0.5">{sub}</div>}
      </div>
      <div className="text-right">{right}</div>
    </div>
  )
}

// ─── Dot ─────────────────────────────────────────────────────────────────────

export function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: color }}
    />
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-5 h-5 border-2 border-border border-t-brand rounded-full animate-spin',
        className
      )}
    />
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-text-tertiary text-sm">
      {message}
    </div>
  )
}

// ─── ViewAllFooter ───────────────────────────────────────────────────────────

export function ViewAllFooter({ label = 'View all', onClick }: { label?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-xs text-text-tertiary text-center py-3 border-t border-border
                 hover:text-text-secondary transition-colors"
    >
      {label} →
    </button>
  )
}
