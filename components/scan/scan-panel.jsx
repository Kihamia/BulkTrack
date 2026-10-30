'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Keyboard, Loader2, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrScanner } from '@/components/scan/qr-scanner'
import { normalizeInvoiceNumber, parseScannedCode } from '@/lib/delivery'

export function ScanPanel({ sampleNumbers }) {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState(null)

  async function openInvoice(invoiceNumber) {
    if (!invoiceNumber) {
      setError('Enter an invoice number.')
      return
    }
    setChecking(true)
    setError(null)
    try {
      const res = await fetch(`/api/invoices/${encodeURIComponent(invoiceNumber)}`, { method: 'GET' })
      if (res.status === 404) {
        setError(`Invoice ${invoiceNumber} was not found.`)
        toast.error(`Invoice ${invoiceNumber} not found`)
        return
      }
      if (!res.ok) throw new Error('Lookup failed')
      router.push(`/invoices/${encodeURIComponent(invoiceNumber)}`)
    } catch {
      setError('Could not look up the invoice. Check your connection and try again.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="scan-heading" className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:p-6">
        <div className="flex items-center gap-2">
          <QrCode className="size-5 text-primary" aria-hidden="true" />
          <h2 id="scan-heading" className="font-semibold">
            Scan QR code
          </h2>
        </div>
        <QrScanner
          onDetected={(text) => {
            const invoiceNumber = parseScannedCode(text)
            setValue(invoiceNumber)
            toast.success(`Scanned ${invoiceNumber}`)
            openInvoice(invoiceNumber)
          }}
        />
      </section>

      <section aria-labelledby="manual-heading" className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Keyboard className="size-5 text-primary" aria-hidden="true" />
          <h2 id="manual-heading" className="font-semibold">
            Enter invoice number
          </h2>
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            openInvoice(normalizeInvoiceNumber(value))
          }}
        >
          <Label htmlFor="invoice-number">Invoice number</Label>
          <Input
            id="invoice-number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. INV-2026-1001"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'invoice-error' : undefined}
            className="h-11 font-mono text-base uppercase"
          />
          {error ? (
            <p id="invoice-error" role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="h-11" disabled={checking}>
            {checking ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Open invoice
            {!checking ? <ArrowRight aria-hidden="true" /> : null}
          </Button>
        </form>

        <div className="mt-2 flex flex-col gap-2 border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground">Sample invoices</p>
          <div className="flex flex-wrap gap-2">
            {sampleNumbers.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setValue(num)
                  openInvoice(num)
                }}
                className="rounded-md border bg-muted/50 px-2.5 py-1.5 font-mono text-xs hover:bg-accent hover:text-accent-foreground"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
