import { cn } from '@/lib/utils'

export function CollectionTypeBadge({ type, className }) {
  const full = type === 'full'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
        full ? 'bg-success/12 text-success' : 'bg-warning/15 text-warning-foreground',
        className,
      )}
    >
      {full ? 'Full' : 'Partial'}
    </span>
  )
}
