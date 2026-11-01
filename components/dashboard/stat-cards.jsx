import { CheckCircle2, Clock, FileText, PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCards({ invoices }) {
  const count = (status) => invoices.filter((inv) => inv.status === status).length
  const stats = [
    { label: 'Total invoices', value: invoices.length, Icon: FileText, tone: 'bg-accent text-accent-foreground' },
    { label: 'Pending', value: count('pending'), Icon: Clock, tone: 'bg-muted text-muted-foreground' },
    {
      label: 'Partially delivered',
      value: count('partial'),
      Icon: PackageOpen,
      tone: 'bg-warning/15 text-warning-foreground',
    },
    { label: 'Fully delivered', value: count('delivered'), Icon: CheckCircle2, tone: 'bg-success/12 text-success' },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, Icon, tone }) => (
        <div key={label} className="flex items-center gap-3 rounded-lg border bg-card p-4">
          <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-md', tone)}>
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <dt className="truncate text-xs font-medium text-muted-foreground">{label}</dt>
            <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
