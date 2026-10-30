import { CheckCircle2, Clock, PackageOpen } from 'lucide-react'
import { STATUS_LABELS } from '@/lib/delivery'
import { cn } from '@/lib/utils'

const STYLES = {
  pending: { className: 'bg-muted text-muted-foreground ring-border', Icon: Clock },
  partial: { className: 'bg-warning/15 text-warning-foreground ring-warning/40', Icon: PackageOpen },
  delivered: { className: 'bg-success/12 text-success ring-success/30', Icon: CheckCircle2 },
}

export function StatusBadge({ status, className }) {
  const { className: tone, Icon } = STYLES[status] ?? STYLES.pending
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        tone,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  )
}
