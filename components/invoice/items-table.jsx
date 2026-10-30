'use client'

import { Input } from '@/components/ui/input'
import { formatQty, roundQty } from '@/lib/delivery'
import { cn } from '@/lib/utils'

function entryFor(item, mode, quantities) {
  if (mode === 'full') return item.outstanding
  if (mode !== 'partial') return 0
  const n = Number(quantities[item.id])
  return Number.isFinite(n) && n > 0 ? n : 0
}

function QuantityInput({ item, value, onChange }) {
  const n = Number(value)
  const invalid = value !== '' && value !== undefined && (!Number.isFinite(n) || n < 0 || n > item.outstanding)
  const done = item.outstanding <= 0

  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        max={item.outstanding}
        step="any"
        value={value ?? ''}
        placeholder="0"
        disabled={done}
        onChange={(e) => onChange(item.id, e.target.value)}
        aria-label={`Quantity collected for ${item.description} (${item.unit})`}
        aria-invalid={invalid || undefined}
        className="h-10 w-24 text-right tabular-nums"
      />
      <button
        type="button"
        disabled={done}
        onClick={() => onChange(item.id, String(item.outstanding))}
        className="rounded-md px-2 py-1.5 text-xs font-medium text-primary hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
      >
        Max
      </button>
    </div>
  )
}

function OutstandingValue({ value, unit }) {
  return (
    <span className={cn('font-semibold tabular-nums', value > 0 ? 'text-warning-foreground' : 'text-success')}>
      {formatQty(value)} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
    </span>
  )
}

export function ItemsTable({ items, mode, quantities, onQuantityChange }) {
  const collecting = mode === 'partial' || mode === 'full'

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Product</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Invoiced</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Collected</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Outstanding</th>
              {collecting && (
                <>
                  <th scope="col" className="bg-accent/60 px-4 py-2.5 font-medium text-accent-foreground">
                    This collection
                  </th>
                  <th scope="col" className="bg-accent/60 px-4 py-2.5 text-right font-medium text-accent-foreground">
                    Remaining after
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => {
              const entry = entryFor(item, mode, quantities)
              const remaining = roundQty(Math.max(0, item.outstanding - entry))
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.description}</div>
                    <div className="font-mono text-xs text-muted-foreground">{item.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatQty(item.quantity)} <span className="text-xs text-muted-foreground">{item.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatQty(item.collected)}</td>
                  <td className="px-4 py-3 text-right">
                    <OutstandingValue value={item.outstanding} unit={item.unit} />
                  </td>
                  {collecting && (
                    <>
                      <td className="bg-accent/30 px-4 py-2">
                        {mode === 'partial' ? (
                          <QuantityInput item={item} value={quantities[item.id]} onChange={onQuantityChange} />
                        ) : (
                          <span className="font-semibold tabular-nums">{formatQty(entry)}</span>
                        )}
                      </td>
                      <td className="bg-accent/30 px-4 py-3 text-right">
                        <OutstandingValue value={remaining} unit={item.unit} />
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y md:hidden">
        {items.map((item) => {
          const entry = entryFor(item, mode, quantities)
          const remaining = roundQty(Math.max(0, item.outstanding - entry))
          return (
            <li key={item.id} className="flex flex-col gap-3 p-4">
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {item.sku} · {item.unit}
                </p>
              </div>
              <dl className="grid grid-cols-3 gap-2 rounded-md bg-muted/50 p-2.5 text-center">
                <div>
                  <dt className="text-[11px] text-muted-foreground">Invoiced</dt>
                  <dd className="font-semibold tabular-nums">{formatQty(item.quantity)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground">Collected</dt>
                  <dd className="font-semibold tabular-nums">{formatQty(item.collected)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-muted-foreground">Outstanding</dt>
                  <dd className={cn('font-semibold tabular-nums', item.outstanding > 0 ? 'text-warning-foreground' : 'text-success')}>
                    {formatQty(item.outstanding)}
                  </dd>
                </div>
              </dl>
              {collecting && item.outstanding > 0 && (
                <div className="flex items-center justify-between gap-3 rounded-md border border-primary/20 bg-accent/40 p-2.5">
                  {mode === 'partial' ? (
                    <QuantityInput item={item} value={quantities[item.id]} onChange={onQuantityChange} />
                  ) : (
                    <span className="text-sm">
                      Collect <strong className="tabular-nums">{formatQty(entry)}</strong> {item.unit}
                    </span>
                  )}
                  <span className="text-right text-xs text-muted-foreground">
                    Remaining
                    <br />
                    <OutstandingValue value={remaining} unit={item.unit} />
                  </span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
