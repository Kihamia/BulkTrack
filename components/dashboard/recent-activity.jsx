import Link from 'next/link'
import { formatDateTime } from '@/lib/format'
import { CollectionTypeBadge } from '@/components/collection-type-badge'

export function RecentActivity({ collections }) {
  return (
    <section aria-labelledby="activity-heading" className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <h2 id="activity-heading" className="font-semibold">
          Recent collections
        </h2>
        <Link href="/activity" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      {collections.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">No collections recorded yet.</p>
      ) : (
        <ol className="divide-y">
          {collections.map((c) => (
            <li key={c.id}>
              <Link href={`/invoices/${c.invoiceNumber}`} className="flex flex-col gap-1 p-4 hover:bg-muted/40">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-medium">{c.invoiceNumber}</span>
                  <CollectionTypeBadge type={c.type} />
                </div>
                <p className="truncate text-sm text-muted-foreground">{c.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(c.collectedAt)} · {c.staff?.name}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
