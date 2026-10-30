import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/status-badge'
import { formatDate, formatDateTime } from '@/lib/format'

export function InvoiceSummary({ invoice }) {
  const fulfilled = invoice.items.filter((i) => i.outstanding <= 0).length

  return (
    <section aria-labelledby="invoice-heading" className="rounded-lg border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Invoice</p>
          <h1 id="invoice-heading" className="font-mono text-2xl font-semibold tracking-tight">
            {invoice.invoiceNumber}
          </h1>
        </div>
        <StatusBadge status={invoice.status} className="self-start text-sm" />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Customer</dt>
          <dd className="font-medium">{invoice.customerName}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Invoice date</dt>
          <dd className="font-medium">{formatDate(invoice.invoiceDate)}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Last collection</dt>
          <dd className="font-medium">{invoice.lastCollectedAt ? formatDateTime(invoice.lastCollectedAt) : '—'}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col gap-2 border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {fulfilled} of {invoice.items.length} products fulfilled · {invoice.collectionCount}{' '}
            {invoice.collectionCount === 1 ? 'collection' : 'collections'}
          </span>
          <span className="font-semibold tabular-nums">{invoice.progress}%</span>
        </div>
        <Progress
          value={invoice.progress}
          aria-label={`${invoice.progress}% of invoiced quantity collected`}
          className="[&_[data-slot=progress-track]]:h-2"
        />
      </div>
    </section>
  )
}
