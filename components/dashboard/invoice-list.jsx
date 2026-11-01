'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/format'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'delivered', label: 'Delivered' },
]

export function InvoiceList({ invoices }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return invoices.filter(
      (inv) =>
        (filter === 'all' || inv.status === filter) &&
        (!q || inv.invoiceNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)),
    )
  }, [invoices, filter, query])

  const countFor = (value) => (value === 'all' ? invoices.length : invoices.filter((i) => i.status === value).length)

  return (
    <section aria-labelledby="invoices-heading" className="rounded-lg border bg-card">
      <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 id="invoices-heading" className="font-semibold">
          Invoices
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-full sm:w-fit">
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value} className="px-2.5">
                  {f.label}
                  <span className="text-xs text-muted-foreground tabular-nums">{countFor(f.value)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative sm:w-60">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoice or customer"
              aria-label="Search invoices"
              className="pl-8"
            />
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">No invoices match this filter.</p>
      ) : (
        <>
          <table className="hidden w-full text-sm md:table">
            <thead className="bg-muted/60 text-left text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Invoice</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Customer</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Progress</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.map((inv) => (
                <tr key={inv.id} className="group relative hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-sm font-medium">
                    <Link
                      href={`/invoices/${inv.invoiceNumber}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{inv.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.invoiceDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={inv.progress} className="w-24" aria-label={`${inv.progress}% collected`} />
                      <span className="w-9 text-xs text-muted-foreground tabular-nums">{inv.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight
                      className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y md:hidden">
            {visible.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/invoices/${inv.invoiceNumber}`}
                  className="flex flex-col gap-2 p-4 active:bg-muted/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="font-mono text-sm font-medium">{inv.invoiceNumber}</span>
                      <span className="truncate text-sm text-muted-foreground">{inv.customerName}</span>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={inv.progress} className="flex-1" aria-label={`${inv.progress}% collected`} />
                    <span className="text-xs text-muted-foreground tabular-nums">{inv.progress}%</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
