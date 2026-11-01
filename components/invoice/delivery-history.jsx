import { UserRound } from 'lucide-react'
import { CollectionTypeBadge } from '@/components/collection-type-badge'
import { formatQty } from '@/lib/delivery'
import { formatDateTime } from '@/lib/format'

export function DeliveryHistory({ history }) {
  return (
    <section aria-labelledby="history-heading" className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b p-4">
        <h2 id="history-heading" className="font-semibold">
          Delivery history
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">{history.length} records</span>
      </div>
      {history.length === 0 ? (
        <p className="p-6 text-center text-sm text-muted-foreground">No collections recorded for this invoice yet.</p>
      ) : (
        <ol className="flex flex-col">
          {history.map((entry, index) => (
            <li key={entry.id} className="relative flex gap-3 px-4 py-4">
              <div className="flex flex-col items-center">
                <span
                  className={
                    entry.type === 'full'
                      ? 'mt-1 size-2.5 rounded-full bg-success'
                      : 'mt-1 size-2.5 rounded-full bg-warning'
                  }
                  aria-hidden="true"
                />
                {index < history.length - 1 && <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CollectionTypeBadge type={entry.type} />
                  <time dateTime={entry.collectedAt} className="text-sm font-medium">
                    {formatDateTime(entry.collectedAt)}
                  </time>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound className="size-3.5" aria-hidden="true" />
                  {entry.staff?.name} · {entry.staff?.employeeCode}
                </p>
                <ul className="flex flex-col gap-1 rounded-md bg-muted/50 p-2.5 text-sm">
                  {entry.lines.map((line) => (
                    <li key={line.invoiceItemId} className="flex justify-between gap-3">
                      <span className="truncate">{line.description}</span>
                      <span className="shrink-0 font-medium tabular-nums">
                        {formatQty(line.quantity)} {line.unit}
                      </span>
                    </li>
                  ))}
                </ul>
                {entry.notes ? <p className="text-xs text-muted-foreground italic">{`“${entry.notes}”`}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
