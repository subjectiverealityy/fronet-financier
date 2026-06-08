import { useDashboardStore } from '@/store/dashboardStore'
import { cn } from '@/lib/utils'

// Placeholder locations — replace with useQuery(getMyLocations) once API is live
const MY_LOCATIONS = [
  { id: 'bims', name: 'Bims Hostel', institution: 'University of Ilorin', status: 'Live' },
  { id: 'zaha', name: 'ZAHA Hostel', institution: 'University of Lagos', status: 'Live' },
  { id: 'kings', name: 'Kings Court', institution: 'Covenant University', status: 'Live' },
]

interface Props {
  open: boolean
  onToggle: () => void
  onClose: () => void
}

export default function LocationDropdown({ open, onToggle, onClose }: Props) {
  const { selectedView, setSelectedView } = useDashboardStore()

  const currentLabel =
    selectedView === 'all'
      ? 'All deployments'
      : (MY_LOCATIONS.find((l) => l.id === selectedView)?.name ?? 'Select location')

  function select(id: string) {
    setSelectedView(id)
    onClose()
  }

  return (
    <div className="relative z-30">
      <button
        className="flex items-center gap-1.5 text-[18px] font-medium text-text-primary"
        onClick={onToggle}
      >
        {currentLabel}
        <svg
          className={cn('w-4 h-4 text-text-tertiary transition-transform', open && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-1 border border-border-strong
                        rounded-card overflow-hidden shadow-2xl animate-fade-in">
          {/* All deployments */}
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest px-4 pt-3 pb-1.5">
            My deployments
          </p>
          <DropdownItem
            name="All deployments"
            sub={`Across your ${MY_LOCATIONS.length} locations`}
            active={selectedView === 'all'}
            onClick={() => select('all')}
          />

          {/* Individual locations */}
          <p className="text-[10px] text-text-tertiary uppercase tracking-widest px-4 pt-3 pb-1.5 border-t border-border mt-1">
            Individual locations
          </p>
          {MY_LOCATIONS.map((loc) => (
            <DropdownItem
              key={loc.id}
              name={loc.name}
              sub={`${loc.institution} · ${loc.status}`}
              active={selectedView === loc.id}
              onClick={() => select(loc.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DropdownItem({
  name, sub, active, onClick,
}: {
  name: string; sub: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      className={cn(
        'w-full flex items-center justify-between px-4 py-3 border-t border-border text-left',
        active ? 'bg-brand/5' : 'hover:bg-surface-2'
      )}
      onClick={onClick}
    >
      <div>
        <p className={cn('text-sm font-medium', active ? 'text-brand' : 'text-text-primary')}>{name}</p>
        <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>
      </div>
      {active && (
        <span className="w-4 h-4 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
          <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 4L3.5 6L6.5 2" />
          </svg>
        </span>
      )}
    </button>
  )
}
